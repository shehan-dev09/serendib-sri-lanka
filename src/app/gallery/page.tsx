import type { Metadata } from "next";
import { Gallery, type GalleryItem } from "@/components/Gallery";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs of Sri Lanka: ancient cities, the hill country, both coasts, wildlife, festivals and food.",
};

const GROUPS = ["Heritage", "Hill country", "Coast", "Wildlife", "People & food"];

const set = (group: string, place: string, ...keys: PhotoKey[]): GalleryItem[] => keys.map((k) => ({ k, place, group }));

const ITEMS: GalleryItem[] = [
  ...set("Heritage", "Sigiriya", "sigiriya", "sigiriyaFar", "sigiriyaGardens", "sigiriyaView"),
  ...set("Hill country", "Ella", "nineArchTrain", "nineArch", "ravanaFalls"),
  ...set("Coast", "Mirissa", "mirissaPalms", "mirissaBeach", "palmOcean"),
  ...set("Wildlife", "Sri Lanka", "leopard", "elephants", "peacock"),
  ...set("People & food", "Sri Lanka", "dancer", "drummers", "monks"),
  ...set("Heritage", "Kandy", "kandyTemple", "kandyLake"),
  ...set("Heritage", "Dambulla", "dambulla", "dambullaSeated"),
  ...set("Hill country", "Nuwara Eliya", "teaPicker", "teaHills", "hillFalls"),
  ...set("Coast", "Galle", "galleLighthouse", "galleWall"),
  ...set("Wildlife", "Yala", "leopardTree", "deer"),
  ...set("Heritage", "Anuradhapura", "ruwanweli", "ruwanweliTrees"),
  ...set("Heritage", "Polonnaruwa", "polonnaruwa", "polonnaruwaLion", "polonnaruwaPalace"),
  ...set("Hill country", "Horton Plains", "horton", "hortonTrail"),
  ...set("Hill country", "Hill country", "train", "railway", "sunrisePeaks", "nineArchTea", "ellaView"),
  ...set("Hill country", "Nallathanniya", "mistFalls"),
  ...set("Coast", "Weligama", "weligama", "weligamaBeach"),
  ...set("Coast", "Unawatuna", "unawatuna"),
  ...set("Coast", "South coast", "stiltFisher", "coconut"),
  ...set("Coast", "Trincomalee", "trincoSunset", "trincoBoat", "trincoShore"),
  ...set("Coast", "Arugam Bay", "arugam"),
  ...set("Wildlife", "Kaudulla", "elephantsGreen"),
  ...set("Wildlife", "Sri Lanka", "elephantFamily"),
  ...set("Heritage", "Colombo", "colombo", "colomboNight", "colomboBuddhas"),
  ...set("Heritage", "Galle Fort", "galleClock", "galleCafe"),
  ...set("Heritage", "Jaffna", "nallur"),
  ...set("People & food", "Sri Lanka", "vesak", "masks", "puppets", "ceremony", "hoppers", "pongal"),
  ...set("People & food", "Colombo", "streetFood"),
];

const credits = [...new Set(Object.values(PHOTOS).map((p) => p.by))].sort((a, b) => a.localeCompare(b));

export default function GalleryPage() {
  return (
    <>
      <header className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-5 pt-36 pb-14 md:px-8 lg:pt-44">
          <p className="label text-gold">Gallery</p>
          <p lang="si" className="mt-6 font-display text-3xl font-semibold text-saffron">
            ඡායාරූප
          </p>
          <h1 className="display mt-2 text-[clamp(3rem,8vw,6.5rem)]">See it before you go</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/85 md:text-xl">{ITEMS.length} photographs from across the island. Select any picture to view it full screen.</p>
        </div>
        <div className="petals text-parchment" aria-hidden="true" />
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Gallery items={ITEMS} groups={GROUPS} />
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <h2 className="label text-lacquer">Photography credits</h2>
          <p className="mt-4 max-w-4xl text-teak">
            With thanks to the photographers who share their work on Pexels: {credits.join(", ")}.
          </p>
        </div>
      </section>
    </>
  );
}
