import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialMetricProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    timeframe: string;
  };
  icon?: 'dollar' | 'credit' | 'target' | 'savings' | 'trending-up' | 'trending-down';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const iconMap = {
  dollar: DollarSign,
  credit: CreditCard,
  target: Target,
  savings: PiggyBank,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
};

const variantStyles = {
  default: {
    bg: 'bg-white',
    iconBg: 'bg-indigo-500',
    iconColor: 'text-white',
    border: 'border-slate-200',
    accentBorder: 'border-l-indigo-500'
  },
  success: {
    bg: 'bg-white',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    border: 'border-slate-200',
    accentBorder: 'border-l-emerald-500'
  },
  warning: {
    bg: 'bg-white',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    border: 'border-slate-200',
    accentBorder: 'border-l-amber-500'
  },
  danger: {
    bg: 'bg-white',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    border: 'border-slate-200',
    accentBorder: 'border-l-red-500'
  }
};

export function FinancialMetric({ 
  title, 
  value, 
  change, 
  icon = 'dollar', 
  variant = 'default',
  className 
}: FinancialMetricProps) {
  const Icon = iconMap[icon];
  const styles = variantStyles[variant];
  
  return (
    <div className={cn(
      "p-6 bg-white border-2 border-l-4 rounded-xl shadow-md",
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300",
      styles.border,
      styles.accentBorder,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold text-slate-900 metric-counter">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full",
                change.isPositive 
                  ? "text-emerald-700 bg-emerald-100 border border-emerald-200" 
                  : "text-red-700 bg-red-100 border border-red-200"
              )}>
                {change.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
              </div>
            )}
          </div>
          {change && (
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {change.timeframe}
            </p>
          )}
        </div>
        
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
          "border-2 border-white shadow-lg hover:scale-105 hover:shadow-xl",
          styles.iconBg
        )}>
          <Icon className={cn("w-7 h-7", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}