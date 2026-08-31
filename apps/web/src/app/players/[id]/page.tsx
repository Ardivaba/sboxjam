"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchById, fetchCollection, mediaUrl, videoEmbedUrl } from "@/lib/payload";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadgeList } from "@/components/ui/role-badge";
import type { Participant, Team } from "@/lib/types";

export default function PlayerProfilePage() {
  const params = useParams();
  const [player, setPlayer] = useState<Participant | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const playerId = params.id as string;

  useEffect(() => {
    if (!playerId) return;
    fetchById<Participant>("participants", playerId, 2)
      .then((data) => {
        setPlayer(data);
        return fetchCollection<Team>("teams", {
          where: { members: { in: [data.id] } },
          depth: 0,
          limit: 1,
        });
      })
      .then((teams) => setTeam(teams?.docs?.[0] ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [playerId]);

  const copyDiscord = async () => {
    if (!player?.discordHandle) return;
    await navigator.clipboard.writeText(player.discordHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Player not found.</p>
          <Link href="/players" className="text-sm text-primary hover:text-primary-light transition-colors">
            &larr; Back to Players
          </Link>
        </div>
      </div>
    );
  }

  const portfolio = player.portfolio || [];

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <Link href="/players" className="text-sm text-text-muted hover:text-text-bright transition-colors">
            &larr; Players
          </Link>

          <div className="mt-6 flex items-start gap-5">
            <Avatar participant={player} className="w-16 h-16" textClassName="text-xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{player.username}</h1>
                {player.lookingForTeam && (
                  <span className="text-[11px] font-medium uppercase tracking-wider text-success border border-success/30 bg-success/10 rounded-full px-2 py-0.5">
                    Looking for team
                  </span>
                )}
              </div>
              <div className="mt-2">
                <RoleBadgeList roles={player.roles} />
              </div>
            </div>
          </div>

          {player.bio && <p className="mt-5 text-text-muted leading-relaxed whitespace-pre-wrap">{player.bio}</p>}

          {(player.skills?.length || 0) > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {player.skills!.map((s, i) => (
                <span key={s.id || i} className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[11px] text-text-muted">
                  {s.skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {player.discordHandle && (
              <button onClick={copyDiscord} className="btn-secondary text-sm cursor-pointer">
                <span className="material-symbols-rounded text-[16px]">content_copy</span>
                {copied ? "Copied!" : `@${player.discordHandle}`}
              </button>
            )}
            {player.sboxProfileUrl && (
              <a href={player.sboxProfileUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                sbox.game profile
              </a>
            )}
            {team && (
              <Link href={`/teams/${team.id}`} className="btn-secondary text-sm">
                Team: {team.name}
              </Link>
            )}
          </div>
        </div>

        {/* Portfolio */}
        <div className="animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-5">Portfolio</p>
          {portfolio.length === 0 ? (
            <p className="text-text-muted text-sm">Nothing here yet.</p>
          ) : (
            <div className="space-y-8">
              {portfolio.map((item, i) => {
                const img = mediaUrl(item.image);
                const embed = item.videoUrl ? videoEmbedUrl(item.videoUrl) : null;
                return (
                  <div key={item.id || i} className="border border-white/[0.06] rounded-lg overflow-hidden">
                    {embed ? (
                      <div className="aspect-video">
                        <iframe
                          src={embed}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={item.title}
                        />
                      </div>
                    ) : img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={item.title} className="w-full max-h-[400px] object-cover" />
                    ) : null}
                    <div className="p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-text-bright font-semibold">{item.title}</h3>
                        <div className="flex gap-3 shrink-0">
                          {item.videoUrl && !embed && (
                            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-primary-light transition-colors">
                              Video &rarr;
                            </a>
                          )}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-primary-light transition-colors">
                              View project &rarr;
                            </a>
                          )}
                        </div>
                      </div>
                      {item.description && (
                        <p className="mt-1.5 text-sm text-text-muted whitespace-pre-wrap">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
