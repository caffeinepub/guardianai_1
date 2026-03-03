import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Check,
  CreditCard,
  Edit2,
  FileText,
  Loader2,
  Plus,
  Settings,
  Shield,
  Smartphone,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SubscriptionPlan } from "../../backend.d";
import { useAuth } from "../../contexts/AuthContext";
import {
  Variant_low_high_medium,
  useAddChild,
  useDeleteChild,
  useSettings,
  useUpdateSettings,
} from "../../hooks/useQueries";
import type { ChildProfile } from "../../hooks/useQueries";
import { useDashboard } from "./DashboardLayout";

// ── Child Card ────────────────────────────────────────────
function ChildCard({
  child,
  index,
  onDelete,
}: {
  child: ChildProfile;
  index: number;
  onDelete: (id: bigint) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      data-ocid={`settings.child.item.${index}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
        style={{
          background: "oklch(0.2 0.06 195)",
          color: "oklch(0.78 0.15 195)",
        }}
      >
        {child.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-foreground">
            {child.name}
          </span>
          <Badge
            className="text-[10px] h-4 border-0"
            style={{
              background: "oklch(0.18 0.03 265)",
              color: "oklch(0.58 0.04 265)",
            }}
          >
            Age {Number(child.age)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{child.deviceName}</p>
        <p className="text-[10px] text-muted-foreground/60">
          Added{" "}
          {new Date(Number(child.createdAt) / 1_000_000).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {confirmDelete ? (
          <>
            <Button
              data-ocid={`settings.child.confirm_button.${index}`}
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid={`settings.child.delete_button.${index}`}
              size="sm"
              className="h-7 text-xs gap-1"
              style={{
                background: "oklch(0.65 0.22 25)",
                color: "oklch(0.98 0 0)",
              }}
              onClick={() => {
                onDelete(child.id);
                setConfirmDelete(false);
              }}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            data-ocid={`settings.child.open_modal_button.${index}`}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────
export default function SettingsPage() {
  const { children, isLoading: childrenLoading } = useDashboard();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const addChild = useAddChild();
  const deleteChild = useDeleteChild();
  const { email, plan } = useAuth();

  // Add child form
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("12");
  const [newDevice, setNewDevice] = useState("");

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [threshold, setThreshold] = useState<string>("medium");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Account edit state
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [newEmail, setNewEmail] = useState(email ?? "");

  useEffect(() => {
    if (settings) {
      setNotifications(settings.notificationsEnabled);
      setWeeklyReport(settings.weeklyReportEnabled);
      setThreshold(String(settings.alertThreshold));
    }
  }, [settings]);

  const handleAddChild = async () => {
    if (!newName.trim() || !newDevice.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addChild.mutateAsync({
        name: newName.trim(),
        age: BigInt(Number.parseInt(newAge) || 12),
        deviceName: newDevice.trim(),
        avatarUrl: "",
      });
      toast.success(`${newName} added successfully`);
      setAddOpen(false);
      setNewName("");
      setNewAge("12");
      setNewDevice("");
    } catch {
      toast.error("Failed to add child");
    }
  };

  const handleDeleteChild = async (id: bigint) => {
    try {
      await deleteChild.mutateAsync(id);
      toast.success("Child profile removed");
    } catch {
      toast.error("Failed to remove child");
    }
  };

  const handleSaveSettings = async () => {
    try {
      const thresholdEnum =
        threshold === "high"
          ? Variant_low_high_medium.high
          : threshold === "low"
            ? Variant_low_high_medium.low
            : Variant_low_high_medium.medium;

      await updateSettings.mutateAsync({
        notificationsEnabled: notifications,
        weeklyReportEnabled: weeklyReport,
        alertThreshold: thresholdEnum,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const planLabel =
    plan === SubscriptionPlan.guardian_pro
      ? "Guardian Pro"
      : plan === SubscriptionPlan.family
        ? "Family"
        : "Free";

  const planColor =
    plan === SubscriptionPlan.guardian_pro
      ? "oklch(0.68 0.22 310)"
      : plan === SubscriptionPlan.family
        ? "oklch(0.78 0.15 195)"
        : "oklch(0.58 0.04 265)";

  return (
    <div data-ocid="settings.page" className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account, children profiles, and notification preferences
        </p>
      </div>

      {/* Account Section */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-primary" />
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Account
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
            <div>
              <div className="text-sm font-medium text-foreground">
                Email Address
              </div>
              <div className="text-xs text-muted-foreground">
                {email ?? "Not set"}
              </div>
            </div>
            <Button
              data-ocid="settings.edit_email.button"
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1"
              onClick={() => {
                setNewEmail(email ?? "");
                setEditEmailOpen(true);
              }}
            >
              <Edit2 size={11} />
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
            <div>
              <div className="text-sm font-medium text-foreground">
                Password
              </div>
              <div className="text-xs text-muted-foreground">••••••••</div>
            </div>
            <Button
              data-ocid="settings.change_password.button"
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1"
              onClick={() => toast.info("Password change coming soon")}
            >
              <Edit2 size={11} />
              Change
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-primary" />
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Subscription
          </h2>
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{
            background: `${planColor}10`,
            border: `1px solid ${planColor}25`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${planColor}20`, color: planColor }}
            >
              <Star size={16} />
            </div>
            <div>
              <div className="font-heading font-semibold text-sm text-foreground">
                {planLabel} Plan
              </div>
              <div className="text-xs" style={{ color: planColor }}>
                {plan === SubscriptionPlan.free
                  ? "Free forever"
                  : plan === SubscriptionPlan.family
                    ? "$9.99/month"
                    : "$19.99/month"}
              </div>
            </div>
          </div>
          {plan === SubscriptionPlan.free ? (
            <Link
              to="/subscribe/$plan"
              params={{ plan: SubscriptionPlan.family }}
            >
              <Button
                data-ocid="settings.upgrade.button"
                size="sm"
                className="bg-primary text-primary-foreground hover:opacity-90 h-8 text-xs"
              >
                Upgrade Plan
              </Button>
            </Link>
          ) : (
            <Button
              data-ocid="settings.manage_billing.button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border/60"
              onClick={() => toast.info("Billing portal coming soon")}
            >
              Manage Billing
            </Button>
          )}
        </div>
        {plan === SubscriptionPlan.free && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              to="/subscribe/$plan"
              params={{ plan: SubscriptionPlan.family }}
            >
              <div
                className="rounded-xl p-3 flex flex-col gap-1 cursor-pointer hover:brightness-110 transition-all"
                style={{
                  background: "oklch(0.16 0.04 195 / 0.3)",
                  border: "1px solid oklch(0.78 0.15 195 / 0.3)",
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: "oklch(0.85 0.15 195)" }}
                >
                  Family — $9.99/mo
                </span>
                <span className="text-[10px] text-muted-foreground">
                  AI analysis, bullying detection
                </span>
              </div>
            </Link>
            <Link
              to="/subscribe/$plan"
              params={{ plan: SubscriptionPlan.guardian_pro }}
            >
              <div
                className="rounded-xl p-3 flex flex-col gap-1 cursor-pointer hover:brightness-110 transition-all"
                style={{
                  background: "oklch(0.16 0.04 310 / 0.3)",
                  border: "1px solid oklch(0.68 0.22 310 / 0.3)",
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: "oklch(0.78 0.22 310)" }}
                >
                  Guardian Pro — $19.99/mo
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Unlimited children, priority AI
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Child Profiles */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-primary" />
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Child Profiles
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard/setup-guide">
              <Button
                data-ocid="settings.setup_guide.button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs gap-1 text-muted-foreground"
              >
                <Smartphone size={12} />
                Setup Guide
              </Button>
            </Link>
            <Button
              data-ocid="settings.add_child.button"
              size="sm"
              className="h-8 text-xs gap-1 bg-primary text-primary-foreground hover:opacity-90"
              onClick={() => setAddOpen(true)}
            >
              <Plus size={12} />
              Add Child
            </Button>
          </div>
        </div>

        {childrenLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : children.length === 0 ? (
          <div
            data-ocid="settings.children.empty_state"
            className="py-8 text-center"
          >
            <User
              size={32}
              className="text-muted-foreground opacity-30 mx-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              No children added yet
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 text-xs"
              onClick={() => setAddOpen(true)}
            >
              Add Your First Child
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {children.map((child, i) => (
              <ChildCard
                key={child.id.toString()}
                child={child}
                index={i + 1}
                onDelete={handleDeleteChild}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-primary" />
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Notifications
          </h2>
        </div>

        {settingsLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
              <div>
                <div className="text-sm font-medium text-foreground">
                  Push Notifications
                </div>
                <div className="text-xs text-muted-foreground">
                  Receive alerts for new detections
                </div>
              </div>
              <Switch
                data-ocid="settings.notifications.toggle"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
              <div>
                <div className="text-sm font-medium text-foreground">
                  Weekly AI Report
                </div>
                <div className="text-xs text-muted-foreground">
                  Receive a weekly summary email with insights
                </div>
              </div>
              <Switch
                data-ocid="settings.weekly_report.toggle"
                checked={weeklyReport}
                onCheckedChange={setWeeklyReport}
              />
            </div>
          </div>
        )}
      </div>

      {/* Alert Threshold */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-primary" />
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Alert Sensitivity
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Label
              htmlFor="threshold"
              className="text-xs text-muted-foreground mb-2 block"
            >
              Minimum alert severity to notify
            </Label>
            <Select value={threshold} onValueChange={setThreshold}>
              <SelectTrigger
                id="threshold"
                data-ocid="settings.alert_threshold.select"
                className="w-48 h-9 bg-secondary text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low — All alerts</SelectItem>
                <SelectItem value="medium">Medium — Medium & High</SelectItem>
                <SelectItem value="high">High — Critical only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Currently set to notify on <strong>{threshold}</strong> severity and
            above.
          </p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          data-ocid="settings.save.submit_button"
          className="gap-2 bg-primary text-primary-foreground hover:opacity-90"
          onClick={handleSaveSettings}
          disabled={updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : settingsSaved ? (
            <Check size={14} />
          ) : (
            <Settings size={14} />
          )}
          {settingsSaved ? "Saved!" : "Save Settings"}
        </Button>
      </div>

      {/* About */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-muted-foreground" />
          <h2 className="font-heading font-semibold text-sm text-foreground">
            About
          </h2>
        </div>
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>App Version</span>
            <span className="font-mono">2.4.1</span>
          </div>
          <div className="flex justify-between">
            <span>AI Model</span>
            <span className="font-mono">GuardianAI-v3</span>
          </div>
          <div className="flex justify-between">
            <span>Last Sync</span>
            <span className="font-mono">Just now</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          © {new Date().getFullYear()} GuardianAI. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>

      {/* Add Child Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          data-ocid="settings.add_child.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-heading">
              Add Child Profile
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="child-name"
                className="text-xs text-muted-foreground"
              >
                Child's Name
              </Label>
              <Input
                id="child-name"
                data-ocid="settings.add_child.input"
                placeholder="e.g. Emma"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="child-age"
                className="text-xs text-muted-foreground"
              >
                Age
              </Label>
              <Input
                id="child-age"
                type="number"
                min="3"
                max="18"
                placeholder="12"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="child-device"
                className="text-xs text-muted-foreground"
              >
                Device Name
              </Label>
              <Input
                id="child-device"
                placeholder="e.g. Emma's iPhone"
                value={newDevice}
                onChange={(e) => setNewDevice(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="settings.add_child.cancel_button"
              variant="ghost"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="settings.add_child.submit_button"
              className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
              onClick={handleAddChild}
              disabled={addChild.isPending}
            >
              {addChild.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Add Child
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Email Dialog */}
      <Dialog open={editEmailOpen} onOpenChange={setEditEmailOpen}>
        <DialogContent
          data-ocid="settings.edit_email.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-heading">Change Email</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="new-email"
                className="text-xs text-muted-foreground"
              >
                New Email Address
              </Label>
              <Input
                id="new-email"
                data-ocid="settings.edit_email.input"
                type="email"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="settings.edit_email.cancel_button"
              variant="ghost"
              onClick={() => setEditEmailOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="settings.edit_email.submit_button"
              className="bg-primary text-primary-foreground hover:opacity-90"
              onClick={() => {
                toast.success(
                  "Email update coming soon (requires backend auth)",
                );
                setEditEmailOpen(false);
              }}
            >
              Save Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
