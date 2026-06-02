import { useState, useEffect } from "react";

interface LiveCountdownProps {
  targetDate: string; // ISO 8601 string
}

export default function LiveCountdown({ targetDate }: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    // Rely on primitive string for dependency array
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/20 text-red-400 text-[10px] font-mono tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        Live Presentation In Progress
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 font-mono text-center select-none" id={`countdown-${targetDate.slice(0, 10)}`}>
      {/* Days */}
      <div className="flex flex-col">
        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 min-w-[32px]">
          <span className="text-xs font-bold text-purple-400">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
        </div>
        <span className="text-[7px] text-white/40 uppercase mt-0.5">D</span>
      </div>

      <span className="text-pink-500/50 text-[10px] pb-3">:</span>

      {/* Hours */}
      <div className="flex flex-col">
        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 min-w-[32px]">
          <span className="text-xs font-bold text-purple-400">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
        </div>
        <span className="text-[7px] text-white/40 uppercase mt-0.5">H</span>
      </div>

      <span className="text-pink-500/50 text-[10px] pb-3">:</span>

      {/* Minutes */}
      <div className="flex flex-col">
        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 min-w-[32px]">
          <span className="text-xs font-bold text-purple-400">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
        </div>
        <span className="text-[7px] text-white/40 uppercase mt-0.5">M</span>
      </div>

      <span className="text-pink-500/50 text-[10px] pb-3">:</span>

      {/* Seconds */}
      <div className="flex flex-col">
        <div className="bg-pink-500/10 px-2 py-1 rounded-md border border-pink-500/20 min-w-[32px]">
          <span className="text-xs font-bold text-pink-400 animate-pulse">
            {String(timeLeft.seconds).padStart(1, "0").padStart(2, "0")}
          </span>
        </div>
        <span className="text-[7px] text-white/40 uppercase mt-0.5">S</span>
      </div>
    </div>
  );
}
