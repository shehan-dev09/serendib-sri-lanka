import { TERRAIN } from "./terrain";

export const CENTER = { lat: 7.85, lng: 80.75 };

/** Web-Mercator northing in "degree" units, so x and y share one scale (same projection as the map tiles). */
export function mercDeg(lat: number): number {
  return (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
}

/** Projects lat/lng to flat map units around the island centre (1 unit ≈ 1° of longitude). */
export function toXY(lat: number, lng: number): [number, number] {
  return [lng - CENTER.lng, mercDeg(lat) - mercDeg(CENTER.lat)];
}

/** Position on the terrain images: u 0→1 west→east, v 0→1 south→north. */
export function toUV(lat: number, lng: number): [number, number] {
  return [
    (lng - TERRAIN.west) / (TERRAIN.east - TERRAIN.west),
    (mercDeg(lat) - mercDeg(TERRAIN.south)) / (mercDeg(TERRAIN.north) - mercDeg(TERRAIN.south)),
  ];
}

export interface Pin {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  high?: boolean;
}

export interface View {
  lat: number;
  lng: number;
  dist: number;
  az: number;
  pol: number;
}
