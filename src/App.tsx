import React, { useEffect, useMemo, useState } from "react";
import { DateRangeSelector, type RangeOption } from "./components/DateRangeSelector";
import { SubredditTabs } from "./components/SubredditTabs";
import { SentimentVolumeChart } from "./components/SentimentVolumeChart";
import { MetricSummary } from "./components/MetricSummary";
import { KeywordCloud } from "./components/KeywordCloud";
import { ExamplesDrawer } from "./components/ExamplesDrawer";
import { ExportButton } from "./components/ExportButton";
import { UpdateStatusBanner } from "./components/UpdateStatusBanner";
import { getDailyMetrics, SUBREDDITS } from "./data/mockData";

const App: React.FC = () => {
  const [range, setRange] = useState<RangeOption>(30);
  const [subreddit, setSubreddit] = useState<string>(SUBREDDITS[0]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const metrics = useMemo(() => getDailyMetrics(subreddit), [subreddit]);
  const latestMetric = metrics[metrics.length - 1];

  const rangedMetrics = useMemo(() => metrics.slice(-range), [metrics, range]);

  useEffect(() => {
    if (rangedMetrics.length && !selectedDate) {
      setSelectedDate(rangedMetrics[rangedMetrics.length - 1].date);
    }
  }, [rangedMetrics, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;
    const exists = rangedMetrics.some((metric) => metric.date === selectedDate);
    if (!exists && rangedMetrics.length) {
      setSelectedDate(rangedMetrics[rangedMetrics.length - 1].date);
    }
  }, [rangedMetrics, selectedDate]);

  const selectedMetric = rangedMetrics.find((metric) => metric.date === selectedDate);

  const lastUpdated = latestMetric?.date ?? "N/A";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header className="glass-panel p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="badge">Codex Sentiment Monitor</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-50 leading-tight">
              Track how the Codex community feels across Reddit—in one glance.
            </h1>
            <p className="text-lg text-brand-100/80">
              Pulling daily sentiment from r/ChatGPT, r/OpenAI, r/ChatGPTPro, and r/codex with automated cleaning, spam
              filtering, and HuggingFace-powered scoring. Use the dashboard to spot swings, decode why they happened, and export
              evidence for your launch notes.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-brand-100/80">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-400"></span> 30m ingest cadence</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lime-400"></span> DistilRoBERTa sentiment</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Supabase aggregates</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-sm text-brand-100/70 max-w-sm">
            <div className="bg-brand-400/10 border border-brand-400/20 rounded-2xl p-4">
              <p className="uppercase text-xs text-brand-100/60 tracking-[0.3em]">Latest spike</p>
              <h3 className="text-lg font-semibold text-emerald-50 mt-2">{latestMetric?.date ?? "—"}</h3>
              <p className="mt-2 text-brand-100/80">
                Confidence-weighted sentiment at {latestMetric ? Math.round(latestMetric.avgSentiment * 100) : 0}% with
                {" "}
                {latestMetric ? latestMetric.totalItems.toLocaleString() : "0"} mentions.
              </p>
            </div>
            <ExportButton metrics={rangedMetrics} subreddit={subreddit} range={range} />
          </div>
        </div>
      </header>

      <UpdateStatusBanner lastUpdated={lastUpdated} healthy={true} />

      <DateRangeSelector value={range} onChange={(value) => setRange(value)} />

      <SubredditTabs value={subreddit} onChange={(value) => {
        setSubreddit(value);
        setSelectedDate(undefined);
      }} />

      <MetricSummary metrics={rangedMetrics} />

      <SentimentVolumeChart metrics={rangedMetrics} onSelectDate={setSelectedDate} selectedDate={selectedDate} />

      <div className="grid lg:grid-cols-2 gap-6">
        <KeywordCloud metrics={rangedMetrics} />
        <ExamplesDrawer selectedDate={selectedDate} metric={selectedMetric} />
      </div>

      <section id="methodology" className="glass-panel p-6 sm:p-10 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-100/60">Transparency</p>
          <h2 className="text-2xl font-semibold text-emerald-50">How the pipeline works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-brand-100/80">
          <div className="bg-brand-400/10 rounded-2xl border border-brand-400/20 p-4 space-y-2">
            <h3 className="text-lg font-semibold text-emerald-50">Ingestion</h3>
            <ul className="space-y-2 list-disc list-inside text-brand-100/80">
              <li>Supabase Edge Function polls each subreddit every 30 minutes using OAuth.</li>
              <li>Backfills 90 days on cold starts with rate-limit-aware pagination.</li>
              <li>Stores raw payloads for reproducibility.</li>
            </ul>
          </div>
          <div className="bg-brand-400/10 rounded-2xl border border-brand-400/20 p-4 space-y-2">
            <h3 className="text-lg font-semibold text-emerald-50">Cleaning & scoring</h3>
            <ul className="space-y-2 list-disc list-inside text-brand-100/80">
              <li>Markdown stripped, language filtered, bots down-weighted via karma heuristics.</li>
              <li>Sentiment scored through HuggingFace DistilRoBERTa with confidence thresholds.</li>
              <li>Late arrivals captured via nightly re-aggregation.</li>
            </ul>
          </div>
          <div className="bg-brand-400/10 rounded-2xl border border-brand-400/20 p-4 space-y-2">
            <h3 className="text-lg font-semibold text-emerald-50">Serving</h3>
            <ul className="space-y-2 list-disc list-inside text-brand-100/80">
              <li>Daily metrics served from Supabase materialized views.</li>
              <li>Next.js (simulated here) caches responses for fast loads.</li>
              <li>CSV export streams weighted aggregates for offline review.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="quality" className="glass-panel p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-100/60">QA Loop</p>
            <h2 className="text-2xl font-semibold text-emerald-50">Human-in-the-loop review</h2>
          </div>
          <div className="flex items-center gap-3 text-sm text-brand-100/80">
            <span className="badge">Weekly 200 sample audit</span>
            <span className="badge">Model drift tracker</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-brand-100/80">
          <div className="bg-brand-400/10 rounded-2xl border border-brand-400/20 p-4 space-y-2">
            <h3 className="text-lg font-semibold text-emerald-50">Accuracy checks</h3>
            <ul className="space-y-2 list-disc list-inside text-brand-100/80">
              <li>Analysts review low-confidence items and recalibrate thresholds.</li>
              <li>Precision/recall tracked vs. labeled validation set.</li>
              <li>Escalations logged if sentiment deviates &gt;10 pts from manual labels.</li>
            </ul>
          </div>
          <div className="bg-brand-400/10 rounded-2xl border border-brand-400/20 p-4 space-y-2">
            <h3 className="text-lg font-semibold text-emerald-50">Reliability signals</h3>
            <ul className="space-y-2 list-disc list-inside text-brand-100/80">
              <li>Pipeline health banner surfaces delays & links to Supabase logs.</li>
              <li>Data freshness warnings appear if no updates in 6 hours.</li>
              <li>Exports stamped with model version + refresh time.</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="pb-10 text-xs text-brand-100/60 text-center">
        Built with love for the Codex team · Mock data for demo purposes · {new Date().getFullYear()}
      </footer>
    </main>
  );
};

export default App;
