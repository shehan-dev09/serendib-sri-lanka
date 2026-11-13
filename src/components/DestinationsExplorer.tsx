"use client";

import { useMemo, useState } from "react";
import { MONTHS_LONG, REGIONS, TAGS, type Region, type Tag } from "@/lib/data";
import { DestinationCard, type CardDestination } from "./DestinationCard";

const pill = (on: boolean) =>
  `liquid rounded-full border-[1.5px] px-4 py-2 font-label font-semibold tracking-[0.1em] uppercase ${
    on ? "border-maroon bg-maroon text-paper" : "border-maroon text-maroon hover:bg-maroon hover:text-paper"
  }`;

export function DestinationsExplorer({ items, initialRegion }: { items: CardDestination[]; initialRegion?: Region }) {
  const [region, setRegion] = useState<Region | "All">(initialRegion ?? "All");
  const [tag, setTag] = useState<Tag | "All">("All");
  const [month, setMonth] = useState(0);
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (d) =>
        (region === "All" || d.region === region) &&
        (tag === "All" || d.tags.includes(tag)) &&
        (month === 0 || d.best.includes(month)) &&
        (!q || `${d.name} ${d.tagline} ${d.region} ${d.tags.join(" ")}`.toLowerCase().includes(q)),
    );
  }, [items, region, tag, month, query]);

  const filtered = region !== "All" || tag !== "All" || month !== 0 || query !== "";
  const reset = () => {
    setRegion("All");
    setTag("All");
    setMonth(0);
    setQuery("");
  };

  return (
    <div>
      <div className="grid gap-6 rounded-[1.75rem] bg-paper p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
          <div>
            <label htmlFor="dest-search" className="label mb-2 block text-teak">
              Search
            </label>
            <input id="dest-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “surf”, “temple” or “Ella”" className="field" />
          </div>
          <div>
            <label htmlFor="dest-month" className="label mb-2 block text-teak">
              Good in
            </label>
            <select id="dest-month" value={month} onChange={(e) => setMonth(Number(e.target.value))} className="field">
              <option value={0}>Any month</option>
              {MONTHS_LONG.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <p className="label mb-2 text-teak" id="region-label">
            Region
          </p>
          <div role="group" aria-labelledby="region-label" className="flex flex-wrap gap-2">
            {(["All", ...REGIONS] as const).map((r) => (
              <button key={r} type="button" aria-pressed={region === r} onClick={() => setRegion(r)} className={pill(region === r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="label mb-2 text-teak" id="tag-label">
            I&rsquo;m here for
          </p>
          <div role="group" aria-labelledby="tag-label" className="flex flex-wrap gap-2">
            {(["All", ...TAGS] as const).map((t) => (
              <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)} className={pill(tag === t)}>
                {t === "All" ? "Everything" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-2xl font-bold text-maroon" aria-live="polite">
          {shown.length} {shown.length === 1 ? "destination" : "destinations"}
        </p>
        {filtered && (
          <button type="button" onClick={reset} className="label text-lacquer underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>

      {shown.length ? (
        <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((d) => (
            <li key={d.slug}>
              <DestinationCard d={d} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-[1.75rem] border-[1.5px] border-dashed border-maroon/50 p-10 text-center">
          <p className="display text-3xl text-maroon">Nothing matches that combination</p>
          <p className="mx-auto mt-3 max-w-md text-teak">Try another month or region — the two coasts have opposite seasons, so there is always somewhere to go.</p>
          <button type="button" onClick={reset} className="btn btn-maroon mt-6">
            Show all destinations
          </button>
        </div>
      )}
    </div>
  );
}
