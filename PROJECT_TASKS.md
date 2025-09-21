# FinancePal - Project Tasks for Hackathon Completion

## 🚨 Priority 1: Core Integration (Must Have for Demo)

### Task 1: Connect Dashboard to Backend Data
**Time: 30 mins**
- [ ] Replace mock data in Dashboard.tsx with API calls
- [ ] Fetch `/api/financial/metrics` on component mount
- [ ] Update financial metrics in real-time
- [ ] Show actual user balance, credit score, etc.

### Task 2: WebSocket Integration for Main App
**Time: 45 mins**
- [ ] Create WebSocket hook for notifications
- [ ] Connect NotificationsDrawer to real WebSocket
- [ ] Update notification count in header
- [ ] Auto-refresh dashboard when notifications arrive
- [ ] Show toast notifications for high-priority alerts

### Task 3: Agent Chat Interface
**Time: 1 hour**
- [ ] Create dedicated Chat page/modal
- [ ] Wire up AgentCard "Chat Now" buttons
- [ ] Implement chat UI with message bubbles
- [ ] Show agent personality in chat (colors, avatars)
- [ ] Persist chat history per agent

## 🎨 Priority 2: Navigation & Pages (Nice to Have)

### Task 4: Navigation Structure
**Time: 30 mins**
- [ ] Create navigation menu/sidebar
- [ ] Add routes for:
  - `/` - Dashboard (existing)
  - `/chat/:agentId` - Chat with specific agent
  - `/goals` - Financial goals tracking
  - `/transactions` - Transaction history
  - `/insights` - All notifications/insights

### Task 5: Goals Page
**Time: 30 mins**
- [ ] Create Goals component
- [ ] Fetch goals from `/api/financial/goals`
- [ ] Show progress bars for each goal
- [ ] Allow contributing to goals
- [ ] Celebrate when goals achieved

### Task 6: Transactions Page
**Time: 20 mins**
- [ ] Create transaction list view
- [ ] Fetch from `/api/financial/transactions`
- [ ] Group by date
- [ ] Show categories with icons
- [ ] Add search/filter

## 🚀 Priority 3: Polish & Demo Features

### Task 7: Proactive Notifications Polish
**Time: 20 mins**
- [ ] Add notification sound
- [ ] Animate new notifications
- [ ] Group notifications by agent
- [ ] Add "snooze" functionality

### Task 8: Demo Mode
**Time: 15 mins**
- [ ] Create "Demo Mode" toggle
- [ ] Auto-trigger scenarios every 30 seconds
- [ ] Show guided tour on first load
- [ ] Add sample user "Alex Johnson"

### Task 9: Mobile Responsiveness
**Time: 30 mins**
- [ ] Fix Dashboard for mobile
- [ ] Make chat responsive
- [ ] Adjust notification drawer for mobile
- [ ] Test on phone browser

## 🎯 Hackathon Demo Script Features

### Must Show:
1. **Proactive Notifications**: Agents alert without being asked
2. **Three Distinct Personalities**: Each agent has unique voice
3. **Real-time Updates**: WebSocket instant communication
4. **Chat Functionality**: Natural conversations with context

### Demo Flow (5 minutes):
1. **0:00-0:30**: "Unlike chatbots, our agents proactively monitor"
2. **0:30-1:30**: Show dashboard with real metrics
3. **1:30-2:30**: Trigger overspending alert, show Luna's personality
4. **2:30-3:30**: Chat with Sofia about credit improvement
5. **3:30-4:30**: Marcus identifies investment opportunity
6. **4:30-5:00**: Show goals progress and achievement celebration

## 📝 Quick Wins (If Time Permits)

- [ ] Add user profile with photo
- [ ] Dark mode toggle
- [ ] Export financial report
- [ ] Voice input for chat
- [ ] Notification preferences
- [ ] Agent "thinking" animations

## 🛠️ Technical Debt (Post-Hackathon)

- [ ] Add authentication (real login)
- [ ] Persist data in database
- [ ] Add unit tests
- [ ] Error boundaries
- [ ] Loading states
- [ ] Offline support
- [ ] Real financial data integration

---

## Which task should we start with?

**Recommendation**: Start with **Task 1 & 2** (Dashboard + WebSocket integration) as they provide the most visual impact and show the core "proactive AI" concept.

Type the task number you want to work on!