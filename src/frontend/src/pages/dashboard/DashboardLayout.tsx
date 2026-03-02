import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Brain,
  Clock,
  CreditCard,
  ExternalLink,
  Home,
  MapPin,
  Menu,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  useDashboardSummary,
  useSeedAndChildren,
} from "../../hooks/useQueries";
import type { ChildProfile } from "../../hooks/useQueries";

// ── Context ───────────────────────────────────────────────
interface DashboardContextType {
  selectedChild: ChildProfile | null;
  setSelectedChildId: (id: string) => void;
  children: ChildProfile[];
  isLoading: boolean;
}

export const DashboardContext = createContext<DashboardContextType>({
  selectedChild: null,
  setSelectedChildId: () => {},
  children: [],
  isLoading: true,
});

export function useDashboard() {
  return useContext(DashboardContext);
}

// ── Nav Item ──────────────────────────────────────────────
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  ocid: string;
  badge?: number;
  exact?: boolean;
  onClick?: () => void;
}

function NavItem({
  to,
  icon,
  label,
  ocid,
  badge,
  exact,
  onClick,
}: NavItemProps) {
  const matchRoute = useMatchRoute();
  const isActive = exact
    ? matchRoute({ to, fuzzy: false }) !== false
    : matchRoute({ to, fuzzy: true }) !== false;

  return (
    <Link
      to={to}
      data-ocid={ocid}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative overflow-hidden ${
        isActive
          ? "nav-item-active"
          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
      }`}
    >
      <span
        className={`w-5 h-5 shrink-0 transition-all duration-150 ${isActive ? "scale-105" : "group-hover:scale-110"}`}
        style={isActive ? { color: "oklch(0.85 0.16 195)" } : {}}
      >
        {icon}
      </span>
      <span className="flex-1 tracking-tight">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge
          className="text-[11px] h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center font-semibold"
          style={{
            background: "oklch(0.65 0.22 25 / 0.9)",
            color: "oklch(0.98 0 0)",
            border: "none",
            boxShadow: "0 0 8px oklch(0.65 0.22 25 / 0.4)",
          }}
        >
          {badge}
        </Badge>
      )}
    </Link>
  );
}

// ── Sidebar ───────────────────────────────────────────────
interface SidebarProps {
  alertCount: number;
  onClose?: () => void;
}

function Sidebar({ alertCount, onClose }: SidebarProps) {
  const mainItems = [
    {
      to: "/dashboard",
      icon: <Home size={17} />,
      label: "Overview",
      ocid: "nav.overview.link",
      exact: true,
    },
    {
      to: "/dashboard/location",
      icon: <MapPin size={17} />,
      label: "Location",
      ocid: "nav.location.link",
    },
    {
      to: "/dashboard/screen-time",
      icon: <Clock size={17} />,
      label: "Screen Time",
      ocid: "nav.screen_time.link",
    },
    {
      to: "/dashboard/content",
      icon: <Shield size={17} />,
      label: "Content",
      ocid: "nav.content.link",
    },
    {
      to: "/dashboard/bullying",
      icon: <AlertTriangle size={17} />,
      label: "Bullying Alerts",
      ocid: "nav.bullying.link",
      badge: alertCount,
    },
    {
      to: "/dashboard/spending",
      icon: <CreditCard size={17} />,
      label: "Spending",
      ocid: "nav.spending.link",
    },
    {
      to: "/dashboard/recommendations",
      icon: <Brain size={17} />,
      label: "AI Coach",
      ocid: "nav.recommendations.link",
    },
  ];

  const utilityItems = [
    {
      to: "/dashboard/settings",
      icon: <Settings size={17} />,
      label: "Settings",
      ocid: "nav.settings.link",
    },
  ];

  return (
    <div className="flex flex-col h-full dashboard-sidebar">
      {/* Logo */}
      <div className="px-5 py-[18px] flex items-center justify-between border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <img
              src="/assets/generated/guardian-shield-icon-transparent.dim_400x400.png"
              alt="GuardianAI"
              className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 12px oklch(0.78 0.15 195 / 0.5)" }}
            />
          </div>
          <span className="font-display text-[17px] font-black text-foreground tracking-tight">
            Guardian<span className="text-gradient-teal">AI</span>
          </span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">
        <div className="px-2 pb-1 pt-0.5">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/50">
            Monitor
          </span>
        </div>
        {mainItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}

        <div className="px-2 pt-4 pb-1">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/50">
            Account
          </span>
        </div>
        {utilityItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2.5 py-3 border-t border-sidebar-border">
        <Link to="/">
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-150"
          >
            <ExternalLink size={13} />
            Back to Website
          </button>
        </Link>
      </div>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────
interface HeaderProps {
  onMenuOpen: () => void;
  childProfiles: ChildProfile[];
  selectedChild: ChildProfile | null;
  setSelectedChildId: (id: string) => void;
  alertCount: number;
  isLoading: boolean;
}

function Header({
  onMenuOpen,
  childProfiles,
  selectedChild,
  setSelectedChildId,
  alertCount,
  isLoading,
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-4 sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-8 w-8 text-muted-foreground"
        onClick={onMenuOpen}
      >
        <Menu size={18} />
      </Button>

      {/* Child selector */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton className="h-9 w-44" />
        ) : (
          <Select
            value={selectedChild?.id.toString() ?? ""}
            onValueChange={setSelectedChildId}
          >
            <SelectTrigger
              data-ocid="child.selector.select"
              className="h-9 w-44 bg-secondary border-border text-sm font-medium"
            >
              <SelectValue placeholder="Select child">
                {selectedChild && (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                      style={{
                        background: "oklch(0.2 0.06 195)",
                        color: "oklch(0.78 0.15 195)",
                      }}
                    >
                      {selectedChild.name[0]}
                    </span>
                    {selectedChild.name}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {childProfiles.map((child) => (
                <SelectItem
                  key={child.id.toString()}
                  value={child.id.toString()}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                      style={{
                        background: "oklch(0.2 0.06 195)",
                        color: "oklch(0.78 0.15 195)",
                      }}
                    >
                      {child.name[0]}
                    </span>
                    {child.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex-1" />

      {/* Alerts bell */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
      >
        <Bell size={18} />
        {alertCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "oklch(0.65 0.22 25)" }}
          />
        )}
      </Button>

      {/* User avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
        style={{
          background: "oklch(0.2 0.06 195)",
          color: "oklch(0.78 0.15 195)",
        }}
      >
        P
      </div>
    </header>
  );
}

// ── Dashboard Layout ──────────────────────────────────────
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  const { data: children = [], isLoading } = useSeedAndChildren();

  // Auto-select first child
  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id.toString());
    }
  }, [children, selectedChildId]);

  const selectedChild =
    children.find((c) => c.id.toString() === selectedChildId) ?? null;
  const childId = selectedChild?.id ?? null;

  const { data: summary } = useDashboardSummary(childId);
  const alertCount = summary ? Number(summary.unreadAlertsCount) : 0;

  return (
    <DashboardContext.Provider
      value={{
        selectedChild,
        setSelectedChildId,
        children,
        isLoading,
      }}
    >
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col">
          <Sidebar alertCount={alertCount} />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-0 cursor-default"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative z-10 w-64 flex flex-col">
              <Sidebar
                alertCount={alertCount}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onMenuOpen={() => setSidebarOpen(true)}
            childProfiles={children}
            selectedChild={selectedChild}
            setSelectedChildId={setSelectedChildId}
            alertCount={alertCount}
            isLoading={isLoading}
          />
          <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
