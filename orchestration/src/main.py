import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

from src.config import settings
from src.retriever import HybridRetriever
from src.llm import query_groq_for_synthesis
from src.models import Briefing, BriefingMetadata, Insight, Citation, DrillDownRequest, DrillDownResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SalesAI Orchestration")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize retriever (with graceful fallback)
try:
    pg_conn_str = f"postgresql://{settings.pg_user}:{settings.pg_password}@{settings.pg_host}:{settings.pg_port}/{settings.pg_database}"
    retriever = HybridRetriever(
        pg_conn_str,
        settings.milvus_host,
        settings.milvus_port,
        settings.neo4j_uri,
        settings.neo4j_user,
        settings.neo4j_password,
    )
    logger.info("HybridRetriever initialized successfully")
except Exception as e:
    logger.warning(f"HybridRetriever initialization failed (expected in dev): {e}")
    retriever = None


@app.on_event("shutdown")
async def shutdown():
    if retriever:
        retriever.close()
        logger.info("Retriever closed")


@app.get("/health")
async def health():
    return {"status": "ok", "retriever": "connected" if retriever else "disconnected"}


@app.post("/api/briefing/{account_id}")
async def generate_briefing(account_id: str, role: str = "ae", query: str = ""):

    try:
        logger.info(f"Generating briefing for account {account_id} (role={role})")

        context_text = ""
    
        # Hybrid retrieval (use stub if retriever unavailable)
        # if retriever:
        #     placeholder_embedding = [0.1] * 768  # Replace with actual embedding
        #     retrieval_results = retriever.hybrid_search(placeholder_embedding, account_id, query)
        #     context_text = f"""
        #                     Vector Results:
        #                     {retrieval_results['vector_results']}

        #                     Graph Context:
        #                     {retrieval_results['graph_context']}

        #                     SQL Metadata:
        #                     {retrieval_results['sql_metadata']}
        #                     """
        # if context_text.strip() == "":
        #     # Stub data for development
        #     context_text = f"""
        #                     Stub context for account {account_id}.
        #                     Query: {query or "General account analysis"}

        #                     This is placeholder data returned in development mode (no database connected).
        #                     In production, this would contain:
        #                     - Recent news articles
        #                     - SEC filings
        #                     - Social media sentiment
        #                     - Historical CRM interactions
        #                     """
        
        # context_text = f"""
        #                     EXECUTIVE DOSSIER: {account_id}
        #                     Primary Focus: {query or "Comprehensive Account Strategy"}
                            
        #                     CRITICAL BUSINESS SIGNALS:
        #                     - Recent News: {account_id} is undergoing a 'Digital-First' transformation, focusing on AI-integrated workflows and cloud scalability.
        #                     - Financial Performance: Latest quarterly filings show a 12% increase in R&D spend, specifically targeting operational efficiency and automation.
        #                     - SEC Insights: Management's recent 10-K highlights "Geopolitical supply chain diversification" as a top 2026 priority.
                            
        #                     SOCIAL & MARKET SENTIMENT:
        #                     - LinkedIn Trends: Massive hiring surge in {account_id}'s DevOps and Sustainable Infrastructure teams.
        #                     - Industry Positioning: Moving from a hardware-centric model to a recurring 'as-a-service' revenue model.
                            
        #                     HISTORICAL CRM CONTEXT:
        #                     - Previous Engagement: Evaluated our platform in 2024; project stalled due to budget cycles. 
        #                     - Current Status: Contract for their legacy provider is up for renewal in 6 months.
                            
        #                     OBJECTIVE: Identify high-impact entry points for a {role.upper()} to start a conversation.
        #                 """
        context_text = f"""
                        EXECUTIVE DOSSIER: {account_id}
                        Primary Focus: Comprehensive Account Strategy

                        CRITICAL BUSINESS SIGNALS:
                        - Recent News: Recent news regarding {account_id}.
                        - Financial Performance: Latest quarterly filings, for {account_id}.
                        - SEC Insights: 2026 priorities from recent 10-K.
                        SOCIAL & MARKET SENTIMENT:
                        - LinkedIn Trends: Massive social news or develpopments regarding {account_id}.
                        - Industry Positioning: Shifts in business model for {account_id}.
                        COMPANY RIVAL:
                        - Key Competitors: Main competitors for {account_id} in the market.
                        HISTORICAL CRM CONTEXT:
                        - Previous Engagement: What we know from prior sales cycles with {account_id}.
                        - Current Status: What is their current vendor landscape.
                        OBJECTIVE: Identify high-impact entry points for {role.upper()} to start a conversation with {account_id}.
                        
                        """
    
        try:
            llm_output = await query_groq_for_synthesis(context_text, query)
        
        except Exception as groq_err:
            logger.error(f"GROQ Synthesis failed: {groq_err}")
            llm_output = {"insight": "Fallback: Market signals strong", "confidence": 0.7}
        
        # Parse into structured Insight
        insight = Insight(
            id="insight_1",
            text=llm_output.get("insight", "Account analysis generated via GROQ"),
            category="opportunity",
            confidence=llm_output.get("confidence", 0.75),
            citations=[
                Citation(
                    source_url=src if src.startswith("http") else f"https://example.com/source-{i}",
                    title=f"Source {i+1}",
                    text_snippet="...",
                    retrieval_method="vector",
                    confidence=0.9
                )
                for i, src in enumerate(llm_output.get("sources", ["NewsAPI", "SEC EDGAR"])[:3])
            ],
            reasoning=llm_output.get("reasoning", "Analyzed based on available data sources"),
            action =llm_output.get("Action", "Engage with tailored messaging")
        )
        print("Generated Insight:", insight)
        
        # Build role-specific briefing
        metadata = BriefingMetadata(
            account_id=account_id,
            account_name="Sample Account",
            trigger_type="manual",
            generated_at=__import__('datetime').datetime.now().isoformat(),
            role=role,
        )
        
        briefing = Briefing(
            metadata=metadata,
            insights=[insight],
            ice_breakers=["What's your take on sustainable manufacturing?", "How are you approaching digital transformation?"] if role == "sdr" else None,
            financial_metrics={"roe": "12%", "fcf_growth": "+15%", "debt_to_equity": "0.45"} if role == "ae" else None,
        )
        
        return JSONResponse(briefing.model_dump())
    
    except Exception as e:
        logger.error(f"Error generating briefing: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/briefing/{account_id}/drill-down")
