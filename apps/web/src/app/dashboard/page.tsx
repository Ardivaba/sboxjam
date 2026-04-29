"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useTeamStore } from "@/features/teams/useTeamStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { myTeam, fetchMyTeam } = useTeamStore();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setRegistered(user.registeredForJam);
      fetchMyTeam(user.id);
    }
  }, [user, fetchMyTeam]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-[60px]">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-text-bright mb-2">
            Welcome back, <span className="text-gradient">{user.username}</span>
          </h1>
          <p className="text-text-muted text-lg mb-10">Manage your jam participation and team.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-rounded text-2xl text-primary">event_available</span>
              <h2 className="text-xl font-semibold text-text-bright">Registration Status</h2>
            </div>
            {registered ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                <span className="material-symbols-rounded text-success">check_circle</span>
                <span className="text-success font-medium">Registered for the Jam</span>
              </div>
            ) : (
              <div>
                <p className="text-text-muted mb-4">You haven&apos;t registered for the jam yet.</p>
                <button onClick={() => setRegistered(true)} className="btn-primary">
                  <span className="material-symbols-rounded">rocket_launch</span>
                  Register for Jam
                </button>
              </div>
            )}
          </div>

          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-rounded text-2xl text-primary">groups</span>
              <h2 className="text-xl font-semibold text-text-bright">Team Status</h2>
            </div>
            {myTeam ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-text-bright font-semibold text-lg">{myTeam.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary-light text-xs font-medium">
                    {Array.isArray(myTeam.members) ? myTeam.members.length : 0}/{myTeam.maxMembers}
                  </span>
                </div>
                <Link href={`/teams/${myTeam.id}`} className="btn-secondary text-sm">
                  <span className="material-symbols-rounded">visibility</span>
                  View Team
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-text-muted mb-4">You&apos;re not on a team yet.</p>
                <Link href="/teams" className="btn-primary text-sm">
                  <span className="material-symbols-rounded">group_add</span>
                  Find or Create a Team
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 animate-fade-in">
          <h2 className="text-xl font-semibold text-text-bright mb-4">Quick Links</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/rules" className="card p-5 flex items-center gap-4 group">
              <span className="material-symbols-rounded text-2xl text-primary group-hover:text-primary-light transition-colors">gavel</span>
              <div>
                <p className="text-text-bright font-medium">Rules</p>
                <p className="text-text-muted text-sm">View jam guidelines</p>
              </div>
            </Link>
            <Link href="/schedule" className="card p-5 flex items-center gap-4 group">
              <span className="material-symbols-rounded text-2xl text-primary group-hover:text-primary-light transition-colors">calendar_month</span>
              <div>
                <p className="text-text-bright font-medium">Schedule</p>
                <p className="text-text-muted text-sm">View timeline</p>
              </div>
            </Link>
            <Link href="/teams" className="card p-5 flex items-center gap-4 group">
              <span className="material-symbols-rounded text-2xl text-primary group-hover:text-primary-light transition-colors">people</span>
              <div>
                <p className="text-text-bright font-medium">Browse Teams</p>
                <p className="text-text-muted text-sm">Find teammates</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
