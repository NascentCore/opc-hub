const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

export async function apiGet<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
  const url = await buildUrl(path, params);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    console.error(`[apiGet] ${res.status} ${path}:`, text);
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const url = await buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    console.error(`[apiPost] ${res.status} ${path}:`, text);
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
