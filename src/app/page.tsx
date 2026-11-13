import Link from "next/link";
import { AtlasScroll } from "@/components/AtlasScroll";
import { DestinationCard } from "@/components/DestinationCard";
import { SeasonFinder } from "@/components/SeasonFinder";
import { Arch, Arrow, LotusMark, Mandala, Photo, SectionHead } from "@/components/ui";
import { ATLAS, DESTINATIONS, DISHES, EXPERIENCES, FESTIVALS, ITINERARIES } from "@/lib/data";
import type { Pin } from "@/lib/geo";

const pins: Pin[] = DESTINATIONS.map((d) => ({ slug: d.slug, name: d.name.split(" & ")[0], lat: d.lat, lng: d.lng, high: d.high }));
const featured = ["sigiriya", "ella", "galle", "kandy", "yala", "mirissa"].map((s) => DESTINATIONS.find((d) => d.slug === s)!);
const seasonPlaces = DESTINATIONS.map((d) => ({ slug: d.slug, name: d.name, best: d.best }));
const festivals = FESTIVALS.filter((f) => ["Vesak", "Kandy Esala Perahera", "Sinhala & Tamil New Year"].includes(f.name));

const STATS = [
  { value: "8", label: "UNESCO World Heritage Sites" },
  { value: "26", label: "National parks" },
  { value: "1,340 km", label: "Of coastline" },
  { value: "2,524 m", label: "Highest peak, Pidurutalagala" },
];

