import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = { 
  count: number; 
  onOpen: () => void; 
  animate?: boolean;
};

export function NotificationsButton({ count, onOpen, animate }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Notifications${count ? `: ${count} new` : ""}`}
      onClick={onOpen}
      className={cn(
        "relative p-3 hover:bg-slate-100 rounded-xl border-2 border-transparent hover:border-slate-200 transition-all",
        animate && "bell-bump"
      )}
    >
      <Bell className="h-5 w-5 text-slate-600" aria-hidden />
      {count > 0 && (
        <Badge
          className={cn(
            "absolute -top-1 -right-1 rounded-full px-1.5 py-0 text-[10px] leading-4 min-w-[18px] h-[18px] flex items-center justify-center",
            "bg-red-500 text-white border-2 border-white shadow-lg"
          )}
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Button>
  );
}