"""
Financial Data Simulator
Generates realistic financial data for demo purposes
"""

import random
from datetime import datetime, timedelta
from typing import Dict, List

# Default user financial data - will be personalized based on quiz
DEFAULT_USER_DATA = {
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

# Store personalized data per user
USER_DATA = DEFAULT_USER_DATA.copy()

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

def personalize_financial_data(quiz_data: Dict) -> None:
    """Personalize financial data based on quiz responses"""
    global USER_DATA
    
    # Reset to default
    USER_DATA = DEFAULT_USER_DATA.copy()
    
    # Adjust based on income level
    if quiz_data.get('income') == 'under-50k':
        USER_DATA['monthly_income'] = 3200.00
        USER_DATA['total_balance'] = 8500.00
        USER_DATA['savings_balance'] = 3200.00
        USER_DATA['checking_balance'] = 1800.00
        USER_DATA['investment_balance'] = 3500.00
        USER_DATA['credit_score'] = 680
        USER_DATA['credit_card_debt'] = 2800.00
    elif quiz_data.get('income') == '50k-100k':
        USER_DATA['monthly_income'] = 5500.00
        USER_DATA['total_balance'] = 24563.00
        USER_DATA['savings_balance'] = 12943.00
        USER_DATA['checking_balance'] = 3200.00
        USER_DATA['investment_balance'] = 8420.00
        USER_DATA['credit_score'] = 742
        USER_DATA['credit_card_debt'] = 1850.00
    elif quiz_data.get('income') == '100k-150k':
        USER_DATA['monthly_income'] = 9200.00
        USER_DATA['total_balance'] = 45000.00
        USER_DATA['savings_balance'] = 22000.00
        USER_DATA['checking_balance'] = 5000.00
        USER_DATA['investment_balance'] = 18000.00
        USER_DATA['credit_score'] = 780
        USER_DATA['credit_card_debt'] = 1200.00
    elif quiz_data.get('income') == 'over-150k':
        USER_DATA['monthly_income'] = 15000.00
        USER_DATA['total_balance'] = 85000.00
        USER_DATA['savings_balance'] = 35000.00
        USER_DATA['checking_balance'] = 8000.00
        USER_DATA['investment_balance'] = 42000.00
        USER_DATA['credit_score'] = 820
        USER_DATA['credit_card_debt'] = 800.00
    
    # Adjust based on savings level
    if quiz_data.get('savings') == 'under-5k':
        USER_DATA['savings_balance'] = min(USER_DATA['savings_balance'], 3000)
        USER_DATA['total_balance'] = USER_DATA['checking_balance'] + USER_DATA['savings_balance'] + USER_DATA['investment_balance']
    elif quiz_data.get('savings') == '5k-25k':
        USER_DATA['savings_balance'] = min(max(USER_DATA['savings_balance'], 5000), 25000)
    elif quiz_data.get('savings') == '25k-50k':
        USER_DATA['savings_balance'] = min(max(USER_DATA['savings_balance'], 25000), 50000)
    elif quiz_data.get('savings') == 'over-50k':
        USER_DATA['savings_balance'] = max(USER_DATA['savings_balance'], 50000)
    
    # Adjust goals based on primary goal
    primary_goal = quiz_data.get('primaryGoal')
    if primary_goal == 'emergency-fund':
        USER_DATA['goals'] = [
            {"name": "Emergency Fund", "target": 15000, "current": min(USER_DATA['savings_balance'] * 0.6, 8500), "completed": False},
            {"name": "Short-term Savings", "target": 5000, "current": 2100, "completed": False}
        ]
    elif primary_goal == 'pay-debt':
        # Higher debt for debt-focused users
        USER_DATA['credit_card_debt'] = max(USER_DATA['credit_card_debt'], 3500)
        USER_DATA['goals'] = [
            {"name": "Pay Off Credit Cards", "target": USER_DATA['credit_card_debt'], "current": 0, "completed": False},
            {"name": "Emergency Fund", "target": 5000, "current": 1200, "completed": False}
        ]
    elif primary_goal == 'save-home':
        USER_DATA['goals'] = [
            {"name": "Home Down Payment", "target": 50000, "current": min(USER_DATA['savings_balance'] * 0.4, 15000), "completed": False},
            {"name": "Closing Costs", "target": 8000, "current": 2500, "completed": False}
        ]
    elif primary_goal == 'retirement':
        USER_DATA['goals'] = [
            {"name": "401(k) Contribution", "target": 20000, "current": 12000, "completed": False},
            {"name": "IRA Maxing", "target": 6500, "current": 3200, "completed": False}
        ]
    elif primary_goal == 'invest':
        # Higher investment balance for investment-focused users
        USER_DATA['investment_balance'] = max(USER_DATA['investment_balance'], USER_DATA['total_balance'] * 0.4)
        USER_DATA['goals'] = [
            {"name": "Investment Portfolio Growth", "target": 25000, "current": USER_DATA['investment_balance'], "completed": False},
            {"name": "Diversified Holdings", "target": 10000, "current": 6500, "completed": False}
        ]
    
    # Adjust risk-based metrics
    if quiz_data.get('riskTolerance') == 'conservative':
        USER_DATA['investment_balance'] = min(USER_DATA['investment_balance'], USER_DATA['total_balance'] * 0.2)
        USER_DATA['savings_balance'] = max(USER_DATA['savings_balance'], USER_DATA['total_balance'] * 0.6)
    elif quiz_data.get('riskTolerance') == 'aggressive':
        USER_DATA['investment_balance'] = max(USER_DATA['investment_balance'], USER_DATA['total_balance'] * 0.5)
        USER_DATA['savings_balance'] = min(USER_DATA['savings_balance'], USER_DATA['total_balance'] * 0.3)
    
    # Recalculate total balance
    USER_DATA['total_balance'] = USER_DATA['checking_balance'] + USER_DATA['savings_balance'] + USER_DATA['investment_balance']
    
    # Ensure realistic monthly expenses first
    if quiz_data.get('income') == 'under-50k':
        USER_DATA['monthly_expenses'] = USER_DATA['monthly_income'] * 0.85  # 85% expense ratio for lower income
    elif quiz_data.get('income') == 'over-150k':
        USER_DATA['monthly_expenses'] = USER_DATA['monthly_income'] * 0.60  # 60% expense ratio for higher income
    else:
        USER_DATA['monthly_expenses'] = USER_DATA['monthly_income'] * 0.76  # 76% expense ratio for middle income
    
    # Calculate realistic savings rate
    if USER_DATA['monthly_income'] > 0:
        monthly_savings = USER_DATA['monthly_income'] - USER_DATA['monthly_expenses']
        USER_DATA['savings_rate'] = (monthly_savings / USER_DATA['monthly_income']) * 100
        USER_DATA['savings_rate'] = max(5, min(USER_DATA['savings_rate'], 40))  # Cap between 5-40%


async def get_user_financial_data(quiz_data: Dict = None) -> Dict:
    """Get current user financial data, personalized by quiz if provided"""
    
    # Personalize data if quiz data is provided
    if quiz_data:
        personalize_financial_data(quiz_data)
    
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