"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS, px, type PhotoKey } from "@/lib/photos";

export interface GalleryItem {
  k: PhotoKey;
  place: string;
  group: string;
}

/** Masonry gallery with a native <dialog> lightbox (focus-trapped, Esc to close, arrow keys to browse). */
export function Gallery({ items, groups }: { items: GalleryItem[]; groups: string[] }) {
  const [group, setGroup] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = group === "All" ? items : items.filter((i) => i.group === group);

  const step = useCallback(
    (dir: number) => setOpen((cur) => (cur === null ? cur : (cur + dir + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = open !== null ? shown[open] : null;

  return (
    <div>
      <div role="group" aria-label="Filter photographs" className="flex flex-wrap gap-2">
        {["All", ...groups].map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={g === group}
            onClick={() => {
              setOpen(null);
              setGroup(g);
            }}
            className={`liquid rounded-full border-[1.5px] px-4 py-2 font-label font-semibold tracking-[0.1em] uppercase ${
              g === group ? "border-maroon bg-maroon text-paper" : "border-maroon text-maroon hover:bg-maroon hover:text-paper"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="mt-4 text-teak" aria-live="polite">
        {shown.length} photographs
      </p>

      <ul className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shown.map((item, i) => {
          const info = PHOTOS[item.k];
          return (
            <li key={item.k} className="mb-4 break-inside-avoid">
              <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl bg-teak text-left" aria-label={`Open photograph: ${info.alt}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={px(info.id, 800)}
                  srcSet={`${px(info.id, 480)} 480w, ${px(info.id, 800)} 800w, ${px(info.id, 1200)} 1200w`}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 94vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full transition-transform duration-700 group-hover:scale-105"
                />
                <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1.5 font-label text-sm font-semibold tracking-[0.1em] uppercase">{item.place}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog ref={dialog} className="lightbox" onClose={() => setOpen(null)} aria-label="Photograph viewer">
        {current && (
          <div className="flex h-full flex-col">
            <div className="relative min-h-0 flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={current.k} src={px(PHOTOS[current.k].id, 1800)} alt={PHOTOS[current.k].alt} className="absolute inset-0 h-full w-full object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 px-5 py-4">
              <div>
                <p className="font-display text-xl font-bold">{current.place}</p>
                <p className="text-sm text-paper/75">
                  {PHOTOS[current.k].alt} · Photo: {PHOTOS[current.k].by} / Pexels
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="btn btn-line" aria-label="Previous photograph">
                  Prev
                </button>
                <button type="button" onClick={() => step(1)} className="btn btn-line" aria-label="Next photograph">
                  Next
                </button>
                <button type="button" onClick={() => setOpen(null)} className="btn btn-saffron" autoFocus>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
