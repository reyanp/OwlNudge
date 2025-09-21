"""
FinancePal Backend - Proactive AI Financial Advisory
Uses Google Gemini for intelligent, personalized financial insights
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import os
from dotenv import load_dotenv
from typing import List
import json

from app.db.database import init_db
from app.services.websocket_manager import ConnectionManager
from app.services.proactive_analyzer import ProactiveAnalyzer
from app.api import chat, auth, financial_data
from app.models.schemas import ProactiveNotification

load_dotenv()

# WebSocket connection manager
manager = ConnectionManager()

# Proactive analyzer instance
analyzer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    # Startup
    print("🚀 Starting FinancePal Backend...")
    
    # Initialize database
    await init_db()
    
    # Start proactive analyzer
    global analyzer
    analyzer = ProactiveAnalyzer(manager)
    asyncio.create_task(analyzer.start())
    
    print("✅ Backend ready!")
    
    yield
    
    # Shutdown
    if analyzer:
        await analyzer.stop()
    print("👋 Backend stopped")

app = FastAPI(
    title="FinancePal API",
    description="Proactive AI Financial Advisory Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:8080")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(financial_data.router, prefix="/api/financial", tags=["financial"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "FinancePal Backend",
        "version": "1.0.0",
        "agents": ["sofia", "marcus", "luna"]
    }

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time proactive notifications"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Keep connection alive and listen for any client messages
            data = await websocket.receive_text()
            
            # Handle ping/pong for connection keepalive
            if data == "ping":
                await websocket.send_text("pong")
            else:
                # Could handle other client messages here
                print(f"Client {client_id} sent: {data}")
                
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"WebSocket error for {client_id}: {e}")
        manager.disconnect(client_id)

@app.get("/api/test-notification")
async def test_notification():
    """Test endpoint to trigger a sample proactive notification"""
    notification = ProactiveNotification(
        id="test-001",
        agent_id="sofia",
        type="proactive",
        title="Test Notification",
        message="This is a test proactive insight from Sofia!",
        priority="medium",
        action_required=True
    )
    
    # Send to all connected clients
    await manager.broadcast(notification.dict())
    
    return {"status": "notification sent", "notification": notification.dict()}

@app.post("/api/demo/trigger/{scenario}")
async def trigger_demo_scenario(scenario: str):
    """Trigger specific demo scenarios for presentation
    
    Available scenarios:
    - overspending: Luna alerts about budget exceeded
    - investment_opportunity: Marcus finds investment opportunity
    - credit_alert: Sofia notices credit score issue
    - goal_achieved: Luna celebrates goal completion
    """
    valid_scenarios = ["overspending", "investment_opportunity", "credit_alert", "goal_achieved"]
    
    if scenario not in valid_scenarios:
        return {"error": f"Invalid scenario. Choose from: {valid_scenarios}"}
    
    # Create a manual notification for demo
    from app.models.schemas import ProactiveNotification
    import uuid
    from datetime import datetime
    
    notifications = {
        "overspending": ProactiveNotification(
            id=str(uuid.uuid4()),
            agent_id="luna",
            type="alert",
            title="Overspending Alert!",
            message="You've exceeded your monthly budget by 20%. I noticed several large shopping purchases. Let's review your spending triggers together.",
            priority="high",
            action_required=True
        ),
        "investment_opportunity": ProactiveNotification(
            id=str(uuid.uuid4()),
            agent_id="marcus",
            type="proactive",
            title="Investment Opportunity",
            message="You have $13,000 in savings earning minimal interest. Based on your risk profile, I found 3 conservative investment options that could grow your wealth.",
            priority="medium",
            action_required=True
        ),
        "credit_alert": ProactiveNotification(
            id=str(uuid.uuid4()),
            agent_id="sofia",
            type="alert",
            title="Credit Score Improvement",
            message="Your credit utilization is high at 45%. Paying down $500 on your cards could boost your score by 15-20 points.",
            priority="medium",
            action_required=True
        ),
        "goal_achieved": ProactiveNotification(
            id=str(uuid.uuid4()),
            agent_id="luna",
            type="achievement",
            title="Goal Achieved! 🎉",
            message="Congratulations! You've completed your Emergency Fund goal of $5,000. This is a huge milestone for your financial security!",
            priority="low",
            action_required=False
        )
    }
    
    notification = notifications[scenario]
    notification.timestamp = datetime.now()
    
    # Send via WebSocket to all connected clients
    await manager.broadcast({
        "type": "notification",
        "data": notification.dict()
    })
    
    return {"status": "success", "scenario": scenario, "notification": notification.dict()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )