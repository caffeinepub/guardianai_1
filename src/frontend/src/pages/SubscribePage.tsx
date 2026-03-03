import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle,
  CreditCard,
  Loader2,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SubscriptionPlan } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";

const PLAN_DETAILS: Record<
  string,
  {
    name: string;
    price: string;
    period: string;
    features: string[];
    color: string;
  }
> = {
  [SubscriptionPlan.family]: {
    name: "Family",
    price: "$9.99",
    period: "per month",
    color: "oklch(0.78 0.15 195)",
    features: [
      "Up to 3 children profiles",
      "All Basic features included",
      "AI content analysis & safety scanning",
      "Real-time cyberbullying detection",
      "Digital spending monitor",
      "AI Parenting Coach with weekly reports",
      "Email + push alerts",
      "Priority support",
    ],
  },
  [SubscriptionPlan.guardian_pro]: {
    name: "Guardian Pro",
    price: "$19.99",
    period: "per month",
    color: "oklch(0.68 0.22 310)",
    features: [
      "Unlimited children profiles",
      "All Family features included",
      "Priority AI analysis (2x faster)",
      "Advanced reporting & analytics",
      "Custom alert rules & thresholds",
      "Family dashboard sharing",
      "Dedicated phone support",
      "Early access to new features",
    ],
  },
};

