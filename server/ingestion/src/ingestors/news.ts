import axios from "axios";

export async function fetchNewsForCompany(name: string, opts: { apiKey?: string } = {}) {
  // Simple NewsAPI example (replace with GNews or other provider)
  const key = opts.apiKey || process.env.NEWS_API_KEY;
  if (!key) return [];

  const q = encodeURIComponent(name);
  const url = `https://newsapi.org/v2/everything?q=${q}&pageSize=5&sortBy=publishedAt&apiKey=${key}`;
  const r = await axios.get(url);
  return (r.data.articles || []).map((a: any) => ({
    source: "news",
    title: a.title,
    url: a.url,
    text: a.description || a.content || "",
    publishedAt: a.publishedAt,
  }));
}
