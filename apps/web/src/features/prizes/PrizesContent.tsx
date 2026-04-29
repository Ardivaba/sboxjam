"use client";

import { motion } from "framer-motion";
import type { Prize } from "@/lib/types";
import { Sparkles } from "@/components/ui/sparkles";

export function PrizesContent({ prizes }: { prizes: Prize[] }) {
  const grandPrizes = prizes.filter((p) => p.category === "grand");
  const runnerUps = prizes.filter((p) => p.category === "runner-up");
  const categoryAwards = prizes.filter((p) => p.category === "category");
  const honorable = prizes.filter((p) => p.category === "honorable");

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Prizes</h1>
          <p className="text-text-muted">
            Compete for prizes across multiple categories.
          </p>
        </div>

        {/* Grand prizes — these get the special treatment */}
        {grandPrizes.map((prize) => (
          <motion.div
            key={prize.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center py-12 border-y border-white/[0.04]"
          >
            <Sparkles count={14} color="#dfb323" className="inline-block">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="material-symbols-rounded text-5xl text-warning">
                  {prize.icon || "emoji_events"}
                </span>
              </motion.div>
            </Sparkles>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-warning/60">
              {prize.title}
            </p>
            <p className="mt-2 text-5xl md:text-6xl font-bold text-white tracking-tight">
              {prize.amount}
            </p>
            {prize.description && (
              <p className="mt-3 text-text-muted max-w-md mx-auto">{prize.description}</p>
            )}
            {prize.perks && prize.perks.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {prize.perks.map((p, i) => (
                  <span key={i} className="text-xs text-warning/70">{i > 0 && "·"} {p.perk}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Runner-ups — clean rows */}
        {runnerUps.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-6">Runner-ups</h2>
            <div className="space-y-1">
              {runnerUps.map((prize, i) => (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-4 py-4 border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-2xl font-bold text-white/10 tabular-nums w-8 shrink-0">{String(i + 2).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-bright font-medium">{prize.title}</p>
                    {prize.description && (
                      <p className="text-sm text-text-muted mt-0.5">{prize.description}</p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-white shrink-0">{prize.amount}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Category awards — compact grid, no card wrappers */}
        {categoryAwards.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-6">Category Awards</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-lg overflow-hidden">
              {categoryAwards.map((prize, i) => (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-bg-dark p-5 text-center"
                >
                  <p className="text-xs text-text-muted mb-1">{prize.title}</p>
                  <p className="text-lg font-bold text-white">{prize.amount}</p>
                  {prize.sponsor && (
                    <p className="text-[10px] text-text-muted/40 mt-1">by {prize.sponsor}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Honorable mentions — simple list */}
        {honorable.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-6">Standout Picks</h2>
            <div className="space-y-3">
              {honorable.map((prize, i) => (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm text-text-muted">{prize.title}</p>
                  <p className="text-sm font-semibold text-text-bright">{prize.amount}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {prizes.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-muted">Prizes will be announced soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
