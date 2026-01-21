#!/usr/bin/env python3
"""
SalesAI Orchestration Service - Single-file implementation
Runs on http://localhost:4011
"""
import os
import sys
import json
import logging
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Try to load GROQ, but don't fail if unavailable
try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False
    Groq = None

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load .env
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
except:
    pass

# Config from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

# Initialize Groq client
groq_client = None
if HAS_GROQ and GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
        logger.info("✅ Groq client initialized")
    except Exception as e:
        logger.warning(f"⚠️  Groq initialization failed: {e}")
else:
    logger.warning("⚠️  GROQ not available (using stub responses)")


# Pydantic models
class Citation(BaseModel):
    source_url: str
    title: str
    text_snippet: str
    retrieval_method: str
    confidence: float


class Insight(BaseModel):
    id: str
    text: str
    category: str
    confidence: float
    citations: list
    reasoning: str


class BriefingMetadata(BaseModel):
    account_id: str
    account_name: str
    trigger_type: str
    generated_at: str
    role: str


class Briefing(BaseModel):
    metadata: BriefingMetadata
    insights: list
    ice_breakers: Optional[list] = None
    value_map: Optional[dict] = None
    competitive_landscape: Optional[str] = None
    financial_metrics: Optional[dict] = None


# FastAPI app
app = FastAPI(
    title="SalesAI Orchestration",
    version="0.1.0",
    description="GROQ-powered sales briefing orchestration"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def query_groq(prompt: str) -> dict:
    """Query GROQ LLM for synthesis."""
    if not groq_client:
        # Stub response
        return {
            "insight": "Account showing strong market signals",
            "confidence": 0.75,
            "reasoning": "Based on available data sources",
            "sources": ["NewsAPI", "SEC EDGAR"]
        }
    
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Try to parse JSON
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Extract JSON from markdown code blocks if present
            import re
            match = re.search(r'\{[^{}]*\}', response_text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except:
                    pass
            
            # Fallback
            return {
                "insight": response_text[:200],
                "confidence": 0.6,
                "reasoning": "Parsed from GROQ response",
                "sources": []
            }
    except Exception as e:
        logger.error(f"GROQ error: {e}")
        return {
            "insight": "Account analysis generated",
            "confidence": 0.5,
            "reasoning": "Fallback response",
            "sources": []
        }


# Routes
@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "groq": "connected" if groq_client else "stub",
        "version": "0.1.0"
    }


@app.post("/api/briefing/{account_id}")
async def generate_briefing(account_id: str, role: str = "ae", query: str = ""):
    """
    Generate a briefing for an account.
    
    Args:
        account_id: CRM account ID
        role: "sdr" or "ae" (role-specific output)
        query: Optional query/context
    
    Returns:
        Briefing with insights and citations
    """
    try:
        logger.info(f"🔄 Generating briefing for {account_id} (role={role})")
        
        # Build context
        context = f"""
                    Account Analysis Request:
                    - Account ID: {account_id}
                    - Role: {role}
                    - Context: {query or "General account intelligence"}

                    Mock Data:
                    - Recent news: Company expanding sustainability initiatives
                    - Financial: Q4 2025 growth at 15% YoY
                    - People: New VP of Operations hired
                    - Social sentiment: Positive mentions on LinkedIn
                    """
        
        # Query GROQ
        prompt = f"""You are a sales intelligence analyst. Analyze this context and respond with ONLY valid JSON:
                    {context}

                    Query: {query or 'Summarize key account intelligence'}

                    Response format (NO markdown, ONLY JSON):
                    {{
                    "insight": "main finding",
                    "confidence": 0.85,
                    "reasoning": "why this matters",
                    "sources": ["source1", "source2"]
                    }}"""
        
        llm_output = query_groq(prompt)
        
        # Build insight
        insight = {
            "id": "insight_1",
            "text": llm_output.get("insight", "Account analysis generated"),
            "category": "opportunity",
            "confidence": min(llm_output.get("confidence", 0.7), 0.95),
            "citations": [
                {
                    "source_url": f"https://source-{i}.example.com",
                    "title": f"Source {i+1}",
                    "text_snippet": "...",
                    "retrieval_method": "vector",
                    "confidence": 0.9
                }
                for i in range(min(len(llm_output.get("sources", [])), 3))
            ],
            "reasoning": llm_output.get("reasoning", "Analysis complete")
        }
        
        # Build briefing
        metadata = {
            "account_id": account_id,
            "account_name": "Sample Account",
            "trigger_type": "manual",
            "generated_at": datetime.now().isoformat(),
            "role": role,
        }
        
        briefing = {
            "metadata": metadata,
            "insights": [insight],
        }
        
        # Add role-specific sections
        if role == "sdr":
            briefing["ice_breakers"] = [
                "What's your perspective on sustainable manufacturing?",
                "How is your team approaching digital transformation?",
            ]
        elif role == "ae":
            briefing["financial_metrics"] = {
                "roe": "12%",
                "fcf_growth": "+15%",
                "debt_to_equity": "0.45"
            }
            briefing["value_map"] = {
                "product_fit": "high",
                "timing": "now",
                "champion_level": "C-suite"
            }
        
        logger.info(f"✅ Briefing generated for {account_id}")
        return JSONResponse(briefing)
    
    except Exception as e:
        logger.error(f"❌ Error generating briefing: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/briefing/{account_id}/drill-down")
async def drill_down(account_id: str, insight_id: str = ""):
    """Expand insight with reasoning and sources."""
    return JSONResponse({
        "insight": {
            "id": insight_id,
            "text": "Sample insight",
            "category": "opportunity",
            "confidence": 0.85,
            "citations": [],
            "reasoning": "Based on recent market signals..."
        },
        "full_context": "Expanded context from retrieval...",
        "reasoning_trace": [
            "Step 1: Retrieved 5 news articles via vector search",
            "Step 2: Analyzed sentiment from social media",
            "Step 3: Scored with GROQ for commercial relevance"
        ],
        "related_graph_paths": [
            {"from": "Acme Corp", "to": "TechCorp X", "relation": "competitor"},
            {"from": "Acme Corp", "to": "John Smith", "relation": "ceo"},
        ]
    })


@app.get("/api/graph/{account_id}")
async def get_graph(account_id: str):
    """Get account relationship graph."""
    return JSONResponse({
        "account_id": account_id,
        "graph": [
            {"from": "Acme Corp", "to": "Tech Vendor X", "relation": "uses"},
            {"from": "Acme Corp", "to": "John Smith", "relation": "ceo"},
            {"from": "Acme Corp", "to": "Competitor Y", "relation": "competes_with"},
        ]
    })


def main():
    """Run the server."""
    logger.info("🚀 Starting SalesAI Orchestration Service")
    logger.info(f"📊 GROQ Model: {GROQ_MODEL}")
    logger.info(f"🔐 GROQ Available: {'Yes' if groq_client else 'No (using stubs)'}")
    logger.info("🌐 Listening on http://0.0.0.0:4011")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=4011,
        log_level="info"
    )


if __name__ == "__main__":
    main()
