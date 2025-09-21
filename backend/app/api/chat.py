"""
Chat API endpoints for agent conversations
"""

from fastapi import APIRouter, HTTPException
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

@router.delete("/history/{agent_id}")
async def clear_chat_history(agent_id: str):
    """Clear conversation history with a specific agent"""
    history_key = f"demo_user_{agent_id}"
    if history_key in conversation_history:
        del conversation_history[history_key]
    
    return {"status": "success", "message": f"Chat history cleared for {agent_id}"}