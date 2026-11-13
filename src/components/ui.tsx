import type { CSSProperties, ReactNode } from "react";
import { MONTHS } from "@/lib/data";
import { PHOTOS, px, type PhotoKey } from "@/lib/photos";

/* ---------------------------------------------------------------- Photo */

const RATIOS = { tall: 1.5, portrait: 1.25, square: 1, wide: 0.625, pano: 0.42 } as const;
const WIDTHS = [480, 800, 1200, 1800];

export function Photo({
  k,
  crop,
  sizes = "100vw",
  className = "",
  priority = false,
  alt,
}: {
  k: PhotoKey;
  crop?: keyof typeof RATIOS;
  sizes?: string;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  const info = PHOTOS[k];
  const url = (w: number) => px(info.id, w, crop ? Math.round(w * RATIOS[crop]) : undefined);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url(1200)}
      srcSet={WIDTHS.map((w) => `${url(w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt ?? info.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/* ---------------------------------------------------------------- Arch */

const ARCH: CSSProperties = { clipPath: "url(#arch)" };

/** A pointed temple-arch frame. `shadow` is a solid colour class for the offset block behind it. */
export function Arch({ children, className = "", shadow }: { children: ReactNode; className?: string; shadow?: string }) {
  return (
    <div className={`relative ${className}`}>
      {shadow && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 translate-x-2.5 translate-y-2.5 transition-transform duration-700 ease-spring group-hover:translate-x-4 group-hover:translate-y-4 ${shadow}`}
          style={ARCH}
        />
      )}
      <div className="relative h-full w-full overflow-hidden bg-teak" style={ARCH}>
        {children}
      </div>
    </div>
  );
}

/** Shared SVG definitions — rendered once in the root layout. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="pointer-events-none absolute">
      <defs>
        <clipPath id="arch" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.33 C0,0.19 0.2,0.125 0.35,0.085 C0.445,0.06 0.485,0.03 0.5,0 C0.515,0.03 0.555,0.06 0.65,0.085 C0.8,0.125 1,0.19 1,0.33 L1,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ---------------------------------------------------------------- Ornament */

export function LotusMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16 0c4.5 5.5 5.5 12 0 19.5C10.5 12 11.5 5.5 16 0Z" />
      <path d="M1.5 7.5c6.5 0 11.5 3.5 13 12C7.5 19.5 2.5 15 1.5 7.5Z" />
      <path d="M30.5 7.5c-6.5 0-11.5 3.5-13 12 7 0 12-4.5 13-12Z" />
      <path d="M4 21.5h24V24H4z" />
    </svg>
  );
}

function petal(r0: number, r1: number, hw: number): string {
  const a = (r1 - (r1 - r0) * 0.35).toFixed(1);
  const b = (r0 + (r1 - r0) * 0.15).toFixed(1);
  return `M0 ${-r1}C${hw} ${-a} ${hw} ${-b} 0 ${-r0}C${-hw} ${-b} ${-hw} ${-a} 0 ${-r1}Z`;
}

function Ring({ n, r0, r1, hw, fill, offset = 0 }: { n: number; r0: number; r1: number; hw: number; fill: string; offset?: number }) {
  const d = petal(r0, r1, hw);
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={d} fill={fill} transform={`rotate(${((360 / n) * i + offset).toFixed(2)})`} />
      ))}
    </>
  );
}

/**
 * A ceiling-lotus medallion in the manner of Kandyan temple painting:
 * concentric bands of petals and beads in flat colour.
 */
export function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden="true">
      <circle r="199" fill="var(--color-gold)" />
      <circle r="192" fill="var(--color-maroon-deep)" />
      <Ring n={32} r0={150} r1={190} hw={13} fill="var(--color-saffron)" />
      <circle r="151" fill="var(--color-gold)" />
      <circle r="145" fill="var(--color-leaf)" />
      {Array.from({ length: 36 }, (_, i) => (
        <circle key={i} r="4.5" cx="0" cy="-133" fill="var(--color-parchment)" transform={`rotate(${i * 10})`} />
      ))}
      <circle r="121" fill="var(--color-gold)" />
      <circle r="116" fill="var(--color-lacquer)" />
      <Ring n={16} r0={58} r1={113} hw={21} fill="var(--color-parchment)" />
      <Ring n={16} r0={58} r1={97} hw={11} fill="var(--color-saffron)" offset={11.25} />
      <circle r="60" fill="var(--color-gold)" />
      <circle r="54" fill="var(--color-maroon)" />
      <Ring n={8} r0={14} r1={52} hw={14} fill="var(--color-gold)" />
      <circle r="14" fill="var(--color-lacquer)" />
      <circle r="6" fill="var(--color-gold)" />
    </svg>
  );
}

