import Link from "next/link";
import type { Destination } from "@/lib/data";
import { Tilt } from "./Tilt";
import { Arch, Photo } from "./ui";

export type CardDestination = Pick<Destination, "slug" | "name" | "native" | "tagline" | "region" | "photo" | "tags" | "unesco" | "best">;

export function DestinationCard({ d, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" }: { d: CardDestination; sizes?: string }) {
  const href = `/destinations/${d.slug}`;
  return (
    <article className="group">
      <Tilt>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block">
          <Arch className="aspect-[4/5]" shadow="bg-saffron">
            <Photo k={d.photo} crop="portrait" sizes={sizes} className="transition-transform duration-700 group-hover:scale-105" />
          </Arch>
          <span className="glass-clear tilt-pop label absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-[0.75rem]">{d.region}</span>
          {d.unesco && (
            <span className="tilt-pop label absolute right-3 bottom-4 rounded-full bg-gold px-3 py-1.5 text-[0.75rem] text-ink">UNESCO</span>
          )}
        </Link>
      </Tilt>
      <div className="mt-6">
        <h3 className="display text-3xl text-maroon">
          <Link href={href} className="underline-offset-4 hover:underline">
            {d.name}
          </Link>
        </h3>
        <p className="mt-1.5 leading-snug text-teak">{d.tagline}</p>
      </div>
    </article>
  );
}