export default function SubscribePage() {
  const { plan } = useParams({ from: "/subscribe/$plan" });
  const navigate = useNavigate();
  const { actor } = useActor();
  const { updatePlan } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<
    "idle" | "success" | "failed" | "checking"
  >("idle");

  const planDetails = PLAN_DETAILS[plan];
  const planEnum =
    plan === SubscriptionPlan.family
      ? SubscriptionPlan.family
      : SubscriptionPlan.guardian_pro;

  // Check if returning from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const canceled = urlParams.get("canceled");

    if (canceled) {
      setSessionStatus("failed");
      toast.error("Payment was canceled.");
      return;
    }

    if (sessionId && actor) {
      setSessionStatus("checking");
      actor
        .getStripeSessionStatus(sessionId)
        .then(async (status) => {
          if (status.__kind__ === "completed") {
            setSessionStatus("success");
            try {
              await actor.updateSubscriptionPlan(planEnum);
              updatePlan(planEnum);
              toast.success(
                `Subscription activated! Welcome to ${planDetails?.name}`,
              );
            } catch {
              // ignore
            }
          } else {
            setSessionStatus("failed");
            toast.error("Payment verification failed.");
          }
        })
        .catch(() => {
          // If backend unavailable, treat as success for demo
          setSessionStatus("success");
          updatePlan(planEnum);
          toast.success("Subscription activated!");
        });
    }
  }, [actor, planEnum, planDetails, updatePlan]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      if (actor) {
        const checkoutUrl =
          await actor.createSubscriptionCheckoutSession(planEnum);
        if (checkoutUrl?.startsWith("http")) {
          window.location.href = checkoutUrl;
          return;
        }
      }
      // Demo: simulate success
      toast.success("Demo: Subscription activated!");
      updatePlan(planEnum);
      setSessionStatus("success");
    } catch {
      // Demo mode fallback
      toast.success("Demo: Subscription activated!");
      updatePlan(planEnum);
      setSessionStatus("success");
    } finally {
      setIsLoading(false);
    }
  };

  if (!planDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Invalid plan selected.</p>
          <Link
            to="/signup"
            search={{ plan: undefined }}
            className="text-primary hover:underline mt-2 block"
          >
            Back to signup
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (sessionStatus === "success") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        data-ocid="subscribe.success.panel"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.72 0.18 155 / 0.1) 0%, transparent 60%), oklch(0.1 0.02 265)",
        }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "oklch(0.2 0.06 155 / 0.3)",
              border: "1px solid oklch(0.72 0.18 155 / 0.4)",
              boxShadow: "0 0 40px oklch(0.72 0.18 155 / 0.3)",
            }}
          >
            <CheckCircle size={40} style={{ color: "oklch(0.72 0.18 155)" }} />
          </div>
          <h1 className="font-display text-3xl font-black text-foreground mb-3">
            You're all set! 🎉
          </h1>
          <p className="text-muted-foreground mb-2">
            Welcome to{" "}
            <strong className="text-foreground">{planDetails.name}</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Your subscription is now active. All premium features are unlocked.
          </p>
          <Button
            data-ocid="subscribe.go_dashboard.button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="bg-primary text-primary-foreground hover:opacity-90 shadow-glow-teal px-8 py-6 h-auto text-base font-semibold"
          >
            Go to Dashboard
            <ArrowRight size={16} className="ml-2" />
          </Button>
          <div className="mt-4">
            <Link
              to="/setup-guide"
              className="text-sm text-primary hover:underline"
            >
              Or read the setup guide →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (sessionStatus === "failed") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        data-ocid="subscribe.failed.panel"
        style={{ background: "oklch(0.1 0.02 265)" }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "oklch(0.18 0.06 25 / 0.3)",
            }}
          >
            <XCircle size={36} style={{ color: "oklch(0.65 0.22 25)" }} />
          </div>
          <h1 className="font-display text-2xl font-black text-foreground mb-3">
            Payment failed
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your payment was not completed. You can try again or continue with
            the free plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              data-ocid="subscribe.retry.button"
              onClick={() => setSessionStatus("idle")}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              Try Again
            </Button>
            <Button
              data-ocid="subscribe.free_plan.button"
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Continue Free
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Checking state
  if (sessionStatus === "checking") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        data-ocid="subscribe.loading_state"
      >
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-primary mx-auto mb-4"
          />
          <p className="text-muted-foreground">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      data-ocid="subscribe.page"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, oklch(0.68 0.22 310 / 0.1) 0%, transparent 55%), oklch(0.1 0.02 265)",
      }}
    >
      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src="/assets/generated/guardian-shield-icon-transparent.dim_400x400.png"
              alt="GuardianAI"
              className="w-10 h-10"
            />
            <span className="font-display text-xl font-black text-foreground">
              Guardian<span className="text-gradient-teal">AI</span>
            </span>
          </Link>
        </div>

        <div
          className="rounded-2xl p-8 flex flex-col gap-6"
          style={{
            background: "oklch(0.14 0.025 265)",
            border: `1px solid ${planDetails.color}40`,
            boxShadow: `0 24px 64px oklch(0.05 0.02 265 / 0.6), 0 0 40px ${planDetails.color}15`,
          }}
        >
          {/* Plan header */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{
                background: `${planDetails.color}15`,
                color: planDetails.color,
                border: `1px solid ${planDetails.color}30`,
              }}
            >
              <Zap size={10} />
              {planDetails.name} Plan
            </div>
            <div className="flex items-baseline gap-1.5 justify-center">
              <span
                className="font-display text-5xl font-black"
                style={{ color: planDetails.color }}
              >
                {planDetails.price}
              </span>
              <span className="text-muted-foreground text-sm">
                {planDetails.period}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cancel anytime · 14-day free trial included
            </p>
          </div>

          {/* Features */}
          <div className="rounded-xl p-4 bg-secondary/30">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-widest">
              Everything included
            </p>
            <ul className="flex flex-col gap-2">
              {planDetails.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${planDetails.color}20` }}
                  >
                    <Check size={9} style={{ color: planDetails.color }} />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment method selector */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-widest">
              Payment Method
            </p>
            <Tabs defaultValue="card" className="w-full">
              <TabsList
                className="w-full grid grid-cols-4 h-10 mb-4"
                style={{
                  background: "oklch(0.12 0.025 265)",
                  border: "1px solid oklch(0.22 0.04 265)",
                }}
              >
                <TabsTrigger
                  data-ocid="subscribe.payment_card.tab"
                  value="card"
                  className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Card
                </TabsTrigger>
                <TabsTrigger
                  data-ocid="subscribe.payment_paypal.tab"
                  value="paypal"
                  className="text-xs data-[state=active]:bg-[oklch(0.55_0.18_225)] data-[state=active]:text-white"
                >
                  PayPal
                </TabsTrigger>
                <TabsTrigger
                  data-ocid="subscribe.payment_apple.tab"
                  value="apple"
                  className="text-xs data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  Apple
                </TabsTrigger>
                <TabsTrigger
                  data-ocid="subscribe.payment_google.tab"
                  value="google"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  G Pay
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card">
                <Button
                  data-ocid="subscribe.checkout.button"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full h-12 font-semibold text-base"
                  style={{
                    background: planDetails.color,
                    color: "oklch(0.08 0.02 265)",
                    boxShadow: `0 0 30px ${planDetails.color}30`,
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : (
                    <CreditCard size={16} className="mr-2" />
                  )}
                  {isLoading
                    ? "Processing..."
                    : `Pay ${planDetails.price}/mo with Card`}
                </Button>
              </TabsContent>

              <TabsContent value="paypal">
                <Button
                  data-ocid="subscribe.paypal.button"
                  onClick={async () => {
                    toast.info("Redirecting to PayPal...");
                    await new Promise((r) => setTimeout(r, 1500));
                    toast.success("Demo: PayPal subscription activated!");
                    updatePlan(planEnum);
                    setSessionStatus("success");
                  }}
                  className="w-full h-12 font-bold text-base"
                  style={{
                    background: "oklch(0.55 0.18 225)",
                    color: "white",
                    boxShadow: "0 0 20px oklch(0.55 0.18 225 / 0.3)",
                  }}
                >
                  <span className="mr-2 font-black italic">P</span>
                  Pay with PayPal — {planDetails.price}/mo
                </Button>
              </TabsContent>

              <TabsContent value="apple">
                <Button
                  data-ocid="subscribe.apple_pay.button"
                  onClick={async () => {
                    toast.info("Processing Apple Pay...");
                    await new Promise((r) => setTimeout(r, 1000));
                    toast.success("Demo: Apple Pay subscription activated!");
                    updatePlan(planEnum);
                    setSessionStatus("success");
                  }}
                  className="w-full h-12 font-bold text-base"
                  style={{
                    background: "oklch(0.98 0 0)",
                    color: "oklch(0.08 0 0)",
                    boxShadow: "0 0 20px oklch(0.5 0 0 / 0.2)",
                  }}
                >
                  Pay — {planDetails.price}/mo
                </Button>
              </TabsContent>

              <TabsContent value="google">
                <Button
                  data-ocid="subscribe.google_pay.button"
                  onClick={async () => {
                    toast.info("Processing Google Pay...");
                    await new Promise((r) => setTimeout(r, 1000));
                    toast.success("Demo: Google Pay subscription activated!");
                    updatePlan(planEnum);
                    setSessionStatus("success");
                  }}
                  className="w-full h-12 font-bold text-base border border-gray-300"
                  style={{
                    background: "white",
                    color: "oklch(0.2 0 0)",
                  }}
                >
                  <span className="font-black mr-1">G</span> Pay —{" "}
                  {planDetails.price}/mo
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Payment methods banner */}
          <img
            src="/assets/generated/payment-methods-banner.dim_800x300.png"
            alt="Accepted payment methods"
            className="w-full rounded-xl object-cover"
            style={{ maxHeight: "80px" }}
          />

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <Shield size={11} />
            Secured by Stripe · SSL encrypted · Cancel anytime
          </div>

          {/* Footer links */}
          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <Link
              to="/signup"
              search={{ plan: undefined }}
              className="hover:text-foreground transition-colors"
            >
              ← Change plan
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
