import type { Metadata } from "next";
import { MessageForm } from "@/components/forms";
import { LotusMark } from "@/components/ui";
import { EMERGENCY } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask a question about Sri Lanka, and find the official sources and emergency numbers you need.",
};

const OFFICIAL = [
  { name: "Sri Lanka Tourism", url: "https://www.srilanka.travel", text: "The national tourism authority's visitor site." },
  { name: "Electronic Travel Authorisation", url: "https://www.eta.gov.lk", text: "The Department of Immigration's official ETA and visa portal." },
  { name: "Sri Lanka Railways", url: "https://www.railway.gov.lk", text: "Timetables and seat reservations." },
];

export default function ContactPage() {
  return (
    <>
      <header className="bg-ocean text-paper">
        <div className="mx-auto max-w-7xl px-5 pt-36 pb-14 md:px-8 lg:pt-44">
          <p className="label text-gold">Contact</p>
          <h1 className="display mt-6 text-[clamp(3rem,8vw,6.5rem)]">Ask us about the island</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/85 md:text-xl">
            A place you can&rsquo;t find, a festival you want to see, a question about the seasons — write and we will answer.
          </p>
        </div>
        <div className="petals text-parchment" aria-hidden="true" />
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-[1.75rem] bg-paper p-6 md:p-8">
            <h2 className="display text-3xl text-maroon">Send a message</h2>
            <div className="mt-6">
              <MessageForm />
            </div>
          </div>
        </div>
        <div className="space-y-10 lg:col-span-5">
          <div className="rounded-[1.75rem] bg-parchment p-6">
            <p className="label text-lacquer">About this guide</p>
            <p className="mt-3 text-teak">
              Serendib is an independent showcase of Sri Lanka for visitors from abroad. It does not sell tours, take bookings or handle payments — it is
              here to show you the island. For anything you need to arrange, the official sources below are the right place to start.
            </p>
          </div>
          <div>
            <h2 className="label flex items-center gap-3 text-lacquer">
              <LotusMark className="h-4 w-5" /> Official sources
            </h2>
            <ul className="mt-5 divide-y divide-clay border-y border-clay">
              {OFFICIAL.map((o) => (
                <li key={o.url} className="py-4">
                  <a href={o.url} target="_blank" rel="noopener noreferrer" className="display text-2xl text-maroon underline-offset-4 hover:underline">
                    {o.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <p className="mt-1 text-teak">{o.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] bg-maroon p-7 text-paper">
            <h2 className="label text-gold">In an emergency</h2>
            <dl className="mt-5 grid grid-cols-2 gap-5">
              {EMERGENCY.map((e) => (
                <div key={e.number} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[0.95rem] leading-snug text-paper/80">{e.label}</dt>
                  <dd className="display text-4xl text-gold">
                    <a href={`tel:${e.number}`} className="underline-offset-4 hover:underline">
                      {e.number}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
