"use client";

import { motion } from "framer-motion";
import type { ScheduleEvent } from "@/lib/types";

const ACCENT = {
  primary: { dot: "bg-primary", text: "text-primary" },
  warning: { dot: "bg-warning", text: "text-warning" },
  error: { dot: "bg-error", text: "text-error" },
};

export function ScheduleContent({ events }: { events: ScheduleEvent[] }) {
  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Schedule</h1>
          <p className="text-text-muted">
            Key dates and milestones for the jam.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="relative ml-3">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.06]" />

            {events.map((event, i) => {
              const accent = ACCENT[event.accent] || ACCENT.primary;
              const date = new Date(event.date);
              const month = date.toLocaleDateString("en-US", { month: "short" });
              const day = date.getDate();

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative pl-10 pb-10 last:pb-0"
                >
                  <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${accent.dot} -translate-x-[3.5px]`} />

                  <div className="flex items-baseline gap-4">
                    <div className="shrink-0 w-16">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>
                        {month} {day}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">{event.title}</h3>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{event.description}</p>
                      {event.dateLabel && (
                        <p className="text-xs text-text-muted/50 mt-1">{event.dateLabel}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-text-muted">Schedule will be announced soon.</p>
          </div>
        )}

        <p className="mt-12 text-xs text-text-muted/50">
          All times are in UTC.
        </p>
      </div>
    </div>
  );
}
