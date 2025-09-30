import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  TimeScale,
  Tooltip,
  Legend
} from "chart.js";
import { Chart } from "react-chartjs-2";
import type { DailyMetric } from "../data/mockData";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  TimeScale,
  Tooltip,
  Legend
);

interface SentimentVolumeChartProps {
  metrics: DailyMetric[];
  onSelectDate: (date: string) => void;
  selectedDate?: string;
}

export const SentimentVolumeChart: React.FC<SentimentVolumeChartProps> = ({
  metrics,
  onSelectDate,
  selectedDate
}) => {
  const labels = metrics.map((metric) => metric.date);
  const data = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "Avg Sentiment",
        data: metrics.map((metric) => metric.avgSentiment * 100),
        borderColor: "#5c8aff",
        backgroundColor: "rgba(95, 118, 255, 0.24)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        yAxisID: "y1",
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        type: "bar" as const,
        label: "Volume",
        data: metrics.map((metric) => metric.totalItems),
        backgroundColor: labels.map((date) =>
          date === selectedDate ? "rgba(255,255,255,0.7)" : "rgba(41, 100, 255, 0.35)"
        ),
        borderRadius: 6,
        yAxisID: "y"
      }
    ]
  };

  return (
    <div className="glass-panel p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Trendlines</p>
          <h2 className="text-xl font-semibold text-white">Sentiment × Volume</h2>
          <p className="text-sm text-white/60">
            Hover to explore daily sentiment averages (0-100) and stacked discussion volume. Click any bar to drill into the
            narratives for that day.
          </p>
        </div>
        <div className="text-sm text-white/60">
          <p>
            <span className="badge">Updated nightly</span>
          </p>
        </div>
      </div>
      <Chart
        type="bar"
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#cbd5f5"
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  if (context.dataset.type === "line") {
                    return `Avg sentiment: ${context.parsed.y.toFixed(1)}%`;
                  }
                  return `Volume: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#94a3d6"
              },
              grid: {
                color: "rgba(148, 163, 214, 0.12)"
              }
            },
            y1: {
              beginAtZero: true,
              position: "right",
              min: 0,
              max: 100,
              ticks: {
                color: "#94a3d6",
                callback: (value) => `${value}%`
              },
              grid: {
                drawOnChartArea: false
              }
            },
            x: {
              ticks: {
                color: "#94a3d6",
                maxTicksLimit: 10
              },
              grid: {
                display: false
              }
            }
          },
          onClick: (_, elements) => {
            if (!elements?.length) return;
            const element = elements[0];
            const index = element.index;
            const date = labels[index];
            if (date) {
              onSelectDate(date);
            }
          }
        }}
        data={data}
        height={380}
      />
    </div>
  );
};
