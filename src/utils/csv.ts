import type { DailyMetric } from "../data/mockData";

const escapeCell = (value: string | number) => {
  const stringValue = typeof value === "number" ? value.toString() : value;
  if (stringValue.includes(",") || stringValue.includes("\"")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const dailyMetricsToCsv = (rows: DailyMetric[]): string => {
  const header = [
    "date",
    "subreddit",
    "avg_sentiment",
    "positive",
    "neutral",
    "negative",
    "total_items",
    "keywords"
  ];
  const lines = rows.map((row) => {
    const keywordString = row.keywords.map((keyword) => `${keyword.term}:${keyword.weight}`).join(" |");
    return [
      row.date,
      row.subreddit,
      row.avgSentiment.toFixed(3),
      row.positiveCount,
      row.neutralCount,
      row.negativeCount,
      row.totalItems,
      keywordString
    ]
      .map(escapeCell)
      .join(",");
  });
  return [header.join(","), ...lines].join("\n");
};

export const downloadCsv = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
