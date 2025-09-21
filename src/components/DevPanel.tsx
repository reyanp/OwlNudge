import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wifi, 
  WifiOff, 
  Sparkles, 
  AlertCircle,
  Trophy,
  DollarSign,
  Zap,
  Bug,
  X,
  GraduationCap,
  Car,
  Building2,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useUXFlags } from "@/contexts/UXFlagsContext";
import { useQuiz } from "@/contexts/QuizContext";
import { clearAllChatHistory, clearAllAgentMessages } from "@/hooks/use-backend";

interface WebSocketMessage {
  type: string;
  data: any;
}

// Pre-made user personas for demo purposes
const DEMO_PERSONAS = {
  emma: {
    name: "Emma Chen",
    description: "College Student, Limited Banking",
    emoji: "👩‍🎓",
    icon: GraduationCap,
    backstory: "Computer science major working part-time at campus. Building credit for the first time.",
    data: {
      name: "Emma",
      age: "20",
      income: "under-50k",
      profession: "student",
      gender: "female",
      immigrantStatus: "us-citizen",
      primaryLanguage: "english",
      bankAccess: "online-only",
      savings: "under-5k",
      primaryGoal: "emergency-fund",
      riskTolerance: "conservative",
      timeHorizon: "short",
      debt: "student-loans",
      employmentStatus: "part-time",
      dependents: "0",
      homeOwnership: "rent",
      monthlyExpenses: "",
      retirementAge: "65",
      majorPurchases: [],
      investmentExperience: "beginner",
      currentInvestments: [],
      emergencyFund: "none"
    }
  },
  carlos: {
    name: "Carlos Rodriguez",
    description: "Gig Worker, Building Stability",
    emoji: "🚗",
    icon: Car,
    backstory: "Uber driver and freelance designer. Immigrant building financial foundation in the US.",
    data: {
      name: "Carlos",
      age: "28",
      income: "50k-100k",
      profession: "gig-worker",
      gender: "male",
      immigrantStatus: "permanent-resident",
      primaryLanguage: "english",
      bankAccess: "limited-access",
      savings: "5k-25k",
      primaryGoal: "save-home",
      riskTolerance: "moderate",
      timeHorizon: "medium",
      debt: "credit-card",
      employmentStatus: "self-employed",
      dependents: "1",
      homeOwnership: "rent",
      monthlyExpenses: "",
      retirementAge: "65",
      majorPurchases: [],
      investmentExperience: "beginner",
      currentInvestments: [],
      emergencyFund: "partial"
    }
  },
  sarah: {
    name: "Sarah Kim",
    description: "Tech Professional, High Earner",
    emoji: "💼",
    icon: Building2,
    backstory: "Software engineer at a startup. Wants to optimize investments and plan for early retirement.",
    data: {
      name: "Sarah",
      age: "32",
      income: "over-150k",
      profession: "full-time",
      gender: "female",
      immigrantStatus: "us-citizen",
      primaryLanguage: "english",
      bankAccess: "traditional-bank",
      savings: "over-50k",
      primaryGoal: "invest",
      riskTolerance: "aggressive",
      timeHorizon: "long",
      debt: "mortgage",
      employmentStatus: "full-time",
      dependents: "0",
      homeOwnership: "own",
      monthlyExpenses: "",
      retirementAge: "50",
      majorPurchases: [],
      investmentExperience: "intermediate",
      currentInvestments: ["401k", "stocks"],
      emergencyFund: "full"
    }
  },
  amira: {
    name: "Amira Hassan",
    description: "Recent Immigrant, Learning System",
    emoji: "🌍",
    icon: Globe,
    backstory: "Recent arrival on H1B visa. Learning American financial system while supporting family.",
    data: {
      name: "Amira",
      age: "29",
      income: "100k-150k",
      profession: "full-time",
      gender: "female",
      immigrantStatus: "visa-holder",
      primaryLanguage: "english",
      bankAccess: "traditional-bank",
      savings: "25k-50k",
      primaryGoal: "emergency-fund",
      riskTolerance: "conservative",
      timeHorizon: "medium",
      debt: "none",
      employmentStatus: "full-time",
      dependents: "2",
      homeOwnership: "rent",
      monthlyExpenses: "",
      retirementAge: "65",
      majorPurchases: [],
      investmentExperience: "beginner",
      currentInvestments: [],
      emergencyFund: "partial"
    }
  }
};

