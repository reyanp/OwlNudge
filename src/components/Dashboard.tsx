import { useState, useEffect, useRef } from "react";
import { AgentCard } from "./AgentCard";
import { FinancialMetric } from "./FinancialMetric";
import { NotificationsButton } from "./header/NotificationsButton";
import { NotificationsDrawer } from "./notifications/NotificationsDrawer";
import { Button } from "@/components/ui/button";
import { Settings, User, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useFinancialMetrics } from "@/hooks/use-backend";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useUXFlags } from "@/contexts/UXFlagsContext";
import { ChatModal } from "./chat/ChatModal";
import { AskTeamModal } from "./ask/AskTeamModal";
import { ResetQuizButton } from "./ResetQuizButton";
import { useQuiz } from "@/contexts/QuizContext";

// Mock data for demonstration
const mockAgents = [
  {
    id: 'sofia' as const,
    name: 'Sofia',
    role: 'Financial Literacy Coach',
    status: 'active' as const,
    lastMessage: "I noticed you missed your credit score check this month. Let's review your credit health together!",
    notificationCount: 2,
    isProactive: true
  },
  {
    id: 'marcus' as const,
    name: 'Marcus',
    role: 'Investment Educator',
    status: 'thinking' as const,
    lastMessage: "You have $1,200 sitting idle. I found some conservative investment options that match your risk profile.",
    notificationCount: 1,
    isProactive: true
  },
  {
    id: 'luna' as const,
    name: 'Luna',
    role: 'Behavioral Coach',
    status: 'idle' as const,
    lastMessage: "Great job staying under budget this week! Your dining expenses are down 15%.",
    notificationCount: 0,
    isProactive: false
  }
];

const mockMetrics = [
  {
    title: "Total Balance",
    value: 24563,
    kind: 'currency' as const,
    currency: 'USD',
    change: { value: 12.5, isPositive: true },
    variant: 'success' as const
  },
  {
    title: "Credit Score",
    value: 742,
    kind: 'number' as const,
    change: { value: -8, isPositive: false },
    variant: 'warning' as const
  },
  {
    title: "Savings Goal",
    value: 0.68, // 68% as decimal
    kind: 'percent' as const,
    change: { value: 15, isPositive: true },
    variant: 'default' as const
  },
  {
    title: "Investment Portfolio",
    value: 8420,
    kind: 'currency' as const,
    currency: 'USD',
    change: { value: 3.2, isPositive: true },
    variant: 'success' as const
  }
];

const mockNotifications = [
  {
    id: '1',
    agentId: 'sofia' as const,
    type: 'proactive' as const,
    title: 'Credit Score Alert',
    message: 'Your credit score dropped by 8 points. This might be due to your recent credit card application. Let me explain what this means and how to improve it.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    priority: 'medium' as const,
    actionRequired: true
  },
  {
    id: '2',
    agentId: 'marcus' as const,
    type: 'proactive' as const,
    title: 'Investment Opportunity',
    message: 'The market dip presents a good buying opportunity for your portfolio. I found 3 options that match your conservative risk profile.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    priority: 'low' as const,
    actionRequired: true
  },
  {
    id: '3',
    agentId: 'luna' as const,
    type: 'achievement' as const,
    title: 'Budget Goal Achieved!',
    message: 'Congratulations! You stayed under your dining budget for the second week in a row. This positive habit is building great momentum.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    priority: 'low' as const,
    actionRequired: false
  }
];

