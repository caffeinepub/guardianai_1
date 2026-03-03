import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCopy,
  Shield,
  Smartphone,
  UserPlus,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── FAQ Item ──────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        type="button"
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-foreground">{q}</span>
        {open ? (
          <ChevronUp size={14} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <p className="text-sm text-muted-foreground pb-4 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

// ── QR Code Visual ─────────────────────────────────────────
function QRCodeVisual() {
  return (
    <div
      className="w-32 h-32 rounded-xl p-2 mx-auto"
      style={{
        background: "oklch(0.96 0.01 265)",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        role="img"
        aria-label="QR Code"
      >
        {/* QR code pattern simulation */}
        <rect width="100" height="100" fill="white" />
        {/* Top-left finder */}
        <rect x="5" y="5" width="30" height="30" fill="black" rx="3" />
        <rect x="10" y="10" width="20" height="20" fill="white" rx="2" />
        <rect x="14" y="14" width="12" height="12" fill="black" rx="1" />
        {/* Top-right finder */}
        <rect x="65" y="5" width="30" height="30" fill="black" rx="3" />
        <rect x="70" y="10" width="20" height="20" fill="white" rx="2" />
        <rect x="74" y="14" width="12" height="12" fill="black" rx="1" />
        {/* Bottom-left finder */}
        <rect x="5" y="65" width="30" height="30" fill="black" rx="3" />
        <rect x="10" y="70" width="20" height="20" fill="white" rx="2" />
        <rect x="14" y="74" width="12" height="12" fill="black" rx="1" />
        {/* Data modules */}
        {[40, 46, 52, 58, 64, 70, 76, 82].map((x, i) =>
          [40, 46, 52, 58, 64, 70, 76, 82].map((y, j) =>
            (i + j) % 3 === 0 || (i * j) % 2 === 0 ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="4"
                height="4"
                fill="black"
              />
            ) : null,
          ),
        )}
        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(
          (y, i) =>
            i % 2 === 0 ? (
              <rect key={y} x="40" y={y} width="4" height="4" fill="black" />
            ) : null,
        )}
      </svg>
    </div>
  );
}

// ── Step Card ─────────────────────────────────────────────
interface StepProps {
  num: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  active: boolean;
  completed: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

function StepCard({
  num,
  title,
  description,
  image,
  imageAlt,
  active,
  completed,
  onClick,
  children,
}: StepProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        active
          ? "border-primary/50 shadow-glow-teal"
          : completed
            ? "border-brand-green/30"
            : "border-border/50"
      }`}
      style={{
        border: `1px solid ${active ? "oklch(0.78 0.15 195 / 0.5)" : completed ? "oklch(0.72 0.18 155 / 0.3)" : "oklch(0.22 0.04 265)"}`,
        background: active
          ? "oklch(0.16 0.04 195 / 0.3)"
          : "oklch(0.14 0.025 265)",
      }}
    >
      <button type="button" className="w-full p-5 text-left" onClick={onClick}>
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
            style={{
              background: completed
                ? "oklch(0.72 0.18 155)"
                : active
                  ? "oklch(0.78 0.15 195)"
                  : "oklch(0.22 0.04 265)",
              color:
                completed || active
                  ? "oklch(0.08 0.02 265)"
                  : "oklch(0.58 0.04 265)",
            }}
          >
            {completed ? <Check size={16} /> : num}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-foreground text-sm">
                Step {num}: {title}
              </span>
              {completed && (
                <Badge
                  className="text-[10px] h-4 border-0"
                  style={{
                    background: "oklch(0.2 0.06 155 / 0.4)",
                    color: "oklch(0.72 0.18 155)",
                  }}
                >
                  Done
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
          {active ? (
            <ChevronUp size={14} className="text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight
              size={14}
              className="text-muted-foreground shrink-0"
            />
          )}
        </div>
      </button>

      {active && (
        <div className="px-5 pb-5 border-t border-border/30">
          <div className="grid sm:grid-cols-2 gap-5 mt-5">
            <img
              src={image}
              alt={imageAlt}
              className="rounded-xl w-full object-cover"
              style={{ maxHeight: "240px" }}
            />
            <div className="flex flex-col gap-3">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Collapsible Setup Section ─────────────────────────────
function CollapsibleSetup({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${open ? "oklch(0.78 0.15 195 / 0.35)" : "oklch(0.22 0.04 265)"}`,
        background: open
          ? "oklch(0.15 0.03 195 / 0.1)"
          : "oklch(0.12 0.025 265)",
      }}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-3.5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? (
          <ChevronUp size={14} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border/30">{children}</div>
      )}
    </div>
  );
}

