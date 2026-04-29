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
    <div className="min-h-screen pt-[60px]">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-text-bright mb-2">Teams</h1>
          <p className="text-text-muted text-lg mb-10">Create or join a team to participate in the jam.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="animate-fade-in">
            {!user ? (
              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-rounded text-2xl text-warning">lock</span>
                  <h2 className="text-lg font-semibold text-text-bright">Login Required</h2>
                </div>
                <p className="text-text-muted mb-4">You need to be logged in to create or join a team.</p>
                <Link href="/login" className="btn-primary text-sm">
                  <span className="material-symbols-rounded">login</span>
                  Log In
                </Link>
              </div>
            ) : myTeam ? (
              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-rounded text-2xl text-success">check_circle</span>
                  <h2 className="text-lg font-semibold text-text-bright">Your Team</h2>
                </div>
                <p className="text-text-bright font-semibold text-lg mb-1">{myTeam.name}</p>
                <p className="text-text-muted text-sm mb-4">
                  {Array.isArray(myTeam.members) ? myTeam.members.length : 0}/{myTeam.maxMembers} members
                </p>
                <Link href={`/teams/${myTeam.id}`} className="btn-primary text-sm">
                  <span className="material-symbols-rounded">visibility</span>
                  View Team
                </Link>
              </div>
            ) : (
              <div className="glass-strong rounded-xl p-6">
                <div className="flex mb-4 rounded-lg bg-bg-dark/50 p-1">
                  <button
                    onClick={() => { setMode("create"); setError(""); }}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${mode === "create" ? "bg-primary text-white" : "text-text-muted hover:text-text-bright"}`}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => { setMode("join"); setError(""); }}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${mode === "join" ? "bg-primary text-white" : "text-text-muted hover:text-text-bright"}`}
                  >
                    Join
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{error}</div>
                )}

                {mode === "create" ? (
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-muted mb-1.5">Team Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Enter team name" required />
                    </div>
                    <div>
                      <label className="block text-sm text-text-muted mb-1.5">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none h-24" placeholder="What's your team about?" />
                    </div>
                    <button type="submit" disabled={submitting || !name.trim()} className="btn-primary w-full">
                      <span className="material-symbols-rounded">add_circle</span>
                      {submitting ? "Creating..." : "Create Team"}
                    </button>
                  </form>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-muted mb-1.5">Invite Code</label>
                      <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="input-field" placeholder="Enter invite code" required />
                    </div>
                    <button type="submit" disabled={submitting || !inviteCode.trim()} className="btn-primary w-full">
                      <span className="material-symbols-rounded">group_add</span>
                      {submitting ? "Joining..." : "Join Team"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-rounded text-xl text-primary">people</span>
              <h2 className="text-lg font-semibold text-text-bright">Looking for Members</h2>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary-light text-xs font-medium">{teams.length}</span>
            </div>

            {loading ? (
              <div className="glass rounded-xl p-8 text-center">
                <span className="material-symbols-rounded text-3xl text-primary animate-spin">progress_activity</span>
                <p className="mt-3 text-text-muted text-sm">Loading teams...</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <span className="material-symbols-rounded text-3xl text-text-muted">group_off</span>
                <p className="mt-3 text-text-muted">No teams registered yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teams.map((team) => (
                  <Link key={team.id} href={`/teams/${team.id}`} className="card p-4 block">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-text-bright font-semibold truncate">{team.name}</h3>
                        {team.description && <p className="text-text-muted text-sm line-clamp-2">{team.description}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="material-symbols-rounded text-base text-text-muted">person</span>
                        <span className="text-sm text-text-muted">
                          {Array.isArray(team.members) ? team.members.length : 0}/{team.maxMembers}
                        </span>
                      </div>
                    </div>
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
