import Link from "next/link";
import { fetchCollection } from "@/lib/payload";
import type { DevLog, Team, Participant } from "@/lib/types";

function getTeamName(team: Team | string) {
  return typeof team === "string" ? "Unknown Team" : team.name;
}

function getAuthorName(author: Participant | string) {
  return typeof author === "string" ? "Unknown" : author.username;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function DevLogListPage() {
  let posts: DevLog[] = [];

  try {
    const data = await fetchCollection<DevLog>("devlogs", {
      sort: "-publishedAt",
      limit: 50,
      depth: 1,
    });
    posts = data.docs;
  } catch {}

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="py-8 md:py-12 animate-fade-in flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Devlog</h1>
            <p className="text-text-muted">Progress updates from participating teams.</p>
          </div>
          <Link href="/devlog/new" className="btn-primary text-sm shrink-0">
            Write Post
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {posts.map((post) => {
              const teamName = getTeamName(post.team);
              const authorName = getAuthorName(post.author);
              const hasImages = post.images && post.images.length > 0;
              const firstImage = hasImages
                ? (typeof post.images![0].image === "string" ? null : post.images![0].image)
                : null;

              return (
                <Link
                  key={post.id}
                  href={`/devlog/${post.id}`}
                  className="block py-6 first:pt-0 group hover:bg-white/[0.01] -mx-4 px-4 rounded transition-colors"
                >
                  <div className="flex gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-text-muted/60">{formatDate(post.publishedAt)}</span>
                        <span className="text-text-muted/20">·</span>
                        <span className="text-xs text-primary/70">{teamName}</span>
                      </div>
                      <h2 className="text-base font-semibold text-text-bright group-hover:text-white transition-colors mb-1.5 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-xs text-text-muted/60">
                        by {authorName}
                        {post.videoUrl && <> · <span className="text-primary/50">video</span></>}
                        {hasImages && <> · {post.images!.length} image{post.images!.length !== 1 && "s"}</>}
                      </p>
                    </div>
                    {firstImage && (
                      <div className="w-20 h-16 rounded bg-white/[0.03] overflow-hidden shrink-0">
                        <img
                          src={firstImage.url}
                          alt={firstImage.alt || ""}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-text-muted">No devlog posts yet.</p>
            <p className="text-text-muted/50 text-sm mt-1">Teams can share their progress here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
