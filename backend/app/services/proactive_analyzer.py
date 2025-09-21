"""
Proactive Analyzer Service
Periodically analyzes user financial data and generates proactive insights
"""

import asyncio
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid
import os

from app.agents.personalities import AGENTS
from app.services.websocket_manager import ConnectionManager
from app.services.financial_simulator import get_user_financial_data, simulate_transaction

class ProactiveAnalyzer:
    """Analyzes financial data and generates proactive insights"""
    
    def __init__(self, connection_manager: ConnectionManager):
        self.connection_manager = connection_manager
        self.running = False
        self.analysis_interval = int(os.getenv("ANALYSIS_INTERVAL", 30))
        
        # Track last analysis time for each agent
        self.last_agent_analysis = {
            "sofia": datetime.now() - timedelta(minutes=10),
            "marcus": datetime.now() - timedelta(minutes=15),
            "luna": datetime.now() - timedelta(minutes=5)
        }
        
    async def start(self):
        """Start the proactive analysis loop"""
        self.running = True
        print(f"🤖 Proactive Analyzer started (interval: {self.analysis_interval}s)")
        
        while self.running:
            try:
                await self._analyze_and_notify()
                await asyncio.sleep(self.analysis_interval)
            except Exception as e:
                print(f"Error in proactive analysis: {e}")
                await asyncio.sleep(5)  # Wait before retrying
    
    async def stop(self):
        """Stop the proactive analysis loop"""
        self.running = False
        print("🛑 Proactive Analyzer stopped")
    
    async def _analyze_and_notify(self):
        """Perform analysis and send notifications"""
        # Get current financial data (mock for now)
        financial_data = await get_user_financial_data()
        
        # Randomly simulate a transaction to create dynamic data
        if random.random() < 0.3:  # 30% chance
            await simulate_transaction(financial_data)
        
        # Determine which agent should analyze (rotate through them)
        current_time = datetime.now()
        
        # Find agent that hasn't analyzed recently
        for agent_id, last_time in self.last_agent_analysis.items():
            time_since_last = (current_time - last_time).total_seconds()
            
            # Each agent checks at different intervals
            agent_intervals = {
                "sofia": 60,    # Sofia checks every minute (credit/budget focused)
                "marcus": 90,   # Marcus checks every 1.5 minutes (investment focused)
                "luna": 45      # Luna checks every 45 seconds (behavior focused)
            }
            
            if time_since_last > agent_intervals.get(agent_id, 60):
                agent = AGENTS[agent_id]
                
                # Generate insight
                insight = await agent.analyze_for_insights(financial_data)
                
                if insight:
                    # Create notification
                    notification = {
                        "id": str(uuid.uuid4()),
                        "agentId": insight['agent_id'],
                        "type": insight['type'],
                        "title": insight['title'],
                        "message": insight['message'],
                        "timestamp": datetime.now().isoformat(),
                        "isRead": False,
                        "priority": insight['priority'],
                        "actionRequired": insight.get('action_required', False)
                    }
                    
                    # Send to all connected clients
                    await self.connection_manager.broadcast({
                        "type": "notification",
                        "data": notification
                    })
                    
                    print(f"📢 {agent.name} sent insight: {insight['title']}")
                    
                # Update last analysis time
                self.last_agent_analysis[agent_id] = current_time
                
                # Only one agent per cycle to avoid overwhelming
                break
    
    async def trigger_demo_scenarios(self, scenario: str):
        """Trigger specific demo scenarios for hackathon presentation"""
        financial_data = await get_user_financial_data()
        
        scenarios = {
            "overspending": {
                "agent_id": "luna",
                "data_override": {
                    "monthly_expenses": financial_data["monthly_income"] * 1.2,
                    "recent_transactions": [
                        {"merchant": "Amazon", "amount": -347.89, "category": "Shopping"},
                        {"merchant": "Best Buy", "amount": -599.99, "category": "Electronics"},
                        {"merchant": "Target", "amount": -156.32, "category": "Shopping"}
                    ]
                }
            },
            "investment_opportunity": {
                "agent_id": "marcus",
                "data_override": {
                    "total_balance": 15000,
                    "investment_balance": 2000,
                    "savings_rate": 25
                }
            },
            "credit_alert": {
                "agent_id": "sofia",
                "data_override": {
                    "credit_score": 680,
                    "recent_transactions": [
                        {"merchant": "Credit Card Payment", "amount": -50, "category": "Bills"}
                    ]
                }
            },
            "goal_achieved": {
                "agent_id": "luna",
                "data_override": {
                    "goals": [
                        {"name": "Emergency Fund", "target": 5000, "current": 5000, "completed": True}
                    ]
                }
            }
        }
        
        if scenario in scenarios:
            config = scenarios[scenario]
            agent = AGENTS[config["agent_id"]]
            
            # Merge override data
            demo_data = {**financial_data, **config["data_override"]}
            
            # Generate insight
            insight = await agent.analyze_for_insights(demo_data)
            
            if insight:
                # Force specific message for demo
                if scenario == "overspending":
                    insight["title"] = "Overspending Alert!"
                    insight["message"] = "You've exceeded your monthly budget by 20%. I noticed several large shopping purchases. Let's review your spending triggers together."
                    insight["priority"] = "high"
                    insight["type"] = "alert"
                elif scenario == "investment_opportunity":
                    insight["title"] = "Investment Opportunity"
                    insight["message"] = "You have $13,000 in savings earning minimal interest. Based on your risk profile, I found 3 conservative investment options that could grow your wealth."
                    insight["priority"] = "medium"
                elif scenario == "credit_alert":
                    insight["title"] = "Credit Score Improvement"
                    insight["message"] = "Your credit utilization is high at 45%. Paying down $500 on your cards could boost your score by 15-20 points."
                    insight["priority"] = "medium"
                elif scenario == "goal_achieved":
                    insight["title"] = "Goal Achieved! 🎉"
                    insight["message"] = "Congratulations! You've completed your Emergency Fund goal of $5,000. This is a huge milestone for your financial security!"
                    insight["type"] = "achievement"
                    insight["priority"] = "low"
                
                # Create and send notification
                notification = {
                    "id": str(uuid.uuid4()),
                    "agentId": insight['agent_id'],
                    "type": insight['type'],
                    "title": insight['title'],
                    "message": insight['message'],
                    "timestamp": datetime.now().isoformat(),
                    "isRead": False,
                    "priority": insight['priority'],
                    "actionRequired": insight.get('action_required', True)
                }
                
                await self.connection_manager.broadcast({
                    "type": "notification",
                    "data": notification
                })
                
                print(f"🎯 Demo scenario '{scenario}' triggered by {agent.name}")
                return notification
        
        return None