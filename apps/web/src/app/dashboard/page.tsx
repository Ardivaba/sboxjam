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
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            {user.username}
          </h1>
          <p className="text-text-muted">Manage your jam participation.</p>
        </div>

        <div className="space-y-8 animate-fade-in">
          {/* Registration */}
          <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-text-bright">Jam Registration</p>
              <p className="text-xs text-text-muted mt-0.5">
                {registered ? "You're registered for the jam" : "You haven't registered yet"}
              </p>
            </div>
            {registered ? (
              <span className="text-xs font-medium text-success uppercase tracking-wider">Registered</span>
            ) : (
              <button onClick={() => setRegistered(true)} className="btn-primary text-sm">
                Register
              </button>
            )}
          </div>

          {/* Team */}
          <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-text-bright">Team</p>
              <p className="text-xs text-text-muted mt-0.5">
                {myTeam
                  ? `${myTeam.name} · ${Array.isArray(myTeam.members) ? myTeam.members.length : 0}/${myTeam.maxMembers} members`
                  : "Not on a team yet"
                }
              </p>
            </div>
            {myTeam ? (
              <Link href={`/teams/${myTeam.id}`} className="text-sm text-primary hover:text-primary-light transition-colors">
                View &rarr;
              </Link>
            ) : (
              <Link href="/teams" className="btn-primary text-sm">
                Find Team
              </Link>
            )}
          </div>

          {/* Links */}
          <div className="pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">Quick Links</p>
            <div className="space-y-1">
              {[
                { href: "/rules", label: "Rules", desc: "View jam guidelines" },
                { href: "/schedule", label: "Schedule", desc: "View timeline" },
                { href: "/teams", label: "Browse Teams", desc: "Find teammates" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between py-3 hover:bg-white/[0.02] -mx-3 px-3 rounded transition-colors group"
                >
                  <div>
                    <p className="text-sm text-text-bright font-medium group-hover:text-white transition-colors">{link.label}</p>
                    <p className="text-xs text-text-muted/60">{link.desc}</p>
                  </div>
                  <span className="text-text-muted/30 group-hover:text-text-muted transition-colors">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
