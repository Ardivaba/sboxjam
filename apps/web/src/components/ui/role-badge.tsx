import { ROLE_LABELS, type Role } from "@/lib/types";

const ROLE_COLORS: Record<Role, string> = {
  programmer: "text-primary-light border-primary/30 bg-primary/10",
  artist: "text-purple-300 border-purple-400/30 bg-purple-400/10",
  sound: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  money: "text-yellow-200 border-yellow-400/30 bg-yellow-400/10",
};

export function RoleBadge({ role }: { role: Role }) {
  const color = ROLE_COLORS[role] || "text-text-muted border-white/10 bg-white/5";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${color}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

export function RoleBadgeList({ roles }: { roles?: Role[] }) {
  if (!roles?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((role) => (
        <RoleBadge key={role} role={role} />
      ))}
    </div>
  );
}
