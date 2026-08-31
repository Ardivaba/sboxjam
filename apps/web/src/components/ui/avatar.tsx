import type { Participant } from "@/lib/types";

export function Avatar({
  participant,
  className = "w-9 h-9",
  textClassName = "text-xs",
}: {
  participant: Pick<Participant, "username" | "avatarUrl">;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className={`${className} rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden`}>
      {participant.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={participant.avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className={`${textClassName} font-bold text-text-muted`}>
          {participant.username?.[0]?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}
