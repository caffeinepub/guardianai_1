import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Heart,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useDashboard } from "./DashboardLayout";

type CategoryFilter =
  | "all"
  | "screen_time"
  | "content"
  | "social"
  | "financial"
  | "wellbeing";

// ── Static recommendations ────────────────────────────────
const RECOMMENDATIONS = [
  {
    id: "1",
    tipType: "screen_time",
    priority: 1,
    read: false,
    icon: <Clock size={18} />,
    color: "oklch(0.78 0.15 195)",
    title: "Reduce Evening Screen Time",
    content:
      "Your child uses devices for an average of 3.8 hours after 7 PM. Research shows screen light suppresses melatonin production, impacting sleep quality. Try implementing a 'device sunset' at 8:30 PM on school nights to improve their sleep by up to 45 minutes.",
  },
  {
    id: "2",
    tipType: "content",
    priority: 1,
    read: false,
    icon: <Shield size={18} />,
    color: "oklch(0.65 0.22 25)",
    title: "Review Discord Server Access",
    content:
      "We've detected activity in Discord servers with mature content. Consider reviewing server memberships together. Use this as an opportunity to discuss online community safety — servers with good moderation are much safer than unmoderated ones.",
  },
  {
    id: "3",
    tipType: "social",
    priority: 2,
    read: false,
    icon: <Users size={18} />,
    color: "oklch(0.68 0.22 310)",
    title: "Social Media Balance Strategy",
    content:
      "Instagram usage has increased 60% this month. Consider the 1:1 rule — for every hour on social media, encourage one hour of in-person social interaction. This helps maintain genuine relationships and reduces comparison anxiety.",
  },
  {
    id: "4",
    tipType: "financial",
    priority: 1,
    read: false,
    icon: <CreditCard size={18} />,
    color: "oklch(0.78 0.18 70)",
    title: "In-App Purchase Education",
    content:
      "This month's gaming purchases totaled $41.95. This is a great opportunity to teach financial literacy. Try a monthly 'digital allowance' approach — give your child a set budget for digital purchases and let them prioritize spending. This builds real-world money management skills.",
  },
  {
    id: "5",
    tipType: "wellbeing",
    priority: 2,
    read: false,
    icon: <Heart size={18} />,
    color: "oklch(0.72 0.18 155)",
    title: "Encourage Offline Hobbies",
    content:
      "Total screen time this week was 24.5 hours — about 3.5 hours/day. Introducing a structured offline hobby like sport, art, or music can naturally reduce screen time. Kids who have strong offline interests are 3x less likely to develop problematic phone usage patterns.",
  },
  {
    id: "6",
    tipType: "screen_time",
    priority: 3,
    read: true,
    icon: <Clock size={18} />,
    color: "oklch(0.78 0.15 195)",
    title: "Leverage Educational App Time",
    content:
      "Educational app usage is only 8% of total screen time. Apps like Duolingo, Khan Academy, or Brilliant can make learning feel like entertainment. Challenge: replace 30 minutes of gaming per day with an educational app for 2 weeks and compare mood and performance.",
  },
  {
    id: "7",
    tipType: "social",
    priority: 2,
    read: true,
    icon: <Users size={18} />,
    color: "oklch(0.68 0.22 310)",
    title: "Family Tech-Free Dinners",
    content:
      "Research by the Journal of Adolescent Health found that families who eat together without devices report 40% better communication and reduced depression risk in teens. Start small with just 3 device-free dinners per week.",
  },
  {
    id: "8",
    tipType: "wellbeing",
    priority: 3,
    read: true,
    icon: <Heart size={18} />,
    color: "oklch(0.72 0.18 155)",
    title: "Positive Reinforcement Works",
    content:
      "Your child has been respecting screen time limits this week. Acknowledge this! Positive reinforcement is 3x more effective than restrictions at building long-term healthy habits. Consider a reward system that celebrates good digital citizenship.",
  },
];

const FILTER_ICONS: Record<string, React.ReactNode> = {
  all: <Sparkles size={12} />,
  screen_time: <Clock size={12} />,
  content: <Shield size={12} />,
  social: <Users size={12} />,
  financial: <CreditCard size={12} />,
  wellbeing: <Heart size={12} />,
};

const FILTER_LABELS: Record<string, string> = {
  all: "All",
  screen_time: "Screen Time",
  content: "Content",
  social: "Social",
  financial: "Financial",
  wellbeing: "Wellbeing",
};

// ── Recommendation Card ───────────────────────────────────
interface RecCardProps {
  rec: (typeof RECOMMENDATIONS)[0];
  index: number;
  onRead: (id: string) => void;
}

