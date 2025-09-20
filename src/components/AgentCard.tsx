import { Badge } from "@/components/ui/badge";
import { MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: {
    id: 'sofia' | 'marcus' | 'luna';
    name: string;
    role: string;
    status: 'active' | 'thinking' | 'idle';
    lastMessage?: string;
    notificationCount?: number;
    isProactive?: boolean;
  };
  onChat: (agentId: string) => void;
  className?: string;
}

const agentConfig = {
  sofia: {
    emoji: '🧠',
    cardGradient: 'from-purple-200 via-pink-200 to-purple-300',
    color: 'purple',
    description: 'Financial Literacy Coach'
  },
  marcus: {
    emoji: '📈',
    cardGradient: 'from-blue-200 via-indigo-200 to-blue-300',
    color: 'blue',
    description: 'Investment Educator'
  },
  luna: {
    emoji: '💖',
    cardGradient: 'from-orange-200 via-pink-200 to-orange-300',
    color: 'orange',
    description: 'Behavioral Coach'
  }
};

export function AgentCard({ agent, onChat, className }: AgentCardProps) {
  const config = agentConfig[agent.id];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl shadow-lg border border-white/20",
      "transition-all duration-300 hover:shadow-2xl cursor-pointer group",
      "hover:-translate-y-2 hover:scale-[1.02]",
      `bg-gradient-to-br ${config.cardGradient}`,
      className
    )}
    onClick={() => onChat(agent.id)}>
      
      {/* Proactive Indicator */}
      {agent.isProactive && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-indigo-200 shadow-sm">
            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600">Proactive</span>
          </div>
        </div>
      )}

      <div className="p-6 relative z-10">
        {/* Agent Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
            "bg-white/90 backdrop-blur-sm shadow-xl group-hover:scale-110 group-hover:shadow-2xl",
            "border border-white/50"
          )}>
            <span className="text-2xl">{config.emoji}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-2xl text-slate-800 truncate">
                {agent.name}
              </h3>
              <Badge 
                variant={agent.status === 'active' ? 'default' : 'secondary'}
                className={cn(
                  "text-xs font-semibold px-3 py-1 border shadow-sm",
                  agent.status === 'active' && 'bg-green-500 text-white border-green-600',
                  agent.status === 'thinking' && 'animate-pulse bg-amber-100 text-amber-800 border-amber-300',
                  agent.status === 'idle' && 'bg-slate-100 text-slate-600 border-slate-300'
                )}
              >
                {agent.status}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {config.description}
            </p>
          </div>
        </div>

        {/* Last Message */}
        {agent.lastMessage && (
          <div className="p-4 rounded-2xl mb-6 bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm">
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              "{agent.lastMessage}"
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <button className={cn(
            "bg-white/90 backdrop-blur-sm text-slate-700 font-semibold px-5 py-3 rounded-xl",
            "border border-white/50 shadow-lg transition-all duration-300",
            "hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:scale-105",
            "flex items-center gap-2"
          )}>
            <MessageCircle className="w-4 h-4" />
            Chat Now
          </button>
          
          {agent.notificationCount && agent.notificationCount > 0 && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white text-sm font-bold border-2 border-white shadow-xl notification-pop">
              {agent.notificationCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}