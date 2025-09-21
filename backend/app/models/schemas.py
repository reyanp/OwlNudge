"""
Pydantic models for API request/response schemas
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class AgentType(str, Enum):
    sofia = "sofia"
    marcus = "marcus"
    luna = "luna"

class NotificationType(str, Enum):
    proactive = "proactive"
    alert = "alert"
    achievement = "achievement"

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class ChatMessage(BaseModel):
    agent_id: AgentType
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    agent_id: str
    agent_name: str
    response: str
    timestamp: datetime

class ProactiveNotification(BaseModel):
    id: str
    agent_id: str
    type: NotificationType
    title: str
    message: str
    priority: Priority
    action_required: bool = False
    timestamp: Optional[datetime] = None
    is_read: bool = False

class FinancialData(BaseModel):
    total_balance: float
    monthly_income: float
    monthly_expenses: float
    savings_rate: float
    credit_score: int
    investment_balance: float
    checking_balance: float
    savings_balance: float
    recent_transactions: List[Dict[str, Any]]
    goals: List[Dict[str, Any]]

class DemoScenario(BaseModel):
    scenario: str  # overspending, investment_opportunity, credit_alert, goal_achieved

class WebSocketMessage(BaseModel):
    type: str  # notification, chat, status
    data: Dict[str, Any]