"use client";

import { useEffect } from "react";

export function GlobalSpotlight() {
  useEffect(() => {
    const selectors = ".card, .glass, .glass-strong";

    function handleMouseMove(e: MouseEvent) {
      const target = (e.currentTarget as HTMLElement);
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--spotlight-x", `${x}px`);
      target.style.setProperty("--spotlight-y", `${y}px`);
    }

    function handleMouseEnter(e: MouseEvent) {
      (e.currentTarget as HTMLElement).classList.add("spotlight-active");
    }

    function handleMouseLeave(e: MouseEvent) {
      (e.currentTarget as HTMLElement).classList.remove("spotlight-active");
    }

    function attach() {
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        if (el.dataset.spotlightBound) return;
        el.dataset.spotlightBound = "1";
        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    }

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return null;
}
