/**
 * A stylised outline of Sri Lanka as [longitude, latitude] pairs,
 * clockwise from Point Pedro. Good enough to recognise and to place
 * pins on — not a navigational chart.
 */
export const OUTLINE: [number, number][] = [
  [80.21, 9.83],
  [80.42, 9.62],
  [80.62, 9.44],
  [80.82, 9.27],
  [80.95, 9.05],
  [81.05, 8.85],
  [81.22, 8.58],
  [81.36, 8.44],
  [81.42, 8.15],
  [81.58, 7.93],
  [81.7, 7.72],
  [81.82, 7.42],
  [81.88, 7.02],
  [81.84, 6.82],
  [81.72, 6.52],
  [81.52, 6.33],
  [81.3, 6.19],
  [81.12, 6.12],
  [80.8, 6.02],
  [80.59, 5.92],
  [80.42, 5.95],
  [80.22, 6.02],
  [80.08, 6.15],
  [79.99, 6.42],
  [79.92, 6.65],
  [79.85, 6.93],
  [79.83, 7.21],
  [79.79, 7.58],
  [79.74, 7.95],
  [79.7, 8.25],
  [79.83, 8.35],
  [79.9, 8.6],
  [79.93, 8.88],
  [79.84, 9.02],
  [79.98, 9.14],
  [80.08, 9.36],
  [80.1, 9.55],
  [79.92, 9.68],
  [80.0, 9.8],
];

export const CENTER = { lat: 7.85, lng: 80.75 };

/** Equirectangular projection around the island's centre. 1 unit = 1 degree of latitude. */
export function toXY(lat: number, lng: number): [number, number] {
  return [(lng - CENTER.lng) * 0.9905, lat - CENTER.lat];
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
