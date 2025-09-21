"""
Financial Data Simulator
Generates realistic financial data for demo purposes
"""

import random
from datetime import datetime, timedelta
from typing import Dict, List

# Mock user financial data
USER_DATA = {
    "user_id": "demo_user",
    "name": "Alex",
    "total_balance": 24563.00,
    "monthly_income": 5500.00,
    "monthly_expenses": 4200.00,
    "savings_rate": 23.6,
    "credit_score": 742,
    "investment_balance": 8420.00,
    "checking_balance": 3200.00,
    "savings_balance": 12943.00,
    "credit_card_debt": 1850.00,
    "credit_limit": 10000.00,
    "recent_transactions": [],
    "goals": [
        {"name": "Emergency Fund", "target": 10000, "current": 8500, "completed": False},
        {"name": "Vacation", "target": 3000, "current": 1200, "completed": False},
        {"name": "New Car Down Payment", "target": 5000, "current": 2100, "completed": False}
    ]
}

# Transaction templates
TRANSACTION_TEMPLATES = [
    # Positive (income)
    {"merchant": "Direct Deposit", "amount": 2750, "category": "Income"},
    {"merchant": "Freelance Payment", "amount": 500, "category": "Income"},
    
    # Negative (expenses)
    {"merchant": "Starbucks", "amount": -6.45, "category": "Dining"},
    {"merchant": "Whole Foods", "amount": -127.89, "category": "Groceries"},
    {"merchant": "Netflix", "amount": -15.99, "category": "Entertainment"},
    {"merchant": "Spotify", "amount": -9.99, "category": "Entertainment"},
    {"merchant": "Gas Station", "amount": -45.00, "category": "Transportation"},
    {"merchant": "Amazon", "amount": -67.23, "category": "Shopping"},
    {"merchant": "Target", "amount": -89.45, "category": "Shopping"},
    {"merchant": "Restaurant", "amount": -45.67, "category": "Dining"},
    {"merchant": "Uber", "amount": -23.45, "category": "Transportation"},
    {"merchant": "Electric Bill", "amount": -120.00, "category": "Bills"},
    {"merchant": "Internet", "amount": -60.00, "category": "Bills"},
    {"merchant": "Gym", "amount": -35.00, "category": "Health"},
]

async def get_user_financial_data() -> Dict:
    """Get current user financial data"""
    # Generate some recent transactions if empty
    if not USER_DATA["recent_transactions"]:
        USER_DATA["recent_transactions"] = generate_recent_transactions()
    
    return USER_DATA.copy()

async def simulate_transaction(data: Dict):
    """Simulate a new transaction"""
    transaction = random.choice(TRANSACTION_TEMPLATES).copy()
    transaction["date"] = datetime.now().isoformat()
    transaction["id"] = f"txn_{random.randint(1000, 9999)}"
    
    # Add some randomness to amount
    if transaction["amount"] < 0:
        transaction["amount"] *= random.uniform(0.8, 1.2)
    
    # Update balances
    if transaction["amount"] > 0:
        data["total_balance"] += transaction["amount"]
        data["checking_balance"] += transaction["amount"]
    else:
        data["total_balance"] += transaction["amount"]
        data["checking_balance"] += transaction["amount"]
        data["monthly_expenses"] += abs(transaction["amount"])
    
    # Add to recent transactions
    data["recent_transactions"].insert(0, transaction)
    data["recent_transactions"] = data["recent_transactions"][:20]  # Keep last 20
    
    # Update global data
    USER_DATA.update(data)
    
    return transaction

def generate_recent_transactions() -> List[Dict]:
    """Generate a list of recent transactions"""
    transactions = []
    
    for i in range(15):
        template = random.choice(TRANSACTION_TEMPLATES)
        transaction = template.copy()
        
        # Add date (going back in time)
        date = datetime.now() - timedelta(days=i, hours=random.randint(0, 23))
        transaction["date"] = date.isoformat()
        transaction["id"] = f"txn_{random.randint(1000, 9999)}"
        
        # Add some randomness to amount
        if transaction["amount"] < 0:
            transaction["amount"] *= random.uniform(0.8, 1.5)
            transaction["amount"] = round(transaction["amount"], 2)
        
        transactions.append(transaction)
    
    return transactions

async def update_user_goal_progress(goal_name: str, amount: float):
    """Update progress on a financial goal"""
    for goal in USER_DATA["goals"]:
        if goal["name"] == goal_name:
            goal["current"] = min(goal["current"] + amount, goal["target"])
            if goal["current"] >= goal["target"]:
                goal["completed"] = True
            return goal
    return None