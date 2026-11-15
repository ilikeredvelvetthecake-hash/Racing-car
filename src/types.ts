// The shape of ONE car's data.
export type Car = {
  carId: number;
  name: string;
  speedKmh: number;
  bestLapS: number | null; // null means "no lap finished yet"
  foul: boolean; // true when the car started early
};
 
