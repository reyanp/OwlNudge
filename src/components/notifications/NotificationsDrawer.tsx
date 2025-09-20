
import { Sheet, SheetContent, SheetTitle, SheetOverlay, SheetPortal } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, X, Brain, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Updated notification type to match existing data structure
type Notification = {
  id: string;
  agentId: 'sofia' | 'marcus' | 'luna';
  type: 'proactive' | 'alert' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  notifications: Notification[];
  onMarkAllRead: () => void;

  onMarkAsRead: (id: string) => void;
  onTakeAction: (id: string, agentId: string) => void;
};

const agentConfig = {
  sofia: { icon: Brain, name: 'Sofia', color: 'bg-purple-500' },
  marcus: { icon: TrendingUp, name: 'Marcus', color: 'bg-indigo-500' },
  luna: { icon: Heart, name: 'Luna', color: 'bg-orange-500' }
};

export function NotificationsDrawer({
  open, 
  onOpenChange, 
  notifications, 
  onMarkAllRead, 
  onMarkAsRead,
  onTakeAction
}: Props) {
  
  const alerts = notifications.filter(n => n.type === 'alert' || n.priority === 'high');
  const messages = notifications.filter(n => n.type === 'proactive' || n.type === 'achievement');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        {/* Dark overlay, blocks clicks */}
        <SheetOverlay className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm pointer-events-auto" />
        
        {/* Drawer content, above overlay */}
        <SheetContent 
          side="right" 
          className="
            fixed inset-y-0 right-0 z-[61] rounded-none border-l p-0
            w-[420px] sm:w-[520px] lg:w-[560px] max-w-[100vw]
            bg-background text-foreground shadow-2xl
            data-[state=open]:animate-in data-[state=open]:slide-in-from-right
            data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right
          "
        >
        <header className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Bell className="h-4 w-4 text-white" aria-hidden />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-slate-900">Notifications</SheetTitle>
              {unreadCount > 0 && (
                <p className="text-sm text-slate-600">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="text-slate-600 hover:bg-slate-100">
              <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-slate-600 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <Tabs defaultValue="all" className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-white">Alerts</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-white">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)] pr-3">
              {notifications.length === 0 ? (
                <EmptyState />
              ) : (
                notifications.map(n => (
                  <NotificationItem 
                    key={n.id} 
                    notification={n} 
                    onMarkAsRead={onMarkAsRead}
                    onTakeAction={onTakeAction}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)] pr-3">
              {alerts.length === 0 ? (
                <EmptyState message="No alerts" />
              ) : (
                alerts.map(n => (
                  <NotificationItem 
                    key={n.id} 
                    notification={n} 
                    onMarkAsRead={onMarkAsRead}
                    onTakeAction={onTakeAction}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)] pr-3">
              {messages.length === 0 ? (
                <EmptyState message="No messages" />
              ) : (
                messages.map(n => (
                  <NotificationItem 
                    key={n.id} 
                    notification={n} 
                    onMarkAsRead={onMarkAsRead}
                    onTakeAction={onTakeAction}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}

function NotificationItem({ 
  notification, 
  onMarkAsRead,
  onTakeAction
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
  onTakeAction: (id: string, agentId: string) => void;
}) {
  const agent = agentConfig[notification.agentId];
  const AgentIcon = agent.icon;
  const unread = !notification.isRead;

  const handleOpen = () => {
    // Optimistic update - mark as read immediately
    if (unread) {
      onMarkAsRead(notification.id);
      toast("Marked as read", {
        description: notification.title,
        action: { 
          label: "Undo", 
          onClick: () => {
            // In a real app, you'd invalidate queries to refetch
            toast("Notification unmarked");
          }
        },
      });
    }
    
    if (notification.actionRequired) {
      onTakeAction(notification.id, notification.agentId);
    }
  };

  return (
    <div className="relative mb-3">
      <button
        onClick={handleOpen}
        className={cn(
          "group relative w-full text-left rounded-xl px-4 py-3 transition",
          // tonal list: subtle gray bg, visible border
          "border border-slate-300 bg-slate-100/70",
          // hover tint (no layout shift)
          "hover:bg-slate-50/80",
          // focus ring
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          // unread state: subtle elevation via tone
          unread && "bg-slate-200/80 border-slate-400"
        )}
        aria-label={`${unread ? "Unread: " : ""}${notification.title}`}
      >
      <div className="flex items-start gap-3">
        {/* Agent Avatar */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md",
          agent.color
        )}>
          <AgentIcon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {unread && (
                <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden />
              )}
              <span className="font-medium text-foreground">{agent.name}</span>
              {notification.type === 'proactive' && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Proactive
                </span>
              )}
              {notification.type === 'alert' && (
                <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  Alert
                </span>
              )}
              {notification.type === 'achievement' && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Achievement
                </span>
              )}
            </div>
            <time className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {notification.timestamp.toLocaleTimeString([], { 
                hour: "2-digit", 
                minute: "2-digit" 
              })}
            </time>
          </div>
          
          {/* Content */}
          <h4 className={cn(
            "mb-1 truncate",
            unread ? "font-semibold text-foreground" : "font-medium text-foreground"
          )}>
            {notification.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          
          {/* Action hint */}
          {notification.actionRequired && (
            <div className="mt-2 text-xs text-indigo-600 font-medium">
              Click to chat with {agent.name}
            </div>
          )}
        </div>
      </div>
      </button>
    </div>
  );
}

function EmptyState({ message = "No notifications" }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto mb-4 flex items-center justify-center border-2 border-slate-200">
        <Bell className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-slate-600 font-medium">{message}</p>
      <p className="text-sm text-slate-500 mt-2">
        Your agents will notify you of important insights
      </p>
    </div>
  );
}