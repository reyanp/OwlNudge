# OwlNudge 🦉

**AI-Powered Financial Advisory Platform for Financial Inclusion**

OwlNudge is a comprehensive financial planning platform designed to serve all users, especially those who are unbanked or underbanked. Our platform features three specialized AI financial advisors and provides personalized guidance without requiring traditional banking connections.

## 🌟 Features

- **Three AI Financial Advisors**: Sofia (Financial Literacy), Marcus (Investment Education), and Luna (Behavioral Coaching)
- **Inclusive Design**: Works for users with or without traditional bank accounts
- **Real-time Notifications**: Proactive financial insights via WebSocket connections
- **Personalized Dashboard**: Adapts to user profiles and financial goals
- **Interactive Learning**: Gamified financial education modules
- **Multi-persona Support**: Built-in user personas for diverse financial situations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ and pip
- Google Gemini API key

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your Google Gemini API key to .env

# Start the backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **shadcn/ui** for consistent UI components
- **WebSocket** for real-time communication

### Backend
- **FastAPI** with async/await support
- **WebSocket** connections for real-time notifications
- **Google Gemini AI** for intelligent financial advice
- **SQLite** for data persistence

## 📱 Usage

1. **Complete the Onboarding Quiz**: Tell us about your financial situation, goals, and background
2. **Explore Your Dashboard**: View personalized metrics and insights
3. **Chat with AI Advisors**: Get instant, tailored financial guidance
4. **Receive Proactive Notifications**: Stay informed about important financial opportunities
5. **Learn and Grow**: Use our interactive learning modules to improve financial literacy

## 🎯 Target Audience

- Unbanked and underbanked individuals
- Students and young professionals
- Gig workers and freelancers
- Recent immigrants
- Anyone seeking accessible financial guidance

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and feel free to submit issues and pull requests.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with accessibility and financial inclusion in mind. Dedicated to the 63 million unbanked Americans seeking financial empowerment.

---

*OwlNudge: Smart financial planning for everyone. No bank account required.*
