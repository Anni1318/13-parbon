'use client';

import { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-10-15T00:00:00').getTime();

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-red-800 to-red-600 rounded-2xl shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-4 font-serif">Durga Puja Countdown</h2>
      <div className="flex gap-4 text-center">
        <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg backdrop-blur-sm min-w-[80px]">
          <span className="text-4xl font-bold">{timeLeft.days}</span>
          <span className="text-xs uppercase tracking-wider mt-1">Days</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg backdrop-blur-sm min-w-[80px]">
          <span className="text-4xl font-bold">{timeLeft.hours}</span>
          <span className="text-xs uppercase tracking-wider mt-1">Hours</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg backdrop-blur-sm min-w-[80px]">
          <span className="text-4xl font-bold">{timeLeft.minutes}</span>
          <span className="text-xs uppercase tracking-wider mt-1">Mins</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg backdrop-blur-sm min-w-[80px]">
          <span className="text-4xl font-bold">{timeLeft.seconds}</span>
          <span className="text-xs uppercase tracking-wider mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}
