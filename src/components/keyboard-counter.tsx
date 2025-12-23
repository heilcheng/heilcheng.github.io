"use client";

import { useEffect, useState } from "react";

export function KeyboardCounter() {
  const [days, setDays] = useState<string>("0.00000000");
  const buildDate = new Date("2021-12-29T00:00:00");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = now.getTime() - buildDate.getTime();
      const daysCount = diff / (1000 * 60 * 60 * 24);
      setDays(daysCount.toFixed(8));
    };

    update();
    const interval = setInterval(update, 50); // Update frequently for the "moving" effect
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 font-mono text-sm text-neutral-600 dark:text-neutral-400">
      <span>been here for {days} days</span>
    </div>
  );
}

