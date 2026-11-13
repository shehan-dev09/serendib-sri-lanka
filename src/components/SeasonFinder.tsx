"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { CLIMATE, FESTIVALS, MONTHS, MONTHS_LONG, OUTLOOK_LABEL, type Outlook } from "@/lib/data";
import { LotusMark } from "./ui";

const CHIP: Record<Outlook, string> = {
  2: "bg-leaf text-paper",
  1: "bg-gold text-ink",
  0: "bg-clay text-teak",
};

const subscribeNever = () => () => {};
const currentMonth = () => new Date().getMonth();

export interface SeasonPlace {
  slug: string;
  name: string;
  best: number[];
}

/** Pick a month, see which parts of the island are in season. */
export function SeasonFinder({ places }: { places: SeasonPlace[] }) {
  // Start on the visitor's current month (January while rendering on the server).
  const current = useSyncExternalStore(subscribeNever, currentMonth, () => 0);
  const [picked, setMonth] = useState<number | null>(null);
  const month = picked ?? current;

  const going = places.filter((p) => p.best.includes(month + 1));
  const festivals = FESTIVALS.filter((f) => f.months.includes(month + 1));

  return (
    <div>
      <div role="group" aria-label="Choose a month" className="grid grid-cols-6 gap-1.5 md:grid-cols-12">
        {MONTHS.map((m, i) => (
          <button
            key={m}
            type="button"
            onClick={() => setMonth(i)}
            aria-pressed={i === month}
            aria-label={MONTHS_LONG[i]}
            className={`liquid flex h-16 flex-col items-center justify-center rounded-t-full font-label text-lg font-bold tracking-wider uppercase ${
              i === month ? "bg-maroon text-paper" : "bg-clay/55 text-teak hover:bg-saffron hover:text-ink"
            }`}
          >
            {i === month && <LotusMark className="mb-0.5 h-3 w-4 text-gold" />}
            {m}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12" aria-live="polite">
        <div className="lg:col-span-7">
          <h3 className="display text-4xl text-maroon">{MONTHS_LONG[month]} across the island</h3>
          <ul className="mt-6 divide-y divide-clay border-y border-clay">
            {CLIMATE.map((row) => (
              <li key={row.id} className="grid gap-2 py-4 sm:grid-cols-[11rem_7.5rem_1fr] sm:items-center sm:gap-5">
                <span className="font-display text-xl font-bold text-ink">{row.label}</span>
                <span className={`label inline-flex w-fit items-center rounded-full px-3 py-1.5 text-[0.8rem] ${CHIP[row.months[month]]}`}>
                  {OUTLOOK_LABEL[row.months[month]]}
                </span>
                <span className="text-[0.975rem] leading-snug text-teak">{row.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-teak/80">Typical patterns only — tropical weather varies from year to year.</p>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-[1.75rem] bg-leaf p-7 text-paper">
            <p className="label text-gold">In season in {MONTHS_LONG[month]}</p>
            {going.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {going.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/destinations/${p.slug}`}
                      className="block rounded-full border border-paper/40 px-3 py-1.5 font-label text-sm font-semibold tracking-[0.1em] uppercase transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4">A quieter month everywhere — good for lower prices and empty sites, with showers likely.</p>
            )}
            {festivals.length > 0 && (
              <>
                <p className="label mt-8 text-gold">Festivals this month</p>
                <ul className="mt-3 space-y-3">
                  {festivals.map((f) => (
                    <li key={f.name}>
                      <span className="font-display text-xl font-bold">{f.name}</span>
                      <span className="block text-[0.95rem] text-paper/80">
                        {f.when} · {f.where}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
