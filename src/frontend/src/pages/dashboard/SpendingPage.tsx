import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useDashboardSummary } from "../../hooks/useQueries";
import { useDashboard } from "./DashboardLayout";

// ── Static demo spending data ─────────────────────────────
const SPENDING_DATA = [
  {
    id: "1",
    merchant: "Roblox Corporation",
    category: "Gaming",
    amount: 999,
    date: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: "2",
    merchant: "Apple App Store",
    category: "Apps",
    amount: 299,
    date: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: "3",
    merchant: "Spotify Premium",
    category: "Subscription",
    amount: 499,
    date: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "4",
    merchant: "YouTube Premium",
    category: "Subscription",
    amount: 1399,
    date: new Date(Date.now() - 4 * 86400000),
  },
  {
    id: "5",
    merchant: "Minecraft Marketplace",
    category: "Gaming",
    amount: 799,
    date: new Date(Date.now() - 5 * 86400000),
  },
  {
    id: "6",
    merchant: "Discord Nitro",
    category: "Subscription",
    amount: 999,
    date: new Date(Date.now() - 6 * 86400000),
  },
  {
    id: "7",
    merchant: "Xbox Game Pass",
    category: "Gaming",
    amount: 1499,
    date: new Date(Date.now() - 8 * 86400000),
  },
  {
    id: "8",
    merchant: "Fortnite V-Bucks",
    category: "Gaming",
    amount: 1999,
    date: new Date(Date.now() - 10 * 86400000),
  },
  {
    id: "9",
    merchant: "Amazon Prime",
    category: "Subscription",
    amount: 1499,
    date: new Date(Date.now() - 12 * 86400000),
  },
  {
    id: "10",
    merchant: "Steam - Indie Bundle",
    category: "Gaming",
    amount: 2499,
    date: new Date(Date.now() - 14 * 86400000),
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Gaming: "oklch(0.65 0.22 25)",
  Apps: "oklch(0.68 0.22 310)",
  Subscription: "oklch(0.78 0.15 195)",
  Other: "oklch(0.58 0.04 265)",
};

const MONTHLY_LIMIT = 5000; // in cents = $50

// ── Donut Chart ───────────────────────────────────────────
interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

function SpendingDonut({ slices }: { slices: DonutSlice[] }) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 55;
  const innerR = 34;
  let angle = -Math.PI / 2;

  const paths: { d: string; color: string; label: string; pct: number }[] = [];

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
      label: slice.label,
      pct: Math.round((slice.value / total) * 100),
    });
    angle += sweep;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="Spending by category"
      >
        <title>Spending by category</title>
        {paths.map((p, i) => (
          <path key={`${p.label}-${i}`} d={p.d} fill={p.color} opacity="0.9" />
        ))}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="oklch(0.95 0.01 265)"
          fontSize="14"
          fontWeight="700"
          fontFamily="Geist Mono, monospace"
        >
          ${(total / 100).toFixed(0)}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="oklch(0.58 0.04 265)"
          fontSize="9"
          fontFamily="Sora, sans-serif"
        >
          this month
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 w-full">
        {paths.map((p) => (
          <div key={p.label} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: p.color }}
            />
            <span className="text-xs text-muted-foreground flex-1">
              {p.label}
            </span>
            <span className="text-xs font-mono">{p.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Spending Page ─────────────────────────────────────────
export default function SpendingPage() {
  const { selectedChild } = useDashboard();
  const childId = selectedChild?.id ?? null;
  const { data: summary } = useDashboardSummary(childId);

  const totalMonthly = SPENDING_DATA.reduce((s, t) => s + t.amount, 0);
  const todayTotal = summary ? Number(summary.todaySpendingTotal) : 0;
  const limitPct = Math.min((totalMonthly / MONTHLY_LIMIT) * 100, 100);

  // Category breakdown
  const catTotals: Record<string, number> = {};
  for (const t of SPENDING_DATA) {
    catTotals[t.category] = (catTotals[t.category] ?? 0) + t.amount;
  }

  const donutSlices: DonutSlice[] = Object.entries(catTotals).map(
    ([label, value]) => ({
      label,
      value,
      color: CATEGORY_COLORS[label] ?? CATEGORY_COLORS.Other,
    }),
  );

  return (
    <div data-ocid="spending.page" className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Spending Monitor
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track every purchase and subscription for{" "}
          {selectedChild?.name ?? "your child"}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            Monthly Total
          </div>
          <div
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.78 0.18 70)" }}
          >
            ${(totalMonthly / 100).toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Today</div>
          <div
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.78 0.15 195)" }}
          >
            ${(todayTotal / 100).toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Transactions</div>
          <div className="font-display text-2xl font-bold text-foreground">
            {SPENDING_DATA.length}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Top Category</div>
          <div
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.65 0.22 25)" }}
          >
            Gaming
          </div>
        </div>
      </div>

      {/* Budget limit */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Monthly Budget Limit
          </h2>
          <span className="text-sm font-mono text-muted-foreground">
            ${(totalMonthly / 100).toFixed(2)} / $
            {(MONTHLY_LIMIT / 100).toFixed(2)}
          </span>
        </div>
        <Progress
          value={limitPct}
          className="h-2.5"
          style={{
            ["--progress-background" as string]:
              limitPct > 80
                ? "oklch(0.65 0.22 25)"
                : limitPct > 60
                  ? "oklch(0.78 0.18 70)"
                  : "oklch(0.78 0.15 195)",
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{limitPct.toFixed(0)}% used</span>
          <span>
            ${((MONTHLY_LIMIT - totalMonthly) / 100).toFixed(2)} remaining
          </span>
        </div>
        {limitPct > 80 && (
          <div
            className="mt-3 flex items-center gap-2 text-xs p-2 rounded-lg"
            style={{
              background: "oklch(0.65 0.22 25 / 0.15)",
              color: "oklch(0.65 0.22 25)",
            }}
          >
            <TrendingUp size={12} />
            Approaching monthly limit. Consider reviewing subscriptions.
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Transaction table */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-primary" />
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Transaction History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">
                    Merchant
                  </th>
                  <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPENDING_DATA.map((tx, i) => {
                  const color =
                    CATEGORY_COLORS[tx.category] ?? CATEGORY_COLORS.Other;
                  return (
                    <tr
                      key={tx.id}
                      data-ocid={`spending.table.row.${i + 1}`}
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: `${color}20` }}
                          >
                            <ShoppingBag size={10} style={{ color }} />
                          </div>
                          <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                            {tx.merchant}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 hidden sm:table-cell">
                        <Badge
                          className="text-[10px] h-5 border-0"
                          style={{ background: `${color}20`, color }}
                        >
                          {tx.category}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-muted-foreground hidden md:table-cell">
                        {tx.date.toLocaleDateString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-sm font-semibold text-foreground">
                        ${(tx.amount / 100).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category donut */}
        <div className="rounded-2xl p-5 bg-card border border-border flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "oklch(0.78 0.18 70)" }}
            />
            <h2 className="font-heading font-semibold text-sm text-foreground">
              By Category
            </h2>
          </div>
          <SpendingDonut slices={donutSlices} />
        </div>
      </div>
    </div>
  );
}
