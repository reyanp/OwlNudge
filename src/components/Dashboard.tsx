import { useState } from "react";
import { AgentCard } from "./AgentCard";
import { FinancialMetric } from "./FinancialMetric";
import { NotificationCenter } from "./NotificationCenter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    value: "$24,563",
    change: { value: 12.5, isPositive: true, timeframe: "this month" },
    icon: 'dollar' as const,
    variant: 'success' as const
  },
  {
    title: "Credit Score",
    value: "742",
    change: { value: -8, isPositive: false, timeframe: "30 days" },
    icon: 'credit' as const,
    variant: 'warning' as const
  },
  {
    title: "Savings Goal",
    value: "68%",
    change: { value: 15, isPositive: true, timeframe: "this week" },
    icon: 'target' as const,
    variant: 'default' as const
  },
  {
    title: "Investment Portfolio",
    value: "$8,420",
    change: { value: 3.2, isPositive: true, timeframe: "today" },
    icon: 'trending-up' as const,
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
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const handleChatWithAgent = (agentId: string) => {
    setSelectedAgent(agentId);
    // In a real app, this would navigate to the chat interface
    console.log(`Opening chat with agent: ${agentId}`);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleTakeAction = (notificationId: string, agentId: string) => {
    handleMarkAsRead(notificationId);
    handleChatWithAgent(agentId);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const proactiveAgents = mockAgents.filter(a => a.isProactive).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center border-2 border-white shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">FinancePal</h1>
                <p className="text-sm font-medium text-slate-600">AI Financial Advisory</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-3 hover:bg-slate-100 rounded-xl border-2 border-transparent hover:border-slate-200 transition-all"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadNotifications}
                  </div>
                )}
              </Button>
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
                Good morning, Alex
              </h2>
              <p className="text-lg text-slate-600">
                {proactiveAgents > 0 && (
                  <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-3 py-2 rounded-full border border-indigo-200">
                    <Sparkles className="w-4 h-4" />
                    {proactiveAgents} agent{proactiveAgents > 1 ? 's' : ''} have insights for you
                  </span>
                )}
              </p>
            </div>
            {proactiveAgents > 0 && (
              <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl border-2 border-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                View All Insights
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mockMetrics.map((metric, index) => (
            <FinancialMetric
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              variant={metric.variant}
              className="agent-entrance"
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Agents */}
          <div className="lg:col-span-2 space-y-6">
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
                    className="agent-entrance"
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border-2 border-slate-200 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-5">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="h-24 flex flex-col items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center border-2 border-white shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Ask Any Agent</span>
                </button>
                <button className="h-24 flex flex-col items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center border-2 border-white shadow-md">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Set New Goal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div>
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismissNotification}
              onTakeAction={handleTakeAction}
              className="sticky top-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}