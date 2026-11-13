import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, LotusMark, PageHero, SectionHead } from "@/components/ui";
import { CLIMATE, EMERGENCY, FAQ, GETTING_AROUND, MONTHS, MONTHS_LONG, OUTLOOK_LABEL, QUICK_FACTS, type Outlook } from "@/lib/data";

export const metadata: Metadata = {
  title: "Travel guide",
  description: "Everything practical for a trip to Sri Lanka: when to go, entry rules, getting around, money, health, safety, budgets and emergency numbers.",
};

const CELL: Record<Outlook, string> = {
  2: "bg-leaf text-paper",
  1: "bg-gold text-ink",
  0: "bg-clay text-teak",
};

const BUDGETS = [
  { name: "Backpacker", range: "US$30–50", text: "Guesthouses and homestays, rice and curry, trains and buses." },
  { name: "Comfortable", range: "US$70–150", text: "Good hotels, a car and driver for part of the trip, a safari or two." },
  { name: "High-end", range: "US$250+", text: "Boutique villas and tea bungalows, private guides, seaplane transfers." },
];

const MONEY = [
  "ATMs are easy to find in every town, and cards are accepted in hotels and larger restaurants.",
  "Carry cash for buses, tuk-tuks, markets and small cafés.",
  "Major ancient sites and national parks charge foreign visitors in US dollars — often US$25–35 each — so budget for them.",
  "Keep exchange receipts if you may want to change rupees back when you leave.",
];

const HEALTH = [
  "The sun is strong all year, even under cloud in the hills. Cover up, and drink more water than you think you need.",
  "Use insect repellent, especially at dusk — dengue is carried by mosquitoes.",
  "Swim where locals swim and heed red flags. Some beaches have powerful currents, particularly out of season.",
  "Give stray dogs and temple monkeys space, and see a doctor promptly after any bite or scratch.",
  "Roads are busy and buses drive fast. Take extra care on foot and on scooters.",
  "Talk to a travel clinic about vaccinations before you go, and take out travel insurance that covers the activities you plan.",
];

