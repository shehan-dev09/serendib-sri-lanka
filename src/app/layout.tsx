import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/abhaya-libre/400.css";
import "@fontsource/abhaya-libre/600.css";
import "@fontsource/abhaya-libre/700.css";
import "@fontsource/abhaya-libre/800.css";
import "@fontsource/yaldevi/400.css";
import "@fontsource/yaldevi/500.css";
import "@fontsource/yaldevi/600.css";
import "@fontsource/gemunu-libre/600.css";
import "@fontsource/gemunu-libre/700.css";
import "@fontsource/noto-sans-tamil/tamil-400.css";
import "@fontsource/noto-sans-tamil/tamil-600.css";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SvgDefs } from "@/components/ui";

export const metadata: Metadata = {
  title: {
    default: "Serendib — Discover Sri Lanka",
    template: "%s · Serendib — Discover Sri Lanka",
  },
  description:
    "A showcase of Sri Lanka for visitors from abroad: ancient cities, tea country, wildlife, beaches, food, festivals, suggested routes and practical advice.",
  openGraph: {
    title: "Serendib — Discover Sri Lanka",
    description: "Ancient cities, tea country, leopards and 1,340 km of coast — the island of serendipity, shown in full.",
    type: "website",
    images: ["https://images.pexels.com/photos/19574565/pexels-photo-19574565.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6f1a28",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main" className="btn btn-saffron fixed top-3 left-3 z-[100] -translate-y-24 focus:translate-y-0">
          Skip to content
        </a>
        <SvgDefs />
        <Nav />
        <main id="main" className="relative overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
