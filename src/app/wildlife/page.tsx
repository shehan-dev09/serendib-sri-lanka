import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, LotusMark, PageHero, Photo, SectionHead } from "@/components/ui";
import { ANIMALS, PARKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wildlife",
  description: "Leopards, elephants, blue whales and sea turtles: where and when to see Sri Lanka's wildlife, park by park, and how to do it responsibly.",
};

const RESPONSIBLE = [
  "See elephants wild, in a national park. Skip rides, shows and anywhere animals are chained.",
  "Choose a safari driver who keeps his distance, turns the engine off and does not race other jeeps to a sighting.",
  "On whale-watching trips, pick boats that approach slowly from the side and never chase or cut across an animal.",
  "Watch nesting turtles only with a community project guide. No torches, no flash, no touching.",
  "Never stand on coral, and use reef-safe sunscreen before you swim.",
  "Do not feed monkeys, or the wild elephants that wait by some roads — it teaches them to approach vehicles.",
  "Carry your rubbish out, and leave single-use plastic behind.",
];

export default function WildlifePage() {
  return (
    <>
      <PageHero
        kicker="Wildlife & nature"
        native="වනජීවී"
        title="Big animals on a small island"
        intro="Leopards with no rivals, elephants by the hundred, and the largest creature on earth just offshore. Few places make wildlife this easy to find."
        photo="leopard"
        tone="leaf"
      />

      {/* Animals */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead kicker="Who lives here" title="The animals you came to see" />
        <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {ANIMALS.map((a, i) => (
            <li key={a.name} className="fx-flip">
              <div className="relative">
                <div className={`absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[1.75rem] ${["bg-saffron", "bg-leaf", "bg-ocean"][i % 3]}`} aria-hidden="true" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-teak">
                  <Photo k={a.photo} crop="wide" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw" />
                </div>
              </div>
              <h3 className="display mt-7 text-3xl text-maroon">{a.name}</h3>
              <p className="text-teak italic">{a.latin}</p>
              <p className="mt-3 text-teak">{a.text}</p>
              <p className="label mt-4 border-t border-clay pt-3 text-lacquer">{a.where}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Parks */}
      <section className="bg-leaf text-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker="Park by park" title="Where to go, and when" tone="dark">
              <p>Sri Lanka has 26 national parks. These ten cover almost everything a first visit could want.</p>
            </SectionHead>
            <Link href="/destinations/yala" className="btn btn-line">
              Guide to Yala <Arrow />
            </Link>
          </div>
          <div className="relative mt-12 overflow-x-auto rounded-[1.75rem] bg-leaf-deep">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <caption className="sr-only">National parks, what they are known for and the best months to visit</caption>
              <thead>
                <tr className="border-b border-paper/25">
                  <th scope="col" className="label px-6 py-5 text-gold">Park</th>
                  <th scope="col" className="label px-6 py-5 text-gold">Known for</th>
                  <th scope="col" className="label px-6 py-5 text-gold">Best months</th>
                  <th scope="col" className="label px-6 py-5 text-gold">Character</th>
                </tr>
              </thead>
              <tbody>
                {PARKS.map((p) => (
                  <tr key={p.name} className="border-b border-paper/15 align-top last:border-0">
                    <th scope="row" className="display px-6 py-5 text-2xl">{p.name}</th>
                    <td className="px-6 py-5 text-paper/90">{p.star}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-gold">{p.best}</td>
                    <td className="px-6 py-5 text-paper/90">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The gathering feature */}
      <section className="relative flex min-h-[80svh] items-end overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Photo k="elephants" sizes="100vw" className="fx-drift" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <div className="glass fx-rise max-w-xl rounded-[2rem] p-8 md:p-10">
            <p className="label text-gold">August & September</p>
            <h2 className="display mt-3 text-5xl">The Gathering</h2>
            <p className="mt-4 text-lg text-paper/90">
              As the dry season empties the forest waterholes, elephants walk to the ancient Minneriya reservoir. Several hundred can share its grassy
              bed in a single afternoon.
            </p>
            <Link href="/destinations/minneriya" className="btn btn-saffron mt-7">
              Minneriya & Kaudulla <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* Responsible */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead kicker="Tread lightly" title="Seven rules for wild places" tone="dark">
              <p>The animals are the reason to come. How visitors behave decides whether they stay.</p>
            </SectionHead>
          </div>
          <ol className="space-y-5 lg:col-span-7">
            {RESPONSIBLE.map((t, i) => (
              <li key={t} className="fx-rise flex gap-5 border-b border-paper/20 pb-5 text-lg">
                <span className="display w-8 flex-none text-3xl text-gold" aria-hidden="true">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 pb-12 text-gold md:px-8">
          <LotusMark className="h-4 w-5" />
          <div className="beads flex-1" aria-hidden="true" />
          <LotusMark className="h-4 w-5" />
        </div>
      </section>
    </>
  );
}
