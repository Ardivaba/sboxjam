"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import type { Team, Participant } from "@/lib/types";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

export default function TeamDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const res = await fetch(`${CMS_URL}/api/teams/${params.id}?depth=1`);
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
      setLoading(false);
    };
    if (params.id) fetchTeam();
  }, [params.id]);

  const isLeader = user && team && typeof team.leader !== "string" && team.leader?.id === user.id;
  const isMember = user && team?.members?.some((m) => {
    const member = typeof m === "string" ? m : m.id;
    return member === user.id;
  });

  const handleCopyInvite = async () => {
    if (!team) return;
    await navigator.clipboard.writeText(team.inviteCode);
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
    typeof m === "string" ? { id: m, username: "Unknown" } : m
  ) as Participant[];

  const leader = typeof team.leader === "string"
    ? { id: team.leader, username: "Unknown" }
    : team.leader;

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
          {team.description && (
            <p className="text-text-muted mt-2">{team.description}</p>
          )}
        </div>

        {/* Members */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">Members</p>
          <div className="divide-y divide-white/[0.04]">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 py-3">
                <div className="w-7 h-7 rounded bg-white/[0.06] flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-text-muted">
                    {member.username[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <span className="text-text-bright text-sm font-medium flex-1">{member.username}</span>
                {leader && member.id === leader.id && (
                  <span className="text-[10px] text-warning uppercase tracking-wider font-medium">Leader</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invite code */}
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
            <p className="text-text-muted/50 text-xs mt-2">Share this code with others to invite them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
