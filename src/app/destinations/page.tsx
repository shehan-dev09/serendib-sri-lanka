import type { Metadata } from "next";
import { IslandExplorer } from "@/components/AtlasScroll";
import { DestinationsExplorer } from "@/components/DestinationsExplorer";
import { ATLAS, DESTINATIONS, REGIONS, type Region } from "@/lib/data";
import type { Pin } from "@/lib/geo";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Eighteen places to go in Sri Lanka — ancient cities, hill stations, beaches and national parks — with an interactive 3D map.",
};

const pins: Pin[] = DESTINATIONS.map((d) => ({ slug: d.slug, name: d.name.split(" & ")[0], lat: d.lat, lng: d.lng, high: d.high }));
const items = DESTINATIONS.map(({ slug, name, native, tagline, region, photo, tags, unesco, best }) => ({ slug, name, native, tagline, region, photo, tags, unesco, best }));

export default async function DestinationsPage({ searchParams }: { searchParams: Promise<{ region?: string | string[] }> }) {
  const { region } = await searchParams;
  const initialRegion = REGIONS.find((r) => r === region) as Region | undefined;

  return (
    <>
      <header className="relative overflow-hidden bg-abyss text-paper">
        <div className="relative z-10 mx-auto max-w-7xl px-5 pt-32 md:px-8 lg:pointer-events-none lg:flex lg:min-h-[94svh] lg:items-center lg:pt-24 lg:pb-16">
          <div className="glass-lg max-w-md lg:pointer-events-auto lg:max-w-lg">
            <p className="label text-gold">Destinations</p>
            <p lang="si" className="mt-6 font-display text-3xl font-semibold text-saffron">
              ගමනාන්ත
            </p>
            <h1 className="display mt-2 text-[clamp(2.75rem,5vw,4.25rem)]">Where will the island take you?</h1>
            <p className="mt-6 text-lg text-paper/85">
              {DESTINATIONS.length} places across six regions. Drag the island to turn it, pick a region to fly there, and open any pin for its guide.
            </p>
            <a href="#explore" className="btn btn-saffron mt-8">
              Browse the list
            </a>
          </div>
        </div>
        <IslandExplorer pins={pins} steps={ATLAS} className="h-[66svh] min-h-[420px] w-full lg:absolute lg:inset-0 lg:h-full" />
        <div className="petals relative z-10 text-parchment" aria-hidden="true" />
      </header>

      <section id="explore" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <DestinationsExplorer key={initialRegion ?? "all"} items={items} initialRegion={initialRegion} />
      </section>
    </>
  );
}
