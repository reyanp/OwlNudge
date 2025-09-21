import { createContext, useContext, useMemo, ReactNode } from "react";
import { useWebSocket } from "@/hooks/use-websocket";

export const NotificationsContext = createContext<ReturnType<typeof useWebSocket> | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const value = useWebSocket();
  const memo = useMemo(() => value, [value.isConnected, value.unreadCount, value.notifications]);
  return (
    <NotificationsContext.Provider value={memo}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}
