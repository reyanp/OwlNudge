"""
Chat API endpoints for agent conversations
"""

from fastapi import APIRouter, HTTPException, Body
from datetime import datetime
from typing import List, Dict

from app.models.schemas import ChatMessage, ChatResponse
from app.agents.personalities import get_agent
from app.services.financial_simulator import get_user_financial_data

router = APIRouter()

# Store conversation history (in production, use a database)
conversation_history: Dict[str, List[Dict]] = {}

@router.post("/", response_model=ChatResponse)
async def chat_with_agent(message: ChatMessage):
    """Chat with a specific agent"""
    agent = get_agent(message.agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {message.agent_id} not found")
    
    # Get or create conversation history for this agent
    history_key = f"demo_user_{message.agent_id}"
    if history_key not in conversation_history:
        conversation_history[history_key] = []
    
    # Add user message to history
    conversation_history[history_key].append({
        "role": "user",
        "content": message.message,
        "timestamp": datetime.now().isoformat()
    })
    
    try:
        # Get response from agent
        response_text = await agent.chat(
            message.message,
            conversation_history[history_key]
        )
        
        # Add agent response to history
        conversation_history[history_key].append({
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only last 20 messages
        conversation_history[history_key] = conversation_history[history_key][-20:]
        
        return ChatResponse(
            agent_id=agent.agent_id,
            agent_name=agent.name,
            response=response_text,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail="Failed to get response from agent")

@router.get("/history/{agent_id}")
async def get_chat_history(agent_id: str):
    """Get conversation history with a specific agent"""
    history_key = f"demo_user_{agent_id}"
    history = conversation_history.get(history_key, [])
    
    return {
        "agent_id": agent_id,
        "history": history,
        "message_count": len(history)
    }

@router.post("/suggestion/{agent_id}")
async def get_instant_suggestion(agent_id: str, quiz_data: Dict = Body(...)):
    """Get an instant personalized suggestion when user opens chat"""
    agent = get_agent(agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    
    try:
        # Get personalized financial data
        financial_data = await get_user_financial_data(quiz_data)
        
        # Create a personalized prompt for instant suggestion
        suggestion_prompt = f"""Based on the user's profile and financial situation, provide ONE immediate, actionable suggestion that would be most helpful for them right now.
        
User Profile:
- Age: {quiz_data.get('age', 'Not specified')}
- Income: {quiz_data.get('income', 'Not specified')}
- Primary Goal: {quiz_data.get('primaryGoal', 'Not specified')}
- Risk Tolerance: {quiz_data.get('riskTolerance', 'Not specified')}
- Banking Access: {quiz_data.get('bankAccess', 'Not specified')}
- Profession: {quiz_data.get('profession', 'Not specified')}
- Immigration Status: {quiz_data.get('immigrantStatus', 'Not specified')}
- Savings Level: {quiz_data.get('savings', 'Not specified')}

Financial Data:
- Total Balance: ${financial_data.get('total_balance', 0):,.2f}
- Monthly Income: ${financial_data.get('monthly_income', 0):,.2f}
- Credit Score: {financial_data.get('credit_score', 0)}
- Savings Rate: {financial_data.get('savings_rate', 0):.1f}%
- Investment Portfolio: ${financial_data.get('investment_balance', 0):,.2f}

Provide a warm, personalized suggestion that:
1. Acknowledges their specific situation
2. Offers one concrete action they can take this week
3. Explains why this action is important for their goals
4. Matches your personality as {agent.name} ({agent.role})

Keep it conversational, encouraging, and under 150 words."""
        
        # Get suggestion from agent
        suggestion = await agent.chat(suggestion_prompt, [])
        
        return {
            "agent_id": agent.agent_id,
            "agent_name": agent.name,
            "suggestion": suggestion,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error generating suggestion for {agent_id}: {e}")
        
        # Fallback suggestions based on agent and quiz data
        fallback_suggestions = {
            "sofia": {
                "emergency-fund": "Hi! I see you want to build an emergency fund. Start small this week - even saving $10 can create momentum. Would you like me to help you create a simple savings plan?",
                "pay-debt": "Let's tackle your debt together! The first step is listing all your debts. I can help you create a payoff strategy that fits your budget. Ready to start?",
                "student": "As a student, you're ahead of the game by thinking about finances early! Let's start with building credit history - I can show you safe ways to do this.",
                "no-bank-account": "I understand banking can be challenging. There are several ways to build financial stability without traditional banks. Want to explore your options?",
                "default": "Welcome! I'm here to help you build financial literacy step by step. What's your biggest money question right now?"
            },
            "marcus": {
                "invest": "Great choice focusing on investing! Even with $25/month, you can start building wealth. Let me show you the simplest way to begin your investment journey.",
                "retirement": "Retirement planning is smart at any age! Time is your biggest advantage. Want me to calculate how small contributions now can grow into significant wealth?",
                "aggressive": "I love your appetite for growth! Let's make sure you understand the risks and rewards. I can help you build a balanced aggressive strategy.",
                "gig-worker": "Irregular income makes investing tricky but not impossible! I can show you flexible investment strategies that work with your lifestyle.",
                "default": "Hello! I help people understand investing and wealth building. Even if you're starting small, I can show you how to make your money work for you."
            },
            "luna": {
                "save-home": "Saving for a home requires changing daily habits, but it's totally doable! I can help you identify small changes that add up to big savings.",
                "student": "College is expensive, but building good money habits now will serve you forever. Want to explore some stress-free budgeting techniques?",
                "under-50k": "Every dollar counts when money is tight. I can help you find small wins that build confidence and momentum. What's your biggest spending challenge?",
                "immigrant": "Managing money in a new country can feel overwhelming. I'm here to help you build confidence and understand American financial habits.",
                "default": "Hi! I focus on the emotional side of money - building healthy habits and overcoming mental barriers. What money habit would you most like to change?"
            }
        }
        
        # Select appropriate fallback
        agent_fallbacks = fallback_suggestions.get(agent_id, fallback_suggestions["sofia"])
        
        # Try to match with user's situation
        if quiz_data.get('primaryGoal') in agent_fallbacks:
            suggestion = agent_fallbacks[quiz_data['primaryGoal']]
        elif quiz_data.get('profession') in agent_fallbacks:
            suggestion = agent_fallbacks[quiz_data['profession']]
        elif quiz_data.get('income') in agent_fallbacks:
            suggestion = agent_fallbacks[quiz_data['income']]
        elif quiz_data.get('bankAccess') in agent_fallbacks:
            suggestion = agent_fallbacks[quiz_data['bankAccess']]
        elif quiz_data.get('immigrantStatus') and 'immigrant' in agent_fallbacks:
            suggestion = agent_fallbacks['immigrant']
        else:
            suggestion = agent_fallbacks['default']
        
        return {
            "agent_id": agent.agent_id,
            "agent_name": agent.name,
            "suggestion": suggestion,
            "timestamp": datetime.now().isoformat(),
            "fallback": True
        }

@router.delete("/history/{agent_id}")
async def clear_chat_history(agent_id: str):
    """Clear conversation history with a specific agent"""
    history_key = f"demo_user_{agent_id}"
    if history_key in conversation_history:
        del conversation_history[history_key]
    
    return {"status": "success", "message": f"Chat history cleared for {agent_id}"}

@router.delete("/history")
async def clear_all_chat_history():
    """Clear all conversation history (useful when switching profiles)"""
    conversation_history.clear()
    
    return {"status": "success", "message": "All chat history cleared"}