function ProfileSwitcher() {
  const { setQuizData, clearQuizData } = useQuiz();
  
  const loadPersona = async (personaKey: string) => {
    const persona = DEMO_PERSONAS[personaKey as keyof typeof DEMO_PERSONAS];
    if (persona) {
      try {
        // Clear all chat history (backend and frontend) first to prevent cross-contamination
        await clearAllChatHistory();
        clearAllAgentMessages();
        
        // Then set the new profile
        setQuizData(persona.data);
        
        toast.success(`Switched to ${persona.name}`, {
          description: persona.backstory
        });
      } catch (error) {
        console.error('Error switching profile:', error);
        // Still switch profile even if chat clearing fails
        setQuizData(persona.data);
        toast.success(`Switched to ${persona.name}`, {
          description: persona.backstory + " (Note: Previous chat history may still be visible)"
        });
      }
    }
  };
  
  const clearProfile = async () => {
    try {
      // Clear all chat history (backend and frontend) first
      await clearAllChatHistory();
      clearAllAgentMessages();
      
      // Then clear quiz data
      clearQuizData();
      
      toast.success("Cleared profile", {
        description: "Reset to default state"
      });
    } catch (error) {
      console.error('Error clearing profile:', error);
      // Still clear profile even if chat clearing fails
      clearQuizData();
      toast.success("Cleared profile", {
        description: "Reset to default state (Note: Previous chat history may still be visible)"
      });
    }
  };
  
  return (
    <div className="space-y-3">
      {Object.entries(DEMO_PERSONAS).map(([key, persona]) => (
        <Card key={key} className="p-3 hover:shadow-md transition-all cursor-pointer">
          <button
            onClick={() => loadPersona(key)}
            className="w-full flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
              <persona.icon className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{persona.emoji}</span>
                <p className="font-semibold text-sm text-slate-900">{persona.name}</p>
              </div>
              <p className="text-xs text-slate-600 font-medium">{persona.description}</p>
              <p className="text-xs text-slate-500 truncate">{persona.backstory}</p>
            </div>
          </button>
        </Card>
      ))}
      
      <Card className="p-3 border-red-200 hover:shadow-md transition-all cursor-pointer">
        <button
          onClick={clearProfile}
          className="w-full flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <X className="w-5 h-5 text-red-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-red-900">Clear Profile</p>
            <p className="text-xs text-red-600">Reset to default state</p>
          </div>
        </button>
      </Card>
    </div>
  );
}

function UXToggles() {
  const { flags, setFlags } = useUXFlags();
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={flags.inlinePreview} onChange={(e) => setFlags({ inlinePreview: e.target.checked })} />
        Inline agent preview (recommended)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={flags.autoOpenDrawer} onChange={(e) => setFlags({ autoOpenDrawer: e.target.checked })} />
        Auto-open drawer
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={flags.autoOpenChat} onChange={(e) => setFlags({ autoOpenChat: e.target.checked })} />
        Auto-open chat
      </label>
    </div>
  );
}

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const notificationsEndRef = useRef<HTMLDivElement>(null);

  // Use shared notifications
  // We intentionally do not create another WebSocket connection here
  // to avoid multiple sockets and split state in dev
  const { isConnected, notifications: sharedNotifications, unreadCount, triggerDemo } = useNotifications();

  useEffect(() => {
    setWsStatus(isConnected ? "connected" : "disconnected");
  }, [isConnected]);

  useEffect(() => {
    notificationsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sharedNotifications]);




  // Test Backend Health

  const agentColors = {
    sofia: "bg-pink-500",
    marcus: "bg-indigo-500",
    luna: "bg-emerald-500"
  };

  const scenarioIcons = {
    overspending: AlertCircle,
    investment_opportunity: DollarSign,
    credit_alert: Zap,
    goal_achieved: Trophy
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
        title="Open Developer Panel"
      >
        <Bug className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 w-[240px] bg-white border-r-2 border-slate-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4" />
          <h2 className="font-bold text-sm">Dev Panel</h2>
          <Badge 
            variant={wsStatus === "connected" ? "default" : "secondary"}
            className={cn(
              "ml-1 text-[10px]",
              wsStatus === "connected" && "bg-green-500",
              wsStatus === "connecting" && "bg-yellow-500 animate-pulse",
              wsStatus === "disconnected" && "bg-red-500"
            )}
          >
            {wsStatus === "connected" && <Wifi className="w-3 h-3 mr-1" />}
            {wsStatus === "disconnected" && <WifiOff className="w-3 h-3 mr-1" />}
            {wsStatus}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profiles" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 p-1">
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifs
            {sharedNotifications.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {sharedNotifications.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Profiles Tab */}
        <TabsContent value="profiles" className="flex-1 p-3 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-xs text-slate-600 uppercase tracking-wider">
              Demo User Profiles
            </h3>
            <p className="text-xs text-slate-500">
              Switch between different user personas to see how the dashboard personalizes.
            </p>
            <ProfileSwitcher />
          </div>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="flex-1 p-3 space-y-3">
          {/* Feature toggles */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xs text-slate-600 uppercase tracking-wider">
              Behavior
            </h3>
            <UXToggles />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-xs text-slate-600 uppercase tracking-wider">
              Trigger Demo Scenarios
            </h3>
            
            {Object.entries(scenarioIcons).map(([scenario, Icon]) => (
              <Card key={scenario} className="p-4 hover:shadow-md transition-all">
                <button
                  onClick={() => triggerDemo(scenario)}
                  className="w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-900">
                        {scenario.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-slate-500">
                        {scenario === 'overspending' && 'Luna alerts about budget'}
                        {scenario === 'investment_opportunity' && 'Marcus finds opportunities'}
                        {scenario === 'credit_alert' && 'Sofia notices credit issues'}
                        {scenario === 'goal_achieved' && 'Luna celebrates success'}
                      </p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {sharedNotifications.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No notifications yet. Trigger a scenario!
              </div>
            ) : (
              <div className="space-y-3">
                {sharedNotifications.map((notif, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                        agentColors[notif.agentId] || "bg-slate-500"
                      )}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{notif.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {notif.agentId}
                          </Badge>
                          <Badge 
                            variant={notif.priority === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {notif.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <div ref={notificationsEndRef} />
              </div>
            )}
          </ScrollArea>
        </TabsContent>


      </Tabs>
    </div>
  );
}