// ── Numbered step list ────────────────────────────────────
function SetupStepList({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-start gap-2.5">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
            style={{
              background: "oklch(0.78 0.15 195)",
              color: "oklch(0.08 0.02 265)",
            }}
          >
            {i + 1}
          </span>
          <span className="text-xs text-muted-foreground leading-relaxed">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

// ── Setup Guide Page ──────────────────────────────────────
export default function SetupGuidePage({
  selectedChild: selectedChildProp,
}: {
  selectedChild?: { name: string } | null;
} = {}) {
  const TOTAL_STEPS = 5;
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const selectedChild = selectedChildProp ?? null;

  const demoParentCode = "GUARD-7X4K2-SHIELD";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(demoParentCode).then(() => {
      toast.success("Parent code copied to clipboard!");
    });
  };

  const handleStepClick = (step: number) => {
    setActiveStep(activeStep === step ? 0 : step);
  };

  const handleMarkComplete = (step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    if (step < TOTAL_STEPS) {
      setActiveStep(step + 1);
    }
  };

  return (
    <div
      data-ocid="setup_guide.page"
      className="flex flex-col gap-8 max-w-3xl mx-auto"
    >
      {/* Hero */}
      <div className="text-center py-8 px-4">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4"
          style={{
            background: "oklch(0.2 0.06 195 / 0.4)",
            border: "1px solid oklch(0.78 0.15 195 / 0.3)",
            color: "oklch(0.85 0.15 195)",
          }}
        >
          <Smartphone size={11} />
          Setup Guide
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black text-foreground mb-3">
          Set Up GuardianAI on{" "}
          <span className="text-gradient-teal">
            {selectedChild ? `${selectedChild.name}'s` : "Your Child's"}
          </span>{" "}
          Device
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          Follow these 5 simple steps to get full background protection running
          in under 10 minutes.
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1 px-4">
        {[1, 2, 3, 4, 5].map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className="w-full h-1.5 rounded-full transition-all duration-500"
              style={{
                background: completedSteps.has(step)
                  ? "oklch(0.72 0.18 155)"
                  : activeStep === step
                    ? "oklch(0.78 0.15 195)"
                    : "oklch(0.22 0.04 265)",
              }}
            />
            {i < 4 && <div className="w-2 shrink-0" />}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-4">
        {completedSteps.size} of {TOTAL_STEPS} steps completed
      </p>

      {/* Steps */}
      <div className="flex flex-col gap-3 px-0">
        {/* Step 1: Create Account */}
        <StepCard
          num={1}
          title="Create Your Account"
          description="Register as a parent and choose your protection plan"
          image="/assets/generated/setup-step1-create-account.dim_600x400.png"
          imageAlt="Create your GuardianAI account"
          active={activeStep === 1}
          completed={completedSteps.has(1)}
          onClick={() => handleStepClick(1)}
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create your parent account at{" "}
              <span className="text-primary font-medium">guardianai.com</span>.
              Your account is the control center for all your children's
              devices.
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Enter your email address",
                "Create a secure password",
                "Choose a plan that fits your family",
                "Verify your email address",
              ].map((step) => (
                <li
                  key={step}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Check size={10} className="text-primary shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <Link to="/signup" search={{ plan: undefined }}>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:opacity-90 text-xs h-8"
                  data-ocid="setup_guide.create_account.button"
                >
                  <UserPlus size={12} className="mr-1" />
                  Create Account
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-8 text-muted-foreground"
                onClick={() => handleMarkComplete(1)}
                data-ocid="setup_guide.step1.complete_button"
              >
                <CheckCircle size={12} className="mr-1" />
                Mark Done
              </Button>
            </div>
          </div>
        </StepCard>

        {/* Step 2: Add Child Profile */}
        <StepCard
          num={2}
          title="Add Your Child's Profile"
          description="Set up your child's name, age, and device details"
          image="/assets/generated/setup-step1-create-account.dim_600x400.png"
          imageAlt="Add your child's profile"
          active={activeStep === 2}
          completed={completedSteps.has(2)}
          onClick={() => handleStepClick(2)}
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Go to the Settings section in your dashboard and click "Add
              Child". Fill in their profile details.
            </p>
            {/* Mini form preview */}
            <div
              className="rounded-xl p-3 flex flex-col gap-2"
              style={{
                background: "oklch(0.12 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
              }}
            >
              {[
                { label: "Child's Name", placeholder: "e.g. Emma" },
                { label: "Age", placeholder: "e.g. 12" },
                { label: "Device Name", placeholder: "e.g. Emma's iPhone" },
              ].map((field) => (
                <div key={field.label} className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">
                    {field.label}
                  </span>
                  <div
                    className="h-7 rounded-lg px-3 flex items-center text-xs text-muted-foreground/50"
                    style={{
                      background: "oklch(0.16 0.03 265)",
                      border: "1px solid oklch(0.22 0.04 265)",
                    }}
                  >
                    {field.placeholder}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard/settings">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:opacity-90 text-xs h-8"
                  data-ocid="setup_guide.add_child.button"
                >
                  Add Child Now
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-8 text-muted-foreground"
                onClick={() => handleMarkComplete(2)}
                data-ocid="setup_guide.step2.complete_button"
              >
                <CheckCircle size={12} className="mr-1" />
                Mark Done
              </Button>
            </div>
          </div>
        </StepCard>

        {/* Step 3: Install Child App */}
        <StepCard
          num={3}
          title="Install the Child App"
          description="Download GuardianAI Child on your child's device"
          image="/assets/generated/setup-step2-install-app.dim_600x400.png"
          imageAlt="Install GuardianAI on child's phone"
          active={activeStep === 3}
          completed={completedSteps.has(3)}
          onClick={() => handleStepClick(3)}
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              On your child's device, open the App Store (iOS) or Google Play
              (Android) and search for{" "}
              <span className="text-foreground font-medium">
                "GuardianAI Child"
              </span>
              .
            </p>

            {/* Platform instructions */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Android", store: "Google Play" },
                { name: "iOS", store: "App Store" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-lg p-2.5 flex flex-col gap-1"
                  style={{
                    background: "oklch(0.12 0.025 265)",
                    border: "1px solid oklch(0.22 0.04 265)",
                  }}
                >
                  <span className="text-xs font-semibold text-foreground">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {p.store} → "GuardianAI Child"
                  </span>
                </div>
              ))}
            </div>

            {/* Android detailed setup */}
            <CollapsibleSetup
              title="🤖 Android Setup (Detailed)"
              defaultOpen={false}
            >
              <img
                src="/assets/generated/android-permissions-screen.dim_600x400.png"
                alt="Android permissions setup"
                className="w-full rounded-lg object-cover mt-3 mb-3"
                style={{ maxHeight: "180px" }}
              />
              <SetupStepList
                steps={[
                  "Install GuardianAI Child from Google Play Store",
                  'Grant Location Permission: Settings → Apps → GuardianAI → Permissions → Location → "Allow all the time"',
                  "Grant Usage Access: Settings → Digital Wellbeing → Usage Access → GuardianAI → Enable",
                  'Disable Battery Optimization: Settings → Battery → Battery Optimization → GuardianAI → "Don\'t optimize"',
                  "Enable Device Admin (optional, for remote lock): Settings → Security → Device Administrators → GuardianAI",
                  'Open GuardianAI Child app, enter your parent code, and tap "Link Device"',
                ]}
              />
            </CollapsibleSetup>

            {/* iOS detailed setup */}
            <CollapsibleSetup
              title="🍎 iOS Setup (Detailed)"
              defaultOpen={false}
            >
              <img
                src="/assets/generated/ios-screentime-setup.dim_600x400.png"
                alt="iOS Screen Time setup"
                className="w-full rounded-lg object-cover mt-3 mb-3"
                style={{ maxHeight: "180px" }}
              />
              <SetupStepList
                steps={[
                  "Install GuardianAI Child from the App Store",
                  "Enable Screen Time: Settings → Screen Time → Turn On Screen Time (if not already on)",
                  "Set up Family Sharing: Settings → [Your Name] → Family Sharing → Add Family Member → your child's Apple ID",
                  'Grant Location: Settings → Privacy & Security → Location Services → GuardianAI → "Always"',
                  "Allow Notifications: Settings → Notifications → GuardianAI → Allow Notifications → toggle on",
                  'Open GuardianAI Child app, enter your parent code, and tap "Link Device"',
                ]}
              />
            </CollapsibleSetup>

            {/* Parent Code */}
            <div
              className="rounded-xl p-3 flex flex-col gap-2"
              style={{
                background: "oklch(0.18 0.06 195 / 0.2)",
                border: "1px solid oklch(0.78 0.15 195 / 0.3)",
              }}
            >
              <div className="flex items-center gap-2">
                <Wifi size={12} className="text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground">
                  Your Parent Code
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code
                  className="flex-1 font-mono text-sm px-3 py-1.5 rounded-lg"
                  style={{
                    background: "oklch(0.12 0.025 265)",
                    color: "oklch(0.85 0.15 195)",
                  }}
                >
                  {demoParentCode}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={handleCopyCode}
                  data-ocid="setup_guide.copy_code.button"
                >
                  <ClipboardCopy size={14} />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Enter this code in the child app to link devices
              </p>
            </div>

            <div className="flex justify-center">
              <QRCodeVisual />
            </div>
            <p className="text-[10px] text-center text-muted-foreground">
              Scan this QR code to install directly
            </p>

            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-8 text-muted-foreground self-start"
              onClick={() => handleMarkComplete(3)}
              data-ocid="setup_guide.step3.complete_button"
            >
              <CheckCircle size={12} className="mr-1" />
              App Installed — Mark Done
            </Button>
          </div>
        </StepCard>

        {/* Step 4: Protection Active */}
        <StepCard
          num={4}
          title="Protection Active"
          description="GuardianAI is now protecting your child's device"
          image="/assets/generated/setup-step3-protection-active.dim_600x400.png"
          imageAlt="Protection is active"
          active={activeStep === 4}
          completed={completedSteps.has(4)}
          onClick={() => handleStepClick(4)}
        >
          <div className="flex flex-col gap-3">
            <div
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{
                background: "oklch(0.18 0.06 155 / 0.2)",
                border: "1px solid oklch(0.72 0.18 155 / 0.3)",
              }}
            >
              <div className="flex items-center gap-2">
                <Shield size={16} style={{ color: "oklch(0.72 0.18 155)" }} />
                <span
                  className="font-heading font-semibold text-sm"
                  style={{ color: "oklch(0.72 0.18 155)" }}
                >
                  All systems active
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                GuardianAI is now monitoring{" "}
                <strong className="text-foreground">
                  {selectedChild?.name ?? "your child"}
                </strong>
                's device. You'll receive alerts in real-time.
              </p>
            </div>

            <ul className="flex flex-col gap-2">
              {[
                "Real-time location tracking enabled",
                "Screen time monitoring active",
                "Content safety scanning on",
                "Bullying detection running",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ background: "oklch(0.72 0.18 155)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-8 text-muted-foreground self-start"
              onClick={() => handleMarkComplete(4)}
              data-ocid="setup_guide.step4.complete_button"
            >
              <CheckCircle size={12} className="mr-1" />
              Mark Done
            </Button>
          </div>
        </StepCard>

        {/* Step 5: Background Reports */}
        <StepCard
          num={5}
          title="Receive Background Reports"
          description="Get real-time alerts and scheduled reports on your phone"
          image="/assets/generated/parent-report-notification.dim_600x400.png"
          imageAlt="Parent report notifications"
          active={activeStep === 5}
          completed={completedSteps.has(5)}
          onClick={() => handleStepClick(5)}
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              GuardianAI runs silently in the background on your child's device
              and sends you scheduled reports and instant alerts.
            </p>

            {/* Report types */}
            <div className="flex flex-col gap-2">
              {[
                {
                  emoji: "🌅",
                  title: "Daily Summary",
                  desc: "Every morning — yesterday's location history, screen time, and activity overview",
                },
                {
                  emoji: "⚡",
                  title: "Real-Time Alerts",
                  desc: "Immediate notification when bullying is detected, safe zone is crossed, or concerning content is found",
                },
                {
                  emoji: "📊",
                  title: "Weekly Deep-Dive",
                  desc: "Sunday evenings — full AI report with trends, comparisons, and parenting tips",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg p-3 flex gap-2.5"
                  style={{
                    background: "oklch(0.12 0.025 265)",
                    border: "1px solid oklch(0.22 0.04 265)",
                  }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Background monitoring image */}
            <img
              src="/assets/generated/setup-background-monitoring.dim_600x400.png"
              alt="Background monitoring active"
              className="w-full rounded-xl object-cover"
              style={{ maxHeight: "160px" }}
            />

            {/* Enable push notifications */}
            <div
              className="rounded-xl p-3 flex flex-col gap-1.5"
              style={{
                background: "oklch(0.18 0.06 195 / 0.15)",
                border: "1px solid oklch(0.78 0.15 195 / 0.3)",
              }}
            >
              <span className="text-xs font-semibold text-foreground">
                Enable push notifications on your phone:
              </span>
              <div className="text-[10px] text-muted-foreground">
                <strong>iOS:</strong> Settings → Notifications → GuardianAI
                Parent → Allow Notifications
              </div>
              <div className="text-[10px] text-muted-foreground">
                <strong>Android:</strong> Settings → Apps → GuardianAI →
                Notifications → Allow
              </div>
              <div className="text-[10px] text-muted-foreground">
                <strong>Web:</strong> Allow notifications when prompted in your
                browser
              </div>
            </div>

            {/* Completion card */}
            <div
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{
                background: "oklch(0.18 0.06 155 / 0.2)",
                border: "1px solid oklch(0.72 0.18 155 / 0.4)",
              }}
            >
              <div className="flex items-center gap-2">
                <Shield size={16} style={{ color: "oklch(0.72 0.18 155)" }} />
                <span
                  className="font-heading font-semibold text-sm"
                  style={{ color: "oklch(0.72 0.18 155)" }}
                >
                  🎉 Monitoring is now active!
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                GuardianAI is fully set up and protecting{" "}
                <strong className="text-foreground">
                  {selectedChild?.name ?? "your child"}
                </strong>
                's device in the background. You'll start receiving reports and
                alerts shortly.
              </p>
            </div>

            <div className="flex gap-2">
              <Link to="/dashboard">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:opacity-90 text-xs h-8"
                  data-ocid="setup_guide.go_dashboard.button"
                >
                  <Shield size={12} className="mr-1" />
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-8 text-muted-foreground"
                onClick={() => handleMarkComplete(5)}
                data-ocid="setup_guide.step5.complete_button"
              >
                <CheckCircle size={12} className="mr-1" />
                Complete Setup
              </Button>
            </div>
          </div>
        </StepCard>
      </div>

      {/* FAQ */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "oklch(0.14 0.025 265)",
          border: "1px solid oklch(0.22 0.04 265)",
        }}
      >
        <h2 className="font-heading font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col">
          <FAQItem
            q="Is my child notified that they're being monitored?"
            a="GuardianAI operates transparently. We recommend parents have an open conversation with their children about monitoring. The child app shows a small shield icon in the notification bar. Transparency builds trust and is better for long-term outcomes."
          />
          <FAQItem
            q="What data is collected and stored?"
            a="We collect location coordinates, app usage statistics, browsed URLs (not full content), message metadata for bullying detection (not full messages), and purchase information. All data is encrypted and never sold to third parties."
          />
          <FAQItem
            q="How do I uninstall GuardianAI from my child's device?"
            a="On Android: Go to Settings → Apps → GuardianAI Child → Uninstall. On iOS: Long-press the app icon → Remove App. You can also remotely deactivate monitoring from your parent dashboard Settings page."
          />
          <FAQItem
            q="Does it work on both Android and iPhone?"
            a="Yes! GuardianAI Child is available for both Android (Android 8.0+) and iOS (iOS 14+). The parent dashboard works on any device with a web browser."
          />
          <FAQItem
            q="What happens if my child's phone is offline?"
            a="GuardianAI queues data locally and syncs automatically when the device reconnects. Location history will show gaps during offline periods, and screen time is tracked locally."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-xs text-muted-foreground">
        Need help?{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => toast.info("Support chat coming soon!")}
        >
          Contact support
        </button>{" "}
        ·{" "}
        <Link to="/dashboard" className="text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
