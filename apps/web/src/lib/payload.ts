const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

type FetchOptions = {
  collection?: string;
  global?: string;
  id?: string;
  where?: Record<string, unknown>;
  sort?: string;
  limit?: number;
  depth?: number;
};

export async function fetchFromCMS<T>(options: FetchOptions): Promise<T> {
  let url: string;

  if (options.global) {
    url = `${CMS_URL}/api/globals/${options.global}?depth=${options.depth ?? 1}`;
  } else if (options.collection && options.id) {
    url = `${CMS_URL}/api/${options.collection}/${options.id}?depth=${options.depth ?? 1}`;
  } else if (options.collection) {
    const params = new URLSearchParams();
    if (options.sort) params.set("sort", options.sort);
    if (options.limit) params.set("limit", options.limit.toString());
    if (options.depth !== undefined) params.set("depth", options.depth.toString());
    if (options.where) params.set("where", JSON.stringify(options.where));
    url = `${CMS_URL}/api/${options.collection}?${params.toString()}`;
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

export async function fetchGlobal<T>(global: string) {
  return fetchFromCMS<T>({ global });
}

export async function fetchById<T>(collection: string, id: string, depth?: number) {
  return fetchFromCMS<T>({ collection, id, depth });
}

export async function loginParticipant(email: string, password: string) {
  const res = await fetch(`${CMS_URL}/api/participants/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.[0]?.message || "Login failed");
  }
  return res.json();
}

export async function registerParticipant(username: string, email: string, password: string) {
  const res = await fetch(`${CMS_URL}/api/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.[0]?.message || "Registration failed");
  }
  return res.json();
}
