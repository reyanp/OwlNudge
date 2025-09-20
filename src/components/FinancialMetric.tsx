import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricValue } from "./MetricValue";

type Delta = { 
  value: number; 
  isPositive: boolean; 
};

interface FinancialMetricProps {
  title: string;
  value: number;
  kind: 'currency' | 'percent' | 'number';
  currency?: string;
  change?: Delta;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    border: 'border-slate-200',
    accentBorder: 'border-l-indigo-500'
  },
  success: {
    border: 'border-slate-200',
    accentBorder: 'border-l-emerald-500'
  },
  warning: {
    border: 'border-slate-200',
    accentBorder: 'border-l-amber-500'
  },
  danger: {
    border: 'border-slate-200',
    accentBorder: 'border-l-red-500'
  }
};

export function FinancialMetric({ 
  title, 
  value,
  kind,
  currency,
  change, 
  variant = 'default',
  className 
}: FinancialMetricProps) {
  const styles = variantStyles[variant];
  
  return (
    <div className={cn(
      "p-6 bg-white border-2 border-l-4 rounded-xl shadow-md",
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300",
      styles.border,
      styles.accentBorder,
      className
    )}>
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          {title}
        </p>
        
        <div className="flex items-center justify-between gap-3 min-w-0">
          {/* Compact value with tooltip for full precision */}
          <div className="min-w-0 flex-1">
            <MetricValue 
              kind={kind}
              value={value}
              currency={currency}
            />
          </div>
          
          {/* Change indicator - smaller and more subtle */}
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0",
              change.isPositive 
                ? "text-emerald-700 bg-emerald-100 border border-emerald-200" 
                : "text-red-700 bg-red-100 border border-red-200"
            )}
            aria-label={`Change ${change.isPositive ? "up" : "down"} ${Math.abs(change.value)}%`}
            >
              {change.isPositive ? (
                <TrendingUp className="w-3 h-3" aria-hidden />
              ) : (
                <TrendingDown className="w-3 h-3" aria-hidden />
              )}
              <span className="tabular-nums">
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}