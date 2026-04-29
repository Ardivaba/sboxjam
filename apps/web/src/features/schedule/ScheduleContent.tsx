"use client";

import { motion } from "framer-motion";
import type { ScheduleEvent } from "@/lib/types";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TextGenerateEffect } from "@/components/ui/text-generate";

const ACCENT_COLORS = {
  primary: {
    text: "text-primary",
    dot: "bg-primary",
    spotlightColor: "rgba(50, 115, 235, 0.12)",
    glow: "shadow-[0_0_12px_rgba(50,115,235,0.3)]",
    line: "from-primary/40",
  },
  warning: {
    text: "text-warning",
    dot: "bg-warning",
    spotlightColor: "rgba(223, 179, 35, 0.1)",
    glow: "shadow-[0_0_12px_rgba(223,179,35,0.3)]",
    line: "from-warning/40",
  },
  error: {
    text: "text-error",
    dot: "bg-error",
    spotlightColor: "rgba(183, 45, 79, 0.1)",
    glow: "shadow-[0_0_12px_rgba(183,45,79,0.3)]",
    line: "from-error/40",
  },
};

function TimelineEvent({ event, index, total }: { event: ScheduleEvent; index: number; total: number }) {
  const accent = ACCENT_COLORS[event.accent] || ACCENT_COLORS.primary;
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="relative flex gap-6 md:gap-8"
    >
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.2, type: "spring", stiffness: 300 }}
          className={`relative z-10 w-4 h-4 rounded-full ${accent.dot} ${accent.glow}`}
        />
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
            className="w-px flex-1 origin-top bg-gradient-to-b from-white/[0.08] to-transparent"
          />
        )}
      </div>

      <div className="pb-12 flex-1 -mt-1">
        <SpotlightCard spotlightColor={accent.spotlightColor}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center`}>
                <span className={`material-symbols-rounded text-lg ${accent.text}`}>
                  {event.icon || "event"}
                </span>
              </div>
              <div>
                <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${accent.text}`}>
                  {formattedDate}
                </span>
                {event.dateLabel && (
                  <p className="text-[10px] text-text-muted/60">{event.dateLabel}</p>
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text-bright mb-1">{event.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{event.description}</p>
          </div>
        </SpotlightCard>
      </div>
    </motion.div>
  );
}

export function ScheduleContent({ events }: { events: ScheduleEvent[] }) {
  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <section className="mx-auto max-w-5xl py-6 text-center md:py-10">
        <TextGenerateEffect
          words="Event Schedule"
          className="text-3xl font-bold text-white md:text-5xl mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto max-w-xl text-text-muted md:text-lg"
        >
          Key dates and milestones for the s&box Game Jam.
        </motion.p>
      </section>

      <section className="mx-auto max-w-2xl pb-16">
        {events.length > 0 ? (
          <div className="mt-4">
            {events.map((event, i) => (
              <TimelineEvent key={event.id} event={event} index={i} total={events.length} />
            ))}
          </div>
        ) : (
          <SpotlightCard className="p-16">
            <div className="flex flex-col items-center text-center">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="material-symbols-rounded text-5xl text-text-muted/30 mb-4"
              >
                calendar_month
              </motion.span>
              <p className="text-text-muted text-lg">Schedule will be announced soon.</p>
              <p className="text-text-muted/50 text-sm mt-1">Stay tuned!</p>
            </div>
          </SpotlightCard>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <SpotlightCard>
            <div className="p-5 flex items-center justify-center gap-2 text-text-muted">
              <span className="material-symbols-rounded text-lg text-primary">public</span>
              <p className="text-sm">
                All times are in <span className="font-semibold text-text-bright">UTC</span>. Convert to your local timezone.
              </p>
            </div>
          </SpotlightCard>
        </motion.div>
      </section>
    </div>
  );
}