export default function PlanPage() {
  return (
    <>
      <PageHero
        kicker="Travel guide"
        native="සංචාරක මාර්ගෝපදේශය"
        title="Everything practical, on one page"
        intro="When to come, how to get around, what it costs and who to call. Read this once and you are ready to book."
        photo="tuktuk"
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            ["#facts", "Quick facts"],
            ["#seasons", "When to go"],
            ["#entry", "Entry"],
            ["#transport", "Getting around"],
            ["#money", "Money"],
            ["#health", "Health & safety"],
            ["#faq", "Questions"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="btn btn-line">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Facts */}
      <section id="facts" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
        <SectionHead kicker="Quick facts" title="The essentials" />
        <dl className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_FACTS.map((f) => (
            <div key={f.label} className="fx-rise border-t-[3px] border-double border-maroon py-5">
              <dt className="label text-lacquer">{f.label}</dt>
              <dd className="mt-2 font-display text-2xl leading-snug font-bold text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Seasons */}
      <section id="seasons" className="scroll-mt-24 bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead kicker="When to go" title="A season chart for the whole island">
            <p>
              Two monsoons, arriving from opposite directions at opposite times of year, mean that somewhere is always dry. Temperatures on the coast stay
              around 27–32°C all year; the hills are ten degrees cooler.
            </p>
          </SectionHead>

          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Key">
            {([2, 1, 0] as Outlook[]).map((o) => (
              <li key={o} className="flex items-center gap-2">
                <span className={`h-5 w-5 rounded-t-full ${CELL[o]}`} aria-hidden="true" />
                <span className="label text-teak">{OUTLOOK_LABEL[o]}</span>
              </li>
            ))}
          </ul>

          <div className="relative mt-6 overflow-x-auto">
            <table className="w-full min-w-[52rem] border-separate border-spacing-1 text-left">
              <caption className="sr-only">Typical travel conditions by region and month</caption>
              <thead>
                <tr>
                  <th scope="col" className="label w-48 px-2 py-2 text-teak">Region</th>
                  {MONTHS.map((m, i) => (
                    <th key={m} scope="col" className="label px-1 py-2 text-center text-teak">
                      <abbr title={MONTHS_LONG[i]} className="no-underline">
                        {m}
                      </abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLIMATE.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" className="px-2 py-2 font-display text-xl font-bold text-ink">{row.label}</th>
                    {row.months.map((o, i) => (
                      <td key={i} className={`h-12 rounded-t-full text-center font-label text-sm font-bold ${CELL[o]}`}>
                        <span className="sr-only">{OUTLOOK_LABEL[o]}</span>
                        <span aria-hidden="true">{o === 2 ? "●" : o === 1 ? "◐" : "○"}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {CLIMATE.map((row) => (
              <li key={row.id} className="border-t border-clay pt-4">
                <span className="font-display text-xl font-bold text-maroon">{row.label}.</span> <span className="text-teak">{row.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-teak/80">These are typical patterns. Tropical weather varies from year to year, and showers are possible in any month.</p>
        </div>
      </section>

      {/* Entry */}
      <section id="entry" className="scroll-mt-24 bg-maroon text-paper">
        <div className="petals petals-down text-paper" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead kicker="Entry & arrival" title="Getting in" tone="dark" />
          </div>
          <div className="space-y-6 text-lg text-paper/90 lg:col-span-7">
            <p>
              <strong className="text-gold">Visas.</strong> Most visitors need an Electronic Travel Authorisation (ETA) or visa arranged before they fly. The
              rules, fees and list of exempt nationalities have changed several times in recent years, so rely only on the official Department of
              Immigration portal, <span className="whitespace-nowrap">eta.gov.lk</span>, and apply there directly.
            </p>
            <p>
              <strong className="text-gold">Passport.</strong> It should be valid for at least six months from your date of arrival.
            </p>
            <p>
              <strong className="text-gold">Arriving.</strong> Almost all international flights land at Bandaranaike International Airport (CMB) at Katunayake,
              about 30 km north of Colombo. Banks, SIM-card counters and a taxi desk are in the arrivals hall. The beach town of Negombo is 20 minutes
              away; Colombo is 30–45 minutes by expressway.
            </p>
            <p>
              <strong className="text-gold">Customs.</strong> Do not carry or wear images of the Buddha as fashion, and do not take antiques, coral or shells
              out of the country.
            </p>
          </div>
        </div>
      </section>

      {/* Transport */}
      <section id="transport" className="scroll-mt-24 bg-parchment">
        <div className="petals petals-down text-maroon" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead kicker="Getting around" title="Slow roads, wonderful journeys">
            <p>Plan on about 40 km an hour by road. The upside: there is always something to look at out of the window.</p>
          </SectionHead>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {GETTING_AROUND.map((g, i) => (
              <li key={g.mode} className={`fx-flip rounded-[1.75rem] p-6 ${["bg-maroon text-paper", "bg-saffron text-ink", "bg-leaf text-paper", "bg-ocean text-paper", "bg-ink text-paper"][i]}`}>
                <h3 className="display text-3xl">{g.mode}</h3>
                <p className="mt-3 leading-snug opacity-95">{g.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Money */}
      <section id="money" className="scroll-mt-24 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
          <div>
            <SectionHead kicker="Money" title="What it costs">
              <p>Rough daily budgets per person, not counting international flights. Prices move with the exchange rate, so treat these as a guide.</p>
            </SectionHead>
            <ul className="mt-8 space-y-4">
              {BUDGETS.map((b) => (
                <li key={b.name} className="grid gap-2 rounded-2xl bg-parchment p-5 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6">
                  <div>
                    <p className="label text-lacquer">{b.name}</p>
                    <p className="display mt-1 text-3xl text-maroon">{b.range}</p>
                  </div>
                  <p className="text-teak">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:pt-24">
            <ul className="space-y-5">
              {MONEY.map((t) => (
                <li key={t} className="flex gap-4 border-b border-clay pb-5 text-lg text-teak">
                  <LotusMark className="mt-1.5 h-4 w-5 flex-none text-lacquer" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Health */}
      <section id="health" className="scroll-mt-24 bg-leaf text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead kicker="Health & safety" title="Stay well, stay safe" tone="dark">
              <p>Sri Lanka is a welcoming place to travel. Check your own government&rsquo;s current travel advice before you go, and use ordinary good sense.</p>
            </SectionHead>
            <dl className="mt-10 grid grid-cols-2 gap-5 rounded-[1.75rem] bg-leaf-deep p-6">
              {EMERGENCY.map((e) => (
                <div key={e.number} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[0.95rem] leading-snug text-paper/80">{e.label}</dt>
                  <dd className="display text-4xl text-gold">
                    <a href={`tel:${e.number}`} className="underline-offset-4 hover:underline">
                      {e.number}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className="space-y-5 lg:col-span-7">
            {HEALTH.map((t) => (
              <li key={t} className="fx-rise flex gap-4 border-b border-paper/25 pb-5 text-lg">
                <LotusMark className="mt-1.5 h-4 w-5 flex-none text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
        <SectionHead kicker="Questions" title="What people ask first" />
        <div className="mt-10 border-t-[3px] border-double border-maroon">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-clay">
              <summary className="flex list-none items-center justify-between gap-6 py-5">
                <span className="display text-2xl text-ink md:text-3xl">{f.q}</span>
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-maroon text-maroon transition-transform duration-500 ease-spring group-open:rotate-45 group-open:bg-maroon group-open:text-paper" aria-hidden="true">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-lg text-teak">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/itineraries" className="btn btn-maroon">
            See the routes <Arrow />
          </Link>
          <Link href="/destinations" className="btn btn-line-dark">
            Browse destinations
          </Link>
        </div>
      </section>
    </>
  );
}
