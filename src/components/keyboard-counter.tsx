"use client";

import { useEffect, useState } from "react";

export function KeyboardCounter() {
  const [days, setDays] = useState(0);
  const buildDate = new Date("2021-12-29T00:00:00");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = now.getTime() - buildDate.getTime();
      const daysCount = Math.floor(diff / (1000 * 60 * 60 * 24));
      setDays(daysCount);
    };

    update();
    const interval = setInterval(update, 1000 * 60 * 60); // Update every hour is enough for days
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-4 p-4 border rounded-lg bg-muted/30">
      <p className="text-sm font-medium">
        days since build: <span className="text-primary">{days}</span> days
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        started on 2021.12.29
      </p>
    </div>
  );
}

