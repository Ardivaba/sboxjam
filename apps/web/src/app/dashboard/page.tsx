"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useTeamStore } from "@/features/teams/useTeamStore";
import { fetchCollection, updateDoc, uploadMedia, mediaUrl } from "@/lib/payload";
import { Avatar } from "@/components/ui/avatar";
import { ROLES, ROLE_LABELS, type JoinRequest, type Participant, type PortfolioItem, type Role, type Team } from "@/lib/types";

const asId = (v: { id: string } | string) => (typeof v === "string" ? v : v.id);

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, refresh } = useAuthStore();
  const { myTeam, fetchMyTeam } = useTeamStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

  useEffect(() => {
    if (user) fetchMyTeam(user.id);
  }, [user, fetchMyTeam]);

  if (!hydrated || !user || !token) return null;

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="py-8 md:py-12 animate-fade-in flex items-center gap-5">
          <Avatar participant={user} className="w-14 h-14" textClassName="text-lg" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{user.username}</h1>
            <p className="text-text-muted">
              Your profile is how teams find you —{" "}
              <Link href={`/players/${user.id}`} className="text-primary hover:text-primary-light transition-colors">
                see it live &rarr;
              </Link>
            </p>
          </div>
        </div>

        <div className="space-y-12 animate-fade-in">
          <TeamSection user={user} myTeam={myTeam} />
          <ProfileSection user={user} token={token} onSaved={refresh} />
          <PortfolioSection user={user} token={token} onSaved={refresh} />
        </div>
      </div>
    </div>
  );
}

