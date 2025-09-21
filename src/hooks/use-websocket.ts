/**
 * WebSocket hook for real-time notifications
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

const VERBOSE = false;

export interface Notification {
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

interface WebSocketMessage {
  type: string;
  data: any;
}

function normalizeNotification(raw: any): Notification {
  return {
    id: raw.id,
    agentId: raw.agent_id || raw.agentId,
    type: raw.type,
    title: raw.title,
    message: raw.message,
    timestamp: new Date(raw.timestamp),
    isRead: raw.is_read || raw.isRead || false,
    priority: raw.priority,
    actionRequired: raw.action_required || raw.actionRequired,
  };
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      // Generate unique client ID
      const clientId = `user-${Date.now()}`;
      ws.current = new WebSocket(`ws://localhost:8000/ws/${clientId}`);

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Send initial ping
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send('ping');
        }
      };

      ws.current.onmessage = (event) => {
        const raw = event.data;
        if (VERBOSE) console.log('🔵 Raw WebSocket message received:', raw);

        // Ignore keepalive pongs or any non-JSON strings
        if (typeof raw === 'string') {
          if (raw === 'pong') {
            // Silently ignore keepalive
            return;
          }
        }

        let message: WebSocketMessage | undefined;
        try {
          message = JSON.parse(raw);
          if (VERBOSE) console.log('🟣 Parsed message:', message);
        } catch (e) {
          // Non-JSON message (likely from tools or proxies) — ignore safely
          if (VERBOSE) console.warn('⚠️ Ignoring non-JSON WebSocket payload:', raw);
          return;
        }
        
        if (message?.type === 'notification') {
          const rawNotification = message.data;
          if (VERBOSE) console.log('🟠 Raw notification data:', rawNotification);
          
          const notification: Notification = normalizeNotification(rawNotification);
          
          // Add to notifications list
          setNotifications(prev => [notification, ...prev]);
          
          if (VERBOSE) console.log('📨 Notification received:', notification);
          
          // Show toast based on priority
          const agentNames = {
            sofia: 'Sofia',
            marcus: 'Marcus',
            luna: 'Luna'
          };

          const toastOptions: any = {
            description: notification.message.substring(0, 100) + '...',
          };

          // Add action for high priority or action required
          if (notification.priority === 'high' || notification.actionRequired) {
            toastOptions.action = {
              label: 'View',
              onClick: () => {
                // In a real app, this would navigate to the notification
                console.log('View notification:', notification.id);
              }
            };
          }

          // Different toast types based on notification type
          if (notification.type === 'alert' || notification.priority === 'high') {
            toast.error(`${agentNames[notification.agentId]}: ${notification.title}`, toastOptions);
          } else if (notification.type === 'achievement') {
            toast.success(`${agentNames[notification.agentId]}: ${notification.title}`, toastOptions);
          } else {
            toast(notification.title, {
              ...toastOptions,
              icon: '🤖'
            });
          }
        } else if (message?.type === 'connection') {
          if (VERBOSE) console.log('Connection message:', message);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttempts.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          toast.error('Lost connection to server. Please refresh the page.');
        }
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    // Connect on mount
    connect();

    // Keep-alive ping every 30 seconds
    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send('ping');
      }
    }, 30000);

    // Cleanup
    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [connect]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Trigger demo scenario
  const triggerDemo = useCallback(async (scenario: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/demo/trigger/${scenario}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        if (VERBOSE) console.log(`Demo triggered: ${scenario}`);
        // Fallback: directly inject notification into state so UI updates
        if (data.notification) {
          try {
            const injected = normalizeNotification(data.notification);
            setNotifications(prev => [injected, ...prev]);
          } catch {}
        }
      } else {
        if (VERBOSE) console.error('Failed to trigger demo:', data.error);
      }
    } catch (error) {
      if (VERBOSE) console.error('Error triggering demo:', error);
    }
  }, []);

  return {
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    triggerDemo
  };
}