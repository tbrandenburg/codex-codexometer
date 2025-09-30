import React from "react";
import type { DailyMetric } from "../data/mockData";

interface MetricSummaryProps {
  metrics: DailyMetric[];
}

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const MetricSummary: React.FC<MetricSummaryProps> = ({ metrics }) => {
  const total = metrics.reduce((sum, metric) => sum + metric.totalItems, 0);
  const positive = metrics.reduce((sum, metric) => sum + metric.positiveCount, 0);
  const negative = metrics.reduce((sum, metric) => sum + metric.negativeCount, 0);
  const neutral = metrics.reduce((sum, metric) => sum + metric.neutralCount, 0);
  const avgSentiment =
    total === 0
      ? 0
      : metrics.reduce((sum, metric) => sum + metric.avgSentiment * metric.totalItems, 0) / total;

  const latest = metrics[metrics.length - 1];
  const previous = metrics[Math.max(metrics.length - 8, 0)];
  const sentimentTrend = latest && previous ? latest.avgSentiment - previous.avgSentiment : 0;

  const topDays = [...metrics]
    .sort((a, b) => b.totalItems - a.totalItems)
    .slice(0, 3)
    .map((metric) => metric.date);

  return (
    <div className="glass-panel p-4 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Pulse Check</p>
            <h2 className="text-xl font-semibold text-white">Community health snapshot</h2>
          </div>
          <span className="badge">Auto QA · 83% confidence</span>
        </div>
        <div className="grid-auto-fit">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="metric-label">Weighted Sentiment</p>
            <p className="metric-value">{formatPercent(avgSentiment)}</p>
            <p className="text-xs text-white/60 mt-1">
              {sentimentTrend >= 0 ? "▲" : "▼"}
              {Math.abs(sentimentTrend * 100).toFixed(1)} pts vs. prior week
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="metric-label">Total Mentions</p>
            <p className="metric-value">{total.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">Across posts + top comments</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="metric-label">Positive vs. Negative</p>
            <p className="metric-value">
              {positive.toLocaleString()} / {negative.toLocaleString()}
            </p>
            <p className="text-xs text-white/60 mt-1">Neutral: {neutral.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="metric-label">Top Surge Days</p>
            <ul className="mt-2 space-y-1 text-sm text-white">
              {topDays.map((day) => (
                <li key={day} className="flex items-center justify-between">
                  <span>{day}</span>
                  <span className="text-white/60">{metrics.find((m) => m.date === day)?.totalItems ?? 0} items</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
