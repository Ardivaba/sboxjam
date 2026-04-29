"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "days", value: timeLeft.days },
    { label: "hrs", value: timeLeft.hours },
    { label: "min", value: timeLeft.minutes },
    { label: "sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-2 md:gap-3 font-mono">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-baseline gap-2 md:gap-3">
          <div className="text-center">
            <span className="text-3xl md:text-5xl font-bold text-white tabular-nums tracking-tight">
              {mounted ? String(value).padStart(2, "0") : "--"}
            </span>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-sans">{label}</p>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl md:text-4xl text-white/15 font-light self-start mt-0.5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
