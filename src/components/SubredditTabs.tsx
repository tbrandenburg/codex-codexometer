import { clsx } from "clsx";
import React from "react";
import { SUBREDDITS } from "../data/mockData";

interface SubredditTabsProps {
  value: string;
  onChange: (value: string) => void;
}

export const SubredditTabs: React.FC<SubredditTabsProps> = ({ value, onChange }) => {
  return (
    <div className="glass-panel p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-100/60">Communities</p>
            <h2 className="text-xl font-semibold text-emerald-50">Where Codex is being discussed</h2>
          </div>
          <div className="flex items-center gap-2 bg-brand-400/10 rounded-full p-1 border border-brand-400/20">
            {SUBREDDITS.map((subreddit) => (
              <button
                key={subreddit}
                onClick={() => onChange(subreddit)}
                className={clsx(
                  "tab-trigger",
                  value === subreddit
                    ? "tab-trigger-active"
                    : "text-brand-100/70 hover:bg-brand-400/10 hover:text-brand-50"
                )}
              >
                {subreddit}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-brand-100/80">
          Each tab recalculates averages, keyword clusters, and recent stand-out examples for that community only.
        </p>
      </div>
    </div>
  );
};
