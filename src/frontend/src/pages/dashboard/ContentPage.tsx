import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Filter,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useDashboard } from "./DashboardLayout";

// ── Static demo content data ─────────────────────────────
const CONTENT_ITEMS = [
  {
    id: "1",
    title: "YouTube - Gaming Highlights Compilation",
    url: "youtube.com/watch?v=...",
    category: "gaming",
    riskScore: 12,
    flagged: false,
    timestamp: Date.now() - 2 * 3600 * 1000,
  },
  {
    id: "2",
    title: "Reddit Post - Controversial Discussion Thread",
    url: "reddit.com/r/teenagers/...",
    category: "social",
    riskScore: 68,
    flagged: true,
    timestamp: Date.now() - 4 * 3600 * 1000,
  },
  {
    id: "3",
    title: "TikTok - Viral Dance Challenge",
    url: "tiktok.com/@user/video/...",
    category: "entertainment",
    riskScore: 22,
    flagged: false,
    timestamp: Date.now() - 5 * 3600 * 1000,
  },
  {
    id: "4",
    title: "Discord Server - Online Gaming Community",
    url: "discord.gg/...",
    category: "social",
    riskScore: 75,
    flagged: true,
    timestamp: Date.now() - 6 * 3600 * 1000,
  },
  {
    id: "5",
    title: "Khan Academy - Algebra Fundamentals",
    url: "khanacademy.org/math/algebra",
    category: "educational",
    riskScore: 2,
    flagged: false,
    timestamp: Date.now() - 7 * 3600 * 1000,
  },
  {
    id: "6",
    title: "Instagram - Influencer Profile Page",
    url: "instagram.com/user_profile/",
    category: "social",
    riskScore: 45,
    flagged: false,
    timestamp: Date.now() - 9 * 3600 * 1000,
  },
  {
    id: "7",
    title: "Adult Content Site - Explicit Material",
    url: "example-site.com/...",
    category: "other",
    riskScore: 98,
    flagged: true,
    timestamp: Date.now() - 10 * 3600 * 1000,
  },
  {
    id: "8",
    title: "Minecraft Wiki - Building Guide",
    url: "minecraft.fandom.com/wiki/...",
    category: "gaming",
    riskScore: 5,
    flagged: false,
    timestamp: Date.now() - 12 * 3600 * 1000,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  social: "oklch(0.68 0.22 310)",
  gaming: "oklch(0.65 0.22 25)",
  entertainment: "oklch(0.78 0.18 70)",
  educational: "oklch(0.72 0.18 155)",
  other: "oklch(0.58 0.04 265)",
};

function riskColor(score: number): string {
  if (score >= 70) return "oklch(0.65 0.22 25)";
  if (score >= 40) return "oklch(0.78 0.18 70)";
  return "oklch(0.72 0.18 155)";
}

function riskLabel(score: number): string {
  if (score >= 70) return "High Risk";
  if (score >= 40) return "Medium";
  return "Low";
}

// ── Risk Bar ──────────────────────────────────────────────
function RiskBar({ score }: { score: number }) {
  const color = riskColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono w-8" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

// ── Content Page ──────────────────────────────────────────
export default function ContentPage() {
  const { selectedChild } = useDashboard();
  const [filter, setFilter] = useState<"all" | "flagged">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const avgRisk = Math.round(
    CONTENT_ITEMS.reduce((s, c) => s + c.riskScore, 0) / CONTENT_ITEMS.length,
  );
  const flaggedCount = CONTENT_ITEMS.filter((c) => c.flagged).length;

  const categories = [
    "all",
    ...Array.from(new Set(CONTENT_ITEMS.map((c) => c.category))),
  ];

  const filtered = CONTENT_ITEMS.filter((item) => {
    if (filter === "flagged" && !item.flagged) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter)
      return false;
    return true;
  });

  // Category breakdown
  const catBreakdown: Record<string, { total: number; flagged: number }> = {};
  for (const item of CONTENT_ITEMS) {
    if (!catBreakdown[item.category])
      catBreakdown[item.category] = { total: 0, flagged: 0 };
    catBreakdown[item.category].total++;
    if (item.flagged) catBreakdown[item.category].flagged++;
  }

  return (
    <div data-ocid="content.page" className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Content Analysis
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI-powered content safety scanning for{" "}
          {selectedChild?.name ?? "your child"}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            Avg Risk Score
          </div>
          <div
            className="font-display text-2xl font-bold"
            style={{ color: riskColor(avgRisk) }}
          >
            {avgRisk}/100
          </div>
        </div>
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            Sites Scanned
          </div>
          <div className="font-display text-2xl font-bold text-foreground">
            {CONTENT_ITEMS.length}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            Flagged Content
          </div>
          <div
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.65 0.22 25)" }}
          >
            {flaggedCount}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Safe Sites</div>
          <div
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.72 0.18 155)" }}
          >
            {CONTENT_ITEMS.length - flaggedCount}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <h2 className="font-heading font-semibold text-sm text-foreground mb-4">
          Category Breakdown
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(catBreakdown).map(([cat, data]) => {
            const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
            return (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="text-xs font-medium text-foreground capitalize">
                      {cat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {data.total} pages
                    </span>
                    {data.flagged > 0 && (
                      <Badge
                        className="text-[10px] h-4 border-0"
                        style={{
                          background: "oklch(0.65 0.22 25 / 0.25)",
                          color: "oklch(0.65 0.22 25)",
                        }}
                      >
                        {data.flagged} flagged
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(data.total / CONTENT_ITEMS.length) * 100}%`,
                      background: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content list */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Browsed Content
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as "all" | "flagged")}
            >
              <TabsList className="h-7 bg-secondary">
                <TabsTrigger
                  value="all"
                  data-ocid="content.filter.tab"
                  className="h-6 text-xs px-3"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="flagged"
                  data-ocid="content.flagged.tab"
                  className="h-6 text-xs px-3"
                >
                  Flagged Only
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-7 rounded-md px-2 text-xs border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              data-ocid="content.category.select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div
              data-ocid="content.list.empty_state"
              className="py-8 text-center text-sm text-muted-foreground"
            >
              No content matches the selected filter
            </div>
          ) : (
            filtered.map((item, i) => {
              const color =
                CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other;
              const date = new Date(item.timestamp);
              return (
                <div
                  key={item.id}
                  data-ocid={`content.item.${i + 1}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${color}20`, color }}
                  >
                    <Shield size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.flagged && (
                          <Badge
                            className="text-[10px] h-4 border-0 gap-0.5"
                            style={{
                              background: "oklch(0.65 0.22 25 / 0.25)",
                              color: "oklch(0.65 0.22 25)",
                            }}
                          >
                            <AlertCircle size={8} />
                            Flagged
                          </Badge>
                        )}
                        <Badge
                          className="text-[10px] h-4 border-0 capitalize"
                          style={{ background: `${color}20`, color }}
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex-1 max-w-[200px]">
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          Risk: {riskLabel(item.riskScore)}
                        </div>
                        <RiskBar score={item.riskScore} />
                      </div>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
