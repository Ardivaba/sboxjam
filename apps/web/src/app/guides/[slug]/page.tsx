import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCollection } from "@/lib/payload";
import type { Guide } from "@/lib/types";
import { LexicalRenderer } from "@/components/LexicalRenderer";

const DIFFICULTY_DOT: Record<string, string> = {
  beginner: "bg-success",
  intermediate: "bg-warning",
  advanced: "bg-error",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const CATEGORY_LABEL: Record<string, string> = {
  setup: "Setting Up",
  development: "Game Development",
  tips: "Jam Tips",
};

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function GuideDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  let guide: Guide | undefined;
  try {
    const data = await fetchCollection<Guide>("guides", {
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    guide = data.docs[0];
  } catch {}

  if (!guide) notFound();

  const cover =
    guide.coverImage && typeof guide.coverImage === "object" ? guide.coverImage : null;

  return (
    <article className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors mb-8"
        >
          <span className="material-symbols-rounded text-base">arrow_back</span>
          All guides
        </Link>

        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  DIFFICULTY_DOT[guide.difficulty] || "bg-text-muted"
                }`}
              />
              {DIFFICULTY_LABEL[guide.difficulty] || guide.difficulty}
            </span>
            <span>·</span>
            <span>{CATEGORY_LABEL[guide.category] || guide.category}</span>
            {guide.readTime && (
              <>
                <span>·</span>
                <span>{guide.readTime}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{guide.title}</h1>
          <p className="text-lg text-text-muted">{guide.description}</p>
        </div>

        {cover?.url && (
          <figure className="mb-10 -mx-4 md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={cover.alt || guide.title}
              className="w-full md:rounded-lg border border-white/[0.06]"
              loading="eager"
            />
          </figure>
        )}

        <div className="animate-fade-in">
          {guide.content ? (
            <LexicalRenderer content={guide.content} />
          ) : (
            <p className="text-text-muted italic">This guide is being written.</p>
          )}
        </div>
      </div>
    </article>
  );
}
