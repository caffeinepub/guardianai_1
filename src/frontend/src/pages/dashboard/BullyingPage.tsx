import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Loader2,
  MessageCircle,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Variant_new_reviewed_dismissed,
  useBullyingAlerts,
  useUpdateAlertStatus,
} from "../../hooks/useQueries";
import type { BullyingAlert } from "../../hooks/useQueries";
import { useDashboard } from "./DashboardLayout";

type FilterType = "all" | "new" | "reviewed" | "dismissed";

const SEVERITY_COLORS = {
  high: "oklch(0.65 0.22 25)",
  medium: "oklch(0.78 0.18 70)",
  low: "oklch(0.78 0.15 195)",
};

const PLATFORM_ICONS: Record<string, string> = {
  Instagram: "📸",
  Snapchat: "👻",
  Discord: "💬",
  TikTok: "🎵",
  WhatsApp: "📱",
  Twitter: "🐦",
  X: "🐦",
  Roblox: "🎮",
  default: "💬",
};

function getPlatformIcon(platform: string) {
  return PLATFORM_ICONS[platform] ?? PLATFORM_ICONS.default;
}

// ── Alert Card ────────────────────────────────────────────
interface AlertCardProps {
  alert: BullyingAlert;
  index: number;
  onUpdateStatus: (id: bigint, status: Variant_new_reviewed_dismissed) => void;
  isPending: boolean;
}

