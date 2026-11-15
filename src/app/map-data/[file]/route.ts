import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Serves the satellite / elevation files from public/terrain.
 * Next.js (especially `next dev` + Turbopack) can 404 `.bin` / `.bin.gz`
 * from the public folder; going through a route handler is reliable locally
 * and in production.
 */
const FILES: Record<string, string> = {
  "height.bin": "application/octet-stream",
  "height.bin.gz": "application/gzip",
  "satellite-hd.jpg": "image/jpeg",
  "satellite-sd.jpg": "image/jpeg",
  "water.png": "image/png",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const type = FILES[file];
  if (!type) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "terrain", file));
    return new Response(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
