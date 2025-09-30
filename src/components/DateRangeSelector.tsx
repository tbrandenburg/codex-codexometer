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
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">Time Horizon</p>
        <h2 className="text-xl font-semibold text-white">Last {value} days</h2>
        <p className="text-sm text-white/60">
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
              value === option.value ? "tab-trigger-active" : "bg-white/5 text-white/70 hover:bg-white/10"
            )}
          >
            <div className="flex flex-col items-center leading-tight">
              <span>{option.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/50">{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export type { RangeOption };
