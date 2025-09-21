#!/bin/bash

echo "🦉 Starting OwlNudge Demo Servers..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the OwlNudge project root directory"
    exit 1
fi

# Start backend in background
echo "🚀 Starting backend server..."
cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ OwlNudge Demo is starting up!"
echo ""
echo "📡 Backend API: http://localhost:8000"
echo "🌐 Frontend App: http://localhost:8080 (or next available port)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
wait $FRONTEND_PID
wait $BACKEND_PID

echo ""
echo "👋 OwlNudge Demo stopped. Thanks for using our platform!"