"use client";

import { useEffect, useState } from "react";

interface Props {
  durationMinutes: number;
  onExpire: () => void;
}

export default function Timer({
  durationMinutes,
  onExpire,
}: Props) {
  const [seconds, setSeconds] = useState(
    durationMinutes * 60
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="font-bold text-red-500">
      ⏱ {mins}:{secs.toString().padStart(2, "0")}
    </div>
  );
}