export function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  const [askTeamOpen, setAskTeamOpen] = useState(false);
  
  // Get quiz data for personalization
  const { quizData, getUserProfile } = useQuiz();
  const userProfile = getUserProfile();
  
  // Use real backend data
  const { metrics, loading: metricsLoading, error: metricsError } = useFinancialMetrics();
  const { 
    notifications, 
    unreadCount, 
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
    triggerDemo 
  } = useNotifications();
  
  // Use backend metrics or fallback to mock
  const displayMetrics = metrics.length > 0 ? metrics : mockMetrics;

  const handleChatWithAgent = (agentId: string) => {
    setSelectedAgent(agentId);
    setChatModalOpen(true);
  };

  const handleTakeAction = (notificationId: string, agentId: string) => {
    markAsRead(notificationId);
    handleChatWithAgent(agentId);
  };

  const proactiveAgents = mockAgents.filter(a => a.isProactive).length;
  
  // Generate personalized welcome message based on quiz data
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    
    if (!quizData) return `${timeGreeting}, Welcome!`;
    
    // Personalize based on primary goal
    if (quizData.primaryGoal === 'emergency-fund') {
      return `${timeGreeting}! Let's Build Your Safety Net`;
    } else if (quizData.primaryGoal === 'pay-debt') {
      return `${timeGreeting}! Your Debt-Free Journey Starts Here`;
    } else if (quizData.primaryGoal === 'save-home') {
      return `${timeGreeting}! Your Dream Home Awaits`;
    } else if (quizData.primaryGoal === 'retirement') {
      return `${timeGreeting}! Planning Your Future`;
    } else if (quizData.primaryGoal === 'invest') {
      return `${timeGreeting}! Ready to Grow Your Wealth`;
    } else if (quizData.primaryGoal === 'education') {
      return `${timeGreeting}! Investing in Education`;
    }
    
    return `${timeGreeting}! Your Financial Journey Begins`;
  };
  
  // Handle new notifications: inline preview, optional auto-open behaviors, and bell bump
  const { flags } = useUXFlags();
  const lastNotifiedId = useRef<string | null>(null);
  const [previewByAgent, setPreviewByAgent] = useState<Record<string, { message: string; timeout?: any }>>({});
  const [bellAnimateKey, setBellAnimateKey] = useState(0);

  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    const latest = notifications[0];
    if (latest.id === lastNotifiedId.current) return;
    lastNotifiedId.current = latest.id;

    // Bump bell
    setBellAnimateKey((k) => k + 1);

    if (flags.autoOpenDrawer) {
      setNotificationDrawerOpen(true);
    }
    if (flags.autoOpenChat && (latest.actionRequired || latest.priority === 'high' || latest.type === 'alert')) {
      setSelectedAgent(latest.agentId);
      setChatInitialMessage(latest.message);
      setChatModalOpen(true);
    }

    // Inline preview (non-intrusive)
    if (flags.inlinePreview) {
      const agentId = latest.agentId;
      // clear existing timeout if any
      const existing = previewByAgent[agentId];
      if (existing?.timeout) clearTimeout(existing.timeout);
      const t = setTimeout(() => {
        setPreviewByAgent((prev) => {
          const copy = { ...prev };
          delete copy[agentId];
          return copy;
        });
      }, 8000);
      setPreviewByAgent((prev) => ({ ...prev, [agentId]: { message: latest.message, timeout: t } }));
    }
  }, [notifications, flags]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center border-2 border-white shadow-lg">
                <span className="text-2xl">🦉</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">OwlNudge</h1>
                <p className="text-sm font-medium text-slate-600">Your Personal Financial Guide</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ResetQuizButton />
              <NotificationsButton 
                count={unreadCount}
                onOpen={() => setNotificationDrawerOpen(true)}
                animate={bellAnimateKey > 0}
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="p-3 hover:bg-slate-100 rounded-xl border-2 border-transparent hover:border-slate-200 transition-all"
              >
                <Settings className="w-5 h-5 text-slate-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-3 hover:bg-slate-100 rounded-xl border-2 border-transparent hover:border-slate-200 transition-all"
              >
                <User className="w-5 h-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">
                {getWelcomeMessage()}
              </h2>
              <p className="text-lg text-slate-600">
                {userProfile && (
                  <span className="mr-4">
                    Your Profile: <span className="font-semibold capitalize">{userProfile.riskProfile}</span> investor,
                    {' '}focused on <span className="font-semibold capitalize">{userProfile.primaryFocus}</span>
                  </span>
                )}
                {proactiveAgents > 0 && (
                  <span 
                    className="inline-flex items-center gap-2 text-blue-700 font-semibold bg-blue-50 px-3 py-2 rounded-full border border-blue-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    {proactiveAgents} agent{proactiveAgents > 1 ? 's' : ''} have insights for you
                  </span>
                )}
              </p>
            </div>
            <Button 
              onClick={() => setAskTeamOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-3 rounded-xl border-2 border-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Ask OwlNudge
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metricsLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-pulse text-slate-500">Loading financial data...</div>
            </div>
          ) : (
            displayMetrics.map((metric, index) => (
            <FinancialMetric
              key={index}
              title={metric.title}
              value={metric.value}
              kind={metric.kind}
              currency={metric.currency}
              change={metric.change}
              variant={metric.variant}
              className="agent-entrance"
            />
          ))
          )}
        </div>

        {/* Main Content - Full Width */}
        <div className="space-y-8">
          {/* Personalized Insights Based on Quiz */}
          {quizData && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Your Personalized Financial Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Based on your assessment, we've identified:</p>
                  <ul className="space-y-2">
                    {quizData.primaryGoal && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-slate-700">
                          Primary Goal: <span className="font-semibold">
                            {quizData.primaryGoal === 'emergency-fund' && 'Building Emergency Fund'}
                            {quizData.primaryGoal === 'pay-debt' && 'Paying Off Debt'}
                            {quizData.primaryGoal === 'save-home' && 'Saving for a Home'}
                            {quizData.primaryGoal === 'retirement' && 'Retirement Planning'}
                            {quizData.primaryGoal === 'invest' && 'Growing Investments'}
                            {quizData.primaryGoal === 'education' && 'Education Savings'}
                          </span>
                        </span>
                      </li>
                    )}
                    {quizData.timeHorizon && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-slate-700">
                          Timeline: <span className="font-semibold">
                            {quizData.timeHorizon === 'less-1' && 'Less than 1 year'}
                            {quizData.timeHorizon === '1-3' && '1-3 years'}
                            {quizData.timeHorizon === '3-5' && '3-5 years'}
                            {quizData.timeHorizon === '5-10' && '5-10 years'}
                            {quizData.timeHorizon === 'over-10' && 'Over 10 years'}
                          </span>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Your financial agents will focus on:</p>
                  <ul className="space-y-2">
                    {userProfile?.primaryFocus === 'stability' && (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Building financial security</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Debt reduction strategies</span>
                        </li>
                      </>
                    )}
                    {userProfile?.primaryFocus === 'growth' && (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Investment opportunities</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Long-term wealth building</span>
                        </li>
                      </>
                    )}
                    {userProfile?.primaryFocus === 'saving' && (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Savings optimization</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Goal-based planning</span>
                        </li>
                      </>
                    )}
                    {userProfile?.primaryFocus === 'balanced' && (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Comprehensive financial planning</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-slate-700">Balanced approach to wealth</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Agents Section */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Your Financial Team
            </h3>
            <div className="space-y-5">
              {mockAgents.map((agent, index) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onChat={handleChatWithAgent}
                  onPreviewChat={(aid, message) => {
                    setSelectedAgent(aid);
                    setChatInitialMessage(message);
                    setChatModalOpen(true);
                  }}
                  previewMessage={previewByAgent[agent.id]?.message}
                  className="agent-entrance"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Drawer */}
        <NotificationsDrawer
          open={notificationDrawerOpen}
          onOpenChange={setNotificationDrawerOpen}
          notifications={notifications}
          onMarkAllRead={() => {
            markAllAsRead();
            toast.success("All notifications marked as read");
          }}
          onMarkAsRead={markAsRead}
          onTakeAction={handleTakeAction}
        />
        
        {/* Ask Team Modal */}
        <AskTeamModal
          open={askTeamOpen}
          onOpenChange={setAskTeamOpen}
          onStartPlan={(message, recommended) => {
            setAskTeamOpen(false)
            setSelectedAgent(recommended || 'sofia')
            setChatInitialMessage(message)
            setChatModalOpen(true)
          }}
        />

        {/* Chat Modal */}
        {selectedAgent && (
          <ChatModal
            open={chatModalOpen}
            onOpenChange={setChatModalOpen}
            agentId={selectedAgent}
            initialAgentMessage={chatInitialMessage}
          />
        )}
      </div>
    </div>
  );
}
