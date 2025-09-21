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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useUXFlags } from "@/contexts/UXFlagsContext";

interface WebSocketMessage {
  type: string;
  data: any;
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
      <Tabs defaultValue="scenarios" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 p-1">
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {sharedNotifications.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {sharedNotifications.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

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