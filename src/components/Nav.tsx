"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LotusMark } from "./ui";

const MAIN = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/culture", label: "Culture" },
  { href: "/food", label: "Food & Tea" },
  { href: "/wildlife", label: "Wildlife" },
  { href: "/itineraries", label: "Itineraries" },
  { href: "/plan", label: "Travel Guide" },
];

const MORE = [
  { href: "/gallery", label: "Gallery" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 px-3">
        <div className="glass glass-deep mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pr-2 pl-5">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5" aria-label="Serendib — home">
            <LotusMark className="h-5 w-6 text-gold" />
            <span className="font-display text-2xl leading-none font-extrabold tracking-tight">Serendib</span>
            <span lang="si" className="hidden font-display text-base leading-none text-gold sm:inline" aria-hidden="true">
              ශ්‍රී ලංකා
            </span>
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {MAIN.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`rounded-full px-3 py-2 font-label text-[0.95rem] font-semibold tracking-[0.1em] uppercase transition-colors ${
                      isActive(l.href) ? "bg-gold text-ink" : "text-paper hover:bg-paper/15"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/gallery"
              onClick={() => setOpen(false)}
              className="liquid hidden h-10 items-center rounded-full bg-saffron px-4 font-label text-[0.95rem] font-bold tracking-[0.1em] text-ink uppercase hover:bg-gold md:flex"
            >
              Gallery
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper/15 xl:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="site-menu" className="fixed inset-0 z-40 overflow-y-auto bg-maroon text-paper xl:hidden">
          <nav aria-label="Menu" className="mx-auto max-w-xl px-7 pt-28 pb-12">
            <ul>
              {MAIN.map((l) => (
                <li key={l.href} className="border-b border-paper/20">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`display flex items-center justify-between py-4 text-4xl ${isActive(l.href) ? "text-gold" : ""}`}
                  >
                    {l.label}
                    {isActive(l.href) && <LotusMark className="h-5 w-6" />}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-8 flex flex-wrap gap-3">
              {MORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="btn btn-line">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p lang="si" className="mt-10 font-display text-3xl text-saffron">
              ආයුබෝවන්
            </p>
          </nav>
          <div className="petals text-gold" aria-hidden="true" />
        </div>
      )}
    </>
  );
}
