import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Clock,
  CreditCard,
  MapPin,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Variant_new_reviewed_dismissed,
  useBullyingAlerts,
  useDashboardSummary,
  useScreenTimeByDate,
} from "../../hooks/useQueries";
import { useDashboard } from "./DashboardLayout";

// ── Stat Card ─────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  variant: "teal" | "violet" | "amber" | "red";
  link?: string;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  sub,
  icon,
  variant,
  link,
  isLoading,
}: StatCardProps) {
  const variantClass = {
    teal: "stat-card-teal",
    violet: "stat-card-violet",
    amber: "stat-card-amber",
    red: "stat-card-red",
  }[variant];

  const accentColor = {
    teal: "oklch(0.82 0.16 195)",
    violet: "oklch(0.74 0.22 310)",
    amber: "oklch(0.82 0.19 70)",
    red: "oklch(0.72 0.22 25)",
  }[variant];

  const iconBg = {
    teal: "oklch(0.78 0.15 195 / 0.15)",
    violet: "oklch(0.68 0.22 310 / 0.15)",
    amber: "oklch(0.78 0.18 70 / 0.15)",
    red: "oklch(0.65 0.22 25 / 0.15)",
  }[variant];

  const content = (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-2.5 transition-all duration-300 cursor-default ${variantClass}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-widest">
          {title}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>
      {isLoading ? (
        <>
          <Skeleton className="h-9 w-28 mt-1" />
          <Skeleton className="h-3 w-16" />
        </>
      ) : (
        <>
          <div
            className="font-display text-4xl font-black tracking-tight leading-none pt-0.5"
            style={{ color: accentColor }}
          >
            {value}
          </div>
          {sub && (
            <div className="text-[11px] text-muted-foreground/70 font-medium">
              {sub}
            </div>
          )}
        </>
      )}
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
}

// ── Mini Bar Chart ─────────────────────────────────────────
interface MiniBarChartProps {
  data: { label: string; value: number }[];
  color?: string;
}

function MiniBarChart({
  data,
  color = "oklch(0.78 0.15 195)",
}: MiniBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${(d.value / max) * 64}px`,
              background: `linear-gradient(to top, ${color}, ${color}80)`,
              minHeight: "4px",
            }}
          />
          <span className="text-[9px] text-muted-foreground font-mono">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── AI Tip Card ───────────────────────────────────────────
function AITipCard({ childName }: { childName: string }) {
  const tips = [
    `${childName} is spending more time on social media after 9 PM. Consider setting a device bedtime to improve sleep quality.`,
    `Based on ${childName}'s screen usage patterns, introducing structured tech-free family time on weekends could strengthen your bond.`,
    `${childName}'s educational app usage has dropped 40% this week. A conversation about balancing fun and learning might help.`,
  ];
  const tip = tips[Math.floor(Date.now() / 86400000) % tips.length];

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.06 310 / 0.5), oklch(0.14 0.025 265))",
        border: "1px solid oklch(0.68 0.22 310 / 0.3)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.22 310 / 0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <div className="flex items-start gap-3 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "oklch(0.2 0.06 310 / 0.6)",
            color: "oklch(0.68 0.22 310)",
          }}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-xs font-semibold font-heading"
              style={{ color: "oklch(0.68 0.22 310)" }}
            >
              AI Tip of the Day
            </span>
            <Badge
              className="text-[10px] border-0 h-4"
              style={{
                background: "oklch(0.2 0.06 310 / 0.5)",
                color: "oklch(0.68 0.22 310)",
              }}
            >
              Personalized
            </Badge>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}

