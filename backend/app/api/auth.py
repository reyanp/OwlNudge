"""
Auth API endpoints (simplified for hackathon demo)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import os

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Simple login for demo (accepts any username/password)"""
    # For hackathon demo - accept any credentials
    # In production, verify against database
    
    user = {
        "id": "demo_user",
        "username": request.username,
        "name": "Alex",
        "email": f"{request.username}@example.com"
    }
    
    # Create JWT token
    secret = os.getenv("SECRET_KEY", "hackathon-demo-secret-key-2024")
    token_data = {
        "sub": user["id"],
        "username": user["username"],
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    
    access_token = jwt.encode(token_data, secret, algorithm="HS256")
    
    return LoginResponse(
        access_token=access_token,
        user=user
    )

@router.get("/me")
async def get_current_user():
    """Get current user info"""
    return {
        "id": "demo_user",
        "username": "alex",
        "name": "Alex",
        "email": "alex@example.com",
        "created_at": datetime.now().isoformat()
    }

@router.post("/logout")
async def logout():
    """Logout (client should clear token)"""
    return {"status": "success", "message": "Logged out successfully"}