import express from "express";
import dotenv from "dotenv";
import { fetchNewsForCompany } from "./ingestors/news";
import { fetchLatestFilingsForCompany } from "./ingestors/sec";
import { fetchSocialSignalsForCompany } from "./ingestors/social";
import { normalizeDocument } from "./normalizer";
import { publishDocument } from "./rabbit";
import { queryGroq } from "./groqClient";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/webhook/calendar", async (req, res) => {
  try {
    const event = req.body;
    // Minimal event parsing - expand as needed
    const company = (event.title || event.summary || "").match(/with\s+(.*)$/i)?.[1] || event.account || event.company || "";

    // Orchestrate ingestion
    const [news, filings, social] = await Promise.all([
      fetchNewsForCompany(company),
      fetchLatestFilingsForCompany(company),
      fetchSocialSignalsForCompany(company),
    ]);

    const rawDocs = [...news, ...filings, ...social];

    for (const raw of rawDocs) {
      const doc = normalizeDocument(raw);
      // enrich with a lightweight judgment via GROQ (optional)
      try {
        const prompt = `Score the commercial relevance of this document for sales outreach: ${doc.title || doc.text}`;
        const score = await queryGroq(prompt, { task: "score" });
        doc.meta = { ...doc.meta, groq: score };
      } catch (e) {
        console.warn("groq scoring failed", e instanceof Error ? e.message : e);
      }

      await publishDocument(doc);
    }

    res.json({ ok: true, pushed: rawDocs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

const port = process.env.PORT || 4010;
app.listen(port, () => console.log(`Ingestion service listening on ${port}`));
