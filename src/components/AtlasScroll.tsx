"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AtlasStep } from "@/lib/data";
import type { Pin, View } from "@/lib/geo";
import { Arrow, LotusMark } from "./ui";

const Island3D = dynamic(() => import("./Island3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-abyss">
      <LotusMark className="h-10 w-12 animate-pulse text-gold" />
      <span className="label text-paper/70">Loading satellite terrain…</span>
    </div>
  ),
});

/**
 * Scroll-driven 3D atlas: the island stays pinned while the camera flies
 * from region to region as the visitor scrolls through the steps.
 */
export function AtlasScroll({ steps, pins }: { steps: AtlasStep[]; pins: Pin[] }) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [index, setIndex] = useState(0);
  const views = useMemo(() => steps.map((s) => s.view), [steps]);

  useEffect(() => {
    const update = () => {
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const f = p * (steps.length - 1);
      progress.current = f;
      const i = Math.round(f);
      setIndex((prev) => (prev === i ? prev : i));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [steps.length]);

  const nameOf = useMemo(() => Object.fromEntries(pins.map((p) => [p.slug, p.name])), [pins]);

  return (
    <section ref={section} className="relative bg-abyss text-paper" aria-label="The island, region by region">
      <div className="sticky top-0 h-svh overflow-hidden">
        <Island3D pins={pins} views={views} progress={progress} active={steps[index].slugs} shift={0.2} className="h-full w-full" />
        <ol className="absolute top-1/2 right-4 hidden -translate-y-1/2 flex-col gap-3 md:flex" aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s.id} className={`h-2.5 w-2.5 rotate-45 transition-colors duration-300 ${i === index ? "bg-gold" : "bg-paper/25"}`} />
          ))}
        </ol>
      </div>

      <div className="pointer-events-none relative -mt-[100svh]">
        {steps.map((s, i) => (
          <div key={s.id} className="flex min-h-svh items-end px-4 pb-8 md:px-10 lg:items-center lg:pb-0">
            <article
              className={`glass pointer-events-auto w-full max-w-md rounded-[1.75rem] p-6 transition-opacity duration-500 md:p-8 lg:ml-[4vw] ${
                i === index ? "opacity-100" : "opacity-40"
              }`}
            >
              <p className="label flex items-center justify-between gap-3 text-gold">
                <span>{s.kicker}</span>
                <span className="text-paper/70">
                  {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
              </p>
              {i === 0 ? (
                <h2 className="display mt-4 text-4xl md:text-5xl">{s.title}</h2>
              ) : (
                <h3 className="display mt-4 text-4xl md:text-5xl">{s.title}</h3>
              )}
              <p className="mt-4 text-paper/90">{s.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.slugs.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/destinations/${slug}`}
                      className="block rounded-full border border-paper/40 px-3 py-1.5 font-label text-sm font-semibold tracking-[0.1em] uppercase transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                    >
                      {nameOf[slug] ?? slug}
                    </Link>
                  </li>
                ))}
              </ul>
              {s.region ? (
                <Link href={`/destinations?region=${encodeURIComponent(s.region)}`} className="label mt-6 inline-flex items-center gap-2 text-gold underline-offset-4 hover:underline">
                  Explore {s.kicker} <Arrow />
                </Link>
              ) : (
                <p className="label mt-6 flex items-center gap-2 text-paper/70">
                  Scroll to travel
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 3v13M5 11l5 5 5-5" />
                  </svg>
                </p>
              )}
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Free-standing island: drag to turn it, or pick a region to fly there.
 * Only the chosen region's places are labelled, so the map stays readable.
 */
export function IslandExplorer({ pins, steps, className = "" }: { pins: Pin[]; steps: AtlasStep[]; className?: string }) {
  const progress = useRef(0);
  const [index, setIndex] = useState(0);
  const views = useMemo<View[]>(() => steps.map((s) => s.view), [steps]);

  const pick = (i: number) => {
    progress.current = i;
    setIndex(i);
  };

  return (
    <div className={`relative ${className}`}>
      <Island3D pins={pins} views={views} progress={progress} active={steps[index].slugs} interactive shift={0.2} className="h-full w-full" />
      <div role="group" aria-label="Fly to a region" className="absolute inset-x-3 bottom-10 z-10 flex flex-wrap justify-center gap-2 lg:left-auto lg:max-w-xl lg:justify-end lg:pr-6">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => pick(i)}
            className={`liquid rounded-full px-3.5 py-2 font-label text-sm font-semibold tracking-[0.1em] uppercase ${i === index ? "bg-gold text-ink" : "glass"}`}
          >
            {s.kicker}
          </button>
        ))}
      </div>
    </div>
  );
}
