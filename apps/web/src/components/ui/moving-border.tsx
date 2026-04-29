"use client";

import { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/cn";

export function MovingBorder({
  children,
  duration = 4000,
  className,
  containerClassName,
  borderRadius = "1rem",
  colors = ["#3273eb", "#0088ff", "#78a3f3", "#3273eb"],
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  colors?: string[];
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progressRef = useRef(0);
  const circleRef = useRef<SVGCircleElement>(null);

  useAnimationFrame((time) => {
    const path = pathRef.current;
    const circle = circleRef.current;
    if (!path || !circle) return;
    const length = path.getTotalLength();
    progressRef.current = (time / duration) % 1;
    const point = path.getPointAtLength(progressRef.current * length);
    circle.setAttribute("cx", String(point.x));
    circle.setAttribute("cy", String(point.y));
  });

  return (
    <div
      className={cn("relative p-[1px]", containerClassName)}
      style={{ borderRadius }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius }}>
        <svg
          className="absolute h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            ref={pathRef}
            fill="none"
            width="100%"
            height="100%"
            rx={borderRadius}
            ry={borderRadius}
          />
          <circle
            ref={circleRef}
            r="80"
            fill={`conic-gradient(from 0deg, ${colors.join(", ")})`}
            opacity="0.7"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from calc(var(--angle, 0) * 1deg), ${colors.join(", ")})`,
            animation: `spin ${duration}ms linear infinite`,
            filter: "blur(16px)",
            opacity: 0.5,
          }}
        />
      </div>
      <div
        className={cn("relative", className)}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}
