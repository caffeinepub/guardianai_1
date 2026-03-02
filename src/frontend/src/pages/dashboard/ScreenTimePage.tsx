import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useScreenTimeByDate } from "../../hooks/useQueries";
import type { ScreenTimeRecord } from "../../hooks/useQueries";
import { useDashboard } from "./DashboardLayout";

// ── Category colors ───────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  social: "oklch(0.68 0.22 310)",
  gaming: "oklch(0.65 0.22 25)",
  entertainment: "oklch(0.78 0.18 70)",
  educational: "oklch(0.72 0.18 155)",
  other: "oklch(0.58 0.04 265)",
};

const CATEGORY_LABELS: Record<string, string> = {
  social: "Social",
  gaming: "Gaming",
  entertainment: "Entertainment",
  educational: "Educational",
  other: "Other",
};

// ── Bar Chart ─────────────────────────────────────────────
function AppBarChart({ records }: { records: ScreenTimeRecord[] }) {
  const sorted = [...records]
    .sort((a, b) => Number(b.durationMinutes) - Number(a.durationMinutes))
    .slice(0, 8);
  const max = Math.max(...sorted.map((r) => Number(r.durationMinutes)), 1);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((record, i) => {
        const mins = Number(record.durationMinutes);
        const pct = (mins / max) * 100;
        const color =
          CATEGORY_COLORS[String(record.category)] ?? CATEGORY_COLORS.other;
        return (
          <div key={record.id.toString()} className="flex items-center gap-3">
            <div className="w-24 text-xs text-muted-foreground truncate font-medium">
              {record.appName}
            </div>
            <div className="flex-1 h-6 rounded-sm overflow-hidden bg-secondary/40 relative">
              <div
                className="h-full rounded-sm transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(to right, ${color}, ${color}80)`,
                  transitionDelay: `${i * 60}ms`,
                }}
              />
            </div>
            <div className="w-12 text-right text-xs font-mono text-muted-foreground">
              {mins >= 60
                ? `${Math.floor(mins / 60)}h${mins % 60}m`
                : `${mins}m`}
            </div>
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: color }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Donut Chart (SVG) ──────────────────────────────────────
interface DonutSlice {
  category: string;
  value: number;
  color: string;
}

function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const innerR = 36;

  let angle = -Math.PI / 2;
  const paths: { d: string; color: string; category: string; pct: number }[] =
    [];

  for (const slice of slices) {
    const sweep = (slice.value / total) * 2 * Math.PI;
    if (sweep < 0.01) continue;

    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + sweep);
    const y2 = cy + r * Math.sin(angle + sweep);
    const ix1 = cx + innerR * Math.cos(angle);
    const iy1 = cy + innerR * Math.sin(angle);
    const ix2 = cx + innerR * Math.cos(angle + sweep);
    const iy2 = cy + innerR * Math.sin(angle + sweep);

    const largeArc = sweep > Math.PI ? 1 : 0;

    paths.push({
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`,
      color: slice.color,
      category: slice.category,
      pct: Math.round((slice.value / total) * 100),
    });

    angle += sweep;
  }

  const totalHours = (total / 60).toFixed(1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label="Screen time by category"
        >
          <title>Screen time by category</title>
          {paths.map((p, i) => (
            <path
              key={`${p.category}-${i}`}
              d={p.d}
              fill={p.color}
              opacity="0.9"
              className="transition-opacity hover:opacity-100"
            />
          ))}
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="oklch(0.95 0.01 265)"
            fontSize="18"
            fontWeight="700"
            fontFamily="Geist Mono, monospace"
          >
            {totalHours}h
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill="oklch(0.58 0.04 265)"
            fontSize="10"
            fontFamily="Sora, sans-serif"
          >
            total today
          </text>
        </svg>
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {paths.map((p) => (
          <div key={p.category} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: p.color }}
            />
            <span className="text-xs text-muted-foreground">
              {CATEGORY_LABELS[p.category] ?? p.category}
            </span>
            <span className="text-xs font-mono ml-auto">{p.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen Time Page ──────────────────────────────────────
export default function ScreenTimePage() {
  const { selectedChild } = useDashboard();
  const childId = selectedChild?.id ?? null;
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: records = [], isLoading } = useScreenTimeByDate(childId, date);

  // Category breakdown for donut
  const categoryTotals: Record<string, number> = {};
  for (const r of records) {
    const cat = String(r.category);
    categoryTotals[cat] =
      (categoryTotals[cat] ?? 0) + Number(r.durationMinutes);
  }

  const donutSlices: DonutSlice[] = Object.entries(categoryTotals).map(
    ([cat, value]) => ({
      category: cat,
      value,
      color: CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other,
    }),
  );

  const totalMinutes = records.reduce(
    (s, r) => s + Number(r.durationMinutes),
    0,
  );

  return (
    <div data-ocid="screen_time.page" className="flex flex-col gap-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Screen Time
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Per-app usage analytics for {selectedChild?.name ?? "your child"}
          </p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="h-9 rounded-lg px-3 text-sm border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          data-ocid="screen_time.date.input"
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Today",
            value:
              totalMinutes >= 60
                ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                : `${totalMinutes}m`,
            color: "oklch(0.78 0.15 195)",
          },
          {
            label: "Apps Used",
            value: String(records.length),
            color: "oklch(0.68 0.22 310)",
          },
          {
            label: "Most Used",
            value:
              records.length > 0
                ? [...records].sort(
                    (a, b) =>
                      Number(b.durationMinutes) - Number(a.durationMinutes),
                  )[0].appName
                : "—",
            color: "oklch(0.78 0.18 70)",
          },
          {
            label: "Educational",
            value: `${Math.round(((categoryTotals.educational ?? 0) / (totalMinutes || 1)) * 100)}%`,
            color: "oklch(0.72 0.18 155)",
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
              className="font-display text-xl font-bold truncate"
              style={{ color: card.color }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-card border border-border">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <h2 className="font-heading font-semibold text-sm text-foreground">
                App Usage Breakdown
              </h2>
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 rounded" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div
              data-ocid="screen_time.chart.empty_state"
              className="py-16 text-center text-sm text-muted-foreground"
            >
              No screen time recorded for this date
            </div>
          ) : (
            <AppBarChart records={records} />
          )}
        </div>

        {/* Donut chart */}
        <div className="rounded-2xl p-5 bg-card border border-border flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "oklch(0.78 0.15 195)" }}
            />
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Category Split
            </h2>
          </div>
          {isLoading ? (
            <Skeleton className="h-40 rounded-full mx-auto w-40" />
          ) : donutSlices.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No data
            </div>
          ) : (
            <DonutChart slices={donutSlices} />
          )}
        </div>
      </div>

      {/* App table */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <h2 className="font-heading font-semibold text-sm text-foreground mb-4">
          All Apps
        </h2>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 rounded" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div
            data-ocid="screen_time.table.empty_state"
            className="py-8 text-center text-sm text-muted-foreground"
          >
            No app data for this date
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">
                    App
                  </th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="text-right py-2 pr-4 text-xs font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...records]
                  .sort(
                    (a, b) =>
                      Number(b.durationMinutes) - Number(a.durationMinutes),
                  )
                  .map((record, i) => {
                    const mins = Number(record.durationMinutes);
                    const pct = Math.round((mins / totalMinutes) * 100);
                    const color =
                      CATEGORY_COLORS[String(record.category)] ??
                      CATEGORY_COLORS.other;
                    return (
                      <tr
                        key={record.id.toString()}
                        data-ocid={`screen_time.table.row.${i + 1}`}
                        className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                              style={{ background: `${color}20`, color }}
                            >
                              {record.appName[0]}
                            </div>
                            <span className="font-medium text-foreground">
                              {record.appName}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge
                            className="text-[10px] h-5 border-0 capitalize"
                            style={{ background: `${color}20`, color }}
                          >
                            {String(record.category)}
                          </Badge>
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">
                          {mins >= 60
                            ? `${Math.floor(mins / 60)}h ${mins % 60}m`
                            : `${mins}m`}
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, background: color }}
                              />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground w-8">
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
