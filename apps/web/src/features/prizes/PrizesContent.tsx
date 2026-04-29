"use client";

import { motion } from "framer-motion";
import type { Prize } from "@/lib/types";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TextGenerateEffect } from "@/components/ui/text-generate";
import { Sparkles } from "@/components/ui/sparkles";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function GrandPrizeCard({ prize }: { prize: Prize }) {
  return (
    <SpotlightCard
      className="border-warning/[0.12]"
      spotlightColor="rgba(223, 179, 35, 0.1)"
    >
      <div className="relative text-center p-10 md:p-16">
        <Sparkles count={20} color="#dfb323" className="w-full">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="material-symbols-rounded text-7xl text-warning drop-shadow-[0_0_24px_rgba(223,179,35,0.3)]">
                {prize.icon || "emoji_events"}
              </span>
            </motion.div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-warning/70">
              {prize.title}
            </p>
            <p className="mt-3 text-5xl md:text-7xl font-bold text-white tracking-tight">
              {prize.amount}
            </p>
            {prize.description && (
              <p className="text-text-muted mt-4 max-w-md leading-relaxed">{prize.description}</p>
            )}
            {prize.perks && prize.perks.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {prize.perks.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-md bg-warning/[0.08] text-warning/90 text-xs font-medium border border-warning/[0.08]"
                  >
                    {p.perk}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Sparkles>
      </div>
    </SpotlightCard>
  );
}

function RunnerUpCard({ prize }: { prize: Prize }) {
  return (
    <motion.div variants={fadeUp}>
      <SpotlightCard className="h-full group" spotlightColor="rgba(220, 228, 240, 0.1)">
        <div className="relative p-7 md:p-9 h-full">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.06] flex items-center justify-center group-hover:border-white/[0.12] transition-colors">
              <span className="material-symbols-rounded text-3xl text-text-bright">
                {prize.icon || "military_tech"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-1">
                {prize.title}
              </p>
              <p className="text-3xl font-bold text-white tracking-tight">
                {prize.amount}
              </p>
              {prize.description && (
                <p className="text-sm text-text-muted mt-2 leading-relaxed">{prize.description}</p>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function CategoryCard({ prize }: { prize: Prize }) {
  return (
    <motion.div variants={fadeUp}>
      <SpotlightCard className="h-full group" spotlightColor="rgba(50, 115, 235, 0.1)">
        <div className="relative p-6 flex flex-col items-center text-center h-full">
          <div className="w-11 h-11 rounded-xl bg-primary/[0.08] border border-primary/[0.1] flex items-center justify-center mb-4 group-hover:bg-primary/[0.12] transition-colors">
            <span className="material-symbols-rounded text-xl text-primary-light">
              {prize.icon || "star"}
            </span>
          </div>
          <p className="text-sm font-semibold text-text-bright">{prize.title}</p>
          <p className="text-xl font-bold text-white mt-1">{prize.amount}</p>
          {prize.sponsor && (
            <p className="mt-auto pt-3 text-[11px] text-text-muted/50">
              by {prize.sponsor}
            </p>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function HonorableCard({ prize }: { prize: Prize }) {
  return (
    <motion.div variants={fadeUp}>
      <SpotlightCard className="h-full" spotlightColor="rgba(255, 255, 255, 0.06)">
        <div className="relative p-5 flex items-center gap-4">
          <span className="material-symbols-rounded text-xl text-text-muted/50">workspace_premium</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-bright">{prize.title}</p>
          </div>
          <p className="text-lg font-bold text-white shrink-0">{prize.amount}</p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 flex items-center gap-3"
    >
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
        <span className="material-symbols-rounded text-lg text-text-muted">{icon}</span>
      </div>
      <h2 className="text-lg font-semibold text-text-bright">{label}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
    </motion.div>
  );
}

export function PrizesContent({ prizes }: { prizes: Prize[] }) {
  const grandPrizes = prizes.filter((p) => p.category === "grand");
  const runnerUps = prizes.filter((p) => p.category === "runner-up");
  const categoryAwards = prizes.filter((p) => p.category === "category");
  const honorable = prizes.filter((p) => p.category === "honorable");

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <section className="mx-auto max-w-5xl py-6 text-center md:py-10">
        <TextGenerateEffect
          words="Prizes & Rewards"
          className="text-3xl font-bold text-white md:text-5xl mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto max-w-xl text-text-muted md:text-lg"
        >
          Compete for amazing prizes across multiple categories.
        </motion.p>
      </section>

      {grandPrizes.length > 0 && (
        <motion.section
          className="mx-auto max-w-3xl pb-20"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {grandPrizes.map((prize) => (
            <motion.div key={prize.id} variants={scaleIn} className="mb-6">
              <GrandPrizeCard prize={prize} />
            </motion.div>
          ))}
        </motion.section>
      )}

      {runnerUps.length > 0 && (
        <section className="mx-auto max-w-4xl pb-20">
          <SectionHeader icon="military_tech" label="Runner-ups" />
          <motion.div
            className="grid gap-5 md:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {runnerUps.map((prize) => (
              <RunnerUpCard key={prize.id} prize={prize} />
            ))}
          </motion.div>
        </section>
      )}

      {categoryAwards.length > 0 && (
        <section className="mx-auto max-w-5xl pb-20">
          <SectionHeader icon="category" label="Category Awards" />
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categoryAwards.map((prize) => (
              <CategoryCard key={prize.id} prize={prize} />
            ))}
          </motion.div>
        </section>
      )}

      {honorable.length > 0 && (
        <section className="mx-auto max-w-3xl pb-20">
          <SectionHeader icon="workspace_premium" label="Honorable Mentions" />
          <motion.div
            className="grid gap-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {honorable.map((prize) => (
              <HonorableCard key={prize.id} prize={prize} />
            ))}
          </motion.div>
        </section>
      )}

      {prizes.length === 0 && (
        <section className="mx-auto max-w-3xl pb-16 text-center">
          <SpotlightCard className="p-16">
            <div className="flex flex-col items-center">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="material-symbols-rounded text-5xl text-text-muted/30 mb-4"
              >
                emoji_events
              </motion.span>
              <p className="text-text-muted text-lg">Prizes will be announced soon.</p>
              <p className="text-text-muted/50 text-sm mt-1">Stay tuned!</p>
            </div>
          </SpotlightCard>
        </section>
      )}
    </div>
  );
}
