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
      <div className="min-h-screen pt-[60px] flex items-center justify-center">
        <div className="glass-strong rounded-xl p-8 text-center">
          <span className="material-symbols-rounded text-4xl text-primary animate-spin">progress_activity</span>
          <p className="mt-4 text-text-muted">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen pt-[60px] flex items-center justify-center">
        <div className="glass-strong rounded-xl p-8 text-center">
          <span className="material-symbols-rounded text-4xl text-error">error</span>
          <p className="mt-4 text-text-muted">Team not found.</p>
          <Link href="/teams" className="btn-secondary mt-4 text-sm">
            <span className="material-symbols-rounded">arrow_back</span>
            Back to Teams
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
    <div className="min-h-screen pt-[60px]">
      <div className="max-w-[800px] mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <Link href="/teams" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-bright transition-colors mb-6">
            <span className="material-symbols-rounded text-base">arrow_back</span>
            Back to Teams
          </Link>

          <div className="glass-strong rounded-xl p-8 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-bright">{team.name}</h1>
                {team.description && <p className="text-text-muted mt-2">{team.description}</p>}
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-light text-sm font-medium shrink-0">
                {members.length}/{team.maxMembers}
              </span>
            </div>
          </div>

          <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-rounded text-xl text-primary">group</span>
              <h2 className="text-lg font-semibold text-text-bright">Members</h2>
            </div>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark/50">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary-light text-xs font-medium">
                      {member.username[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <span className="text-text-bright font-medium flex-1">{member.username}</span>
                  {leader && member.id === leader.id ? (
                    <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs font-medium flex items-center gap-1">
                      <span className="material-symbols-rounded text-xs">star</span>
                      Leader
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary-light text-xs font-medium">Member</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {(isLeader || isMember) && (
            <div className="card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-rounded text-xl text-primary">vpn_key</span>
                <h2 className="text-lg font-semibold text-text-bright">Invite Code</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 rounded-lg bg-bg-dark/50 font-mono text-primary-light text-sm">
                  {team.inviteCode}
                </div>
                <button onClick={handleCopyInvite} className="btn-secondary text-sm">
                  <span className="material-symbols-rounded text-base">{copied ? "check" : "content_copy"}</span>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-text-muted text-xs mt-2">Share this code with others to invite them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
