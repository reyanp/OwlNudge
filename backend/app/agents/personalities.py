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
                context += f"\nUser: {message}\n{self.name}:"
        
        context += f"\nUser: {message}\n{self.name}:"
        
        try:
            response = self.model.generate_content(context)
            return response.text.strip()
        except Exception as e:
            print(f"Error in chat for {self.name}: {e}")
            # Check if it's a quota error
            if "429" in str(e) or "quota" in str(e).lower():
                return self._get_fallback_response(message)
            return f"I apologize, but I'm having trouble processing that request. Could you please try again?"
    
    def _get_fallback_response(self, message: str) -> str:
        """Provide an intelligent fallback response based on agent personality"""
        message_lower = message.lower()
        
        # Sofia's fallback responses
        if self.agent_id == "sofia":
            if "credit" in message_lower:
                return """Building credit with limited income requires consistent, strategic steps. Start with a secured credit card - deposit what you can afford (even $200 works). Use it for one small monthly purchase and pay it off immediately. Keep your utilization below 30%, ideally under 10%. Set up autopay to never miss payments. Consider becoming an authorized user on a trusted family member's card. Most importantly, be patient - good credit takes time but these habits will get you there."""
            elif "budget" in message_lower:
                return """Budgeting on a tight income starts with the 50/30/20 rule adjusted to your reality - perhaps 70/20/10 if needed. Track every expense for one week to see where money goes. Use free apps like Mint or even a simple notebook. Pay yourself first - even $10 saved is progress. Look for small wins: cancel unused subscriptions, meal prep to reduce food costs, and use the envelope method for discretionary spending. Remember, a budget is a tool for freedom, not restriction."""
            elif "debt" in message_lower:
                return """Tackling debt on limited income requires a strategic approach. List all debts from smallest to largest. Make minimum payments on everything, then attack the smallest debt first (snowball method) for psychological wins. If interest rates are crushing you, consider the avalanche method instead - pay minimums plus extra on highest rate debt. Look into hardship programs with your creditors - many offer reduced payments or interest rates. Consider a side gig for extra debt payments, even $50/month extra makes a difference."""
            else:
                return """Financial stability starts with small, consistent steps. Focus on building an emergency fund (even $5/week helps), tracking your spending to find savings opportunities, and educating yourself with free resources. Set one achievable goal this month - whether it's saving $20, understanding your credit report, or creating a simple budget. Small wins build momentum toward bigger financial goals."""
        
        # Marcus's fallback responses
        elif self.agent_id == "marcus":
            if "invest" in message_lower or "portfolio" in message_lower:
                return """Starting to invest with limited funds is easier than ever. Begin with employer 401(k) matching - it's free money. No 401(k)? Open a Roth IRA and start with $25/month in a low-cost index fund (like VTSAX or VOO). Use apps like Fidelity or Vanguard that have no minimums. Consider fractional shares to own pieces of expensive stocks. Focus on time in market over timing the market. Even $10/week invested over 30 years can grow to significant wealth through compound interest."""
            elif "retirement" in message_lower:
                return """Retirement planning on a budget starts with understanding compound interest is your friend. If you're young, time is your biggest asset. Contribute to employer 401(k) up to the match first. Then open a Roth IRA - contributions grow tax-free. Can't afford much? Start with 1% of income and increase by 1% yearly. At age 25, $50/month can become $250,000 by retirement. Use target-date funds for simple, automatic diversification. Remember: starting small beats not starting at all."""
            elif "save" in message_lower or "emergency" in message_lower:
                return """Building savings requires automation and strategy. Start with a high-yield savings account (many offer 4-5% APY). Automate transfers - even $10/week adds up to $520/year. Use the 52-week challenge: save $1 week one, $2 week two, etc. Round-up apps can painlessly save spare change. Aim for $1,000 emergency fund first, then one month expenses, building to 3-6 months. Keep it separate from checking to reduce temptation. Tax refunds and windfalls go straight to savings."""
            else:
                return """Building wealth starts with understanding money fundamentals. Focus on increasing income (skills, side hustles) while controlling expenses. Learn about compound interest - it's the eighth wonder of the world. Start investing early, even small amounts. Understand the difference between assets (put money in your pocket) and liabilities (take money out). Read one finance book monthly - start with 'The Richest Man in Babylon' or 'A Random Walk Down Wall Street'. Knowledge compounds faster than money."""
        
        # Luna's fallback responses
        elif self.agent_id == "luna":
            if "spend" in message_lower or "impulse" in message_lower:
                return """Impulse spending often stems from emotional triggers - stress, boredom, or seeking happiness. Try the 24-hour rule: wait a day before any non-essential purchase. Create friction: unlink credit cards from online accounts, use cash envelopes, or freeze credit cards (literally, in ice!). When tempted, ask 'Am I buying this thing or the feeling?' Find free dopamine hits: nature walks, library visits, or calling friends. Track your triggers in a journal - awareness is the first step to change."""
            elif "stress" in message_lower or "anxiety" in message_lower:
                return """Financial anxiety is valid and common - you're not alone. Start with small, controllable actions: organize one financial document, save one dollar, or learn one new term. Practice the 5-4-3-2-1 grounding technique when money stress hits. Celebrate micro-wins - paying a bill on time deserves recognition! Reframe thoughts: instead of 'I'm bad with money,' try 'I'm learning about money.' Consider free financial counseling through non-profits. Remember: progress over perfection, always."""
            elif "habit" in message_lower or "change" in message_lower:
                return """Changing financial habits is about small, sustainable shifts. Start with one keystone habit - like checking your bank balance daily. Stack new habits onto existing ones: review spending while having morning coffee. Use implementation intentions: 'When I get paid, I will immediately transfer 10% to savings.' Make good choices easier (automate savings) and bad choices harder (leave credit cards at home). Track streaks - even 3 days of bringing lunch deserves celebration. Be kind to yourself during setbacks - they're part of the journey."""
            else:
                return """Your relationship with money reflects your values and experiences - there's no shame in struggling. Start by identifying one money story you tell yourself and gently question it. Practice gratitude for what you have while working toward goals. Use visualization: spend 2 minutes daily imagining your financially secure future self. Create positive money mantras: 'I make thoughtful financial choices' or 'Money flows to me easily.' Remember, emotional wealth (peace, security, confidence) is the real goal - money is just the tool."""
        
        # Generic fallback
        return "Based on your question, I recommend focusing on building strong financial fundamentals: budgeting, saving even small amounts regularly, and educating yourself about money management. Every journey starts with a single step."

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