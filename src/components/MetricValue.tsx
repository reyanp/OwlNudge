import * as React from "react";
import {
  formatCompactCurrency,
  formatFullCurrency,
  formatCompactPercent,
  formatFullPercent,
  formatCompactNumber,
  formatFullNumber,
} from "@/lib/number-format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CurrencyProps = { 
  kind: "currency"; 
  value: number; 
  currency?: string; 
  locale?: string; 
};

type PercentProps = { 
  kind: "percent"; 
  value: number; 
  locale?: string; 
}; // value as decimal

type NumberProps = { 
  kind: "number"; 
  value: number; 
  locale?: string; 
};

type MetricValueProps = CurrencyProps | PercentProps | NumberProps;

/**
 * Renders a compact, one-line number with:
 * - Tailwind truncation (no wrap)
 * - Tabular figures for stable width
 * - Tooltip exposing full precise value (also via aria-label)
 */
export function MetricValue(props: MetricValueProps) {
  const locale = "locale" in props && props.locale ? props.locale : "en-US";
  
  let compact = "";
  let full = "";
  
  switch (props.kind) {
    case "currency": {
      const currency = props.currency ?? "USD";
      compact = formatCompactCurrency(props.value, { locale, currency });
      full = formatFullCurrency(props.value, { locale, currency });
      break;
    }
    case "percent": {
      compact = formatCompactPercent(props.value, locale);
      full = formatFullPercent(props.value, locale);
      break;
    }
    case "number": {
      compact = formatCompactNumber(props.value, locale);
      full = formatFullNumber(props.value, locale);
      break;
    }
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="tabular-nums whitespace-nowrap overflow-hidden text-ellipsis truncate leading-tight text-4xl font-bold text-slate-900"
            aria-label={full}
            data-full={full}
          >
            {compact}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <span className="tabular-nums font-medium">{full}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}