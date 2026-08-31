import type { Media } from "./types";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

export { CMS_URL };

type FetchOptions = {
  collection?: string;
  global?: string;
  id?: string;
  where?: Record<string, unknown>;
  sort?: string;
  limit?: number;
  depth?: number;
};

export function buildQuery(options: FetchOptions): string {
  const params = new URLSearchParams();
  if (options.sort) params.set("sort", options.sort);
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.depth !== undefined) params.set("depth", options.depth.toString());
  if (options.where) {
    // Payload expects bracket-notation: where[field][operator]=value
    const walk = (obj: Record<string, unknown>, prefix: string) => {
      for (const [k, v] of Object.entries(obj)) {
        const key = `${prefix}[${k}]`;
        if (v !== null && typeof v === "object" && !Array.isArray(v)) {
          walk(v as Record<string, unknown>, key);
        } else if (Array.isArray(v)) {
          v.forEach((item) => params.append(key, String(item)));
        } else if (v !== undefined) {
          params.set(key, String(v));
        }
      }
    };
    walk(options.where, "where");
  }
  return params.toString();
}

export async function fetchFromCMS<T>(options: FetchOptions): Promise<T> {
  let url: string;

  if (options.global) {
    url = `${CMS_URL}/api/globals/${options.global}?depth=${options.depth ?? 1}`;
  } else if (options.collection && options.id) {
    url = `${CMS_URL}/api/${options.collection}/${options.id}?depth=${options.depth ?? 1}`;
  } else if (options.collection) {
    url = `${CMS_URL}/api/${options.collection}?${buildQuery(options)}`;
  } else {
    throw new Error("Must provide collection or global");
  }

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`CMS fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchCollection<T>(collection: string, options?: Omit<FetchOptions, "collection">) {
  return fetchFromCMS<{ docs: T[]; totalDocs: number }>({ collection, ...options });
}

export async function fetchById<T>(collection: string, id: string, depth?: number) {
  return fetchFromCMS<T>({ collection, id, depth });
}

// --- Authenticated mutations (client-side, JWT from the auth store) ---

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };
}

async function throwCMSError(res: Response, fallback: string): Promise<never> {
  let message = fallback;
  try {
    const data = await res.json();
    message = data.errors?.[0]?.message || fallback;
  } catch {}
  throw new Error(message);
}

export async function createDoc<T>(collection: string, data: unknown, token: string): Promise<T> {
  const res = await fetch(`${CMS_URL}/api/${collection}`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) await throwCMSError(res, `Failed to create ${collection}`);
  const { doc } = await res.json();
  return doc;
}

export async function updateDoc<T>(collection: string, id: string, data: unknown, token: string): Promise<T> {
  const res = await fetch(`${CMS_URL}/api/${collection}/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) await throwCMSError(res, `Failed to update ${collection}`);
  const { doc } = await res.json();
  return doc;
}

export async function uploadMedia(file: File, token: string): Promise<Media> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("_payload", JSON.stringify({ alt: file.name }));
  const res = await fetch(`${CMS_URL}/api/media`, {
    method: "POST",
    headers: { Authorization: `JWT ${token}` },
    body: formData,
  });
  if (!res.ok) await throwCMSError(res, "Failed to upload image");
  const { doc } = await res.json();
  return doc;
}

export function mediaUrl(media: Media | string | null | undefined): string | null {
  if (!media || typeof media === "string" || !media.url) return null;
  if (media.url.startsWith("http")) return media.url;
  return `${CMS_URL}${media.url}`;
}

// Turns a YouTube watch/share URL into an embeddable one; returns null for
// anything we can't safely embed (rendered as a plain link instead).
export function videoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch" && u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      }
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}
