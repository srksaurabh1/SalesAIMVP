"""
Data models for briefings, citations, and insights.
"""
from typing import List, Optional
from pydantic import BaseModel


class Citation(BaseModel):
    source_url: str
    title: str
    text_snippet: str
    retrieval_method: str  # "vector", "graph", "sql"
    confidence: float


class Insight(BaseModel):
    id: str
    text: str
    category: str  # "threat", "opportunity", "competitive", "financial"
    confidence: float
    citations: List[Citation]
    reasoning: str
    action:str


class BriefingMetadata(BaseModel):
    account_id: str
    account_name: str
    trigger_type: str  # "calendar", "intent_spike", "manual"
    generated_at: str
    role: str  # "sdr" or "ae"


class Briefing(BaseModel):
    metadata: BriefingMetadata
    insights: List[Insight]
    
    # Role-specific sections
    ice_breakers: Optional[List[str]] = None  # SDR
    value_map: Optional[dict] = None  # AE
    competitive_landscape: Optional[str] = None  # AE
    financial_metrics: Optional[dict] = None  # AE


class DrillDownRequest(BaseModel):
    insight_id: str
    account_id: str


class DrillDownResponse(BaseModel):
    insight: Insight
    full_context: str
    reasoning_trace: List[str]
    related_graph_paths: List[dict]
