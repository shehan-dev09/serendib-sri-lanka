import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { messages, notes, subscribers, type Note } from "@/db/schema";

/*
 * Storage layer for everything visitors submit.
 *
 * Two interchangeable backends with the same functions:
 *   1. PostgreSQL via Drizzle — used whenever DATABASE_URL is set.
 *   2. A JSON file — used when there is no database, so notes still work on a
 *      laptop or a free host without Postgres. It writes to ./.data, or to the
 *      system temp folder if the project folder is read-only (e.g. serverless).
 */

export type NewNote = Pick<Note, "destination" | "name" | "country" | "rating" | "message">;

export const storageKind: "postgres" | "file" = hasDatabase ? "postgres" : "file";

/* ------------------------------------------------------------------ Postgres */

const g = globalThis as typeof globalThis & { __serendibSchema?: Promise<void> };

/** Creates the tables if missing, so a fresh database works without a migration step. Mirrors src/db/schema.ts. */
export function ensureSchema(): Promise<void> {
  if (!g.__serendibSchema) {
    g.__serendibSchema = (async () => {
      const db = getDb();
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS traveller_notes (
          id serial PRIMARY KEY,
          destination varchar(64) NOT NULL DEFAULT 'sri-lanka',
          name varchar(80) NOT NULL,
          country varchar(80) NOT NULL DEFAULT '',
          rating integer NOT NULL,
          message text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )`);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS messages (
          id serial PRIMARY KEY,
          name varchar(80) NOT NULL,
          email varchar(200) NOT NULL,
          message text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )`);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS subscribers (
          id serial PRIMARY KEY,
          email varchar(200) NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          CONSTRAINT subscribers_email_unique UNIQUE (email)
        )`);
    })().catch((error) => {
      g.__serendibSchema = undefined;
      throw error;
    });
  }
  return g.__serendibSchema;
}

/* ------------------------------------------------------------------ JSON file */

interface FileData {
  notes: (Omit<Note, "createdAt"> & { createdAt: string })[];
  messages: { id: number; name: string; email: string; message: string; createdAt: string }[];
  subscribers: { id: number; email: string; createdAt: string }[];
}

const EMPTY: FileData = { notes: [], messages: [], subscribers: [] };
let fileQueue: Promise<unknown> = Promise.resolve();
let resolvedFile: string | null = null;

async function dataFile(): Promise<string> {
  if (resolvedFile) return resolvedFile;
  const candidates = [process.env.SERENDIB_DATA_DIR, path.join(process.cwd(), ".data"), path.join(os.tmpdir(), "serendib-data")].filter(
    (d): d is string => Boolean(d),
  );
  for (const dir of candidates) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const probe = path.join(dir, ".write-test");
      await fs.writeFile(probe, "ok");
      await fs.rm(probe, { force: true });
      resolvedFile = path.join(dir, "serendib.json");
      return resolvedFile;
    } catch {
      /* not writable — try the next location */
    }
  }
  throw new Error("No writable folder found for the JSON data file");
}

async function readFileData(): Promise<FileData> {
  try {
    const raw = await fs.readFile(await dataFile(), "utf8");
    const parsed = JSON.parse(raw) as Partial<FileData>;
    return { notes: parsed.notes ?? [], messages: parsed.messages ?? [], subscribers: parsed.subscribers ?? [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(EMPTY);
    throw error;
  }
}

/** Serialises read-modify-write cycles so two quick submissions can't overwrite each other. */
function updateFileData<T>(change: (data: FileData) => T): Promise<T> {
  const run = fileQueue.then(async () => {
    const file = await dataFile();
    const data = await readFileData();
    const result = change(data);
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2));
    await fs.rename(tmp, file);
    return result;
  });
  fileQueue = run.catch(() => undefined);
  return run;
}

const nextId = (rows: { id: number }[]) => rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;

/* ------------------------------------------------------------------ Public API */

/** Latest notes, optionally for one destination. Returns null if storage can't be read. */
export async function listNotes(destination?: string, limit = 60): Promise<Note[] | null> {
  try {
    if (hasDatabase) {
      await ensureSchema();
      const query = getDb().select().from(notes);
      return destination
        ? await query.where(eq(notes.destination, destination)).orderBy(desc(notes.createdAt), desc(notes.id)).limit(limit)
        : await query.orderBy(desc(notes.createdAt), desc(notes.id)).limit(limit);
    }
    const data = await readFileData();
    return data.notes
      .filter((n) => !destination || n.destination === destination)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
      .slice(0, limit)
      .map((n) => ({ ...n, createdAt: new Date(n.createdAt) }));
  } catch (error) {
    console.error("listNotes failed", error);
    return null;
  }
}

export async function insertNote(note: NewNote): Promise<void> {
  if (hasDatabase) {
    await ensureSchema();
    await getDb().insert(notes).values(note);
    return;
  }
  await updateFileData((data) => {
    data.notes.push({ id: nextId(data.notes), ...note, createdAt: new Date().toISOString() });
  });
}

export async function insertMessage(message: { name: string; email: string; message: string }): Promise<void> {
  if (hasDatabase) {
    await ensureSchema();
    await getDb().insert(messages).values(message);
    return;
  }
  await updateFileData((data) => {
    data.messages.push({ id: nextId(data.messages), ...message, createdAt: new Date().toISOString() });
  });
}

export async function insertSubscriber(email: string): Promise<void> {
  if (hasDatabase) {
    await ensureSchema();
    await getDb().insert(subscribers).values({ email }).onConflictDoNothing();
    return;
  }
  await updateFileData((data) => {
    if (!data.subscribers.some((s) => s.email === email)) {
      data.subscribers.push({ id: nextId(data.subscribers), email, createdAt: new Date().toISOString() });
    }
  });
}

/** Quick connectivity check used by /api/health. */
export async function checkStorage(): Promise<void> {
  if (hasDatabase) {
    await getDb().execute(sql`select 1`);
    return;
  }
  await readFileData();
}
