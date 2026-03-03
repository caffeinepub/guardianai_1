import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AlertCircle, Check, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SubscriptionPlan } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { hashPassword } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";

interface PlanOption {
  id: SubscriptionPlan;
  name: string;
  price: string;
  period?: string;
  badge?: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: PlanOption[] = [
  {
    id: SubscriptionPlan.free,
    name: "Basic",
    price: "Free",
    features: [
      "1 child profile",
      "Location tracking",
      "Screen time overview",
      "Weekly digest",
    ],
  },
  {
    id: SubscriptionPlan.family,
    name: "Family",
    price: "$9.99",
    period: "/mo",
    badge: "Popular",
    highlighted: true,
    features: [
      "Up to 3 children",
      "AI content analysis",
      "Bullying detection",
      "Spending monitor",
      "AI Parenting Coach",
    ],
  },
  {
    id: SubscriptionPlan.guardian_pro,
    name: "Guardian Pro",
    price: "$19.99",
    period: "/mo",
    features: [
      "Unlimited children",
      "Priority AI analysis",
      "Advanced reporting",
      "Custom alert rules",
      "Phone support",
    ],
  },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { actor } = useActor();

  // Get pre-selected plan from URL query
  const search = useSearch({ from: "/signup" }) as { plan?: string };
  const preselectedPlan =
    search.plan === "family"
      ? SubscriptionPlan.family
      : search.plan === "guardian_pro"
        ? SubscriptionPlan.guardian_pro
        : SubscriptionPlan.free;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan>(preselectedPlan);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const passwordHash = await hashPassword(password);

      // Try backend registration
      if (actor) {
        try {
          await actor.registerParent(email.trim(), passwordHash);
        } catch {
          // May already exist, continue
        }
      }

      await register(email.trim(), password, selectedPlan);
      toast.success("Account created successfully!");

      if (
        selectedPlan === SubscriptionPlan.family ||
        selectedPlan === SubscriptionPlan.guardian_pro
      ) {
        navigate({ to: "/subscribe/$plan", params: { plan: selectedPlan } });
      } else {
        // Seed demo data for free plan
        if (actor) {
          try {
            await actor.seedDemoData();
          } catch {
            // ignore
          }
        }
        navigate({ to: "/dashboard" });
      }
    } catch {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      data-ocid="signup.page"
      style={{
        background:
          "radial-gradient(ellipse at 70% 30%, oklch(0.68 0.22 310 / 0.12) 0%, transparent 55%), radial-gradient(ellipse at 20% 60%, oklch(0.78 0.15 195 / 0.1) 0%, transparent 55%), oklch(0.1 0.02 265)",
      }}
    >
      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src="/assets/generated/guardian-shield-icon-transparent.dim_400x400.png"
              alt="GuardianAI"
              className="w-12 h-12 group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-2xl font-black text-foreground">
              Guardian<span className="text-gradient-teal">AI</span>
            </span>
          </Link>
          <h1 className="font-heading text-xl font-bold text-foreground mt-4">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Start protecting your child's digital world today
          </p>
        </div>

        <div
          className="rounded-2xl p-8 flex flex-col gap-6"
          style={{
            background: "oklch(0.14 0.025 265)",
            border: "1px solid oklch(0.25 0.04 265)",
            boxShadow: "0 24px 64px oklch(0.05 0.02 265 / 0.6)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Account fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  data-ocid="signup.email.input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  autoComplete="email"
                  className="h-10 bg-secondary border-border focus:border-primary transition-colors"
                />
                {errors.email && (
                  <span
                    data-ocid="signup.email.error_state"
                    className="text-xs flex items-center gap-1"
                    style={{ color: "oklch(0.72 0.18 25)" }}
                  >
                    <AlertCircle size={10} /> {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    data-ocid="signup.password.input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    autoComplete="new-password"
                    className="h-10 bg-secondary border-border focus:border-primary transition-colors pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <span
                    data-ocid="signup.password.error_state"
                    className="text-xs flex items-center gap-1"
                    style={{ color: "oklch(0.72 0.18 25)" }}
                  >
                    <AlertCircle size={10} /> {errors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  data-ocid="signup.confirm_password.input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  autoComplete="new-password"
                  className="h-10 bg-secondary border-border focus:border-primary transition-colors"
                />
                {errors.confirmPassword && (
                  <span
                    data-ocid="signup.confirm_password.error_state"
                    className="text-xs flex items-center gap-1"
                    style={{ color: "oklch(0.72 0.18 25)" }}
                  >
                    <AlertCircle size={10} /> {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Plan selector */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                Choose your plan
              </Label>
              <div className="grid sm:grid-cols-3 gap-3">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    data-ocid={`signup.plan.${plan.id}.button`}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-xl p-4 text-left transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? "border-primary/60"
                        : "border-border/50 hover:border-border"
                    }`}
                    style={{
                      background:
                        selectedPlan === plan.id
                          ? "oklch(0.18 0.06 195 / 0.3)"
                          : "oklch(0.12 0.025 265 / 0.5)",
                      border: `1px solid ${selectedPlan === plan.id ? "oklch(0.78 0.15 195 / 0.5)" : "oklch(0.22 0.04 265)"}`,
                      boxShadow:
                        selectedPlan === plan.id
                          ? "0 0 20px oklch(0.78 0.15 195 / 0.1)"
                          : "none",
                    }}
                  >
                    {plan.badge && (
                      <Badge
                        className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] border-0 px-2"
                        style={{
                          background: "oklch(0.78 0.15 195)",
                          color: "oklch(0.08 0.02 265)",
                        }}
                      >
                        {plan.badge}
                      </Badge>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">
                        {plan.name}
                      </span>
                      {selectedPlan === plan.id && (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: "oklch(0.78 0.15 195)" }}
                        >
                          <Check
                            size={9}
                            style={{ color: "oklch(0.08 0.02 265)" }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-baseline gap-0.5 mb-2">
                      <span
                        className="font-display text-xl font-bold"
                        style={{ color: "oklch(0.85 0.15 195)" }}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xs text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-center gap-1.5">
                          <Check size={9} className="text-primary shrink-0" />
                          <span className="text-[10px] text-muted-foreground truncate">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="signup.submit_button"
              disabled={isLoading}
              className="w-full h-11 font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-glow-teal"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Shield size={16} className="mr-2" />
              )}
              {isLoading
                ? "Creating account..."
                : selectedPlan === SubscriptionPlan.free
                  ? "Create Free Account"
                  : `Continue to Payment — ${selectedPlan === SubscriptionPlan.family ? "$9.99" : "$19.99"}/mo`}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              data-ocid="signup.login.link"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            ← Back to GuardianAI.com
          </Link>
        </div>
      </div>
    </div>
  );
}
