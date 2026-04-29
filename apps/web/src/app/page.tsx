import Link from "next/link";
import { fetchGlobal, fetchCollection } from "@/lib/payload";
import { Countdown } from "@/features/countdown/Countdown";
import type { JamSettings, Prize } from "@/lib/types";

export default async function HomePage() {
  let settings: JamSettings | null = null;
  let prizes: Prize[] = [];

  try {
    settings = await fetchGlobal<JamSettings>("jam-settings");
  } catch {}

  try {
    const data = await fetchCollection<Prize>("prizes", { sort: "order", limit: 3 });
    prizes = data.docs;
  } catch {}

  const jamName = settings?.jamName || "s&box Jam 2026";
  const tagline = settings?.tagline || "Build something incredible in one week";
  const prizePool = settings?.prizePool || "$1,500";
  const maxTeamSize = settings?.maxTeamSize || 4;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 pt-28 pb-20 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <p className="mb-5 text-sm font-medium tracking-[0.2em] uppercase text-primary-light/70">
            Summer 2026
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] text-white md:text-7xl lg:text-8xl tracking-tight">
            {jamName.replace("2026", "").trim()}{" "}
            <span className="text-gradient">2026</span>
          </h1>
          <p className="mx-auto mb-12 max-w-lg text-text-muted md:text-lg">
            {tagline}
          </p>

          <Countdown targetDate={settings?.jamStartDate || "2026-06-13T18:00:00.000Z"} />

          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/register" className="btn-primary text-base px-6 py-2.5">
              Register Now
            </Link>
            <Link href="/rules" className="btn-secondary text-base px-6 py-2.5">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — no cards, just typography */}
      <section className="px-4 py-12 border-y border-white/[0.04]">
        <div className="mx-auto max-w-4xl flex flex-wrap justify-center gap-x-16 gap-y-6 text-center">
          <div>
            <p className="text-3xl font-bold text-white md:text-4xl">7<span className="text-lg font-normal text-text-muted ml-1">days</span></p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Build Time</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white md:text-4xl">{maxTeamSize}<span className="text-lg font-normal text-text-muted ml-1">max</span></p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Team Size</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white md:text-4xl">{prizePool}</p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Prize Pool</p>
          </div>
        </div>
      </section>

      {/* How it works — numbered steps, no cards */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-12 md:text-3xl">How it works</h2>
          <div className="space-y-10">
            {[
              { title: "Register", desc: "Sign up with your s&box account and secure your spot." },
              { title: "Form a Team", desc: `Find teammates or go solo. Teams of up to ${maxTeamSize} can compete together.` },
              { title: "Build & Submit", desc: `Once the theme is revealed, you have one week to create and submit your game.` },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-baseline">
                <span className="text-4xl font-bold text-white/10 shrink-0 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes preview — simple, not cards */}
      {prizes.length > 0 && (
        <section className="px-4 py-20 md:py-28 border-t border-white/[0.04]">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-2xl font-bold text-white md:text-3xl">Prizes</h2>
              <Link href="/prizes" className="text-sm text-primary hover:text-primary-light transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="space-y-6">
              {prizes.map((prize, i) => (
                <div key={prize.id} className="flex items-center gap-6 py-4 border-b border-white/[0.04] last:border-0">
                  <span className="text-2xl font-bold text-white/10 tabular-nums w-8">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <p className="text-text-bright font-medium">{prize.title}</p>
                  </div>
                  <p className="text-xl font-bold text-white">{prize.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — no card wrapper */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to jam?</h2>
          <p className="text-text-muted mb-8 md:text-lg">
            Register now to secure your spot.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/register" className="btn-primary text-base px-6 py-2.5">
              Register Now
            </Link>
            <Link href="/schedule" className="btn-secondary text-base px-6 py-2.5">
              View Schedule
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
