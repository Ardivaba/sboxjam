import { fetchCollection } from "@/lib/payload";
import type { Prize } from "@/lib/types";

export default async function PrizesPage() {
  let prizes: Prize[] = [];

  try {
    const data = await fetchCollection<Prize>("prizes", { sort: "order", limit: 50 });
    prizes = data.docs;
  } catch {}

  const grandPrizes = prizes.filter((p) => p.category === "grand");
  const runnerUps = prizes.filter((p) => p.category === "runner-up");
  const categoryAwards = prizes.filter((p) => p.category === "category");
  const honorable = prizes.filter((p) => p.category === "honorable");

  return (
    <div className="min-h-screen px-4 pt-20 pb-24">
      <section className="mx-auto max-w-5xl py-12 text-center md:py-20">
        <div className="animate-fade-in">
          <h1 className="mb-4 text-3xl font-bold text-text-white md:text-5xl">
            Prizes & <span className="text-gradient">Rewards</span>
          </h1>
          <p className="mx-auto max-w-xl text-text-muted md:text-lg">
            Compete for amazing prizes across multiple categories.
          </p>
        </div>
      </section>


      {grandPrizes.length > 0 && (
        <section className="mx-auto max-w-4xl pb-16">
          {grandPrizes.map((prize) => (
            <div key={prize.id} className="glass-strong rounded-xl p-10 text-center mb-6">
              <span className="material-symbols-rounded mb-4 text-5xl text-warning">
                {prize.icon || "emoji_events"}
              </span>
              <p className="mb-1 text-sm font-medium uppercase tracking-wider text-warning">
                {prize.title}
              </p>
              <p className="text-4xl font-bold text-text-white">{prize.amount}</p>
              {prize.description && (
                <p className="mt-3 text-text-muted">{prize.description}</p>
              )}
              {prize.perks && prize.perks.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {prize.perks.map((p, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                      {p.perk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {runnerUps.length > 0 && (
        <section className="mx-auto max-w-4xl pb-16">
          <h2 className="mb-6 text-xl font-bold text-text-bright text-center">Runner-ups</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {runnerUps.map((prize) => (
              <div key={prize.id} className="card rounded-xl p-6 text-center">
                <span className="material-symbols-rounded mb-3 text-4xl text-text-bright">
                  {prize.icon || "military_tech"}
                </span>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                  {prize.title}
                </p>
                <p className="text-2xl font-bold text-text-white">{prize.amount}</p>
                {prize.description && (
                  <p className="mt-2 text-sm text-text-muted">{prize.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {categoryAwards.length > 0 && (
        <section className="mx-auto max-w-4xl pb-16">
          <h2 className="mb-6 text-xl font-bold text-text-bright text-center">Category Awards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryAwards.map((prize) => (
              <div key={prize.id} className="glass rounded-xl p-5 text-center">
                <span className="material-symbols-rounded mb-2 text-3xl text-primary-light">
                  {prize.icon || "star"}
                </span>
                <p className="text-sm font-semibold text-text-bright">{prize.title}</p>
                <p className="text-lg font-bold text-text-white">{prize.amount}</p>
                {prize.sponsor && (
                  <p className="mt-1 text-xs text-text-muted">by {prize.sponsor}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {honorable.length > 0 && (
        <section className="mx-auto max-w-4xl pb-16">
          <h2 className="mb-6 text-xl font-bold text-text-bright text-center">Honorable Mentions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {honorable.map((prize) => (
              <div key={prize.id} className="card rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-text-bright">{prize.title}</p>
                <p className="text-lg font-bold text-text-white">{prize.amount}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {prizes.length === 0 && (
        <section className="mx-auto max-w-4xl pb-16 text-center">
          <div className="glass rounded-xl p-12">
            <span className="material-symbols-rounded text-4xl text-text-muted">emoji_events</span>
            <p className="mt-4 text-text-muted">Prizes will be announced soon. Stay tuned!</p>
          </div>
        </section>
      )}
    </div>
  );
}
