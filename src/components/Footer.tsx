import Link from "next/link";
import { EMERGENCY } from "@/lib/data";
import { NewsletterForm } from "./forms";
import { LotusMark } from "./ui";

const EXPLORE = [
  ["/destinations", "Destinations"],
  ["/experiences", "Experiences"],
  ["/culture", "Culture & heritage"],
  ["/food", "Food & tea"],
  ["/wildlife", "Wildlife"],
  ["/gallery", "Gallery"],
] as const;

const PLAN = [
  ["/plan", "Travel guide"],
  ["/itineraries", "Itineraries"],
  ["/guestbook", "Guestbook"],
  ["/contact", "Contact"],
] as const;

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="petals petals-down text-parchment" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="flex items-center gap-3">
              <LotusMark className="h-7 w-9 text-gold" />
              <span className="display text-4xl">Serendib</span>
            </p>
            <p className="mt-4 max-w-sm text-paper/80">
              An independent guide to Sri Lanka — the island once called Serendib, which gave the world the word <em>serendipity</em>.
            </p>
            <p className="mt-6 font-display text-2xl text-saffron">
              <span lang="si">ස්තූතියි</span> · <span lang="ta">நன்றி</span> · Thank you
            </p>
          </div>

          <nav aria-label="Explore" className="lg:col-span-2">
            <p className="label text-gold">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="underline-offset-4 hover:text-gold hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Plan" className="lg:col-span-2">
            <p className="label text-gold">Plan</p>
            <ul className="mt-4 space-y-2.5">
              {PLAN.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="underline-offset-4 hover:text-gold hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <NewsletterForm />
          </div>
        </div>

        <div className="beads mt-14 text-saffron" aria-hidden="true" />

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
          {EMERGENCY.map((e) => (
            <div key={e.number}>
              <dt className="label text-paper/70">{e.label}</dt>
              <dd className="display mt-1 text-3xl text-gold">
                <a href={`tel:${e.number}`} className="underline-offset-4 hover:underline">
                  {e.number}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 max-w-3xl text-sm text-paper/70">
          This guide is an independent showcase of Sri Lanka for visitors from abroad: it does not sell tours, take bookings or handle payments. Entry
          rules, opening times and prices change, so check official sources — including the Department of Immigration (eta.gov.lk) and your own
          government&rsquo;s travel advice — before you travel. Photography by contributors to Pexels; credits are listed in the{" "}
          <Link href="/gallery" className="underline underline-offset-2 hover:text-gold">
            gallery
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
