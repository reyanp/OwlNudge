"""
Financial Data API endpoints
"""

from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Optional

from app.models.schemas import FinancialData, DemoScenario
from app.services.financial_simulator import (
    get_user_financial_data,
    update_user_goal_progress,
    simulate_transaction
)

router = APIRouter()

@router.get("/summary", response_model=FinancialData)
async def get_financial_summary():
    """Get user's financial summary"""
    data = await get_user_financial_data()
    return FinancialData(**data)

@router.post("/summary")
async def get_personalized_financial_summary(quiz_data: Dict = Body(...)):
    """Get user's financial summary personalized by quiz data"""
    data = await get_user_financial_data(quiz_data)
    return data

@router.get("/metrics")
async def get_financial_metrics():
    """Get financial metrics for dashboard"""
    data = await get_user_financial_data()
    
    # Calculate additional metrics
    savings_percentage = (data["savings_balance"] / data["total_balance"]) * 100 if data["total_balance"] > 0 else 0
    debt_to_income = (data["credit_card_debt"] / data["monthly_income"]) * 100 if data["monthly_income"] > 0 else 0
    
    return {
        "metrics": [
            {
                "title": "Total Balance",
                "value": data["total_balance"],
                "kind": "currency",
                "currency": "USD",
                "change": {"value": 12.5, "isPositive": True}
            },
            {
                "title": "Credit Score",
                "value": data["credit_score"],
                "kind": "number",
                "change": {"value": -8, "isPositive": False}
            },
            {
                "title": "Savings Rate",
                "value": data["savings_rate"] / 100,  # Convert to decimal for percent
                "kind": "percent",
                "change": {"value": 15, "isPositive": True}
            },
            {
                "title": "Investment Portfolio",
                "value": data["investment_balance"],
                "kind": "currency",
                "currency": "USD",
                "change": {"value": 3.2, "isPositive": True}
            }
        ],
        "summary": {
            "checking": data["checking_balance"],
            "savings": data["savings_balance"],
            "investments": data["investment_balance"],
            "debt": data["credit_card_debt"],
            "net_worth": data["total_balance"] - data["credit_card_debt"]
        }
    }

@router.post("/metrics")
async def get_personalized_financial_metrics(quiz_data: Dict = Body(...)):
    """Get financial metrics for dashboard, personalized by quiz data"""
    data = await get_user_financial_data(quiz_data)
    
    # Calculate additional metrics
    savings_percentage = (data["savings_balance"] / data["total_balance"]) * 100 if data["total_balance"] > 0 else 0
    debt_to_income = (data["credit_card_debt"] / data["monthly_income"]) * 100 if data["monthly_income"] > 0 else 0
    
    return {
        "metrics": [
            {
                "title": "Total Balance",
                "value": data["total_balance"],
                "kind": "currency",
                "currency": "USD",
                "change": {"value": 12.5, "isPositive": True}
            },
            {
                "title": "Credit Score",
                "value": data["credit_score"],
                "kind": "number",
                "change": {"value": -8, "isPositive": False}
            },
            {
                "title": "Savings Rate",
                "value": data["savings_rate"] / 100,  # Convert to decimal for percent
                "kind": "percent",
                "change": {"value": 15, "isPositive": True}
            },
            {
                "title": "Investment Portfolio",
                "value": data["investment_balance"],
                "kind": "currency",
                "currency": "USD",
                "change": {"value": 3.2, "isPositive": True}
            }
        ],
        "summary": {
            "checking": data["checking_balance"],
            "savings": data["savings_balance"],
            "investments": data["investment_balance"],
            "debt": data["credit_card_debt"],
            "net_worth": data["total_balance"] - data["credit_card_debt"]
        }
    }

@router.get("/transactions")
async def get_recent_transactions():
    """Get recent transactions"""
    data = await get_user_financial_data()
    return {
        "transactions": data["recent_transactions"],
        "count": len(data["recent_transactions"])
    }

@router.get("/goals")
async def get_financial_goals():
    """Get financial goals and progress"""
    data = await get_user_financial_data()
    return {
        "goals": data["goals"],
        "total_progress": sum(g["current"] for g in data["goals"]),
        "total_target": sum(g["target"] for g in data["goals"])
    }

@router.post("/goals/{goal_name}/contribute")
async def contribute_to_goal(goal_name: str, amount: float):
    """Contribute to a financial goal"""
    goal = await update_user_goal_progress(goal_name, amount)
    if not goal:
        raise HTTPException(status_code=404, detail=f"Goal '{goal_name}' not found")
    
    return {
        "status": "success",
        "goal": goal,
        "message": f"Added ${amount:.2f} to {goal_name}"
    }

@router.post("/simulate-transaction")
async def simulate_new_transaction():
    """Simulate a new transaction (for demo purposes)"""
    data = await get_user_financial_data()
    transaction = await simulate_transaction(data)
    
    return {
        "status": "success",
        "transaction": transaction,
        "new_balance": data["total_balance"]
    }