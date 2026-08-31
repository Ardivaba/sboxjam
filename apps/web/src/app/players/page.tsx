"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchCollection } from "@/lib/payload";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadgeList } from "@/components/ui/role-badge";
import { ROLES, ROLE_LABELS, type Participant, type Role } from "@/lib/types";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [lookingOnly, setLookingOnly] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchCollection<Participant>("participants", { limit: 200, depth: 0 })
      .then((data) => setPlayers(data.docs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (lookingOnly && !p.lookingForTeam) return false;
      if (roleFilter !== "all" && !p.roles?.includes(roleFilter)) return false;
      if (search) {
        const haystack = `${p.username} ${p.bio || ""} ${(p.skills || []).map((s) => s.skill).join(" ")}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [players, roleFilter, lookingOnly, search]);

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Players</h1>
          <p className="text-text-muted">
            Developers, artists, and sound folks looking to team up for the jam.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !w-auto flex-1 min-w-[180px]"
            placeholder="Search by name or skill..."
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            className="input-field !w-auto"
          >
            <option value="all">Any role</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>{ROLE_LABELS[role]}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer select-none px-2">
            <input
              type="checkbox"
              checked={lookingOnly}
              onChange={(e) => setLookingOnly(e.target.checked)}
              className="accent-[#3273eb] w-4 h-4"
            />
            Looking for team only
          </label>
        </div>

        {loading ? (
          <p className="text-text-muted text-sm py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-text-muted text-sm py-8">No players match your filters.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 animate-fade-in">
            {filtered.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="flex gap-4 p-4 rounded-lg border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.02] transition-colors"
              >
                <Avatar participant={player} className="w-11 h-11" textClassName="text-sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-text-bright font-medium truncate">{player.username}</p>
                    {player.lookingForTeam && (
                      <span className="text-[10px] font-medium uppercase tracking-wider text-success shrink-0">LFG</span>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <RoleBadgeList roles={player.roles} />
                  </div>
                  {player.bio && (
                    <p className="mt-2 text-xs text-text-muted/70 line-clamp-2">{player.bio}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
