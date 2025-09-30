export type SentimentLabel = "positive" | "neutral" | "negative";

export interface ExampleItem {
  id: string;
  title: string;
  body: string;
  permalink: string;
  sentiment: SentimentLabel;
  confidence: number;
  score: number;
  subreddit: string;
  createdAt: string;
}

export interface DailyMetric {
  date: string;
  subreddit: string;
  avgSentiment: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalItems: number;
  keywords: { term: string; weight: number }[];
  examples: ExampleItem[];
}

export const SUBREDDITS = [
  "All",
  "r/ChatGPT",
  "r/OpenAI",
  "r/ChatGPTPro",
  "r/codex"
] as const;

const KEYWORD_BANK = [
  "release notes",
  "pricing",
  "latency",
  "prompting",
  "workflow",
  "automation",
  "debugging",
  "agents",
  "API quota",
  "fine-tuning",
  "benchmark",
  "roadmap",
  "community",
  "feedback",
  "integration",
  "CLI",
  "IDE",
  "templates",
  "quality",
  "support"
];

const SAMPLE_POSTS = [
  "Ship it! The latest Codex CLI drop finally fixed my deployment script.",
  "Still seeing latency spikes when switching workspaces—any ideas?",
  "Codex Cloud agent absolutely crushed my onboarding checklist today.",
  "Would love better docs for the VS Code extension—stuck on auth loop.",
  "Pricing is fair for hobby usage but the Pro tier could use more seats.",
  "Anyone automating QA with Codex yet? Curious about workflows.",
  "The new templates are 🔥 but exporting them is still clunky.",
  "HuggingFace sentiment combo works, but I'd love in-product labeling.",
  "Great community write-up on integrating Slack alerts with Codex.",
  "Can we get better metrics on prompt success rate in the dashboard?"
];

const random = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const generator = random(42);

const createExamples = (
  subreddit: string,
  date: string,
  sentimentBalance: number
): ExampleItem[] => {
  return Array.from({ length: 4 }).map((_, idx) => {
    const raw = SAMPLE_POSTS[Math.floor(generator() * SAMPLE_POSTS.length)];
    const sentimentRoll = generator();
    const sentiment: SentimentLabel =
      sentimentRoll + sentimentBalance > 0.7
        ? "positive"
        : sentimentRoll + sentimentBalance < 0.35
        ? "negative"
        : "neutral";
    return {
      id: `${date}-${subreddit}-${idx}`,
      title: raw.split("—")[0] ?? raw,
      body: raw,
      permalink: `https://reddit.com/${subreddit.replace("r/", "r/")}/posts/${idx}`,
      sentiment,
      confidence: 0.6 + generator() * 0.35,
      score: Math.round(generator() * 420),
      subreddit,
      createdAt: date
    };
  });
};

const createKeywords = (weightBias: number) => {
  const keywords = [...KEYWORD_BANK]
    .sort(() => generator() - 0.5)
    .slice(0, 8)
    .map((term, index) => ({
      term,
      weight: Math.round((1.2 - index * 0.07 + weightBias * generator()) * 100) / 100
    }));
  return keywords;
};

const generateSubredditMetrics = (subreddit: string): DailyMetric[] => {
  const today = new Date();
  return Array.from({ length: 90 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (89 - index));
    const isoDate = date.toISOString().slice(0, 10);
    const seasonal = Math.sin(index / 12);
    const volumeBase = subreddit === "r/codex" ? 120 : 200;
    const surgeMultiplier = 1 + Math.max(0, seasonal) * (subreddit === "r/OpenAI" ? 1.4 : 0.9);
    const totalItems = Math.round((volumeBase + generator() * 80) * surgeMultiplier);
    const sentimentDrift =
      0.48 +
      seasonal * 0.18 +
      (subreddit === "r/ChatGPTPro" ? 0.05 : 0) -
      (subreddit === "r/OpenAI" ? 0.03 : 0) +
      generator() * 0.08;
    const avgSentiment = Math.max(0.15, Math.min(0.85, sentimentDrift));
    const positiveCount = Math.round(totalItems * avgSentiment * 0.6);
    const negativeCount = Math.round(totalItems * (1 - avgSentiment) * 0.35);
    const neutralCount = Math.max(totalItems - positiveCount - negativeCount, 0);

    const keywords = createKeywords(avgSentiment - 0.5);
    const examples = createExamples(subreddit, isoDate, avgSentiment - 0.5);

    return {
      date: isoDate,
      subreddit,
      avgSentiment,
      positiveCount,
      neutralCount,
      negativeCount,
      totalItems,
      keywords,
      examples
    };
  });
};

const cache = new Map<string, DailyMetric[]>();

export const getDailyMetrics = (subreddit: string): DailyMetric[] => {
  if (cache.has(subreddit)) {
    return cache.get(subreddit)!;
  }
  if (subreddit === "All") {
    const subMetrics = SUBREDDITS.filter((s) => s !== "All").map((s) => getDailyMetrics(s));
    const combined: DailyMetric[] = [];
    for (let day = 0; day < 90; day++) {
      const date = subMetrics[0][day].date;
      const totalItems = subMetrics.reduce((sum, list) => sum + list[day].totalItems, 0);
      const positiveCount = subMetrics.reduce((sum, list) => sum + list[day].positiveCount, 0);
      const negativeCount = subMetrics.reduce((sum, list) => sum + list[day].negativeCount, 0);
      const neutralCount = subMetrics.reduce((sum, list) => sum + list[day].neutralCount, 0);
      const avgSentiment = totalItems
        ? (subMetrics.reduce((sum, list) => sum + list[day].avgSentiment * list[day].totalItems, 0) /
            totalItems)
        : 0.5;
      const keywords = subMetrics
        .flatMap((list) => list[day].keywords)
        .reduce<Record<string, number>>((acc, keyword) => {
          acc[keyword.term] = (acc[keyword.term] ?? 0) + keyword.weight;
          return acc;
        }, {});
      const normalizedKeywords = Object.entries(keywords)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([term, weight]) => ({ term, weight: Math.round(weight * 100) / 100 }));
      const examples = subMetrics.flatMap((list) => list[day].examples).slice(0, 6);
      combined.push({
        date,
        subreddit,
        avgSentiment,
        positiveCount,
        negativeCount,
        neutralCount,
        totalItems,
        keywords: normalizedKeywords,
        examples
      });
    }
    cache.set(subreddit, combined);
    return combined;
  }
  const metrics = generateSubredditMetrics(subreddit);
  cache.set(subreddit, metrics);
  return metrics;
};
