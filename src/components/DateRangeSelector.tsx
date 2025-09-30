import { clsx } from "clsx";
import React from "react";

type RangeOption = 7 | 30 | 90;

interface DateRangeSelectorProps {
  value: RangeOption;
  onChange: (value: RangeOption) => void;
}

const OPTIONS: { value: RangeOption; label: string; description: string }[] = [
  { value: 7, label: "7d", description: "Spot fresh spikes" },
  { value: 30, label: "30d", description: "Monthly pulse" },
  { value: 90, label: "90d", description: "Quarter view" }
];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="glass-panel p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-brand-100/60">Time Horizon</p>
        <h2 className="text-xl font-semibold text-emerald-50">Last {value} days</h2>
        <p className="text-sm text-brand-100/80">
          Toggle between recent chatter, the monthly pulse, or a full quarter to correlate with releases.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={clsx(
              "tab-trigger",
              value === option.value
                ? "tab-trigger-active"
                : "bg-brand-400/5 text-brand-100/70 hover:bg-brand-400/10 hover:text-brand-50"
            )}
          >
            <div className="flex flex-col items-center leading-tight">
              <span>{option.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-brand-100/60">{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export type { RangeOption };
