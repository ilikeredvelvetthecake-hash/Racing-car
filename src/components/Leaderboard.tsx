import { useEffect, useState } from "react";
import type { Car } from "../types.ts";
import { getCars } from "../mockCars.ts";

const SWATCH: Record<number, string> = {
  1: "bg-[#FF4D5E]",
  2: "bg-[#3FA9FF]",
};

// Lower score = better rank. Cars with a foul or no lap go to the bottom.
function score(car: Car) {
  return car.foul || car.bestLapS === null ? 9999 : car.bestLapS;
}

export default function Leaderboard() {
  // "State" = data the page remembers. When it changes, the page redraws.
  const [cars, setCars] = useState<Car[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // 1) Ask for new data once per second.
  useEffect(() => {
    async function load() {
      try {
        setCars(await getCars());
        setConnected(true);
        setLastUpdate(Date.now());
      } catch {
        setConnected(false); 
      }
    }
    load();
    const timer = setInterval(load, 1000); // then every 1000 ms
    return () => clearInterval(timer); // stop when the page closes
  }, []);

  // 2) A clock,"Updated 3s ago".
  useEffect(() => {

    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  const ranked = [...cars].sort((a, b) => score(a) - score(b));
  const foulCar = cars.find((c) => c.foul);
  const secondsAgo =
    lastUpdate === null ? null : Math.max(0, Math.round((now - lastUpdate) / 1000));
  const disconnected = !connected || (secondsAgo !== null && secondsAgo > 5);

  let statusText = "Live";
  let statusDot = "bg-[#38D96B]"; 
  if (disconnected) {
    statusText = "Disconnected";
    statusDot = "bg-[#FF4D5E]"; 
  } else if (foulCar) {
    statusText = "Foul";
    statusDot = "bg-[#FF4D5E]";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#2B2E36] p-4 text-white">
      {}
      <h1 className="border-b-4 border-[#8F1A26] bg-[#D62839] px-8 py-4 text-center text-lg">
        LEADERBOARD
      </h1>
      <p className="text-2xl text-[#FFD23F]">★★★</p>

      {}
      {foulCar && (
        <div className="w-full max-w-xl border-4 border-[#FFD23F] bg-[#D62839] p-4 text-center">
          <p className="text-base">FOUL DETECTED!</p>
          <p className="mt-2 text-xs text-[#FFD23F]">
            {foulCar.name.toUpperCase()} STARTED EARLY
          </p>
        </div>
      )}

      {}
      <section className="w-full max-w-xl border-4 border-[#FFD23F] bg-[#0A0A12] p-4 shadow-[6px_6px_0_#D62839]">
        {}
        <div className="grid grid-cols-[2rem_1fr_6rem_8rem] gap-2 pb-3 text-[10px] text-[#9AA3B5]">
          <span>#</span>
          <span>Car</span>
          <span className="text-right">Best lap</span>
          <span className="text-right">Speed</span>
        </div>

        {}
        {cars.length === 0 && (
          <p className="py-8 text-center text-xs text-[#9AA3B5]">Waiting for cars…</p>
        )}

        {}
        {ranked.map((car, index) => (
          <div
            key={car.carId}
            className={
              "grid grid-cols-[2rem_1fr_6rem_8rem] items-center gap-2 border-t-2 border-dashed border-[#262A36] py-3 text-xs " +
              (car.foul
                ? "text-[#FF4D5E]" 
                : index === 0
                  ? "text-[#FFD23F]" 
                  : "text-white")
            }
          >
            <span>{index + 1}</span>
            <span className="flex items-center gap-2">
              <i className={"inline-block h-3 w-3 " + (SWATCH[car.carId] ?? "bg-white")} />
              {car.name}
              {car.foul && (
                <b className="bg-[#FF4D5E] px-1 py-0.5 text-[8px] text-[#0A0A12]">FOUL</b>
              )}
            </span>
            <span className="text-right">
              {car.foul || car.bestLapS === null ? "--.--" : car.bestLapS.toFixed(2) + "s"}
            </span>
            <span className="text-right">{car.speedKmh.toFixed(1)} km/h</span>
          </div>
        ))}

        {}
        <div className="mt-1 flex justify-between border-t-2 border-[#262A36] pt-3 text-[10px] text-[#9AA3B5]">
          <span className="flex items-center gap-2">
            <i className={"inline-block h-2 w-2 " + statusDot} />
            {statusText}
          </span>
          {secondsAgo !== null && <span>Updated {secondsAgo}s ago</span>}
        </div>
      </section>
    </main>
  );
}
