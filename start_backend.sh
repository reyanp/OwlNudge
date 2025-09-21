#!/bin/bash

echo "🚀 Starting FinancePal Backend with Gemini AI..."
echo ""
cd /home/reyan/Documents/WINNING/WINNINGFINPAL/backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000