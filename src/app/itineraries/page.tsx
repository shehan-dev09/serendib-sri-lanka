import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, PageHero, Photo } from "@/components/ui";
import { ITINERARIES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Itineraries",
  description: "Four tried-and-tested Sri Lanka routes of 7, 8, 10 and 14 days, with day-by-day stops and a guide to each place.",
};

export default function ItinerariesPage() {
  return (
    <>
      <PageHero
        kicker="Itineraries"
        native="ගමන් මාර්ග"
        title="Four routes that work"
        intro="Distances are short but roads are slow, so the order matters. Each of these has been arranged to keep the drives sensible and the seasons on your side."
        photo="railway"
        tone="ocean"
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {ITINERARIES.map((it) => (
            <li key={it.slug}>
              <a href={`#${it.slug}`} className="btn btn-line">
                {it.days} days · {it.title}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {ITINERARIES.map((it) => {
          return (
            <section key={it.slug} id={it.slug} className="grid scroll-mt-24 gap-10 border-b-[3px] border-double border-maroon py-16 last:border-0 md:py-24 lg:grid-cols-12" aria-labelledby={`${it.slug}-title`}>
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <p className="display text-[7rem] leading-none text-saffron md:text-[9rem]">
                    {it.days}
                    <span className="label ml-3 align-middle text-teak">days</span>
                  </p>
                  <h2 id={`${it.slug}-title`} className="display mt-2 text-5xl text-maroon md:text-6xl">
                    {it.title}
                  </h2>
                  <p className="mt-4 max-w-md text-lg text-teak">{it.intro}</p>
                  <dl className="mt-6 grid max-w-md grid-cols-2 gap-4 border-y border-clay py-4">
                    <div>
                      <dt className="label text-lacquer">Pace</dt>
                      <dd className="mt-1 text-ink">{it.pace}</dd>
                    </div>
                    <div>
                      <dt className="label text-lacquer">Best</dt>
                      <dd className="mt-1 text-ink">{it.best}</dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/destinations" className="btn btn-maroon">
                      See these places <Arrow />
                    </Link>
                  </div>
                  <div className="fx-swing-l mt-8 hidden aspect-[16/10] max-w-md overflow-hidden rounded-[1.75rem] bg-teak lg:block">
                    <Photo k={it.photo} crop="wide" sizes="420px" />
                  </div>
                </div>
              </div>

              <ol className="border-l-2 border-maroon lg:col-span-7">
                {it.stops.map((s) => (
                  <li key={`${s.days}-${s.place}`} className="fx-rise relative pb-10 pl-8 last:pb-0">
                    <span className="absolute top-1.5 -left-[9px] h-4 w-4 rotate-45 bg-saffron" aria-hidden="true" />
                    <p className="label text-lacquer">
                      {s.days.includes("–") ? "Days" : "Day"} {s.days}
                    </p>
                    <h3 className="display mt-1 text-3xl text-ink">
                      {s.slug ? (
                        <Link href={`/destinations/${s.slug}`} className="underline decoration-saffron decoration-2 underline-offset-4 hover:text-maroon">
                          {s.place}
                        </Link>
                      ) : (
                        s.place
                      )}
                    </h3>
                    <p className="mt-2 max-w-xl text-lg text-teak">{s.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
