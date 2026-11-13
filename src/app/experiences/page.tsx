import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, PageHero, Photo } from "@/components/ui";
import { DESTINATIONS, EXPERIENCES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Experiences",
  description: "The best things to do in Sri Lanka: scenic trains, safaris, whale watching, surfing, tea trails, sunrise hikes and more.",
};

const nameOf = Object.fromEntries(DESTINATIONS.map((d) => [d.slug, d.name]));

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        kicker="Things to do"
        native="අත්දැකීම්"
        title="Ten days you will never forget"
        intro="You could spend a month here and not repeat yourself. These are the experiences travellers come back talking about."
        photo="train"
        tone="leaf"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <ol className="space-y-20 md:space-y-28">
          {EXPERIENCES.map((e, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={e.slug} id={e.slug} className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <div className={`lg:col-span-6 ${flip ? "fx-swing-r lg:order-2" : "fx-swing-l"}`}>
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-[1.75rem] ${i % 3 === 0 ? "bg-saffron" : i % 3 === 1 ? "bg-leaf" : "bg-maroon"} ${flip ? "-translate-x-3" : "translate-x-3"} translate-y-3`} aria-hidden="true" />
                    <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-teak">
                      <Photo k={e.photo} crop="wide" sizes="(min-width: 1024px) 46vw, 92vw" className="fx-drift" />
                      {e.note && <figcaption className="glass absolute bottom-3 left-3 rounded-full px-4 py-2 text-sm">{e.note}</figcaption>}
                    </figure>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <p className="display text-7xl text-saffron" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display mt-2 text-4xl text-maroon md:text-5xl">{e.title}</h2>
                  <p className="mt-5 text-lg text-teak">{e.blurb}</p>
                  <dl className="mt-6 grid gap-4 border-y border-clay py-5 sm:grid-cols-2">
                    <div>
                      <dt className="label text-lacquer">Where</dt>
                      <dd className="mt-1 text-ink">{e.where}</dd>
                    </div>
                    <div>
                      <dt className="label text-lacquer">When</dt>
                      <dd className="mt-1 text-ink">{e.when}</dd>
                    </div>
                  </dl>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {e.links.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/destinations/${slug}`}
                          className="liquid flex items-center gap-2 rounded-full border-[1.5px] border-maroon px-4 py-2 font-label font-semibold tracking-[0.1em] text-maroon uppercase hover:bg-maroon hover:text-paper"
                        >
                          {nameOf[slug]} <Arrow className="h-3.5 w-3.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <section className="bg-saffron text-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-14 md:px-8">
          <p className="display max-w-2xl text-4xl md:text-5xl">Not sure how to fit it all in?</p>
          <Link href="/itineraries" className="btn btn-ink">
            See ready-made routes <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
