// FAKE data
// Later, replace the inside of getCars() with a real request to backend, e.g.:
//   const res = await fetch("http://192.168.1.10:3000/cars");
import type { Car } from "./types.ts";

const cars: Car[] = [
  { carId: 1, name: "Car 1", speedKmh: 0, bestLapS: null, foul: false },
  // Change foul to true to see the "FOUL DETECTED" design:
  { carId: 2, name: "Car 2", speedKmh: 0, bestLapS: null, foul: false },
];

export async function getCars(): Promise<Car[]> {
  for (const car of cars) {
    car.speedKmh = 25 + Math.random() * 30; 

    if (Math.random() < 0.2) {
      const lap = 11 + Math.random() * 3;
      if (car.bestLapS === null || lap < car.bestLapS) car.bestLapS = lap;
    }
  }
  return cars.map((c) => ({ ...c })); 
}
