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
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Communities</p>
            <h2 className="text-xl font-semibold text-white">Where Codex is being discussed</h2>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
            {SUBREDDITS.map((subreddit) => (
              <button
                key={subreddit}
                onClick={() => onChange(subreddit)}
                className={clsx(
                  "tab-trigger",
                  value === subreddit
                    ? "tab-trigger-active"
                    : "text-white/70 hover:bg-white/10"
                )}
              >
                {subreddit}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-white/60">
          Each tab recalculates averages, keyword clusters, and recent stand-out examples for that community only.
        </p>
      </div>
    </div>
  );
};
