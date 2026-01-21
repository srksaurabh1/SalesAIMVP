"""
GROQ LLM integration using Groq SDK directly.
"""
import os
from groq import Groq
from src.config import settings
import json
import logging


logger = logging.getLogger(__name__)

async def query_groq_for_synthesis(context: str, question: str) -> dict:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY", settings.groq_api_key))
    
    prompt = f"""You are a sales intelligence analyst. 
            Based on the following context, provide a concise, actionable insight.

            Context:
            {context}

            Question:
            {question}

            Respond with ONLY valid JSON (no markdown, no code blocks) with these fields:
            {{
            "insight": "actionable finding",
            "confidence": 0.85,
            "reasoning":  explanation",
            "sources": ["url1", "url2"]
            "Action": "specific next step for sales team"
            }}

            Be factual. Confidence should be 0.5-0.95."""
    try:
        response = client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        
        # print(response)
        
        response_text = response.choices[0].message.content
        # print(response_text)
        
        # Parse JSON response
        try:
            result = json.loads(response_text)
            # print(result)
        except json.JSONDecodeError:
            # If response contains markdown code blocks, extract JSON
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
            else:
                result = {
                    "insight": response_text[:200],
                    "confidence": 0.6,
                    "reasoning": "Parsed from GROQ response",
                    "sources": [],
                    "Action": "Review insight and action accordingly"
                }
        
        logger.info(f"GROQ synthesis complete: confidence={result.get('confidence')}")
        return result
        
    except Exception as e:
        logger.error(f"GROQ query error: {e}")
        result = {
            "insight": f"Analysis for: {question[:50]}",
            "confidence": 0.5,
            "reasoning": "Default response (GROQ unavailable)",
            "sources": [],
            "Action": "Review insight and action accordingly"
            
        }
        return result

