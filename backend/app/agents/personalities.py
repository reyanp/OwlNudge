"""
Agent Personalities for FinancePal
Each agent has a distinct personality and focus area powered by Gemini
"""

import google.generativeai as genai
import os
from typing import Dict, List, Optional
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("⚠️ Warning: GEMINI_API_KEY not found in environment")
else:
    genai.configure(api_key=api_key)
    print(f"✅ Gemini configured with API key: {api_key[:10]}...")

class AgentPersonality:
    """Base class for agent personalities"""
    
    def __init__(self, agent_id: str, name: str, role: str, system_prompt: str):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    async def analyze_for_insights(self, financial_data: Dict) -> Optional[Dict]:
        """Analyze financial data for proactive insights"""
        prompt = f"""{self.system_prompt}

Current Date: {datetime.now().strftime("%Y-%m-%d")}

User's Financial Data:
- Total Balance: ${financial_data.get('total_balance', 0):,.2f}
- Monthly Income: ${financial_data.get('monthly_income', 0):,.2f}
- Monthly Expenses: ${financial_data.get('monthly_expenses', 0):,.2f}
- Savings Rate: {financial_data.get('savings_rate', 0):.1f}%
- Credit Score: {financial_data.get('credit_score', 0)}
- Investment Portfolio: ${financial_data.get('investment_balance', 0):,.2f}
- Recent Transactions: {json.dumps(financial_data.get('recent_transactions', [])[:5])}
- Financial Goals: {json.dumps(financial_data.get('goals', []))}

Based on this data, provide ONE proactive insight or alert that would be valuable for the user.
Format your response as JSON with these fields:
- type: "proactive" or "alert" or "achievement"
- title: Brief title (max 10 words)
- message: Detailed helpful message (2-3 sentences)
- priority: "low", "medium", or "high"
- action_required: true or false

Only provide an insight if it's genuinely valuable. If nothing significant, return null.
Your response must be valid JSON or null."""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Handle null response
            if result_text.lower() == "null" or not result_text:
                return None
                
            # Parse JSON response
            insight = json.loads(result_text)
            
            # Add agent metadata
            insight['agent_id'] = self.agent_id
            insight['agent_name'] = self.name
            insight['timestamp'] = datetime.now().isoformat()
            
            return insight
            
        except Exception as e:
            print(f"Error generating insight for {self.name}: {e}")
            return None
    
    async def chat(self, message: str, conversation_history: List[Dict] = None) -> str:
        """Chat with the user based on agent personality"""
        # Build conversation context
        context = self.system_prompt + "\n\nConversation History:\n"
        
        if conversation_history:
            for msg in conversation_history[-5:]:  # Last 5 messages for context
                role = "User" if msg['role'] == 'user' else self.name
                context += f"{role}: {msg['content']}\n"
        
        context += f"\nUser: {message}\n{self.name}:"
        
        try:
            response = self.model.generate_content(context)
            return response.text.strip()
        except Exception as e:
            print(f"Error in chat for {self.name}: {e}")
            return f"I apologize, but I'm having trouble processing that request. Could you please try again?"

# Define the three agent personalities
SOFIA = AgentPersonality(
    agent_id="sofia",
    name="Sofia",
    role="Financial Literacy Coach",
    system_prompt="""You are Sofia, a warm and encouraging Financial Literacy Coach. Your personality:
- Patient and understanding, especially with financial beginners
- Uses simple analogies to explain complex concepts
- Celebrates small wins and progress
- Focuses on building good financial habits
- Notices when users might not understand something

Your expertise:
- Credit score improvement
- Budgeting basics
- Understanding financial products
- Debt management strategies
- Financial goal setting

Communication style:
- Warm and encouraging
- Never condescending
- Uses everyday language
- Offers step-by-step guidance
- Always explains the "why" behind advice"""
)

MARCUS = AgentPersonality(
    agent_id="marcus",
    name="Marcus",
    role="Investment Educator",
    system_prompt="""You are Marcus, a knowledgeable but approachable Investment Educator. Your personality:
- Data-driven and analytical
- Excited about market opportunities
- Conservative with risk assessment
- Focuses on long-term wealth building
- Proactive about identifying investment opportunities

Your expertise:
- Investment strategy for beginners
- Portfolio diversification
- Risk assessment
- Market analysis (simplified)
- Retirement planning
- Tax-efficient investing basics

Communication style:
- Professional but friendly
- Uses data to support points
- Explains risk clearly
- Focuses on education over advice
- Matches investment suggestions to user's risk profile"""
)

LUNA = AgentPersonality(
    agent_id="luna",
    name="Luna",
    role="Behavioral Coach",
    system_prompt="""You are Luna, an empathetic and insightful Behavioral Coach. Your personality:
- Emotionally intelligent and observant
- Non-judgmental and supportive
- Focuses on the psychology of money
- Celebrates behavioral improvements
- Notices spending patterns and habits

Your expertise:
- Spending behavior analysis
- Emotional spending triggers
- Building sustainable habits
- Mindful money management
- Stress-free budgeting
- Behavioral change techniques

Communication style:
- Empathetic and understanding
- Focuses on feelings and motivations
- Offers gentle nudges, not harsh criticism
- Celebrates progress over perfection
- Uses positive reinforcement"""
)

# Agent registry
AGENTS = {
    "sofia": SOFIA,
    "marcus": MARCUS,
    "luna": LUNA
}

def get_agent(agent_id: str) -> AgentPersonality:
    """Get an agent by ID"""
    return AGENTS.get(agent_id)