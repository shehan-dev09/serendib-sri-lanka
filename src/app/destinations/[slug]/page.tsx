import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/DestinationCard";
import { NoteForm } from "@/components/forms";
import { NotesList } from "@/components/Notes";
import { Arch, LotusMark, MonthStrip, Photo, SectionHead } from "@/components/ui";
import { DESTINATIONS, getDestination, MONTHS_LONG, type Region } from "@/lib/data";
import { PHOTOS } from "@/lib/photos";
import { listNotes } from "@/lib/store";

// Traveller notes are read from the database on every request.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const TONE: Record<Region, string> = {
  "Cultural Triangle": "bg-maroon",
  "Hill Country": "bg-leaf",
  "South Coast": "bg-ocean",
  "West Coast": "bg-ocean",
  "East Coast": "bg-ocean",
  "The North": "bg-maroon",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return { title: "Destination not found" };
  return { title: d.name, description: `${d.tagline}. ${d.summary[0]}`.slice(0, 180) };
}

function monthRange(best: number[]): string {
  return best.map((m) => MONTHS_LONG[m - 1].slice(0, 3)).join(" · ");
}

export default async function DestinationPage({ params }: Params) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();

  const notes = await listNotes(d.slug, 30);
  const nearby = d.nearby.map((s) => DESTINATIONS.find((x) => x.slug === s)).filter((x) => x !== undefined);
  const tamil = d.slug === "jaffna" || d.slug === "trincomalee";

  return (
    <>
      <header className={`${TONE[d.region]} relative overflow-hidden text-paper`}>
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-5 pt-32 pb-16 md:px-8 lg:grid-cols-12 lg:pt-40 lg:pb-20">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb">
              <ol className="label flex flex-wrap items-center gap-2 text-gold">
                <li>
                  <Link href="/destinations" className="underline-offset-4 hover:underline">
                    Destinations
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/destinations?region=${encodeURIComponent(d.region)}`} className="underline-offset-4 hover:underline">
                    {d.region}
                  </Link>
                </li>
              </ol>
            </nav>
            <p lang={tamil ? "ta" : "si"} className="mt-6 font-display text-3xl font-semibold text-saffron">
              {d.native}
            </p>
            <h1 className="display mt-2 text-[clamp(3.25rem,9vw,7.5rem)]">{d.name}</h1>
            <p className="mt-5 max-w-xl text-xl text-paper/90 md:text-2xl">{d.tagline}</p>
            {d.unesco && (
              <p className="label mt-8 inline-flex rounded-full bg-gold px-4 py-3 text-ink">UNESCO World Heritage Site</p>
            )}
          </div>
          <div className="lg:col-span-5">
            <Arch className="mx-auto aspect-[4/5] w-full max-w-sm lg:mr-4 lg:ml-auto" shadow="bg-saffron">
              <Photo k={d.photo} crop="portrait" priority sizes="(min-width: 1024px) 400px, 85vw" className="fx-zoom-out" />
            </Arch>
          </div>
        </div>
        <div className="petals text-parchment" aria-hidden="true" />
      </header>

      {/* Overview */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="prose-lk text-lg text-teak">
            {d.summary.map((p, i) => (
              <p key={i} className={i === 0 ? "font-display text-2xl leading-snug font-semibold text-ink md:text-3xl" : ""}>
                {p}
              </p>
            ))}
          </div>

          <h2 className="display mt-14 text-4xl text-maroon md:text-5xl">Don&rsquo;t miss</h2>
          <ol className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {d.highlights.map((h, i) => (
              <li key={h.title} className="fx-rise border-t-[3px] border-double border-maroon pt-4">
                <span className="display block text-5xl text-saffron" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-2 text-2xl text-ink">{h.title}</h3>
                <p className="mt-2 text-teak">{h.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="lg:col-span-5" aria-label="At a glance">
          <div className="rounded-[1.75rem] bg-paper p-7 lg:sticky lg:top-28">
            <p className="label flex items-center gap-3 text-lacquer">
              <LotusMark className="h-4 w-5" /> At a glance
            </p>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="label text-teak">Best months</dt>
                <dd className="mt-3">
                  <MonthStrip best={d.best} />
                  <span className="mt-2 block text-teak" aria-hidden="true">
                    {monthRange(d.best)}
                  </span>
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="label text-teak">Stay</dt>
                  <dd className="display mt-1 text-2xl text-ink">{d.stay}</dd>
                </div>
                <div>
                  <dt className="label text-teak">Region</dt>
                  <dd className="display mt-1 text-2xl text-ink">{d.region}</dd>
                </div>
              </div>
              <div>
                <dt className="label text-teak">Good for</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {d.tags.map((t) => (
                    <span key={t} className="rounded-full bg-clay/60 px-3 py-1 font-label text-sm font-semibold tracking-[0.1em] text-teak uppercase">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label text-teak">Getting there</dt>
                <dd className="mt-2 text-teak">{d.getThere}</dd>
              </div>
              {d.unesco && (
                <div>
                  <dt className="label text-teak">World Heritage</dt>
                  <dd className="mt-2 text-teak">{d.unesco}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </section>

      {/* Photographs */}
      {d.gallery.length > 0 && (
        <section className="bg-ink py-16 text-paper md:py-24" aria-label={`Photographs of ${d.name}`}>
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead kicker="In pictures" title={`${d.name}, up close`} tone="dark" />
          </div>
          <ul className="snap-row mt-10 gap-5 px-5 pb-4 md:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {d.gallery.map((k) => (
              <li key={k} className="w-[82vw] sm:w-[30rem]">
                <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-teak">
                  <Photo k={k} sizes="(min-width: 640px) 480px, 82vw" />
                  <figcaption className="glass absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3 text-[0.95rem] leading-snug">{PHOTOS[k].alt}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Good to know */}
      <section className="bg-leaf text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead kicker="Good to know" title="Before you go" tone="dark" />
          </div>
          <ul className="space-y-5 lg:col-span-7">
            {d.tips.map((t) => (
              <li key={t} className="fx-rise flex gap-4 border-b border-paper/25 pb-5 text-lg">
                <LotusMark className="mt-1.5 h-4 w-5 flex-none text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Notes */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
        <div>
          <SectionHead kicker="Traveller notes" title={`Been to ${d.name}?`}>
            <p>Leave a tip for the next person.</p>
          </SectionHead>
          <div className="mt-8">
            <NotesList notes={notes} empty={`No notes about ${d.name} yet. Yours will be the first.`} />
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-paper p-6 md:p-8 lg:self-start">
          <h2 className="display text-3xl text-maroon">Write a note</h2>
          <div className="mt-6">
            <NoteForm destination={d.slug} />
          </div>
        </div>
      </section>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <SectionHead kicker="Keep going" title="Pairs well with" />
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((n) => (
                <li key={n.slug} className="fx-flip">
                  <DestinationCard d={n} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
