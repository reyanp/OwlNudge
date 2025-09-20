import { Card } from "@/components/ui/card";
import { Bell, Sparkles, TrendingUp, Heart, Brain, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  agentId: 'sofia' | 'marcus' | 'luna';
  type: 'proactive' | 'alert' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onTakeAction: (id: string, agentId: string) => void;
  className?: string;
}

const agentConfig = {
  sofia: { icon: Brain, color: 'sofia', name: 'Sofia' },
  marcus: { icon: TrendingUp, color: 'marcus', name: 'Marcus' },
  luna: { icon: Heart, color: 'luna', name: 'Luna' }
};

const typeConfig = {
  proactive: { icon: Sparkles, variant: 'default' },
  alert: { icon: Bell, variant: 'warning' },
  achievement: { icon: Check, variant: 'success' }
};

export function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onDismiss, 
  onTakeAction,
  className 
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={cn("bg-white border-2 border-slate-200 rounded-xl shadow-md p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center border-2 border-white shadow-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">
              Agent Notifications
            </h3>
            <p className="text-sm font-medium text-slate-600">
              Proactive insights from your financial team
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-white shadow-lg notification-pop">
            {unreadCount} new
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 mx-auto mb-4 flex items-center justify-center border-2 border-slate-200">
              <Bell className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No notifications yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Your agents will notify you of important insights
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const agent = agentConfig[notification.agentId];
            const type = typeConfig[notification.type];
            const AgentIcon = agent.icon;
            const TypeIcon = type.icon;
            
            return (
              <div
                key={notification.id}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                  notification.isRead 
                    ? "bg-slate-50 border-slate-200" 
                    : "bg-white border-slate-300 shadow-sm",
                  notification.priority === 'high' && "border-l-4 border-l-red-500",
                  notification.priority === 'medium' && "border-l-4 border-l-amber-500"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Agent Avatar */}
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-white shadow-lg",
                    agent.color === 'sofia' && "bg-pink-500",
                    agent.color === 'marcus' && "bg-indigo-500", 
                    agent.color === 'luna' && "bg-emerald-500"
                  )}>
                    <AgentIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">
                          {agent.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 text-slate-500" />
                          {notification.type === 'proactive' && (
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full border border-indigo-200">
                              Proactive
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">
                          {notification.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <button
                          onClick={() => onDismiss(notification.id)}
                          className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h4 className="font-bold text-slate-900 mb-2">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {notification.actionRequired && (
                        <button
                          onClick={() => onTakeAction(notification.id, notification.agentId)}
                          className={cn(
                            "text-sm font-semibold px-4 py-2 rounded-lg text-white border-2 border-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5",
                            agent.color === 'sofia' && "bg-pink-500 hover:bg-pink-600",
                            agent.color === 'marcus' && "bg-indigo-500 hover:bg-indigo-600",
                            agent.color === 'luna' && "bg-emerald-500 hover:bg-emerald-600"
                          )}
                        >
                          Chat with {agent.name}
                        </button>
                      )}
                      {!notification.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-sm font-medium text-slate-600 px-4 py-2 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all hover:-translate-y-0.5"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}