/* ---------------------------------------------------------------- Icons */

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

/* ---------------------------------------------------------------- Headings */

export function SectionHead({
  kicker,
  title,
  children,
  tone = "light",
  className = "",
}: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className={`label flex items-center gap-3 ${dark ? "text-gold" : "text-lacquer"}`}>
        <LotusMark className="h-4 w-5" />
        {kicker}
      </p>
      <h2 className={`display mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)] ${dark ? "text-paper" : "text-maroon"}`}>{title}</h2>
      {children && <div className={`mt-5 max-w-2xl text-lg ${dark ? "text-paper/85" : "text-teak"}`}>{children}</div>}
    </div>
  );
}

const HERO_BG = { maroon: "bg-maroon", leaf: "bg-leaf", ocean: "bg-ocean", ink: "bg-ink" } as const;
const NEXT_COLOR = { parchment: "text-parchment", paper: "text-paper", ink: "text-ink", maroon: "text-maroon", leaf: "text-leaf" } as const;

export function PageHero({
  kicker,
  native,
  nativeLang = "si",
  title,
  intro,
  photo,
  tone = "maroon",
  next = "parchment",
  children,
}: {
  kicker: ReactNode;
  native?: string;
  nativeLang?: string;
  title: string;
  intro: string;
  photo: PhotoKey;
  tone?: keyof typeof HERO_BG;
  next?: keyof typeof NEXT_COLOR;
  children?: ReactNode;
}) {
  return (
    <header className={`${HERO_BG[tone]} relative overflow-hidden text-paper`}>
      <div className="mx-auto grid max-w-7xl items-end gap-12 px-5 pt-32 pb-16 md:px-8 lg:grid-cols-12 lg:pt-40 lg:pb-20">
        <div className="lg:col-span-7">
          <p className="label text-gold">{kicker}</p>
          {native && (
            <p lang={nativeLang} className="mt-6 font-display text-3xl font-semibold text-saffron">
              {native}
            </p>
          )}
          <h1 className="display mt-2 text-[clamp(3rem,8vw,6.5rem)]">{title}</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/85 md:text-xl">{intro}</p>
          {children}
        </div>
        <div className="lg:col-span-5">
          <Arch className="mx-auto aspect-[4/5] w-full max-w-sm lg:mr-4 lg:ml-auto" shadow="bg-saffron">
            <Photo k={photo} crop="portrait" priority sizes="(min-width: 1024px) 400px, 85vw" className="fx-zoom-out" />
          </Arch>
        </div>
      </div>
      <div className={`petals ${NEXT_COLOR[next]}`} aria-hidden="true" />
    </header>
  );
}

/* ---------------------------------------------------------------- Month strip */

export function MonthStrip({ best, tone = "light" }: { best: number[]; tone?: "light" | "dark" }) {
  const names = best.map((m) => MONTHS[m - 1]).join(", ");
  return (
    <div>
      <ol className="grid grid-cols-12 gap-1" aria-hidden="true">
        {MONTHS.map((m, i) => {
          const on = best.includes(i + 1);
          return (
            <li
              key={m}
              className={`flex h-10 items-center justify-center rounded-t-full font-label text-sm font-semibold ${
                on
                  ? "bg-leaf text-paper"
                  : tone === "dark"
                    ? "bg-paper/10 text-paper/60"
                    : "bg-clay/60 text-teak/70"
              }`}
            >
              {m[0]}
            </li>
          );
        })}
      </ol>
      <p className="sr-only">Best months: {names}</p>
    </div>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5 text-lacquer" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <LotusMark key={n} className={`h-3.5 w-4 ${n <= value ? "" : "opacity-25"}`} />
      ))}
    </span>
  );
}
