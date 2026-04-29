"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function HoverBorderGradient({
  children,
  className,
  containerClassName,
  duration = 3,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  duration?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn("relative rounded-xl p-[1px] group", containerClassName)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0.4,
          background: `conic-gradient(from ${rotation}deg at 50% 50%, #3273eb 0%, #0088ff 25%, #78a3f3 50%, #0088ff 75%, #3273eb 100%)`,
        }}
      />
      <div
        className={cn(
          "relative rounded-xl bg-[rgba(12,18,30,0.95)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
