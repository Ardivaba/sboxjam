import Link from "next/link";
import { fetchById } from "@/lib/payload";
import type { DevLog, Team, Participant, MediaItem } from "@/lib/types";
import { RichText } from "@/components/ui/rich-text";

function VideoEmbed({ url }: { url: string }) {
  let embedUrl = url;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return (
    <div className="relative w-full pb-[56.25%] mb-6 rounded-md overflow-hidden bg-white/[0.03]">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default async function DevLogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: DevLog | null = null;

  try {
    post = await fetchById<DevLog>("devlogs", id, 1);
  } catch {}

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Post not found.</p>
          <Link href="/devlog" className="text-sm text-primary hover:text-primary-light transition-colors">
            &larr; Back to Devlog
          </Link>
        </div>
      </div>
    );
  }

  const team = typeof post.team === "string" ? null : post.team;
  const author = typeof post.author === "string" ? null : post.author;
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <article className="mx-auto max-w-2xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <Link href="/devlog" className="text-sm text-text-muted hover:text-text-bright transition-colors">
            &larr; Devlog
          </Link>

          <h1 className="mt-6 text-2xl md:text-3xl font-bold text-white leading-tight">{post.title}</h1>

          <div className="flex items-center gap-2 mt-4 text-sm text-text-muted">
            {author && (
              <>
                <div className="w-6 h-6 rounded bg-white/[0.06] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium text-text-muted">{author.username[0]?.toUpperCase()}</span>
                </div>
                <span className="text-text-bright">{author.username}</span>
                <span className="text-text-muted/30">·</span>
              </>
            )}
            {team && (
              <>
                <Link href={`/teams/${team.id}`} className="text-primary/70 hover:text-primary transition-colors">
                  {team.name}
                </Link>
                <span className="text-text-muted/30">·</span>
              </>
            )}
            <span className="text-text-muted/60">{date}</span>
          </div>
        </div>

        {/* Video */}
        {post.videoUrl && <VideoEmbed url={post.videoUrl} />}

        {/* Body */}
        <div className="mb-10">
          <RichText content={post.body} />
        </div>

        {/* Image gallery */}
        {post.images && post.images.length > 0 && (
          <div className="mb-10">
            <div className={`grid gap-2 ${post.images.length === 1 ? "" : "grid-cols-2"}`}>
              {post.images.map((item, i) => {
                const img = typeof item.image === "string" ? null : (item.image as MediaItem);
                if (!img?.url) return null;
                return (
                  <figure key={i} className={post.images!.length === 1 ? "" : (i === 0 && post.images!.length === 3 ? "col-span-2" : "")}>
                    <img
                      src={img.url}
                      alt={img.alt || item.caption || ""}
                      className="w-full rounded-md"
                      loading="lazy"
                    />
                    {item.caption && (
                      <figcaption className="text-xs text-text-muted/50 mt-1.5">{item.caption}</figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/[0.04] pt-6">
          <Link href="/devlog" className="text-sm text-text-muted hover:text-text-bright transition-colors">
            &larr; All posts
          </Link>
        </div>
      </article>
    </div>
  );
}
