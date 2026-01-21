export function normalizeDocument(raw: any) {
  return {
    id: raw.id || `${raw.source}-${Date.now()}`,
    source: raw.source || "unknown",
    title: raw.title || null,
    url: raw.url || null,
    text: (raw.text || raw.content || "").trim(),
    publishedAt: raw.publishedAt || raw.timestamp || new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
    meta: raw.meta || {},
  };
}
