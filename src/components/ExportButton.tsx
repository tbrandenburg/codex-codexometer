import React from "react";
import { dailyMetricsToCsv, downloadCsv } from "../utils/csv";
import type { DailyMetric } from "../data/mockData";

interface ExportButtonProps {
  metrics: DailyMetric[];
  subreddit: string;
  range: number;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ metrics, subreddit, range }) => {
  const handleExport = () => {
    const csv = dailyMetricsToCsv(metrics);
    const filename = `codex-sentiment-${subreddit.replace("/", "-")}-${range}d.csv`;
    downloadCsv(csv, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-300 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 hover:opacity-90 transition"
    >
      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
      Export CSV
    </button>
  );
};
