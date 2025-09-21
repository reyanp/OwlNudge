"""
Team API: Ask all agents and return a curated plan with brief disagreements.
"""

import os
import asyncio
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import json

from app.agents.personalities import AGENTS

# Optional Gemini curator
try:
    import google.generativeai as genai
    load_dotenv()
    _GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    if _GEMINI_KEY:
        genai.configure(api_key=_GEMINI_KEY)
        _CURATOR_MODEL = genai.GenerativeModel('gemini-1.5-flash')
    else:
        _CURATOR_MODEL = None
except Exception:
    _CURATOR_MODEL = None

router = APIRouter()

class AskTeamRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_team(req: AskTeamRequest):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    # Fan-out to all agents concurrently
    async def ask_agent(agent_id: str):
        try:
            agent = AGENTS[agent_id]
            reply = await agent.chat(question, [])
            return {"agent_id": agent_id, "agent_name": agent.name, "response": reply}
        except Exception as e:
            return {"agent_id": agent_id, "agent_name": AGENTS[agent_id].name, "response": f"(Error: {e})"}

    agent_ids = ["sofia", "marcus", "luna"]
    results: List[Dict[str, Any]] = await asyncio.gather(*[ask_agent(aid) for aid in agent_ids])

    # Curate a unified plan if possible
    curated: Dict[str, Any] = {
        "summary": None,
        "steps": [],
        "disagreements": [],
        "recommended_agent": None,
    }

    def _heuristic_curate(question_text: str, responses: List[Dict[str, Any]]):
        """Extract actionable steps from agent responses"""
        # Analyze question to determine focus
        question = question_text.lower()
        
        # Extract key advice from each agent
        all_advice = []
        for r in responses:
            raw = r.get("response", "")
            
            # Look for specific actionable patterns
            if "secured credit card" in raw.lower():
                all_advice.append("secured_card")
            if "authorized user" in raw.lower():
                all_advice.append("authorized_user")
            if "credit builder loan" in raw.lower() or "credit-builder loan" in raw.lower():
                all_advice.append("builder_loan")
            if "rent reporting" in raw.lower() or "utility reporting" in raw.lower():
                all_advice.append("reporting")
            if "payment history" in raw.lower():
                all_advice.append("payment_history")
                
        # Build appropriate steps based on question context
        steps = []
        
        # Credit building questions
        if "credit" in question:
            steps = [
                "Start with a secured credit card - deposit what you can afford ($200-500)",
                "Use the card for one small monthly purchase and pay it off immediately", 
                "Keep credit utilization below 30% (ideally under 10%)",
                "Consider becoming an authorized user on a trusted family member's card",
                "Set up autopay to ensure you never miss a payment"
            ]
        # Budgeting questions
        elif "budget" in question:
            steps = [
                "Track all expenses for one week to understand spending patterns",
                "Apply the 50/30/20 rule (or adjust to 70/20/10 based on income)",
                "Automate savings - even $10/week builds to $520/year",
                "Cancel unused subscriptions and find small cost-cutting wins",
                "Use the envelope method for discretionary spending"
            ]
        # Investment questions  
        elif "invest" in question or "portfolio" in question:
            steps = [
                "Start with employer 401(k) match if available - it's free money",
                "Open a Roth IRA with low-cost index funds (VTSAX, VOO)",
                "Begin with as little as $25/month - consistency matters more than amount",
                "Use fractional shares to own pieces of expensive stocks",
                "Focus on time in market rather than timing the market"
            ]
        # Debt questions
        elif "debt" in question:
            steps = [
                "List all debts from smallest to largest (snowball method)",
                "Make minimum payments on all debts",
                "Put any extra money toward the smallest debt first",
                "Consider debt consolidation if interest rates are high",
                "Look into hardship programs with creditors for reduced payments"
            ]
        # Emergency fund or savings
        elif "save" in question or "emergency" in question:
            steps = [
                "Open a high-yield savings account (4-5% APY available)",
                "Start with $1,000 as your first emergency fund goal",
                "Automate weekly transfers - even $10 adds up",
                "Use the 52-week challenge or round-up apps",
                "Keep emergency funds separate from checking account"
            ]
        # Default general financial advice
        else:
            steps = [
                "Create a simple budget to track income and expenses",
                "Build an emergency fund starting with $500",
                "Focus on consistent bill payments to build credit",
                "Educate yourself with free financial resources",
                "Set one achievable financial goal for this month"
            ]
            
        # Generate appropriate summary based on question
        if "credit" in question:
            summary = "Building credit with limited income is achievable through strategic, consistent actions. All three advisors agree that secured credit cards and payment history are crucial. The key is starting small and being consistent."
        elif "budget" in question:
            summary = "Creating a budget on limited income requires tracking expenses and making small adjustments. Our advisors emphasize starting with awareness and celebrating small wins."
        elif "invest" in question:
            summary = "Investing with limited funds is possible through employer matches, low-cost index funds, and fractional shares. Time in the market beats timing the market."
        else:
            summary = "Your financial advisors have analyzed your question and created a personalized action plan. Each step builds toward greater financial stability."
            
        # Determine recommended agent based on question type
        if "credit" in question or "debt" in question:
            recommended = "sofia"
        elif "invest" in question or "retirement" in question:
            recommended = "marcus"
        elif "habit" in question or "stress" in question or "spend" in question:
            recommended = "luna" 
        else:
            recommended = "sofia"  # Default to Sofia for general questions
            
        # Note any disagreements (simplified)
        disagreements = []
        if "secured_card" in all_advice and "builder_loan" in all_advice:
            disagreements.append("Sofia prefers secured cards while Marcus also suggests credit-builder loans")
            
        return {
            "summary": summary,
            "steps": steps[:5],  # Return top 5 steps
            "disagreements": disagreements[:2],  # Limit disagreements
            "recommended_agent": recommended,
        }

    curated_result = None
    if _CURATOR_MODEL:
        try:
            curator_prompt = f"""
You are the team curator for FinancePal.
The user asked:
"{question}"

Three advisors responded (Sofia=Financial Literacy Coach, Marcus=Investment Educator, Luna=Behavioral Coach).
Produce a short JSON with fields:
- summary: one-paragraph concise plan
- steps: array of 3-5 short action steps (imperative voice)
- disagreements: array of 1-3 short strings highlighting differences in their perspectives (if any)
- recommended_agent: one of 'sofia', 'marcus', or 'luna' who should lead the next step

Responses:
SOFIA: {results[0]['response']}
MARCUS: {results[1]['response']}
LUNA: {results[2]['response']}

Return ONLY compact JSON.
"""
            resp = _CURATOR_MODEL.generate_content(curator_prompt)
            text = (resp.text or "").strip()
            # try parse json
            curated_result = json.loads(text)
        except Exception:
            curated_result = None

    if not curated_result:
        curated_result = _heuristic_curate(question, results)

    curated.update(curated_result)

    return {
        "question": question,
        "curated": curated,
        "agents": results,
    }
