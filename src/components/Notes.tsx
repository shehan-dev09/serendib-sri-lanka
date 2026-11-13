import Link from "next/link";
import type { Note } from "@/db/schema";
import { Stars } from "./ui";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function NotesList({ notes, names, empty }: { notes: Note[] | null; names?: Record<string, string>; empty: string }) {
  if (notes === null) {
    return (
      <p role="alert" className="rounded-2xl border-[1.5px] border-lacquer bg-paper p-6 text-teak">
        Traveller notes can&rsquo;t be loaded right now. Please refresh the page in a moment — you can still write yours below.
      </p>
    );
  }
  if (notes.length === 0) {
    return <p className="rounded-2xl border-[1.5px] border-dashed border-maroon/50 p-8 text-lg text-teak">{empty}</p>;
  }
  return (
    <ul className="grid gap-5">
      {notes.map((n) => {
        const place = names && n.destination !== "sri-lanka" ? names[n.destination] : undefined;
        return (
          <li key={n.id} className="rounded-2xl bg-paper p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-2xl font-bold text-maroon">
                {n.name}
                {n.country && <span className="ml-2 font-sans text-base font-normal text-teak">from {n.country}</span>}
              </p>
              <Stars value={n.rating} />
            </div>
            <p className="mt-3 whitespace-pre-line text-ink">{n.message}</p>
            <p className="label mt-4 text-teak/80">
              {dateFormat.format(n.createdAt)}
              {place && (
                <>
                  {" · "}
                  <Link href={`/destinations/${n.destination}`} className="text-lacquer underline underline-offset-4">
                    {place}
                  </Link>
                </>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
