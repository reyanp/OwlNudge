import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Brain, TrendingUp, Heart, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentChat, useInstantSuggestion } from "@/hooks/use-backend";
import { useQuiz } from "@/contexts/QuizContext";

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  initialAgentMessage?: string;
}

const agentData = {
  sofia: {
    name: "Sofia",
    role: "Financial Literacy Coach",
    icon: Brain,
    color: "bg-pink-500",
    gradient: "from-pink-400 to-pink-600",
  },
  marcus: {
    name: "Marcus",
    role: "Investment Educator",
    icon: TrendingUp,
    color: "bg-indigo-500",
    gradient: "from-indigo-400 to-indigo-600",
  },
  luna: {
    name: "Luna",
    role: "Behavioral Coach",
    icon: Heart,
    color: "bg-emerald-500",
    gradient: "from-emerald-400 to-emerald-600",
  },
};

export function ChatModal({ open, onOpenChange, agentId }: ChatModalProps) {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, loading, sendMessage } = useAgentChat(agentId);
  const { suggestion, loading: suggestionLoading, getSuggestion } = useInstantSuggestion(agentId);
  const { quizData } = useQuiz();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const agent = agentData[agentId as keyof typeof agentData];
  if (!agent) return null;
  
  const AgentIcon = agent.icon;

  // Get instant suggestion when modal opens and there are no messages
  useEffect(() => {
    if (open && messages.length === 0 && quizData && !suggestion && !suggestionLoading) {
      getSuggestion(quizData);
    }
  }, [open, messages.length, quizData, suggestion, suggestionLoading, getSuggestion]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;
    
    const message = inputMessage;
    setInputMessage("");
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className={cn(
          "px-6 py-4 border-b bg-gradient-to-r text-white",
          agent.gradient
        )}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <AgentIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {agent.name}
              </DialogTitle>
              <p className="text-sm text-white/80">{agent.role}</p>
            </div>
            <Badge className="ml-auto bg-white/20 text-white border-white/30">
              AI Powered
            </Badge>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="space-y-4 p-2">
              {/* Show instant personalized suggestion */}
              {suggestion ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      agent.color
                    )}>
                      <AgentIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-100 rounded-2xl px-4 py-3 relative">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Personalized Suggestion</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ) : suggestionLoading ? (
                <div className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    agent.color
                  )}>
                    <AgentIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      <span className="text-sm text-slate-500">Analyzing your profile...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center",
                    agent.color
                  )}>
                    <AgentIcon className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-slate-600 font-medium mb-2">
                    Hi! I'm {agent.name}
                  </p>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    {agentId === 'sofia' && "I'm here to help you understand credit scores, budgeting, and financial basics. Ask me anything!"}
                    {agentId === 'marcus' && "Let's explore investment opportunities and build your wealth together. What would you like to know?"}
                    {agentId === 'luna' && "I'm here to help you understand your spending habits and build better financial behaviors. How can I assist?"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      agent.color
                    )}>
                      <AgentIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3",
                      message.role === 'user'
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-900"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.timestamp && (
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    agent.color
                  )}>
                    <AgentIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      <span className="text-sm text-slate-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${agent.name} something...`}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              className={cn(
                "bg-gradient-to-r text-white",
                agent.gradient
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Powered by Google Gemini AI
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}