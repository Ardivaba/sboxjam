"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useTeamStore } from "@/features/teams/useTeamStore";
import { RoleBadge } from "@/components/ui/role-badge";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/types";

export default function TeamsPage() {
  const { user, token } = useAuthStore();
  const { teams, myTeam, loading, fetchTeams, fetchMyTeam, createTeam, joinByCode } = useTeamStore();

  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rolesNeeded, setRolesNeeded] = useState<Role[]>([]);
  const [discordUrl, setDiscordUrl] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (user) fetchMyTeam(user.id);
  }, [user, fetchMyTeam]);

  const filtered = useMemo(() => {
    return teams.filter((team) => {
      if (roleFilter !== "all" && !team.rolesNeeded?.includes(roleFilter)) return false;
      if (search && !`${team.name} ${team.description || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [teams, roleFilter, search]);

  const toggleRole = (role: Role) => {
    setRolesNeeded((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    setError("");
    setSubmitting(true);
    try {
      await createTeam({ name, description, rolesNeeded, discordUrl: discordUrl || undefined }, token);
      setName("");
      setDescription("");
      setRolesNeeded([]);
      setDiscordUrl("");
      fetchTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    }
    setSubmitting(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    setError("");
    setSubmitting(true);
    try {
      await joinByCode(inviteCode, user.id, token);
      setInviteCode("");
      fetchTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join team");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Teams</h1>
          <p className="text-text-muted">Find a team that needs what you bring, or start your own.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[340px_1fr]">
          {/* Left panel */}
          <div className="animate-fade-in">
            {!user ? (
              <div className="border border-white/[0.06] rounded-lg p-5">
                <p className="text-text-muted text-sm mb-3">Sign in with Discord to create or join a team.</p>
                <Link href="/login" className="btn-primary text-sm">Sign In</Link>
              </div>
            ) : myTeam ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-3">Your Team</p>
                <div className="border border-white/[0.06] rounded-lg p-5">
                  <p className="text-white font-semibold text-lg">{myTeam.name}</p>
                  <p className="text-text-muted text-sm mt-1">
                    {Array.isArray(myTeam.members) ? myTeam.members.length : 0}/{myTeam.maxMembers} members
                  </p>
                  <Link href={`/teams/${myTeam.id}`} className="btn-secondary text-sm mt-4 inline-flex">
                    Manage Team
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex gap-1 mb-5 border-b border-white/[0.06]">
                  {(["create", "join"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(""); }}
                      className={`pb-2.5 px-3 text-sm font-medium border-b-2 transition-colors -mb-px capitalize ${
                        mode === m
                          ? "border-primary text-white"
                          : "border-transparent text-text-muted hover:text-text-bright"
                      }`}
                    >
                      {m === "join" ? "Join with code" : "Create"}
                    </button>
                  ))}
                </div>

                {error && <p className="mb-4 text-sm text-error">{error}</p>}

                {mode === "create" ? (
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Team Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Enter team name" required />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Pitch</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field resize-none h-20"
                        placeholder="What are you planning to build? What's the vibe?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Recruiting for</label>
                      <div className="flex flex-wrap gap-1.5">
                        {ROLES.map((role) => (
                          <button
                            type="button"
                            key={role}
                            onClick={() => toggleRole(role)}
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                              rolesNeeded.includes(role)
                                ? "border-primary/60 bg-primary/20 text-primary-light"
                                : "border-white/10 bg-white/[0.03] text-text-muted hover:border-white/25"
                            }`}
                          >
                            {ROLE_LABELS[role]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Discord link (optional)</label>
                      <input type="url" value={discordUrl} onChange={(e) => setDiscordUrl(e.target.value)} className="input-field" placeholder="https://discord.gg/..." />
                    </div>
                    <button type="submit" disabled={submitting || !name.trim()} className="btn-primary w-full">
                      {submitting ? "Creating..." : "Create Team"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Invite Code</label>
                      <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="input-field" placeholder="Enter code" required />
                    </div>
                    <button type="submit" disabled={submitting || !inviteCode.trim()} className="btn-primary w-full">
                      {submitting ? "Joining..." : "Join Team"}
                    </button>
                    <p className="text-xs text-text-muted/60">
                      Got a code from a team leader? Enter it to join instantly. Otherwise browse the list and apply.
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right — team list */}
          <div className="animate-fade-in">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field !w-auto flex-1 min-w-[160px]"
                placeholder="Search teams..."
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
                className="input-field !w-auto"
              >
                <option value="all">Any role needed</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>Needs: {ROLE_LABELS[role]}</option>
                ))}
              </select>
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">Recruiting</p>
              <span className="text-xs text-text-muted/50">{filtered.length} teams</span>
            </div>

            {loading ? (
              <p className="text-text-muted text-sm py-8">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-text-muted text-sm py-8">
                {teams.length === 0 ? "No teams recruiting yet. Start the first one!" : "No teams match your filters."}
              </p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filtered.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="flex items-center gap-4 py-4 hover:bg-white/[0.02] -mx-3 px-3 rounded transition-colors group"
                  >
                    <div className="w-9 h-9 rounded bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-white/[0.06] transition-colors">
                      <span className="text-xs font-bold text-text-muted">{team.name[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-bright text-sm font-medium truncate group-hover:text-white transition-colors">{team.name}</p>
                      {team.description && (
                        <p className="text-text-muted/60 text-xs truncate">{team.description}</p>
                      )}
                      <div className="mt-1.5 hidden sm:flex flex-wrap gap-1.5">
                        {team.rolesNeeded?.map((role) => <RoleBadge key={role} role={role} />)}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted/50 shrink-0 tabular-nums">
                      {Array.isArray(team.members) ? team.members.length : 0}/{team.maxMembers}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
