import React from "react";
import type { DailyMetric, ExampleItem } from "../data/mockData";

interface ExamplesDrawerProps {
  selectedDate?: string;
  metric?: DailyMetric;
}

const sentimentBadgeClass = (sentiment: ExampleItem["sentiment"]) => {
  switch (sentiment) {
    case "positive":
      return "bg-brand-500/15 text-brand-100 border border-brand-400/30";
    case "negative":
      return "bg-rose-500/15 text-rose-300 border border-rose-400/20";
    default:
      return "bg-brand-400/10 text-brand-100 border border-brand-400/20";
  }
};

export const ExamplesDrawer: React.FC<ExamplesDrawerProps> = ({ selectedDate, metric }) => {
  if (!selectedDate || !metric) {
    return (
      <div className="glass-panel p-4 sm:p-6 flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-100/60">Drilldown</p>
          <h2 className="text-xl font-semibold text-emerald-50">Select a date</h2>
        </div>
        <p className="text-sm text-brand-100/80">
          Click any bar in the chart to surface representative posts and comments with sentiment details.
        </p>
        <div className="bg-brand-400/10 border border-dashed border-brand-400/30 rounded-2xl p-6 text-sm text-brand-100/70">
          <p>Tip: pair this with the keyword cloud to understand what triggered a spike.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-100/60">{selectedDate}</p>
          <h2 className="text-xl font-semibold text-emerald-50">{metric.totalItems} mentions analysed</h2>
          <p className="text-sm text-brand-100/80">
            {Math.round(metric.avgSentiment * 100)}% average sentiment · {metric.positiveCount} positive · {metric.negativeCount} negative
          </p>
        </div>
        <a
          href={`https://reddit.com/r/${metric.subreddit.replace("r/", "")}`}
          className="badge hover:bg-brand-400/20 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          View subreddit
        </a>
      </div>
      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
        {metric.examples.map((example) => (
          <article key={example.id} className="bg-brand-400/10 rounded-2xl border border-brand-400/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-emerald-50">{example.title}</h3>
                <p className="text-sm text-brand-100/80 leading-relaxed mt-1">{example.body}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${sentimentBadgeClass(example.sentiment)}`}>
                {example.sentiment.toUpperCase()}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-brand-100/70">
              <span>Confidence: {(example.confidence * 100).toFixed(0)}%</span>
              <span>Score: {example.score}</span>
              <a
                href={example.permalink}
                className="text-brand-200 hover:text-brand-100 underline"
                target="_blank"
                rel="noreferrer"
              >
                Open on Reddit
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
