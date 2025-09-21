/**
 * Custom hooks for backend API integration
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:8000';

export interface FinancialMetric {
  title: string;
  value: number;
  kind: 'currency' | 'number' | 'percent';
  currency?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
}

export interface Goal {
  name: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface FinancialSummary {
  total_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
  credit_score: number;
  investment_balance: number;
  checking_balance: number;
  savings_balance: number;
  recent_transactions: Transaction[];
  goals: Goal[];
}

/**
 * Hook to fetch financial metrics for dashboard
 */
export function useFinancialMetrics() {
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/financial/metrics`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      
      const data = await response.json();
      setMetrics(data.metrics);
      setError(null);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load financial data');
      // Don't show error toast on every retry
      if (loading) {
        toast.error('Unable to connect to backend. Using demo data.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refetch: fetchMetrics };
}

/**
 * Hook to fetch financial summary
 */
export function useFinancialSummary() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/financial/summary`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      
      const data = await response.json();
      setSummary(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, refetch: fetchSummary };
}

/**
 * Hook to fetch transactions
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/financial/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  return { transactions, loading, refetch: fetchTransactions };
}

/**
 * Hook to fetch goals
 */
export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/financial/goals`);
      if (!response.ok) throw new Error('Failed to fetch goals');
      
      const data = await response.json();
      setGoals(data.goals);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const contributeToGoal = async (goalName: string, amount: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/financial/goals/${goalName}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) throw new Error('Failed to contribute');
      
      const data = await response.json();
      toast.success(data.message);
      fetchGoals(); // Refresh goals
      return data;
    } catch (err) {
      console.error('Error contributing to goal:', err);
      toast.error('Failed to contribute to goal');
      throw err;
    }
  };

  return { goals, loading, refetch: fetchGoals, contributeToGoal };
}

/**
 * Hook for chat with agents
 */
export function useAgentChat(agentId: string) {
  const [messages, setMessages] = useState<Array<{role: string, content: string, timestamp?: string}>>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    // Add user message optimistically
    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          message: message
        })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      const agentMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp
      };
      
      setMessages(prev => [...prev, agentMessage]);
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return { messages, loading, sendMessage, clearHistory };
}