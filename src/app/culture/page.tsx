import type { Metadata } from "next";
import Link from "next/link";
import { Arch, Arrow, LotusMark, Mandala, PageHero, Photo, SectionHead } from "@/components/ui";
import { CRAFTS, ETIQUETTE, FESTIVALS, PHRASES, TIMELINE, UNESCO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Culture & heritage",
  description: "Sri Lanka's history, eight World Heritage Sites, festivals through the year, traditional crafts, temple etiquette and useful phrases in Sinhala and Tamil.",
};

const FAITHS = [
  { name: "Buddhism", share: "70%", text: "Theravada Buddhism has shaped the island's art, calendar and daily rhythm for 2,300 years." },
  { name: "Hinduism", share: "13%", text: "Colourful kovils mark the Tamil north, east and hill country." },
  { name: "Islam", share: "10%", text: "Brought by Arab traders; mosques stand in every port town." },
  { name: "Christianity", share: "7%", text: "Strongest along the west coast, a legacy of Portuguese, Dutch and British rule." },
];

export default function CulturePage() {
  return (
    <>
      <PageHero
        kicker="Culture & heritage"
        native="සංස්කෘතිය"
        title="An old civilisation, wide awake"
        intro="Stupas older than the Colosseum, a chronicle kept for two thousand years, and a festival somewhere on the island almost every week."
        photo="dancer"
      />

      {/* Faiths */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead kicker="Four faiths, one island" title="Temples, kovils, mosques and churches share the same streets">
          <p>Shares of the population are rounded from the most recent national census. On Adam&rsquo;s Peak, all four faiths climb the same steps.</p>
        </SectionHead>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FAITHS.map((f, i) => (
            <li key={f.name} className={`fx-flip rounded-[1.75rem] p-6 ${["bg-maroon text-paper", "bg-saffron text-ink", "bg-leaf text-paper", "bg-ocean text-paper"][i]}`}>
              <p className="display text-6xl">{f.share}</p>
              <p className="display mt-3 text-2xl">{f.name}</p>
              <p className="mt-2 leading-snug opacity-90">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden bg-maroon text-paper">
        <div className="petals petals-down text-parchment" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 hidden w-[34rem] opacity-90 lg:block" aria-hidden="true">
          <Mandala className="fx-spin h-auto w-full" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead kicker="A short history" title="Twenty-five centuries in ten lines" tone="dark" />
          <ol className="mt-12 max-w-3xl border-l-2 border-gold">
            {TIMELINE.map((t) => (
              <li key={t.when} className="fx-rise relative pb-9 pl-8 last:pb-0">
                <span className="absolute top-2 -left-[9px] h-4 w-4 rotate-45 bg-gold" aria-hidden="true" />
                <p className="display text-3xl text-gold">{t.when}</p>
                <p className="mt-1.5 text-lg text-paper/90">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* UNESCO */}
      <section className="bg-parchment">
        <div className="petals petals-down text-maroon" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead kicker="World Heritage" title="Eight sites on the UNESCO list">
            <p>Six cultural and two natural — an extraordinary number for an island this size.</p>
          </SectionHead>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {UNESCO.map((u, i) => {
              const body = (
                <>
                  <span className="flex items-center justify-between">
                    <span className="display text-5xl text-saffron" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className={`label rounded-full px-3 py-1 text-[0.75rem] ${u.kind === "Natural" ? "bg-leaf text-paper" : "bg-maroon text-paper"}`}>{u.kind}</span>
                  </span>
                  <span className="display mt-4 block text-2xl text-ink">{u.name}</span>
                  <span className="mt-2 block flex-1 leading-snug text-teak">{u.text}</span>
                  <span className="label mt-5 flex items-center justify-between border-t border-clay pt-4 text-teak">
                    Inscribed {u.year}
                    {u.slug && <Arrow />}
                  </span>
                </>
              );
              return (
                <li key={u.name} className="fx-flip">
                  {u.slug ? (
                    <Link href={`/destinations/${u.slug}`} className="liquid flex h-full flex-col rounded-[1.75rem] bg-paper p-6">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col rounded-[1.75rem] bg-paper p-6">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Festivals */}
      <section className="bg-leaf text-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHead kicker="The festival year" title="There is always a procession somewhere" tone="dark">
                <p>
                  Buddhist festivals follow the moon, so dates shift each year; Islamic festivals such as Eid move through the whole calendar. Every full
                  moon is a Poya day and a public holiday.
                </p>
              </SectionHead>
              <div className="mt-10 grid grid-cols-2 gap-4">
                <Arch className="aspect-[3/4]" shadow="bg-gold">
                  <Photo k="vesak" crop="portrait" sizes="(min-width: 1024px) 18vw, 45vw" />
                </Arch>
                <Arch className="mt-10 aspect-[3/4]" shadow="bg-saffron">
                  <Photo k="drummers" crop="portrait" sizes="(min-width: 1024px) 18vw, 45vw" />
                </Arch>
              </div>
            </div>
            <ul className="lg:col-span-7">
              {FESTIVALS.map((f) => (
                <li key={f.name} className="fx-rise grid gap-2 border-b border-paper/25 py-6 first:pt-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <p className="label pt-1.5 text-gold">{f.when}</p>
                  <div>
                    <h3 className="display text-3xl">{f.name}</h3>
                    <p className="label mt-1.5 text-paper/75">{f.where}</p>
                    <p className="mt-2 text-paper/90">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Crafts */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead kicker="Made by hand" title="Crafts worth carrying home" />
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:self-start">
              <div className="fx-swing-l col-span-2 aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-teak">
                <Photo k="masks" crop="wide" sizes="(min-width: 1024px) 40vw, 92vw" />
              </div>
              <div className="fx-swing-l aspect-square overflow-hidden rounded-[1.75rem] bg-teak">
                <Photo k="puppets" crop="square" sizes="(min-width: 1024px) 20vw, 45vw" />
              </div>
              <div className="fx-swing-l aspect-square overflow-hidden rounded-[1.75rem] bg-teak">
                <Photo k="ceremony" crop="square" sizes="(min-width: 1024px) 20vw, 45vw" />
              </div>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
              {CRAFTS.map((c) => (
                <li key={c.name} className="border-t-[3px] border-double border-maroon py-5">
                  <h3 className="display text-2xl text-maroon">{c.name}</h3>
                  <p className="label mt-1 text-lacquer">{c.where}</p>
                  <p className="mt-2 text-teak">{c.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Etiquette */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead kicker="Temple manners" title="How to be a good guest" tone="dark">
              <p>Sri Lankans are forgiving hosts, but sacred places are taken seriously — and a few rules carry legal weight.</p>
            </SectionHead>
          </div>
          <ul className="space-y-5 lg:col-span-7">
            {ETIQUETTE.map((t) => (
              <li key={t} className="flex gap-4 border-b border-paper/20 pb-5 text-lg">
                <LotusMark className="mt-1.5 h-4 w-5 flex-none text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Phrasebook */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead kicker="A few words" title="Say it in Sinhala and Tamil">
          <p>English is widely understood, but a greeting in someone&rsquo;s own language opens every door.</p>
        </SectionHead>
        <div className="relative mt-10 overflow-x-auto rounded-[1.75rem] bg-paper">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Useful phrases in English, Sinhala and Tamil</caption>
            <thead>
              <tr className="bg-maroon text-paper">
                <th scope="col" className="label px-6 py-4">English</th>
                <th scope="col" className="label px-6 py-4">Sinhala</th>
                <th scope="col" className="label px-6 py-4">Tamil</th>
              </tr>
            </thead>
            <tbody>
              {PHRASES.map((p) => (
                <tr key={p.en} className="border-b border-clay last:border-0">
                  <th scope="row" className="px-6 py-4 font-display text-xl font-bold text-ink">{p.en}</th>
                  <td className="px-6 py-4">
                    <span className="block font-display text-xl font-bold text-maroon">{p.siSay}</span>
                    <span lang="si" className="text-teak">{p.si}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="block font-display text-xl font-bold text-leaf">{p.taSay}</span>
                    <span lang="ta" className="text-teak">{p.ta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
