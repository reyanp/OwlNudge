#!/bin/bash

echo "🚀 Starting FinancePal Backend..."
echo ""
echo "⚠️  Make sure you have:"
echo "  1. Created .env file from .env.example"
echo "  2. Added your Gemini API key"
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Starting server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000