const HERO_ARCHES = [
  { k: "sigiriya", href: "/destinations/sigiriya", label: "Sigiriya", box: "h-[62%] w-[30%]", fx: "fx-hero-a" },
  { k: "nineArchTrain", href: "/destinations/ella", label: "Ella", box: "h-full w-[40%]", fx: "fx-hero-b" },
  { k: "mirissaPalms", href: "/destinations/mirissa", label: "Mirissa", box: "h-[78%] w-[30%]", fx: "fx-hero-c" },
] as const;

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-maroon text-paper">
        <p
          lang="si"
          aria-hidden="true"
          className="fx-hero-word pointer-events-none absolute top-10 left-0 font-display text-[40vw] leading-none font-extrabold whitespace-nowrap text-maroon-deep select-none lg:text-[25vw]"
        >
          ශ්‍රී ලංකා
        </p>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pt-32 md:px-8 lg:min-h-svh lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-24">
          <div className="lg:col-span-6">
            <p className="label text-gold">
              <span lang="si">ආයුබෝවන්</span> · <span lang="ta">வணக்கம்</span> · Welcome
            </p>
            <h1 className="display mt-5 text-[clamp(4.75rem,14vw,11.5rem)]">
              <span className="block">Sri</span>
              <span className="block text-gold">Lanka</span>
            </h1>
            <p className="mt-7 max-w-lg text-xl text-paper/90">
              Lion-rock citadels, misty tea country, leopards in the scrub and 1,340 km of palm-fringed coast — on one island you can cross in a day.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/destinations" className="btn btn-saffron">
                Explore the island <Arrow />
              </Link>
              <a href="#seasons" className="btn btn-line">
                When to visit
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex h-[54svh] min-h-[340px] items-end justify-center gap-3 md:gap-5 lg:h-[72svh]">
              {HERO_ARCHES.map((a, i) => (
                <div key={a.k} className={`relative ${a.box} ${a.fx}`}>
                  <Arch className="h-full w-full" shadow={i === 1 ? "bg-saffron" : "bg-gold"}>
                    <Photo k={a.k} crop="tall" priority sizes="(min-width: 1024px) 20vw, 36vw" />
                  </Arch>
                  <Link
                    href={a.href}
                    className="glass-clear liquid label absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-2 text-[0.75rem] whitespace-nowrap md:px-4 md:text-[0.85rem]"
                  >
                    {a.label} <Arrow className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <dl className="relative mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-5 pb-16 md:grid-cols-4 md:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse border-l-2 border-gold pl-4">
              <dt className="label mt-2 text-paper/85">{s.label}</dt>
              <dd className="display text-4xl text-gold md:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="petals petals-lg relative text-saffron" aria-hidden="true" />
      </section>

      {/* ------------------------------------------------ Marquee */}
      <div className="overflow-hidden bg-saffron py-3 text-ink" aria-hidden="true">
        <div className="marquee">
          {[0, 1].map((n) => (
            <ul key={n} className="flex items-center">
              {DESTINATIONS.map((d) => (
                <li key={d.slug} className="flex items-center font-display text-2xl font-extrabold whitespace-nowrap">
                  <span className="px-5">{d.name}</span>
                  <LotusMark className="h-4 w-5 text-maroon" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ 3D atlas */}
      <AtlasScroll steps={ATLAS} pins={pins} />

      {/* ------------------------------------------------ Featured */}
      <section className="bg-parchment">
        <div className="petals petals-down text-ink" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker="Start here" title="Six places that make people book the flight">
              <p>Each one is a reason to come on its own. Together they make a route.</p>
            </SectionHead>
            <Link href="/destinations" className="btn btn-line-dark">
              All {DESTINATIONS.length} destinations <Arrow />
            </Link>
          </div>
          <ul className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <li key={d.slug} className="fx-flip">
                <DestinationCard d={d} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ Experiences */}
      <section className="bg-leaf text-paper">
        <div className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker="Things to do" title="Days you will talk about for years" tone="dark" className="fx-rise" />
            <Link href="/experiences" className="btn btn-line">
              All experiences <Arrow />
            </Link>
          </div>
        </div>
        <ul className="snap-row mt-12 gap-5 px-5 pb-24 md:px-8 md:pb-32 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]" aria-label="Experiences">
          {EXPERIENCES.slice(0, 8).map((e, i) => (
            <li key={e.slug} className="w-[78vw] sm:w-[22rem]">
              <Link href={`/experiences#${e.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-leaf-deep">
                <Photo k={e.photo} crop="portrait" sizes="(min-width: 640px) 352px, 78vw" className="transition-transform duration-700 group-hover:scale-105" />
                <span className="label absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink">{String(i + 1).padStart(2, "0")}</span>
                <span className="glass absolute inset-x-3 bottom-3 block rounded-[1.25rem] p-4">
                  <span className="display block text-2xl">{e.title}</span>
                  <span className="mt-1.5 block text-[0.95rem] leading-snug text-paper/85">{e.where}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ Seasons */}
      <section id="seasons" className="scroll-mt-24 bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <SectionHead kicker="When to go" title="Two monsoons mean it is always summer somewhere">
            <p>
              Rain reaches the south-west from May and the north-east from October, so one coast is always in season. Pick your month and see where to
              point the map.
            </p>
          </SectionHead>
          <div className="mt-12">
            <SeasonFinder places={seasonPlaces} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Culture */}
      <section className="relative overflow-hidden bg-maroon text-paper">
        <div className="petals petals-down text-paper" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="mx-auto w-[82%] max-w-md lg:w-full">
              <Mandala className="fx-spin h-auto w-full" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <SectionHead kicker="Culture & heritage" title="2,500 years, still in daily use" tone="dark">
              <p>
                The chronicles of this island were being written before most of Europe could read. Its temples are not museums — the drums still sound
                at dawn, the lamps are still lit, and on every full moon the whole country takes the day off.
              </p>
            </SectionHead>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {festivals.map((f) => (
                <li key={f.name} className="fx-flip rounded-2xl bg-maroon-deep p-5">
                  <p className="label text-gold">{f.when}</p>
                  <p className="display mt-3 text-2xl">{f.name}</p>
                  <p className="mt-2 text-[0.95rem] leading-snug text-paper/80">{f.where}</p>
                </li>
              ))}
            </ul>
            <Link href="/culture" className="btn btn-saffron mt-10">
              Festivals, crafts & customs <Arrow />
            </Link>
          </div>
        </div>
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 pb-24 md:grid-cols-4 md:gap-6 md:px-8 md:pb-32">
          {(["dancer", "vesak", "masks", "kandyTemple"] as const).map((k, i) => (
            <li key={k} className={`fx-flip ${i % 2 ? "md:mt-12" : ""}`}>
              <Arch className="aspect-[3/4]" shadow="bg-gold">
                <Photo k={k} crop="portrait" sizes="(min-width: 768px) 22vw, 45vw" />
              </Arch>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ Food */}
      <section className="bg-parchment">
        <div className="petals petals-down text-maroon" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2">
          <div className="fx-swing-l relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-teak">
              <Photo k="hoppers" crop="portrait" sizes="(min-width: 1024px) 45vw, 92vw" className="fx-drift" />
            </div>
            <p className="glass absolute right-4 bottom-4 left-4 rounded-[1.25rem] p-4 md:right-auto md:max-w-xs">
              <span className="label block text-gold">Breakfast, Sri Lankan style</span>
              <span className="mt-1.5 block">Egg hoppers, sambols and a pot of tea.</span>
            </p>
          </div>
          <div>
            <SectionHead kicker="Food & tea" title="Come hungry. Leave with recipes.">
              <p>Coconut, curry leaf, cinnamon and chilli — cooked in clay pots and eaten with your fingers. And the tea, of course, is the best in the world.</p>
            </SectionHead>
            <ul className="mt-8 divide-y divide-clay border-y border-clay">
              {DISHES.slice(0, 4).map((d) => (
                <li key={d.name} className="flex items-baseline justify-between gap-6 py-4">
                  <span className="display text-2xl text-ink">{d.name}</span>
                  <span className="text-right text-teak italic">{d.local}</span>
                </li>
              ))}
            </ul>
            <Link href="/food" className="btn btn-maroon mt-10">
              The full menu <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Itineraries */}
      <section className="bg-ocean text-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker="Routes" title="Borrow a plan, then make it yours" tone="dark" />
            <Link href="/itineraries" className="btn btn-line">
              Day-by-day routes <Arrow />
            </Link>
          </div>
          <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ITINERARIES.map((it) => (
              <li key={it.slug} className="fx-flip">
                <Link href={`/itineraries#${it.slug}`} className="liquid flex h-full flex-col rounded-[1.75rem] bg-paper p-6 text-ink">
                  <p className="display text-7xl text-lacquer">
                    {it.days}
                    <span className="label ml-2 align-middle text-teak">days</span>
                  </p>
                  <p className="display mt-4 text-3xl text-maroon">{it.title}</p>
                  <p className="mt-3 flex-1 leading-snug text-teak">{it.intro}</p>
                  <p className="label mt-6 flex items-center justify-between border-t border-clay pt-4 text-teak">
                    {it.best}
                    <Arrow />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ Closing */}
      <section className="relative flex min-h-[86svh] items-center overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Photo k="weligama" sizes="100vw" className="fx-drift" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
          <div className="glass fx-rise max-w-xl rounded-[2rem] p-8 md:p-12">
            <p className="label text-gold">
              <span lang="si">ආයුබෝවන්</span> — &ldquo;may you live long&rdquo;
            </p>
            <h2 className="display mt-4 text-5xl md:text-6xl">The island is waiting.</h2>
            <p className="mt-5 text-lg text-paper/90">Wander the gallery, read the guides, and let the island do the persuading.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/gallery" className="btn btn-saffron">
                See the gallery <Arrow />
              </Link>
              <Link href="/experiences" className="btn btn-line">
                Things to do
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