function AlertCard({
  alert,
  index,
  onUpdateStatus,
  isPending,
}: AlertCardProps) {
  const severityStr = String(alert.severity) as "high" | "medium" | "low";
  const statusStr = String(alert.status);
  const color = SEVERITY_COLORS[severityStr] ?? SEVERITY_COLORS.low;
  const date = new Date(Number(alert.timestamp) / 1_000_000);
  const isNew = statusStr === "new" || statusStr === "new_";

  // Obscure the snippet
  const snippet = alert.snippet;
  const obscured =
    snippet.length > 30
      ? `${snippet.slice(0, 12)}●●●●●●●●●●${snippet.slice(-8)}`
      : `${snippet.slice(0, 6)}●●●●●●`;

  return (
    <div
      data-ocid={`bullying.alert.item.${index}`}
      className={`rounded-2xl p-5 border transition-all duration-300 ${
        isNew
          ? "border-[oklch(0.65_0.22_25/0.4)] bg-[oklch(0.12_0.03_25/0.5)]"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Severity indicator */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}
          >
            {getPlatformIcon(alert.platform)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold text-foreground">
                {alert.platform}
              </span>
              <Badge
                className="text-[10px] h-4 border-0 capitalize"
                style={{ background: `${color}25`, color }}
              >
                {severityStr} severity
              </Badge>
              {isNew && (
                <Badge
                  className="text-[10px] h-4 border-0"
                  style={{
                    background: "oklch(0.65 0.22 25 / 0.3)",
                    color: "oklch(0.65 0.22 25)",
                  }}
                >
                  NEW
                </Badge>
              )}
              {statusStr === "reviewed" && (
                <Badge
                  className="text-[10px] h-4 border-0"
                  style={{
                    background: "oklch(0.2 0.06 155 / 0.3)",
                    color: "oklch(0.72 0.18 155)",
                  }}
                >
                  Reviewed
                </Badge>
              )}
              {statusStr === "dismissed" && (
                <Badge
                  className="text-[10px] h-4 border-0"
                  style={{
                    background: "oklch(0.18 0.03 265)",
                    color: "oklch(0.5 0.02 265)",
                  }}
                >
                  Dismissed
                </Badge>
              )}
            </div>
            <div
              className="font-mono text-xs py-2 px-3 rounded-lg my-2"
              style={{
                background: "oklch(0.1 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
                color: "oklch(0.7 0.02 265)",
                filter: isNew ? "blur(0px)" : "none",
              }}
            >
              "{obscured}"
            </div>
            <div className="text-[10px] text-muted-foreground">
              {date.toLocaleDateString()} at{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isNew && (
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              data-ocid={`bullying.alert.reviewed.button.${index}`}
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 border-[oklch(0.72_0.18_155/0.5)] text-[oklch(0.72_0.18_155)] hover:bg-[oklch(0.2_0.06_155/0.3)]"
              disabled={isPending}
              onClick={() =>
                onUpdateStatus(
                  alert.id,
                  Variant_new_reviewed_dismissed.reviewed,
                )
              }
            >
              {isPending ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <CheckCircle size={10} />
              )}
              Review
            </Button>
            <Button
              data-ocid={`bullying.alert.dismiss.button.${index}`}
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
              disabled={isPending}
              onClick={() =>
                onUpdateStatus(
                  alert.id,
                  Variant_new_reviewed_dismissed.dismissed,
                )
              }
            >
              <XCircle size={10} />
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bullying Page ─────────────────────────────────────────
export default function BullyingPage() {
  const { selectedChild } = useDashboard();
  const childId = selectedChild?.id ?? null;
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: alerts = [], isLoading } = useBullyingAlerts(childId);
  const updateStatus = useUpdateAlertStatus();

  const handleUpdateStatus = async (
    id: bigint,
    status: Variant_new_reviewed_dismissed,
  ) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(
        status === Variant_new_reviewed_dismissed.reviewed
          ? "Marked as reviewed"
          : "Alert dismissed",
      );
    } catch {
      toast.error("Failed to update alert status");
    }
  };

  const filtered = alerts.filter((a) => {
    const s = String(a.status);
    if (filter === "all") return true;
    if (filter === "new") return s === "new" || s === "new_";
    if (filter === "reviewed") return s === "reviewed";
    if (filter === "dismissed") return s === "dismissed";
    return true;
  });

  const newCount = alerts.filter((a) => {
    const s = String(a.status);
    return s === "new" || s === "new_";
  }).length;
  const highSeverity = alerts.filter(
    (a) => String(a.severity) === "high",
  ).length;
  const mediumSeverity = alerts.filter(
    (a) => String(a.severity) === "medium",
  ).length;

  const parentingTips = [
    {
      title: "Open the Conversation",
      content:
        "Start with empathy: 'I noticed something in your messages that concerned me. Can we talk about it?' Avoid judgment — make it safe for them to share.",
      icon: "💬",
    },
    {
      title: "Document the Evidence",
      content:
        "Screenshot harmful messages before reporting. Many platforms have built-in reporting tools for cyberbullying. Involve school administration if it involves classmates.",
      icon: "📋",
    },
    {
      title: "Build Resilience Together",
      content:
        "Teach your child that online attacks say more about the bully than about them. Consider professional counseling if the bullying has impacted their mental health.",
      icon: "💪",
    },
  ];

  return (
    <div data-ocid="bullying.page" className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Bullying Detection
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI-powered message analysis protecting{" "}
          {selectedChild?.name ?? "your child"} online
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Flagged",
            value: String(alerts.length),
            color: "oklch(0.78 0.15 195)",
          },
          {
            label: "Needs Attention",
            value: String(newCount),
            color: "oklch(0.65 0.22 25)",
          },
          {
            label: "High Severity",
            value: String(highSeverity),
            color: "oklch(0.65 0.22 25)",
          },
          {
            label: "Medium",
            value: String(mediumSeverity),
            color: "oklch(0.78 0.18 70)",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4 bg-card border border-border"
          >
            <div className="text-xs text-muted-foreground mb-1">
              {card.label}
            </div>
            <div
              className="font-display text-2xl font-bold"
              style={{ color: card.color }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs + alerts */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-brand-red" />
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Alert Feed
            </h2>
            {newCount > 0 && (
              <Badge
                className="h-5 text-[10px] border-0 px-1.5"
                style={{
                  background: "oklch(0.65 0.22 25 / 0.25)",
                  color: "oklch(0.65 0.22 25)",
                }}
              >
                {newCount} new
              </Badge>
            )}
          </div>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as FilterType)}
          >
            <TabsList className="h-7 bg-secondary">
              <TabsTrigger
                value="all"
                data-ocid="bullying.filter.tab"
                className="h-6 text-xs px-3"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="new"
                data-ocid="bullying.new.tab"
                className="h-6 text-xs px-3"
              >
                New
              </TabsTrigger>
              <TabsTrigger
                value="reviewed"
                data-ocid="bullying.reviewed.tab"
                className="h-6 text-xs px-3"
              >
                Reviewed
              </TabsTrigger>
              <TabsTrigger
                value="dismissed"
                data-ocid="bullying.dismissed.tab"
                className="h-6 text-xs px-3"
              >
                Dismissed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="bullying.alerts.empty_state"
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <Shield size={40} className="text-brand-green opacity-50" />
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "No alerts detected. Your child's chats look safe!"
                : `No ${filter} alerts.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((alert, i) => (
              <AlertCard
                key={alert.id.toString()}
                alert={alert}
                index={i + 1}
                onUpdateStatus={handleUpdateStatus}
                isPending={updateStatus.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Parenting tips */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} style={{ color: "oklch(0.68 0.22 310)" }} />
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Parenting Tips for Cyberbullying
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {parentingTips.map((tip, i) => (
            <div
              key={tip.title}
              data-ocid={`bullying.tip.card.${i + 1}`}
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{
                background: "oklch(0.16 0.04 310 / 0.3)",
                border: "1px solid oklch(0.68 0.22 310 / 0.2)",
              }}
            >
              <div className="text-2xl">{tip.icon}</div>
              <div className="font-heading font-semibold text-sm text-foreground">
                {tip.title}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tip.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
