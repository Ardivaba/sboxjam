import Link from "next/link";
import { fetchCollection } from "@/lib/payload";
import { RoleBadgeList } from "@/components/ui/role-badge";
import type { Participant, Team } from "@/lib/types";

export default async function HomePage() {
  let teams: Team[] = [];
  let players: Participant[] = [];

  try {
    const data = await fetchCollection<Team>("teams", {
      where: { lookingForMembers: { equals: true } },
      limit: 4,
      depth: 0,
      sort: "-createdAt",
    });
    teams = data.docs;
  } catch {}

  try {
    const data = await fetchCollection<Participant>("participants", {
      where: { lookingForTeam: { equals: true } },
      limit: 6,
      depth: 0,
    });
    players = data.docs;
  } catch {}

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 pt-28 pb-20 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <p className="mb-5 text-sm font-medium tracking-[0.2em] uppercase text-primary-light/70">
            s&box gamejam
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] text-white md:text-7xl lg:text-8xl tracking-tight">
            Don&apos;t jam <span className="text-gradient">alone</span>
          </h1>
          <p className="mx-auto mb-12 max-w-lg text-text-muted md:text-lg">
            Find teammates for the s&box gamejam before the theme drops.
            Build a team, or show off what you can do and get recruited.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/teams" className="btn-primary text-base px-6 py-2.5">
              Browse Teams
            </Link>
            <Link href="/players" className="btn-secondary text-base px-6 py-2.5">
              Browse Players
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 md:py-28 border-t border-white/[0.04]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-12 md:text-3xl">How it works</h2>
          <div className="space-y-10">
            {[
              {
                title: "Sign in with Discord",
                desc: "One click, no forms. Your profile is created from your Discord account.",
              },
              {
                title: "Show what you can do",
                desc: "Pick your roles — code, art, sound, design — and add portfolio pieces: projects, screenshots, videos.",
              },
              {
                title: "Team up",
                desc: "Create a team and recruit for the roles you're missing, or apply to teams that need what you bring. Then go win the jam.",
              },
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

      {/* Recruiting teams */}
      {teams.length > 0 && (
        <section className="px-4 py-20 md:py-28 border-t border-white/[0.04]">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-2xl font-bold text-white md:text-3xl">Teams recruiting</h2>
              <Link href="/teams" className="text-sm text-primary hover:text-primary-light transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="space-y-2">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="flex items-center gap-5 py-4 px-3 -mx-3 rounded hover:bg-white/[0.02] border-b border-white/[0.04] last:border-0 transition-colors group"
                >
                  <div className="w-9 h-9 rounded bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-white/[0.06] transition-colors">
                    <span className="text-xs font-bold text-text-muted">{team.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-bright font-medium truncate group-hover:text-white transition-colors">{team.name}</p>
                    {team.description && (
                      <p className="text-text-muted/60 text-sm truncate">{team.description}</p>
                    )}
                  </div>
                  <div className="hidden sm:block shrink-0">
                    <RoleBadgeList roles={team.rolesNeeded} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Players looking */}
      {players.length > 0 && (
        <section className="px-4 py-20 md:py-28 border-t border-white/[0.04]">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-2xl font-bold text-white md:text-3xl">Players looking for a team</h2>
              <Link href="/players" className="text-sm text-primary hover:text-primary-light transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {players.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="flex items-center gap-4 py-3.5 px-4 rounded-lg border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                    {player.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={player.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-text-muted">{player.username[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-bright text-sm font-medium truncate">{player.username}</p>
                    <div className="mt-1">
                      <RoleBadgeList roles={player.roles} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 py-20 md:py-28 border-t border-white/[0.04]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to team up?</h2>
          <p className="text-text-muted mb-8 md:text-lg">
            Sign in with Discord and put yourself out there.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="btn-primary text-base px-6 py-2.5">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
