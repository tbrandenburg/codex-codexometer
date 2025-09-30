import React from "react";
import { scaleLinear } from "d3-scale";
import type { DailyMetric } from "../data/mockData";

interface KeywordCloudProps {
  metrics: DailyMetric[];
}

export const KeywordCloud: React.FC<KeywordCloudProps> = ({ metrics }) => {
  const keywordMap = new Map<string, number>();
  metrics.forEach((metric) => {
    metric.keywords.forEach((keyword) => {
      keywordMap.set(keyword.term, (keywordMap.get(keyword.term) ?? 0) + keyword.weight);
    });
  });

  const keywords = Array.from(keywordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const scale = scaleLinear()
    .domain([0, keywords[0]?.[1] ?? 1])
    .range([0.8, 2.4]);

  return (
    <div className="glass-panel p-4 sm:p-6 flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-100/60">Keywords</p>
        <h2 className="text-xl font-semibold text-emerald-50">What people are talking about</h2>
        <p className="text-sm text-brand-100/80">
          Weighted by TF-IDF-like scores. Larger words indicate topics dominating sentiment in the selected window.
        </p>
      </div>
      <div className="bg-gradient-to-br from-brand-400/10 to-brand-400/0 border border-brand-400/20 rounded-2xl p-6 min-h-[220px]">
        <div className="flex flex-wrap gap-3">
          {keywords.map(([term, weight]) => (
            <span
              key={term}
              className="rounded-full bg-brand-400/10 px-4 py-2 text-emerald-50 border border-brand-400/20"
              style={{
                fontSize: `${scale(weight).toFixed(2)}rem`,
                fontWeight: scale(weight) > 1.8 ? 700 : 500,
                letterSpacing: scale(weight) > 1.8 ? "0.06em" : "0.02em"
              }}
            >
              {term}
            </span>
          ))}
          {keywords.length === 0 && <p className="text-brand-100/70">No keywords available for this range.</p>}
        </div>
      </div>
    </div>
  );
};
