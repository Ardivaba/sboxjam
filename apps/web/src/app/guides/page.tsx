import { fetchCollection } from "@/lib/payload";
import type { Guide } from "@/lib/types";

const DIFFICULTY_COLORS = {
  beginner: "bg-success/20 text-success",
  intermediate: "bg-warning/20 text-warning",
  advanced: "bg-error/20 text-error",
};

export default async function GuidesPage() {
  let guides: Guide[] = [];

  try {
    const data = await fetchCollection<Guide>("guides", { sort: "order", limit: 50 });
    guides = data.docs;
  } catch {}

  const setupGuides = guides.filter((g) => g.category === "setup");
  const devGuides = guides.filter((g) => g.category === "development");
  const tipGuides = guides.filter((g) => g.category === "tips");

  const renderGuideCard = (guide: Guide) => (
    <div key={guide.id} className="card rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        {guide.icon && (
          <span className="material-symbols-rounded text-2xl text-primary">{guide.icon}</span>
        )}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${DIFFICULTY_COLORS[guide.difficulty]}`}>
          {guide.difficulty}
        </span>
      </div>
      <h3 className="text-base font-semibold text-text-bright mb-1">{guide.title}</h3>
      <p className="text-sm text-text-muted mb-3">{guide.description}</p>
      {guide.readTime && (
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <span className="material-symbols-rounded text-xs">schedule</span>
          {guide.readTime}
        </div>
      )}
    </div>
  );

  const renderSection = (title: string, items: Guide[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-text-bright">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(renderGuideCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-24">
      <section className="relative mx-auto max-w-5xl py-12 text-center md:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(50,115,235,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 animate-fade-in">
          <h1 className="mb-4 text-3xl font-bold text-text-white md:text-5xl">
            Getting <span className="text-gradient">Started</span>
          </h1>
          <p className="mx-auto max-w-xl text-text-muted md:text-lg">
            Resources to help you prepare for the jam.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl pb-16">
        {guides.length > 0 ? (
          <>
            {renderSection("Setting Up", setupGuides)}
            {renderSection("Game Development", devGuides)}
            {renderSection("Jam Tips", tipGuides)}
          </>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <span className="material-symbols-rounded text-4xl text-text-muted">menu_book</span>
            <p className="mt-4 text-text-muted">Guides will be published soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