function TeamSection({ user, myTeam }: { user: Participant; myTeam: Team | null }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [myRequests, setMyRequests] = useState<JoinRequest[]>([]);

  const isLeader = !!(myTeam && asId(myTeam.leader) === user.id);

  useEffect(() => {
    if (isLeader && myTeam) {
      fetchCollection<JoinRequest>("join-requests", {
        where: { team: { equals: myTeam.id }, status: { equals: "pending" } },
        depth: 0,
        limit: 100,
      })
        .then((data) => setPendingCount(data.docs.length))
        .catch(() => {});
    }
  }, [isLeader, myTeam]);

  useEffect(() => {
    if (!myTeam) {
      fetchCollection<JoinRequest>("join-requests", {
        where: { participant: { equals: user.id } },
        depth: 1,
        limit: 20,
        sort: "-createdAt",
      })
        .then((data) => setMyRequests(data.docs))
        .catch(() => {});
    }
  }, [myTeam, user.id]);

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">Team</p>
      <div className="flex items-center justify-between py-4 border-y border-white/[0.04]">
        <div>
          <p className="text-sm font-medium text-text-bright">
            {myTeam ? myTeam.name : "Not on a team yet"}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            {myTeam
              ? `${Array.isArray(myTeam.members) ? myTeam.members.length : 0}/${myTeam.maxMembers} members${isLeader ? " · you lead this team" : ""}`
              : "Browse recruiting teams or start your own"}
          </p>
          {isLeader && pendingCount > 0 && (
            <p className="text-xs text-warning mt-1">
              {pendingCount} pending join {pendingCount === 1 ? "request" : "requests"}
            </p>
          )}
        </div>
        {myTeam ? (
          <Link href={`/teams/${myTeam.id}`} className="btn-primary text-sm">
            Manage
          </Link>
        ) : (
          <Link href="/teams" className="btn-primary text-sm">
            Find a Team
          </Link>
        )}
      </div>

      {!myTeam && myRequests.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-text-muted mb-2">Your applications</p>
          <div className="divide-y divide-white/[0.04]">
            {myRequests.map((r) => {
              const team = typeof r.team === "string" ? null : r.team;
              return (
                <div key={r.id} className="flex items-center justify-between py-2.5">
                  {team ? (
                    <Link href={`/teams/${team.id}`} className="text-sm text-text-bright hover:text-white transition-colors">
                      {team.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-text-bright">Unknown team</span>
                  )}
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium ${
                      r.status === "pending" ? "text-warning" : r.status === "accepted" ? "text-success" : "text-text-muted"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function ProfileSection({ user, token, onSaved }: { user: Participant; token: string; onSaved: () => void }) {
  const [lookingForTeam, setLookingForTeam] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");
  const [sboxProfileUrl, setSboxProfileUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLookingForTeam(!!user.lookingForTeam);
    setRoles(user.roles || []);
    setBio(user.bio || "");
    setSkills((user.skills || []).map((s) => s.skill).join(", "));
    setDiscordHandle(user.discordHandle || "");
    setSboxProfileUrl(user.sboxProfileUrl || "");
    // Intentionally seeded once from the logged-in user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const toggleRole = (role: Role) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updateDoc<Participant>(
        "participants",
        user.id,
        {
          lookingForTeam,
          roles,
          bio,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((skill) => ({ skill })),
          discordHandle,
          sboxProfileUrl,
        },
        token,
      );
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    }
    setSaving(false);
  };

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">Profile</p>
      <form onSubmit={handleSave} className="space-y-5">
        <label className="flex items-center justify-between gap-4 py-3 border-y border-white/[0.04] cursor-pointer">
          <div>
            <p className="text-sm font-medium text-text-bright">I&apos;m looking for a team</p>
            <p className="text-xs text-text-muted mt-0.5">Shows you in the player directory as available</p>
          </div>
          <input
            type="checkbox"
            checked={lookingForTeam}
            onChange={(e) => setLookingForTeam(e.target.checked)}
            className="accent-[#3273eb] w-5 h-5"
          />
        </label>

        <div>
          <label className="block text-xs text-text-muted mb-2 uppercase tracking-wider">Roles</label>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => toggleRole(role)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  roles.includes(role)
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
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-field resize-none h-28"
            placeholder="Who are you, what do you like building, what kind of team are you after?"
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Skills (comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="input-field"
            placeholder="C#, Blender, shaders, level design..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Discord handle</label>
            <input
              type="text"
              value={discordHandle}
              onChange={(e) => setDiscordHandle(e.target.value)}
              className="input-field"
              placeholder="yourhandle"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">sbox.game profile</label>
            <input
              type="url"
              value={sboxProfileUrl}
              onChange={(e) => setSboxProfileUrl(e.target.value)}
              className="input-field"
              placeholder="https://sbox.game/..."
            />
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Profile"}
        </button>
      </form>
    </section>
  );
}

function PortfolioSection({ user, token, onSaved }: { user: Participant; token: string; onSaved: () => void }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(user.portfolio || []);
    // Intentionally seeded once from the logged-in user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const persist = async (next: PortfolioItem[]) => {
    const payload = next.map((item) => ({
      title: item.title,
      description: item.description,
      videoUrl: item.videoUrl,
      url: item.url,
      image: item.image ? asId(item.image as { id: string } | string) : undefined,
    }));
    const doc = await updateDoc<Participant>("participants", user.id, { portfolio: payload }, token);
    setItems(doc.portfolio || []);
    onSaved();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let imageId: string | undefined;
      if (file) {
        const media = await uploadMedia(file, token);
        imageId = media.id;
      }
      await persist([...items, { title, description, videoUrl, url, image: imageId }]);
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setUrl("");
      setFile(null);
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add portfolio item");
    }
    setBusy(false);
  };

  const handleRemove = async (index: number) => {
    setBusy(true);
    setError("");
    try {
      await persist(items.filter((_, i) => i !== index));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
    }
    setBusy(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">Portfolio</p>
        <button onClick={() => setAdding((v) => !v)} className="text-xs text-primary hover:text-primary-light transition-colors cursor-pointer">
          {adding ? "Cancel" : "+ Add project"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      {adding && (
        <form onSubmit={handleAdd} className="mb-6 space-y-4 border border-white/[0.06] rounded-lg p-4">
          <div>
            <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Project name" required />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none h-20" placeholder="What is it, what did you do on it?" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block text-sm text-text-muted file:mr-3 file:btn-secondary file:border-0 file:cursor-pointer"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Video URL (YouTube)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field" placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Project link</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="input-field" placeholder="https://sbox.game/... or GitHub" />
            </div>
          </div>
          <button type="submit" disabled={busy || !title.trim()} className="btn-primary">
            {busy ? "Adding..." : "Add to Portfolio"}
          </button>
        </form>
      )}

      {items.length === 0 && !adding ? (
        <p className="text-text-muted text-sm">
          No projects yet. Add screenshots, videos, or links — teams pick people they can see the work of.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const img = mediaUrl(item.image);
            return (
              <div key={item.id || i} className="flex items-center gap-4 border border-white/[0.06] rounded-lg p-3">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="w-16 h-12 object-cover rounded shrink-0" />
                ) : (
                  <div className="w-16 h-12 rounded bg-white/[0.04] flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[18px] text-text-muted/50">
                      {item.videoUrl ? "play_circle" : "link"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-bright truncate">{item.title}</p>
                  {item.description && <p className="text-xs text-text-muted/70 truncate">{item.description}</p>}
                </div>
                <button
                  onClick={() => handleRemove(i)}
                  disabled={busy}
                  className="text-xs text-error/70 hover:text-error transition-colors shrink-0 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
