"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useTeamStore } from "@/features/teams/useTeamStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();
  const { myTeam, fetchMyTeam } = useTeamStore();
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setRegistered(user.registeredForJam);
      fetchMyTeam();
    }
  }, [user, fetchMyTeam]);

  const handleRegister = async () => {
    setRegistering(true);
    setRegistered(true);
    setRegistering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[60px] flex items-center justify-center">
        <div className="glass-strong rounded-xl p-8 text-center">
          <span className="material-symbols-rounded text-4xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="mt-4 text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-[60px]">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-text-bright mb-2">
            Welcome back, <span className="text-gradient">{user.username}</span>
          </h1>
          <p className="text-text-muted text-lg mb-10">
            Manage your jam participation and team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-rounded text-2xl text-primary">
                event_available
              </span>
              <h2 className="text-xl font-semibold text-text-bright">
                Registration Status
              </h2>
            </div>
            {registered ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                <span className="material-symbols-rounded text-success">
                  check_circle
                </span>
                <span className="text-success font-medium">
                  Registered for the Jam
                </span>
              </div>
            ) : (
              <div>
                <p className="text-text-muted mb-4">
                  You haven&apos;t registered for the jam yet.
                </p>
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn-primary"
                >
                  <span className="material-symbols-rounded">
                    rocket_launch
                  </span>
                  {registering ? "Registering..." : "Register for Jam"}
                </button>
              </div>
            )}
          </div>

          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-rounded text-2xl text-primary">
                groups
              </span>
              <h2 className="text-xl font-semibold text-text-bright">
                Team Status
              </h2>
            </div>
            {myTeam ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-text-bright font-semibold text-lg">
                    {myTeam.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary-light text-xs font-medium">
                    {myTeam.members.length}/{myTeam.maxMembers}
                  </span>
                </div>
                <div className="space-y-2">
                  {myTeam.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary-light text-[10px] font-medium">
                          {member.username[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-text">{member.username}</span>
                      {member.role === "leader" && (
                        <span className="px-1.5 py-0.5 rounded bg-warning/20 text-warning text-[10px] font-medium">
                          Leader
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <Link
                  href={`/teams/${myTeam.id}`}
                  className="btn-secondary mt-4 text-sm"
                >
                  <span className="material-symbols-rounded">visibility</span>
                  View Team
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-text-muted mb-4">
                  You&apos;re not on a team yet.
                </p>
                <Link href="/teams" className="btn-primary text-sm">
                  <span className="material-symbols-rounded">group_add</span>
                  Find or Create a Team
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 animate-fade-in">
          <h2 className="text-xl font-semibold text-text-bright mb-4">
            Quick Links
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/rules"
              className="card p-5 flex items-center gap-4 group"
            >
              <span className="material-symbols-rounded text-2xl text-primary group-hover:text-primary-light transition-colors">
                gavel
              </span>
              <div>
                <p className="text-text-bright font-medium">Rules</p>
                <p className="text-text-muted text-sm">View jam guidelines</p>
              </div>
            </Link>
            <Link
              href="/schedule"
              className="card p-5 flex items-center gap-4 group"
            >
              <span className="material-symbols-rounded text-2xl text-primary group-hover:text-primary-light transition-colors">
                calendar_month
              </span>
              <div>
                <p className="text-text-bright font-medium">Schedule</p>
                <p className="text-text-muted text-sm">View timeline</p>
              </div>
            </Link>
            <Link
              href="/teams"
              className="card p-5 flex items-center gap-4 group"
            >
              <span className="material-symbols-rounded text-2xl text-primary group-hover:text-primary-light transition-colors">
                people
              </span>
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
