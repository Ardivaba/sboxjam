import Link from "next/link";

export default function PrizesPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-24">
      <section className="relative mx-auto max-w-5xl py-12 text-center md:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(50,115,235,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <h1 className="mb-4 text-3xl font-bold text-text-white md:text-5xl">
            Prizes & <span className="text-gradient">Rewards</span>
          </h1>
          <p className="mx-auto max-w-xl text-text-muted md:text-lg">
            Over $10,000 in cash prizes plus exclusive perks for top performers
            across multiple categories.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl pb-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-light">
            Top 3
          </p>
          <h2 className="mt-2 text-2xl font-bold text-text-white md:text-3xl">
            Main Prizes
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-strong animate-pulse-glow order-2 flex flex-col items-center rounded-2xl p-8 text-center md:order-1 md:-mt-4 md:p-10">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <span className="material-symbols-rounded text-4xl text-text-bright">
                military_tech
              </span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              2nd Place
            </p>
            <p className="text-3xl font-bold text-text-white">$2,500</p>
            <div className="mt-4 rounded-lg bg-bg-card px-4 py-2 text-sm text-text-muted">
              s&box Store Feature (1 week)
            </div>
          </div>

          <div className="glass-strong order-1 flex flex-col items-center rounded-2xl border-border-blue p-8 text-center md:order-2 md:p-10">
            <div
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(223,179,35,0.2), rgba(223,179,35,0.05))",
              }}
            >
              <span className="material-symbols-rounded text-5xl text-warning">
                emoji_events
              </span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-warning">
              Grand Prize
            </p>
            <p className="text-4xl font-bold text-text-white md:text-5xl">
              $5,000
            </p>
            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-bg-card px-4 py-2 text-sm text-text-muted">
                Featured on s&box Store
              </div>
              <div className="rounded-lg bg-bg-card px-4 py-2 text-sm text-text-muted">
                Official s&box Blog Feature
              </div>
              <div className="rounded-lg bg-bg-card px-4 py-2 text-sm text-text-muted">
                Direct Facepunch Feedback
              </div>
            </div>
          </div>

          <div className="glass-strong order-3 flex flex-col items-center rounded-2xl p-8 text-center md:-mt-4 md:p-10">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <span className="material-symbols-rounded text-4xl text-primary-light">
                workspace_premium
              </span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              3rd Place
            </p>
            <p className="text-3xl font-bold text-text-white">$1,500</p>
            <div className="mt-4 rounded-lg bg-bg-card px-4 py-2 text-sm text-text-muted">
              s&box Store Highlight
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl pb-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-light">
            Special Recognition
          </p>
          <h2 className="mt-2 text-2xl font-bold text-text-white md:text-3xl">
            Category Awards
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            $250 each — awarded regardless of overall placement
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "palette",
              title: "Best Visual",
              description:
                "Outstanding art direction, visual effects, and overall aesthetic.",
            },
            {
              icon: "lightbulb",
              title: "Most Innovative",
              description:
                "Unique mechanics, creative use of s&box features, or novel ideas.",
            },
            {
              icon: "lan",
              title: "Best Multiplayer",
              description:
                "Best use of networking and multiplayer gameplay experience.",
            },
            {
              icon: "favorite",
              title: "Community Choice",
              description:
                "Voted by the community after the jam submission period ends.",
            },
          ].map((award) => (
            <div key={award.title} className="glass rounded-xl p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <span className="material-symbols-rounded text-2xl text-primary">
                  {award.icon}
                </span>
              </div>
              <h3 className="mb-1 text-base font-semibold text-text-white">
                {award.title}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-text-muted">
                {award.description}
              </p>
              <p className="text-lg font-bold text-primary">$250</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl pb-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-light">
            Made possible by
          </p>
          <h2 className="mt-2 text-2xl font-bold text-text-white md:text-3xl">
            Sponsors
          </h2>
        </div>

        <div className="glass rounded-xl p-8 text-center md:p-12">
          <span className="material-symbols-rounded mb-4 text-4xl text-text-muted">
            handshake
          </span>
          <p className="text-text-muted">
            Sponsors will be announced soon. Interested in sponsoring?
          </p>
          <Link href="mailto:kaspar@wenture.io" className="btn-secondary mt-6 text-sm">
            <span className="material-symbols-rounded">mail</span>
            Get in Touch
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl pb-8 text-center">
        <div className="glass-strong rounded-2xl p-10">
          <h2 className="mb-3 text-xl font-bold text-text-white md:text-2xl">
            Want to compete for these prizes?
          </h2>
          <p className="mb-6 text-text-muted">
            Registration is open now. Secure your spot before spaces run out.
          </p>
          <Link href="/register" className="btn-primary text-base">
            <span className="material-symbols-rounded">rocket_launch</span>
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
