"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useTeamStore } from "@/features/teams/useTeamStore";

export default function TeamsPage() {
  const { user } = useAuthStore();
  const { teams, myTeam, loading, fetchTeams, fetchMyTeam, createTeam } = useTeamStore();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (user) {
      fetchMyTeam(user.id);
    }
  }, [user, fetchMyTeam]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);
    try {
      const { token } = useAuthStore.getState();
      await createTeam(name, description, token || "");
      setName("");
      setDescription("");
      fetchTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Teams</h1>
          <p className="text-text-muted">Create or join a team to participate.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[340px_1fr]">
          {/* Left panel */}
          <div className="animate-fade-in">
            {!user ? (
              <div className="border border-white/[0.06] rounded-lg p-5">
                <p className="text-text-muted text-sm mb-3">Log in to create or join a team.</p>
                <Link href="/login" className="btn-primary text-sm">Log In</Link>
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
                    View Team
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex gap-1 mb-5 border-b border-white/[0.06]">
                  <button
                    onClick={() => { setMode("create"); setError(""); }}
                    className={`pb-2.5 px-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      mode === "create"
                        ? "border-primary text-white"
                        : "border-transparent text-text-muted hover:text-text-bright"
                    }`}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => { setMode("join"); setError(""); }}
                    className={`pb-2.5 px-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      mode === "join"
                        ? "border-primary text-white"
                        : "border-transparent text-text-muted hover:text-text-bright"
                    }`}
                  >
                    Join
                  </button>
                </div>

                {error && (
                  <p className="mb-4 text-sm text-error">{error}</p>
                )}

                {mode === "create" ? (
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Team Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Enter team name" required />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none h-20" placeholder="Optional" />
                    </div>
                    <button type="submit" disabled={submitting || !name.trim()} className="btn-primary w-full">
                      {submitting ? "Creating..." : "Create Team"}
                    </button>
                  </form>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Invite Code</label>
                      <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="input-field" placeholder="Enter code" required />
                    </div>
                    <button type="submit" disabled={submitting || !inviteCode.trim()} className="btn-primary w-full">
                      {submitting ? "Joining..." : "Join Team"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right — team list */}
          <div className="animate-fade-in">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">Looking for Members</p>
              <span className="text-xs text-text-muted/50">{teams.length} teams</span>
            </div>

            {loading ? (
              <p className="text-text-muted text-sm py-8">Loading...</p>
            ) : teams.length === 0 ? (
              <p className="text-text-muted text-sm py-8">No teams yet. Be the first!</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="flex items-center gap-4 py-3.5 hover:bg-white/[0.02] -mx-3 px-3 rounded transition-colors group"
                  >
                    <div className="w-8 h-8 rounded bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-white/[0.06] transition-colors">
                      <span className="text-xs font-bold text-text-muted">{team.name[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-bright text-sm font-medium truncate group-hover:text-white transition-colors">{team.name}</p>
                      {team.description && (
                        <p className="text-text-muted/60 text-xs truncate">{team.description}</p>
                      )}
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
