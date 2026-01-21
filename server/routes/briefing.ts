import { Request, Response, Router } from "express";

const router = Router();

// POST /api/briefing/:accountId
router.post("/briefing/:accountId", (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { role, query } = req.body;

  if (!role || !query) {
    return res.status(400).json({ error: "Missing role or query in request body." });
  }

  // Mock response for now
  const mockBriefing = {
    metadata: {
      account_id: accountId,
      account_name: "Mock Account",
      trigger_type: "manual",
      generated_at: new Date().toISOString(),
      role,
    },
    insights: [
      {
        id: "1",
        text: `Generated insight for ${query}`,
        category: "general",
        confidence: 0.9,
        citations: [],
        reasoning: "Mock reasoning."
      }
    ]
  };

  res.json(mockBriefing);
});

export default router;