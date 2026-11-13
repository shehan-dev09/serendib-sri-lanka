import type { Metadata } from "next";
import { NoteForm } from "@/components/forms";
import { NotesList } from "@/components/Notes";
import { DESTINATIONS } from "@/lib/data";
import { listNotes } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Notes, tips and favourite moments from people who have travelled in Sri Lanka.",
};

const options = DESTINATIONS.map((d) => ({ slug: d.slug, name: d.name }));
const names = Object.fromEntries(options.map((o) => [o.slug, o.name]));

export default async function GuestbookPage() {
  const notes = await listNotes(undefined, 80);

  return (
    <>
      <header className="bg-leaf text-paper">
        <div className="mx-auto max-w-7xl px-5 pt-36 pb-14 md:px-8 lg:pt-44">
          <p className="label text-gold">Guestbook</p>
          <h1 className="display mt-6 text-[clamp(3rem,8vw,6.5rem)]">Notes from the road</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/85 md:text-xl">
            What travellers wish they had known, and what they will never forget. Add yours — it appears here straight away.
          </p>
        </div>
        <div className="petals text-parchment" aria-hidden="true" />
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="display mb-8 text-4xl text-maroon">
            {notes && notes.length > 0 ? `${notes.length} ${notes.length === 1 ? "note" : "notes"}` : "Latest notes"}
          </h2>
          <NotesList notes={notes} names={names} empty="The guestbook is open and waiting for its first entry. Been to Sri Lanka? Tell the next traveller one thing." />
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-[1.75rem] bg-paper p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="display text-3xl text-maroon">Write a note</h2>
            <div className="mt-6">
              <NoteForm options={options} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