async def drill_down(account_id: str, request: DrillDownRequest):
    """
    Expand an insight with full reasoning and sources.
    """
    try:
        # Fetch full context for the insight (from DB/cache)
        # Return reasoning trace and related graph paths
        response = DrillDownResponse(
            insight=Insight(
                id=request.insight_id,
                text="Sample insight",
                category="opportunity",
                confidence=0.85,
                citations=[],
                reasoning="Based on recent news about market expansion..."
            ),
            full_context="Expanded context here...",
            reasoning_trace=["Step 1: Retrieved news", "Step 2: Analyzed sentiment", "Step 3: Scored with GROQ"],
            related_graph_paths=[{"from": "Acme", "to": "TechCorp", "relation": "competitive_threat"}],
        )
        return JSONResponse(response.model_dump())
    except Exception as e:
        logger.error(f"Error in drill-down: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/graph/{account_id}")
async def get_graph(account_id: str):
    """
    Retrieve relationship map for account.
    """
    try:
        if retriever:
            graph_context = retriever.graph_search(account_id, depth=2)
        else:
            # Stub data
            graph_context = [
                {"from": "Acme Corp", "to": "TechVendor X", "relation": "uses"},
                {"from": "Acme Corp", "to": "John Smith", "relation": "ceo"},
            ]
        return JSONResponse({"account_id": account_id, "graph": graph_context})
    except Exception as e:
        logger.error(f"Error fetching graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)
