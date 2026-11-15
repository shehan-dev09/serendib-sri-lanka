import Link from "next/link";
import { toUV, type Pin } from "@/lib/geo";
import { TERRAIN } from "@/lib/terrain";

/**
 * A flat satellite map of Sri Lanka with pins, built from the same imagery as the
 * 3D terrain. Used as the no-WebGL fallback and as the locator on destination pages.
 * Pins are positioned with Web-Mercator uv coordinates, so they sit exactly on the image.
 */
export function SatelliteMap({
  pins,
  highlight,
  className = "",
  showLabels = true,
}: {
  pins: Pin[];
  /** Slug to emphasise; other pins are drawn smaller. */
  highlight?: string;
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[1.25rem] bg-abyss ${className}`}
      style={{ aspectRatio: `${TERRAIN.imageWidth} / ${TERRAIN.imageHeight}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/terrain/satellite-sd.jpg"
        alt="Satellite image of Sri Lanka"
        width={Math.round(TERRAIN.imageWidth / 2)}
        height={Math.round(TERRAIN.imageHeight / 2)}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes("/map-data/")) {
            target.src = "/map-data/satellite-sd.jpg";
          }
        }}
      />
      <ul className="absolute inset-0 m-0 list-none p-0">
        {pins.map((pin) => {
          const [u, v] = toUV(pin.lat, pin.lng);
          const main = highlight === pin.slug;
          const dim = Boolean(highlight) && !main;
          return (
            <li key={pin.slug} className="absolute" style={{ left: `${(u * 100).toFixed(2)}%`, top: `${((1 - v) * 100).toFixed(2)}%` }}>
              <Link href={`/destinations/${pin.slug}`} className="group/pin absolute -translate-x-1/2 -translate-y-1/2" aria-label={pin.name}>
                {main && <span className="absolute -inset-2 animate-ping rounded-full bg-gold/60 motion-reduce:animate-none" aria-hidden="true" />}
                <span
                  className={`relative block rounded-full border-2 border-paper ${main ? "h-4 w-4 bg-lacquer" : dim ? "h-2 w-2 border bg-gold/90" : "h-3 w-3 bg-gold"}`}
                  aria-hidden="true"
                />
                {showLabels && (
                  <span
                    className={`glass pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full px-2.5 py-1 font-label font-semibold tracking-[0.1em] whitespace-nowrap uppercase ${
                      main ? "text-[0.8rem]" : "text-[0.65rem] opacity-0 transition-opacity group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100"
                    }`}
                    aria-hidden="true"
                  >
                    {pin.name}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <figcaption className="absolute right-2 bottom-1.5 left-2 text-right text-[0.6rem] leading-tight text-paper/70">
        Sentinel-2 cloudless by EOX · Copernicus Sentinel data 2016 &amp; 2017
      </figcaption>
    </figure>
  );
}
