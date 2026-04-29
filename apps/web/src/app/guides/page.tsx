import Link from "next/link";
import { fetchCollection } from "@/lib/payload";
import type { Guide } from "@/lib/types";

const DIFFICULTY_DOT: Record<string, string> = {
  beginner: "bg-success",
  intermediate: "bg-warning",
  advanced: "bg-error",
};

function GuideRow({ guide }: { guide: Guide }) {
  const className = "flex items-center gap-4 py-4 border-b border-white/[0.04] last:border-0 group hover:bg-white/[0.02] -mx-4 px-4 rounded transition-colors";

  const content = (
    <>
      <div className={`w-2 h-2 rounded-full shrink-0 ${DIFFICULTY_DOT[guide.difficulty] || "bg-text-muted"}`} />
      <div className="flex-1 min-w-0">
        <p className="text-text-bright font-medium text-sm group-hover:text-white transition-colors truncate">
          {guide.title}
        </p>
        <p className="text-text-muted text-xs mt-0.5 truncate">{guide.description}</p>
      </div>
      {guide.readTime && (
        <span className="text-text-muted/50 text-xs shrink-0 hidden sm:block">{guide.readTime}</span>
      )}
      {guide.externalUrl && (
        <span className="material-symbols-rounded text-sm text-text-muted/30 shrink-0">open_in_new</span>
      )}
    </>
  );

  if (guide.externalUrl) {
    return (
      <a href={guide.externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function GuideSection({ title, guides }: { title: string; guides: Guide[] }) {
  if (guides.length === 0) return null;
  return (
    <div className="mb-12">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">{title}</h2>
      <div>
        {guides.map((guide) => (
          <GuideRow key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
}

export default async function GuidesPage() {
  let guides: Guide[] = [];

  try {
    const data = await fetchCollection<Guide>("guides", { sort: "order", limit: 50 });
    guides = data.docs;
  } catch {}

  const setupGuides = guides.filter((g) => g.category === "setup");
  const devGuides = guides.filter((g) => g.category === "development");
  const tipGuides = guides.filter((g) => g.category === "tips");

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Guides</h1>
          <p className="text-text-muted">
            Resources to help you prepare for the jam.
          </p>
        </div>

        {guides.length > 0 ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" /> Beginner</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> Intermediate</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-error" /> Advanced</span>
            </div>
            <GuideSection title="Setting Up" guides={setupGuides} />
            <GuideSection title="Game Development" guides={devGuides} />
            <GuideSection title="Tips & Tricks" guides={tipGuides} />
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-text-muted">Guides will be published soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
