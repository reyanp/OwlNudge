# FinancePal Backend - Ready to Run! 🚀

## ✅ Your API Key is Already Set Up!

Your Gemini API key has been configured in `.env`. You're ready to go!

## 🚀 Quick Start

1. **Get a Gemini API Key** (FREE!)
   - Go to https://makersuite.google.com/app/apikey
   - Create a new API key
   - It's completely free with generous limits

2. **Setup Environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env and add your Gemini API key
   # GEMINI_API_KEY=your_actual_key_here
   ```

3. **Install & Run**
   ```bash
   # Option 1: Use the run script
   ./run.sh
   
   # Option 2: Manual setup
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

4. **Backend will be available at:**
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - WebSocket: ws://localhost:8000/ws/{client_id}

## 🎯 Key Features

### Proactive AI Agents
- **Sofia** - Financial Literacy Coach (credit scores, budgeting)
- **Marcus** - Investment Educator (portfolio optimization)
- **Luna** - Behavioral Coach (spending habits, emotional finance)

### Real-time Insights
- Agents analyze financial data every 30-60 seconds
- Push notifications via WebSocket when insights are found
- Each agent has different analysis intervals and focus areas

### Demo Scenarios (For Hackathon Presentation)

Trigger impressive scenarios via API:

```bash
# Overspending Alert (Luna)
curl -X POST http://localhost:8000/api/demo/trigger/overspending

# Investment Opportunity (Marcus)
curl -X POST http://localhost:8000/api/demo/trigger/investment_opportunity

# Credit Score Alert (Sofia)
curl -X POST http://localhost:8000/api/demo/trigger/credit_alert

# Goal Achievement (Luna)
curl -X POST http://localhost:8000/api/demo/trigger/goal_achieved
```

## 📡 API Endpoints

### Chat with Agents
```bash
POST /api/chat/
{
  "agent_id": "sofia",
  "message": "How can I improve my credit score?"
}
```

### Get Financial Data
```bash
GET /api/financial/metrics     # Dashboard metrics
GET /api/financial/summary     # Complete financial summary
GET /api/financial/transactions # Recent transactions
GET /api/financial/goals       # Financial goals
```

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/user123');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'notification') {
    // Handle proactive notification from agents
  }
};
```

## 🏗️ Architecture

```
backend/
├── app/
│   ├── agents/          # Agent personalities (Gemini-powered)
│   ├── api/             # REST API endpoints
│   ├── models/          # Pydantic schemas
│   ├── services/        # WebSocket, Proactive Analyzer
│   └── main.py          # FastAPI application
```

## 🎪 For Hackathon Demo

### What Makes This Unique:
1. **Proactive AI** - Agents don't wait to be asked, they actively analyze and alert
2. **Personality-Driven** - Each agent has distinct expertise and communication style
3. **Real-time Updates** - WebSocket delivers insights as they're discovered
4. **Gemini-Powered** - Latest Google AI for intelligent financial analysis

### Demo Flow:
1. Start backend → Agents begin analyzing
2. Open frontend → See real-time notifications appear
3. Trigger demo scenarios for judges
4. Show chat functionality with personality differences
5. Highlight proactive nature (not just Q&A)

## 🔑 Environment Variables

```env
GEMINI_API_KEY=your_key_here      # Required - Get free at makersuite.google.com
FRONTEND_URL=http://localhost:8080 # CORS origin
ANALYSIS_INTERVAL=30               # Seconds between analyses
SECRET_KEY=your_secret_key        # JWT secret (auto-generated okay for demo)
```

## 🐛 Troubleshooting

**No notifications appearing?**
- Check Gemini API key is set correctly
- Verify WebSocket connection in browser console
- Try triggering demo scenarios manually

**CORS errors?**
- Make sure FRONTEND_URL in .env matches your frontend URL
- Default is http://localhost:8080

**Gemini API errors?**
- Verify API key at https://makersuite.google.com/app/apikey
- Check you haven't hit rate limits (unlikely with free tier)

## 📝 Notes

- Uses in-memory data storage (perfect for hackathon demo)
- Accepts any login credentials (simplified auth for demo)
- Mock financial data with realistic patterns
- Designed to impress in a 5-minute demo!