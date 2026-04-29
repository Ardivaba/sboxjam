"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useTeamStore } from "@/features/teams/useTeamStore";
import { useEffect } from "react";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

type UploadedImage = {
  id: string;
  url: string;
  filename: string;
  caption: string;
};

function textToLexical(text: string) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: paragraphs.map((p) => ({
        type: "paragraph",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        children: [
          {
            type: "text",
            version: 1,
            text: p.trim(),
            format: 0,
            mode: "normal",
            style: "",
            detail: 0,
          },
        ],
      })),
    },
  };
}

export default function NewDevLogPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { myTeam, fetchMyTeam } = useTeamStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchMyTeam(user.id);
  }, [user, fetchMyTeam]);

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || !token) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", file.name);

      try {
        const res = await fetch(`${CMS_URL}/api/media`, {
          method: "POST",
          headers: { Authorization: `JWT ${token}` },
          body: form,
        });
        if (res.ok) {
          const data = await res.json();
          setImages((prev) => [...prev, {
            id: data.doc.id,
            url: data.doc.url,
            filename: data.doc.filename,
            caption: "",
          }]);
        }
      } catch {}
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }, [token]);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, caption } : img));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !myTeam || !token) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${CMS_URL}/api/devlogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          title,
          body: textToLexical(body),
          team: myTeam.id,
          author: user.id,
          videoUrl: videoUrl || undefined,
          images: images.length > 0
            ? images.map((img) => ({ image: img.id, caption: img.caption || undefined }))
            : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.message || "Failed to publish");
      }

      const { doc } = await res.json();
      router.push(`/devlog/${doc.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen px-4 pt-16 pb-24">
        <div className="mx-auto max-w-2xl py-20 text-center">
          <p className="text-text-muted mb-4">Log in to write a devlog post.</p>
          <Link href="/login" className="btn-primary text-sm">Log In</Link>
        </div>
      </div>
    );
  }

  if (!myTeam) {
    return (
      <div className="min-h-screen px-4 pt-16 pb-24">
        <div className="mx-auto max-w-2xl py-20 text-center">
          <p className="text-text-muted mb-4">You need to be on a team to write devlog posts.</p>
          <Link href="/teams" className="btn-primary text-sm">Find a Team</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <Link href="/devlog" className="text-sm text-text-muted hover:text-text-bright transition-colors">
            &larr; Devlog
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">New Post</h1>
          <p className="text-text-muted text-sm mt-1">
            Posting as <span className="text-text-bright">{user.username}</span> from <span className="text-primary/70">{myTeam.name}</span>
          </p>
        </div>

        {error && <p className="mb-5 text-sm text-error">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
              className="w-full bg-transparent text-xl font-semibold text-white placeholder:text-text-muted/30 outline-none border-b border-white/[0.06] pb-3 focus:border-primary/40 transition-colors"
            />
          </div>

          {/* Body */}
          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write about your progress, what you built, challenges you faced..."
              required
              rows={12}
              className="w-full bg-transparent text-text resize-none outline-none placeholder:text-text-muted/30 leading-relaxed"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.04]" />

          {/* Images */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-3">Images</p>

            {images.length > 0 && (
              <div className="space-y-3 mb-4">
                {images.map((img) => (
                  <div key={img.id} className="flex gap-3 items-start">
                    <img src={img.url} alt="" className="w-20 h-14 object-cover rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted/50 truncate mb-1">{img.filename}</p>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateCaption(img.id, e.target.value)}
                        placeholder="Caption (optional)"
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="text-text-muted/30 hover:text-error transition-colors shrink-0 mt-1"
                    >
                      <span className="material-symbols-rounded text-lg">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-secondary text-xs"
            >
              {uploading ? "Uploading..." : "Add Images"}
            </button>
          </div>

          {/* Video */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-3">Video</p>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube URL (optional)"
              className="input-field text-sm"
            />
          </div>

          {/* Submit */}
          <div className="border-t border-white/[0.04] pt-6 flex items-center justify-between">
            <Link href="/devlog" className="text-sm text-text-muted hover:text-text-bright transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !body.trim()}
              className="btn-primary"
            >
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
