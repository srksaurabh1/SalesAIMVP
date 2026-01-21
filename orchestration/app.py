# Removed unused database configurations and logic
# PostgreSQL, Milvus, and Neo4j are not required for this setup

# Updated /api/briefing/{account_id} endpoint to use mock data
@app.post("/api/briefing/{account_id}")
async def generate_briefing(account_id: str, role: str = "ae", query: str = ""):
    """Generate a briefing for an account using mock data."""
    try:
        logger.info(f"Generating briefing for account {account_id} (role={role})")

        # Mock context and response
        contbext = f"""
                Account: {account_id}
                Role: {role}
                Query: {query or "General account analysis"}

                Recent news and intelligence:
                - Company expanding to sustainable manufacturing (recent news)
                - New executive hire: VP of Operations (LinkedIn)
                - Q4 2025 earnings showing 15% YoY growth

                Social sentiment:
                - Positive mentions on Twitter and Reddit
                - Industry leadership recognized in recent interviews
                """

        # Stub response
        llm_output = {
            "insight": "Account showing strong market signals",
            "confidence": 0.75,
            "reasoning": "Based on available data sources",
            "sources": ["NewsAPI", "SEC EDGAR", "Social Media"]
        }

        # Build insight
        insight = Insight(
            id="insight_1",
            text=llm_output.get("insight", "Account analysis generated"),
            category="opportunity",
            confidence=min(llm_output.get("confidence", 0.7), 0.95),
            citations=[
                Citation(
                    source_url=f"https://source-{i}.example.com",
                    title=f"Source {i+1}",
                    text_snippet="...",
                    retrieval_method="vector",
                    confidence=0.9
                )
                for i in range(min(len(llm_output.get("sources", [])), 3))
            ],
            reasoning=llm_output.get("reasoning", "Analysis based on data sources")
        )

        # Build briefing
        from datetime import datetime
        metadata = BriefingMetadata(
            account_id=account_id,
            account_name="Sample Account",
            trigger_type="manual",
            generated_at=datetime.now().isoformat(),
            role=role,
        )

        briefing = Briefing(
            metadata=metadata,
            insights=[insight],
            ice_breakers=[
                "What's your perspective on sustainable manufacturing?",
                "How is your team approaching digital transformation?",
            ] if role == "sdr" else None,
            financial_metrics={
                "roe": "12%",
                "fcf_growth": "+15%",
                "debt_to_equity": "0.45"
            } if role == "ae" else None,
        )

        return JSONResponse(briefing.model_dump())

    except Exception as e:
        logger.error(f"Error generating briefing: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))