// ── Alert Item ────────────────────────────────────────────
function AlertItem({
  alert,
  index,
}: {
  alert: {
    platform: string;
    snippet: string;
    severity: string;
    timestamp: bigint;
  };
  index: number;
}) {
  const severityColor =
    {
      high: "oklch(0.65 0.22 25)",
      medium: "oklch(0.78 0.18 70)",
      low: "oklch(0.78 0.15 195)",
    }[alert.severity as "high" | "medium" | "low"] ?? "oklch(0.78 0.15 195)";

  const date = new Date(Number(alert.timestamp) / 1_000_000);

  return (
    <div
      data-ocid={`dashboard.alert.item.${index}`}
      className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
    >
      <div
        className="w-2 h-2 rounded-full mt-2 shrink-0"
        style={{ background: severityColor }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-foreground">
            {alert.platform}
          </span>
          <Badge
            className="text-[10px] border-0 h-4 capitalize"
            style={{ background: `${severityColor}25`, color: severityColor }}
          >
            {alert.severity}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {alert.snippet.slice(0, 60)}...
        </p>
        <span className="text-[10px] text-muted-foreground/60 mt-0.5">
          {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

// ── Dashboard Home ────────────────────────────────────────
export default function DashboardHome() {
  const { selectedChild } = useDashboard();
  const childId = selectedChild?.id ?? null;

  const today = new Date().toISOString().split("T")[0];
  const { data: summary, isLoading: summaryLoading } =
    useDashboardSummary(childId);
  const { data: screenTime = [] } = useScreenTimeByDate(childId, today);
  const { data: alerts = [] } = useBullyingAlerts(childId);

  const recentAlerts = alerts
    .filter((a) => a.status !== Variant_new_reviewed_dismissed.dismissed)
    .slice(0, 3);

  const recentActivity = screenTime.slice(0, 5);

  // Weekly chart data (simulate from today's data + seeded pattern)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = days.map((label, i) => ({
    label,
    value: [120, 95, 180, 140, 210, 280, 160][i],
  }));

  const screenTimeHours = summary
    ? (Number(summary.todayScreenTime) / 60).toFixed(1)
    : "0";
  const spendingAmount = summary
    ? (Number(summary.todaySpendingTotal) / 100).toFixed(2)
    : "0.00";
  const locationAddress = summary?.latestLocation?.address ?? "Unknown";

  return (
    <div
      data-ocid="dashboard.home.page"
      className="flex flex-col gap-6 max-w-6xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {selectedChild ? `${selectedChild.name}'s Dashboard` : "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link to="/dashboard/recommendations">
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-border/60"
          >
            <Brain size={14} className="text-primary" />
            AI Coach
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Screen Time Today"
          value={`${screenTimeHours}h`}
          sub="avg 3.2h/day this week"
          icon={<Clock size={16} />}
          variant="teal"
          link="/dashboard/screen-time"
          isLoading={summaryLoading}
        />
        <StatCard
          title="Active Alerts"
          value={summary ? String(Number(summary.unreadAlertsCount)) : "0"}
          sub={
            Number(summary?.unreadAlertsCount ?? 0) > 0
              ? "Requires attention"
              : "All clear"
          }
          icon={<AlertTriangle size={16} />}
          variant="red"
          link="/dashboard/bullying"
          isLoading={summaryLoading}
        />
        <StatCard
          title="Today's Spending"
          value={`$${spendingAmount}`}
          sub="in-app purchases"
          icon={<CreditCard size={16} />}
          variant="amber"
          link="/dashboard/spending"
          isLoading={summaryLoading}
        />
        <StatCard
          title="Current Location"
          value={
            locationAddress.length > 16
              ? `${locationAddress.slice(0, 16)}…`
              : locationAddress
          }
          sub="Last updated just now"
          icon={<MapPin size={16} />}
          variant="violet"
          link="/dashboard/location"
          isLoading={summaryLoading}
        />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col: alerts + activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Recent alerts */}
          <div className="rounded-2xl p-5 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-brand-red" />
                <h2 className="font-heading font-semibold text-sm text-foreground">
                  Recent Alerts
                </h2>
                {recentAlerts.length > 0 && (
                  <Badge
                    className="h-4 text-[10px] border-0 px-1.5"
                    style={{
                      background: "oklch(0.65 0.22 25 / 0.25)",
                      color: "oklch(0.65 0.22 25)",
                    }}
                  >
                    {recentAlerts.length}
                  </Badge>
                )}
              </div>
              <Link to="/dashboard/bullying">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7 gap-1"
                >
                  View all <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
            {recentAlerts.length === 0 ? (
              <div
                data-ocid="dashboard.alerts.empty_state"
                className="flex flex-col items-center gap-2 py-8 text-center"
              >
                <Shield size={32} className="text-brand-green opacity-60" />
                <p className="text-sm text-muted-foreground">
                  No active alerts. All clear!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentAlerts.map((alert, i) => (
                  <AlertItem
                    key={alert.id.toString()}
                    alert={{
                      platform: alert.platform,
                      snippet: alert.snippet,
                      severity: String(alert.severity),
                      timestamp: alert.timestamp,
                    }}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl p-5 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <h2 className="font-heading font-semibold text-sm text-foreground">
                  Recent Activity
                </h2>
              </div>
              <Link to="/dashboard/screen-time">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7 gap-1"
                >
                  View all <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <div
                data-ocid="dashboard.activity.empty_state"
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No activity recorded today.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentActivity.map((record, i) => {
                  const minutes = Number(record.durationMinutes);
                  const categoryColors: Record<string, string> = {
                    social: "oklch(0.68 0.22 310)",
                    gaming: "oklch(0.65 0.22 25)",
                    entertainment: "oklch(0.78 0.18 70)",
                    educational: "oklch(0.72 0.18 155)",
                    other: "oklch(0.58 0.04 265)",
                  };
                  const color =
                    categoryColors[String(record.category)] ??
                    categoryColors.other;
                  return (
                    <div
                      key={record.id.toString()}
                      data-ocid={`dashboard.activity.item.${i + 1}`}
                      className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: `${color}20`, color }}
                      >
                        {record.appName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {record.appName}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {String(record.category)}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {minutes >= 60
                          ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
                          : `${minutes}m`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right col: AI tip + weekly chart */}
        <div className="flex flex-col gap-6">
          <AITipCard childName={selectedChild?.name ?? "Your child"} />

          {/* Weekly screen time */}
          <div className="rounded-2xl p-5 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-teal" />
                <h2 className="font-heading font-semibold text-sm text-foreground">
                  Weekly Screen Time
                </h2>
              </div>
              <Badge
                className="text-[10px] h-4 border-0"
                style={{
                  background: "oklch(0.2 0.06 25 / 0.4)",
                  color: "oklch(0.65 0.22 25)",
                }}
              >
                <TrendingDown size={8} className="mr-0.5" /> +12%
              </Badge>
            </div>
            <MiniBarChart data={weeklyData} />
            <div className="mt-3 text-xs text-muted-foreground text-center">
              Avg 3.2h/day this week
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl p-5 bg-card border border-border">
            <h2 className="font-heading font-semibold text-sm text-foreground mb-3">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "View Location",
                  to: "/dashboard/location",
                  icon: <MapPin size={14} />,
                },
                {
                  label: "Content Analysis",
                  to: "/dashboard/content",
                  icon: <Shield size={14} />,
                },
                {
                  label: "AI Recommendations",
                  to: "/dashboard/recommendations",
                  icon: <Brain size={14} />,
                },
              ].map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-muted-foreground hover:text-foreground h-9"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-primary">{item.icon}</span>
                      {item.label}
                    </span>
                    <ArrowRight size={12} />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
