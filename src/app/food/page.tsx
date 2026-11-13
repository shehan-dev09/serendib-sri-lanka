import type { Metadata } from "next";
import { LotusMark, PageHero, Photo, SectionHead } from "@/components/ui";
import { DISHES, DRINKS, SPICES, TEA_REGIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Food & tea",
  description: "What to eat and drink in Sri Lanka: rice and curry, hoppers, kottu, seafood, sweets, the seven Ceylon tea regions and the island's spices.",
};

const KIND_STYLE: Record<string, string> = {
  Staple: "bg-leaf text-paper",
  "Street food": "bg-saffron text-ink",
  Curry: "bg-lacquer text-paper",
  Sweet: "bg-gold text-ink",
  Festive: "bg-maroon text-paper",
};

const TABLE_TIPS = [
  "Rice and curry is traditionally eaten with the fingertips of the right hand. Nobody minds if you ask for a spoon.",
  "Lunch is the main meal. Curries are cooked fresh in the morning, so small restaurants are at their best from noon to two.",
  "Ask for it 'not too spicy' if you are unsure — and keep a spoonful of curd or coconut sambol nearby to cool things down.",
  "Vegetarians and vegans eat extremely well: most curries are vegetables cooked in coconut milk.",
  "Short eats — pastries, rolls and fritters in bakery windows — are the national snack. You pay for what you take from the plate.",
];

export default function FoodPage() {
  return (
    <>
      <PageHero
        kicker="Food & tea"
        native="රසයි!"
        title="An island you can taste"
        intro="Rasai means delicious, and you will be saying it a lot. This is a cuisine of coconut, curry leaf and slow-roasted spice — unlike anywhere else in Asia."
        photo="hoppers"
        tone="ink"
      />

      {/* Dishes */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead kicker="The menu" title="Twelve things to eat before you leave" />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((d, i) => (
            <li key={d.name} className="fx-flip flex flex-col rounded-[1.75rem] bg-paper p-6">
              <div className="flex items-center justify-between">
                <span className="display text-5xl text-saffron" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`label rounded-full px-3 py-1 text-[0.75rem] ${KIND_STYLE[d.kind]}`}>{d.kind}</span>
              </div>
              <h3 className="display mt-4 text-3xl text-maroon">{d.name}</h3>
              <p className="text-teak italic">{d.local}</p>
              <p className="mt-3 text-teak">{d.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Photo strip */}
      <section className="bg-parchment pb-16 md:pb-24" aria-label="Food photographs">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 md:grid-cols-4 md:gap-6 md:px-8">
          {(
            [
              ["appam", "Appam, fresh from the pan"],
              ["streetFood", "Evening food carts on the Colombo seafront"],
              ["grilledFish", "Grilled fish on the south coast"],
              ["coconut", "King coconut by the sea"],
            ] as const
          ).map(([k, caption], i) => (
            <li key={k} className={`fx-flip ${i % 2 ? "md:mt-12" : ""}`}>
              <figure className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-teak">
                <Photo k={k} crop="portrait" sizes="(min-width: 768px) 22vw, 45vw" />
                <figcaption className="glass absolute inset-x-2 bottom-2 rounded-2xl px-3 py-2 text-sm leading-snug">{caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* Drinks */}
      <section className="bg-saffron text-ink">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <p className="label flex items-center gap-3 text-maroon">
            <LotusMark className="h-4 w-5" /> In the glass
          </p>
          <h2 className="display mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)]">Six things to drink</h2>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {DRINKS.map((d) => (
              <li key={d.name} className="border-t-2 border-ink py-5">
                <h3 className="display text-3xl">{d.name}</h3>
                <p className="mt-2">{d.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tea */}
      <section className="bg-leaf text-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead kicker="Ceylon tea" title="Seven regions, seven cups" tone="dark">
              <p>
                Tea arrived in the 1860s and remade the hill country. Altitude decides everything: the higher the estate, the lighter and more fragrant the
                cup.
              </p>
            </SectionHead>
            <div className="fx-swing-l mt-10 aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-leaf-deep">
              <Photo k="teaPicker" crop="portrait" sizes="(min-width: 1024px) 38vw, 92vw" className="fx-drift" />
            </div>
          </div>
          <ol className="lg:col-span-7">
            {TEA_REGIONS.map((t, i) => (
              <li key={t.name} className="fx-rise grid grid-cols-[3.5rem_1fr] gap-4 border-b border-paper/25 py-6 first:pt-0">
                <span className="display text-5xl text-gold" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="display text-3xl">{t.name}</h3>
                  <p className="label mt-1.5 text-gold">{t.height}</p>
                  <p className="mt-2 text-paper/90">{t.cup}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Spices */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
          <div>
            <SectionHead kicker="The spice island" title="What traders crossed oceans for">
              <p>Long before tea, it was cinnamon that drew ships here from Arabia, Portugal and the Netherlands.</p>
            </SectionHead>
            <ul className="mt-8 divide-y divide-clay border-y border-clay">
              {SPICES.map((s) => (
                <li key={s.name} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <h3 className="display text-2xl text-maroon">{s.name}</h3>
                  <p className="text-teak">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="fx-swing-r relative">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[1.75rem] bg-lacquer" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-teak">
              <Photo k="cinnamon" crop="portrait" sizes="(min-width: 1024px) 45vw, 92vw" />
            </div>
            <figcaption className="glass absolute bottom-4 left-4 rounded-full px-4 py-2 text-sm">Rolled cinnamon quills</figcaption>
          </figure>
        </div>
      </section>

      {/* At the table */}
      <section className="bg-maroon text-paper">
        <div className="petals petals-down text-paper" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead kicker="At the table" title="How to eat like you live here" tone="dark" />
          </div>
          <ul className="space-y-5 lg:col-span-7">
            {TABLE_TIPS.map((t) => (
              <li key={t} className="flex gap-4 border-b border-paper/25 pb-5 text-lg">
                <LotusMark className="mt-1.5 h-4 w-5 flex-none text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
