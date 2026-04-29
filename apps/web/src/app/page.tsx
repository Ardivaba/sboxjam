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
  const tagline = settings?.tagline || "Build something incredible in 72 hours";
  const prizePool = settings?.prizePool || "$10,000+";
  const maxTeamSize = settings?.maxTeamSize || 4;

  return (
    <div className="min-h-screen">
      <section className="overflow-hidden px-4 pt-24 pb-32 md:pt-36 md:pb-44">
        <div className="mx-auto max-w-5xl text-center">
          <div className="animate-fade-in">
            <p className="mb-4 text-sm font-medium tracking-widest uppercase text-primary-light">
              Summer 2026
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-text-white md:text-6xl lg:text-7xl">
              {jamName.replace("2026", "")}
              <span className="text-gradient">2026</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-text-muted md:text-xl">
              {tagline}
            </p>
          </div>

          <div className="mb-12">
            <Countdown targetDate={settings?.jamStartDate || "2026-06-13T18:00:00.000Z"} />
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register" className="btn-primary text-base">
              <span className="material-symbols-rounded">rocket_launch</span>
              Register Now
            </Link>
            <Link href="/rules" className="btn-secondary text-base">
              <span className="material-symbols-rounded">info</span>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {[
            { icon: "timer", value: "72", label: "Hours", suffix: "hrs" },
            { icon: "group", value: String(maxTeamSize), label: "Max Team Size", suffix: "max" },
            { icon: "emoji_events", value: prizePool, label: "Prize Pool", suffix: "" },
            { icon: "people", value: "500", label: "Participants", suffix: "+" },
          ].map((stat) => (
            <div key={stat.label} className="card flex flex-col items-center p-6 text-center">
              <span className="material-symbols-rounded mb-3 text-3xl text-primary">{stat.icon}</span>
              <p className="text-2xl font-bold text-text-white md:text-3xl">
                {stat.value}
                <span className="text-sm font-normal text-text-muted">{stat.suffix}</span>
              </p>
              <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-text-white md:text-4xl">How it Works</h2>
            <p className="text-text-muted">Three simple steps to join the jam</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", icon: "app_registration", title: "Register", description: "Sign up with your s&box account and secure your spot in the jam." },
              { step: "02", icon: "groups", title: "Form a Team", description: "Find teammates or go solo. Teams of up to 4 can compete together." },
              { step: "03", icon: "code", title: "Build & Submit", description: "Once the theme is revealed, you have 72 hours to create and submit your game." },
            ].map((item) => (
              <div key={item.step} className="glass rounded-xl p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
                    {item.step}
                  </span>
                  <span className="material-symbols-rounded text-2xl text-primary-light">{item.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {prizes.length > 0 && (
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold text-text-white md:text-4xl">Prizes</h2>
              <p className="text-text-muted">Over {prizePool} in prizes across multiple categories</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {prizes.map((prize) => (
                <div key={prize.id} className="card rounded-xl p-6 text-center">
                  <span className="material-symbols-rounded mb-3 text-4xl text-warning">
                    {prize.icon || "emoji_events"}
                  </span>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">{prize.title}</p>
                  <p className="text-2xl font-bold text-text-white">{prize.amount}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/prizes" className="btn-glass text-sm">
                <span className="material-symbols-rounded">arrow_forward</span>
                View All Prizes
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-strong rounded-2xl p-10 md:p-16">
            <h2 className="mb-4 text-2xl font-bold text-text-white md:text-4xl">Ready to Jam?</h2>
            <p className="mb-8 text-text-muted md:text-lg">
              Register now to secure your spot. Spaces are limited and filling up fast.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className="btn-primary text-base">
                <span className="material-symbols-rounded">rocket_launch</span>
                Register Now
              </Link>
              <Link href="/schedule" className="btn-secondary text-base">
                <span className="material-symbols-rounded">calendar_month</span>
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
