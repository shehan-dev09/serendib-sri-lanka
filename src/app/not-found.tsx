import Link from "next/link";
import { Mandala } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-maroon text-paper">
      <div className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-5 pt-32 pb-20 text-center">
        <Mandala className="h-40 w-40" />
        <p className="label mt-10 text-gold">Page not found</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">This path ends in the jungle.</h1>
        <p className="mt-6 max-w-md text-lg text-paper/85">The page you were looking for has moved or never existed. The island, happily, is still here.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-saffron">
            Back to the start
          </Link>
          <Link href="/destinations" className="btn btn-line">
            See destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