function RecCard({ rec, index, onRead }: RecCardProps) {
  return (
    <button
      type="button"
      data-ocid={`recommendations.item.${index}`}
      className={`w-full text-left rounded-2xl p-5 border transition-all duration-300 cursor-pointer hover:border-primary/30 ${
        rec.read
          ? "border-border bg-card opacity-70"
          : "border-[oklch(0.78_0.15_195/0.3)] bg-card"
      }`}
      onClick={() => !rec.read && onRead(rec.id)}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `${rec.color}20`,
            border: `1px solid ${rec.color}40`,
            color: rec.color,
          }}
        >
          {rec.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold text-foreground">
                  {rec.title}
                </span>
                {!rec.read && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: rec.color }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className="text-[10px] h-4 border-0 capitalize"
                  style={{ background: `${rec.color}20`, color: rec.color }}
                >
                  {FILTER_LABELS[rec.tipType] ?? rec.tipType}
                </Badge>
                <Badge
                  className="text-[10px] h-4 border-0"
                  style={{
                    background:
                      rec.priority === 1
                        ? "oklch(0.65 0.22 25 / 0.25)"
                        : rec.priority === 2
                          ? "oklch(0.78 0.18 70 / 0.25)"
                          : "oklch(0.18 0.03 265)",
                    color:
                      rec.priority === 1
                        ? "oklch(0.65 0.22 25)"
                        : rec.priority === 2
                          ? "oklch(0.78 0.18 70)"
                          : "oklch(0.5 0.04 265)",
                  }}
                >
                  {rec.priority === 1
                    ? "High Priority"
                    : rec.priority === 2
                      ? "Medium"
                      : "Low"}
                </Badge>
              </div>
            </div>
            {rec.read ? (
              <CheckCircle
                size={16}
                className="text-muted-foreground shrink-0 mt-0.5"
              />
            ) : (
              <ChevronRight
                size={14}
                className="text-muted-foreground shrink-0 mt-0.5"
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {rec.content}
          </p>
        </div>
      </div>
    </button>
  );
}

// ── Recommendations Page ──────────────────────────────────
export default function RecommendationsPage() {
  const { selectedChild } = useDashboard();
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [recs, setRecs] = useState(RECOMMENDATIONS);

  const handleRead = (id: string) => {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, read: true } : r)),
    );
  };

  const unreadCount = recs.filter((r) => !r.read).length;

  const filtered = recs.filter((r) => {
    if (filter === "all") return true;
    return r.tipType === filter;
  });

  const weeklyHighlights = [
    { label: "Screen time up", value: "+12%", color: "oklch(0.65 0.22 25)" },
    { label: "Social media", value: "4.2h/day", color: "oklch(0.68 0.22 310)" },
    {
      label: "Education apps",
      value: "8% of time",
      color: "oklch(0.72 0.18 155)",
    },
    { label: "Safe zones visited", value: "3", color: "oklch(0.78 0.15 195)" },
  ];

  return (
    <div
      data-ocid="recommendations.page"
      className="flex flex-col gap-6 max-w-5xl"
    >
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          AI Parenting Coach
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Personalized recommendations for {selectedChild?.name ?? "your child"}
          's digital wellbeing
        </p>
      </div>

      {/* Weekly report card */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.06 195 / 0.5), oklch(0.14 0.025 265), oklch(0.18 0.06 310 / 0.3))",
          border: "1px solid oklch(0.78 0.15 195 / 0.3)",
          boxShadow: "0 0 40px oklch(0.78 0.15 195 / 0.1)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.15 195 / 0.1) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div className="flex items-start gap-4 relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.2 0.06 195 / 0.5)",
              color: "oklch(0.78 0.15 195)",
            }}
          >
            <Brain size={22} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading font-bold text-base text-foreground">
                Weekly AI Report — {selectedChild?.name ?? "Your Child"}
              </span>
              <Badge
                className="text-[10px] h-4 border-0"
                style={{
                  background: "oklch(0.2 0.06 195 / 0.5)",
                  color: "oklch(0.78 0.15 195)",
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              This week showed some positive trends in educational engagement,
              though screen time overall increased. The AI has flagged 2
              high-priority areas requiring attention and prepared 8
              personalized recommendations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {weeklyHighlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-lg p-2.5"
                  style={{ background: "oklch(0.12 0.025 265 / 0.5)" }}
                >
                  <div
                    className="font-mono text-base font-bold"
                    style={{ color: h.color }}
                  >
                    {h.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unread count */}
      {unreadCount > 0 && (
        <div
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl"
          style={{
            background: "oklch(0.2 0.06 195 / 0.2)",
            border: "1px solid oklch(0.78 0.15 195 / 0.3)",
            color: "oklch(0.78 0.15 195)",
          }}
        >
          <Sparkles size={14} />
          <span>
            {unreadCount} unread recommendations — click to mark as read
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {(Object.keys(FILTER_LABELS) as CategoryFilter[]).map((key) => (
          <Button
            key={key}
            data-ocid="recommendations.filter.tab"
            variant={filter === key ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs shrink-0 gap-1.5 ${filter === key ? "bg-primary text-primary-foreground" : "border-border/60 text-muted-foreground"}`}
            onClick={() => setFilter(key)}
          >
            {FILTER_ICONS[key]}
            {FILTER_LABELS[key]}
          </Button>
        ))}
      </div>

      {/* Recommendations list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div
            data-ocid="recommendations.list.empty_state"
            className="flex flex-col items-center gap-3 py-12 text-center rounded-2xl bg-card border border-border"
          >
            <Brain size={40} className="text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground">
              No recommendations in this category yet
            </p>
          </div>
        ) : (
          filtered.map((rec, i) => (
            <RecCard key={rec.id} rec={rec} index={i + 1} onRead={handleRead} />
          ))
        )}
      </div>
    </div>
  );
}
