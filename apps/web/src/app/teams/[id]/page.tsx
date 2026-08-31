"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { fetchById, fetchCollection, createDoc, updateDoc } from "@/lib/payload";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadgeList } from "@/components/ui/role-badge";
import { ROLES, ROLE_LABELS, type JoinRequest, type Participant, type Role, type Team } from "@/lib/types";

const asId = (v: { id: string } | string) => (typeof v === "string" ? v : v.id);

export default function TeamDetailPage() {
  const params = useParams();
  const { user, token } = useAuthStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  const teamId = params.id as string;

  const loadTeam = useCallback(async () => {
    try {
      const data = await fetchById<Team>("teams", teamId, 1);
      setTeam(data);
    } catch {
      setTeam(null);
    }
    setLoading(false);
  }, [teamId]);

  useEffect(() => {
    if (teamId) loadTeam();
  }, [teamId, loadTeam]);

  const isLeader = !!(user && team && asId(team.leader) === user.id);
  const isMember = !!(user && team?.members?.some((m) => asId(m) === user.id));

  // Load join requests: pending ones for the leader, own for the applicant.
  useEffect(() => {
    if (!team || !user) return;
    fetchCollection<JoinRequest>("join-requests", {
      where: { team: { equals: team.id } },
      depth: 1,
      limit: 100,
      sort: "-createdAt",
    })
      .then((data) => setRequests(data.docs))
      .catch(() => {});
  }, [team, user]);

  const myRequest = user
    ? requests.find((r) => asId(r.participant) === user.id && r.status === "pending")
    : undefined;
  const pendingRequests = requests.filter((r) => r.status === "pending");

  const handleCopyInvite = async () => {
    if (!team) return;
    await navigator.clipboard.writeText(team.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !team) return;
    setError("");
    setBusy(true);
    try {
      await createDoc<JoinRequest>(
        "join-requests",
        { participant: user.id, team: team.id, message, status: "pending" },
        token,
      );
      setApplied(true);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
    }
    setBusy(false);
  };

  const handleRespond = async (request: JoinRequest, accept: boolean) => {
    if (!token || !team) return;
    setBusy(true);
    setError("");
    try {
      if (accept) {
        const memberIds = (team.members || []).map(asId);
        const applicantId = asId(request.participant);
        if (memberIds.length >= team.maxMembers) throw new Error("Team is full");
        if (!memberIds.includes(applicantId)) {
          await updateDoc<Team>("teams", team.id, { members: [...memberIds, applicantId] }, token);
        }
      }
      await updateDoc<JoinRequest>("join-requests", request.id, { status: accept ? "accepted" : "declined" }, token);
      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: accept ? "accepted" : "declined" } : r)),
      );
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update request");
    }
    setBusy(false);
  };

  const handleLeave = async () => {
    if (!user || !token || !team) return;
    setBusy(true);
    try {
      const members = (team.members || []).map(asId).filter((id) => id !== user.id);
      await updateDoc<Team>("teams", team.id, { members }, token);
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave team");
    }
    setBusy(false);
  };

  const handleTeamUpdate = async (data: Partial<Team>) => {
    if (!token || !team) return;
    setBusy(true);
    setError("");
    try {
      await updateDoc<Team>("teams", team.id, data, token);
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update team");
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Team not found.</p>
          <Link href="/teams" className="text-sm text-primary hover:text-primary-light transition-colors">
            &larr; Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const members = (team.members || []).map((m) =>
    typeof m === "string" ? ({ id: m, username: "Unknown" } as Participant) : m,
  );
  const leaderId = asId(team.leader);
  const isFull = members.length >= team.maxMembers;

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <Link href="/teams" className="text-sm text-text-muted hover:text-text-bright transition-colors">
            &larr; Teams
          </Link>

          <div className="mt-6 flex items-baseline justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{team.name}</h1>
            <span className="text-sm text-text-muted tabular-nums shrink-0">
              {members.length}/{team.maxMembers}
            </span>
          </div>
          {team.description && <p className="text-text-muted mt-2">{team.description}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {team.lookingForMembers ? (
              <span className="text-[11px] font-medium uppercase tracking-wider text-success">Recruiting</span>
            ) : (
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Not recruiting</span>
            )}
            <RoleBadgeList roles={team.rolesNeeded} />
          </div>

          {team.discordUrl && (
            <a
              href={team.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-primary hover:text-primary-light transition-colors"
            >
              Team Discord &rarr;
            </a>
          )}
        </div>

        {error && <p className="mb-6 text-sm text-error">{error}</p>}

        {/* Members */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">Members</p>
          <div className="divide-y divide-white/[0.04]">
            {members.map((member) => (
              <Link key={member.id} href={`/players/${member.id}`} className="flex items-center gap-3 py-3 hover:bg-white/[0.02] -mx-3 px-3 rounded transition-colors">
                <Avatar participant={member} className="w-7 h-7" />
                <span className="text-text-bright text-sm font-medium flex-1">{member.username}</span>
                <div className="hidden sm:block">
                  <RoleBadgeList roles={member.roles} />
                </div>
                {member.id === leaderId && (
                  <span className="text-[10px] text-warning uppercase tracking-wider font-medium">Leader</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Apply */}
        {user && !isMember && !applied && !myRequest && team.lookingForMembers && !isFull && (
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-3">Apply to join</p>
            <form onSubmit={handleApply} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field resize-none h-24"
                placeholder="Tell the team what you'd bring — roles, experience, links..."
              />
              <button type="submit" disabled={busy} className="btn-primary">
                {busy ? "Sending..." : "Send Request"}
              </button>
            </form>
          </div>
        )}
        {user && !isMember && (applied || myRequest) && (
          <div className="mb-10 py-4 border-y border-white/[0.04]">
            <p className="text-sm text-text-bright">Request sent — the team leader will review it.</p>
          </div>
        )}
        {!user && team.lookingForMembers && (
          <div className="mb-10 py-4 border-y border-white/[0.04] flex items-center justify-between gap-4">
            <p className="text-sm text-text-muted">Sign in with Discord to apply to this team.</p>
            <Link href="/login" className="btn-primary text-sm shrink-0">Sign In</Link>
          </div>
        )}

        {/* Leader: pending requests */}
        {isLeader && (
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">
              Join Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
            </p>
            {pendingRequests.length === 0 ? (
              <p className="text-text-muted text-sm">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => {
                  const applicant = typeof request.participant === "string"
                    ? ({ id: request.participant, username: "Unknown" } as Participant)
                    : request.participant;
                  return (
                    <div key={request.id} className="border border-white/[0.06] rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Avatar participant={applicant} className="w-8 h-8" />
                        <div className="flex-1 min-w-0">
                          <Link href={`/players/${applicant.id}`} className="text-sm font-medium text-text-bright hover:text-white transition-colors">
                            {applicant.username}
                          </Link>
                          <div className="mt-0.5">
                            <RoleBadgeList roles={applicant.roles} />
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleRespond(request, true)} disabled={busy || isFull} className="btn-primary text-xs px-3 py-1.5">
                            Accept
                          </button>
                          <button onClick={() => handleRespond(request, false)} disabled={busy} className="btn-secondary text-xs px-3 py-1.5">
                            Decline
                          </button>
                        </div>
                      </div>
                      {request.message && (
                        <p className="mt-3 text-sm text-text-muted whitespace-pre-wrap">{request.message}</p>
                      )}
                    </div>
                  );
                })}
                {isFull && <p className="text-xs text-text-muted">Team is full — accepting is disabled.</p>}
              </div>
            )}
          </div>
        )}

        {/* Member tools */}
        {(isLeader || isMember) && (
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-3">Invite Code</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 py-2.5 px-3 bg-white/[0.03] border border-white/[0.06] rounded text-sm text-primary-light font-mono tracking-wider">
                {team.inviteCode}
              </code>
              <button onClick={handleCopyInvite} className="btn-secondary text-sm">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-text-muted/50 text-xs mt-2">Share this code to let someone join instantly.</p>
          </div>
        )}

        {/* Leader: team settings */}
        {isLeader && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">Team Settings</p>
              <button onClick={() => setEditing((v) => !v)} className="text-xs text-primary hover:text-primary-light transition-colors">
                {editing ? "Close" : "Edit"}
              </button>
            </div>
            {editing && (
              <div className="space-y-4 border border-white/[0.06] rounded-lg p-4">
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="text-sm text-text-bright">Recruiting new members</span>
                  <input
                    type="checkbox"
                    checked={team.lookingForMembers}
                    disabled={busy}
                    onChange={(e) => handleTeamUpdate({ lookingForMembers: e.target.checked })}
                    className="accent-[#3273eb] w-4 h-4"
                  />
                </label>
                <div>
                  <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Recruiting for</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ROLES.map((role) => {
                      const active = team.rolesNeeded?.includes(role);
                      return (
                        <button
                          key={role}
                          disabled={busy}
                          onClick={() => {
                            const next = active
                              ? (team.rolesNeeded || []).filter((r) => r !== role)
                              : [...(team.rolesNeeded || []), role as Role];
                            handleTeamUpdate({ rolesNeeded: next });
                          }}
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                            active
                              ? "border-primary/60 bg-primary/20 text-primary-light"
                              : "border-white/10 bg-white/[0.03] text-text-muted hover:border-white/25"
                          }`}
                        >
                          {ROLE_LABELS[role]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Pitch</p>
                  <TeamDescriptionEditor
                    initial={team.description || ""}
                    busy={busy}
                    onSave={(description) => handleTeamUpdate({ description })}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leave */}
        {isMember && !isLeader && (
          <div className="py-4 border-t border-white/[0.04]">
            <button onClick={handleLeave} disabled={busy} className="text-sm text-error/80 hover:text-error transition-colors cursor-pointer">
              Leave team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamDescriptionEditor({
  initial,
  busy,
  onSave,
}: {
  initial: string;
  busy: boolean;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="space-y-2">
      <textarea value={value} onChange={(e) => setValue(e.target.value)} className="input-field resize-none h-20" />
      <button onClick={() => onSave(value)} disabled={busy || value === initial} className="btn-secondary text-xs px-3 py-1.5">
        Save
      </button>
    </div>
  );
}
