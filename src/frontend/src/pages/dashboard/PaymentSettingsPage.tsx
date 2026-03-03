import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

// ── Payment Method Toggle ──────────────────────────────────
function PaymentMethodToggle({
  label,
  description,
  enabled,
  onToggle,
  comingSoon,
  provider,
  ocid,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  comingSoon?: boolean;
  provider?: string;
  ocid: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl transition-colors"
      style={{
        background:
          enabled && !comingSoon
            ? "oklch(0.16 0.04 195 / 0.2)"
            : "oklch(0.12 0.025 265)",
        border: `1px solid ${enabled && !comingSoon ? "oklch(0.78 0.15 195 / 0.3)" : "oklch(0.22 0.04 265)"}`,
      }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {comingSoon && (
            <Badge
              className="text-[10px] border-0"
              style={{
                background: "oklch(0.22 0.04 265)",
                color: "oklch(0.58 0.04 265)",
              }}
            >
              Coming Soon
            </Badge>
          )}
          {provider && (
            <Badge
              className="text-[10px] border-0"
              style={{
                background: "oklch(0.2 0.06 195 / 0.3)",
                color: "oklch(0.78 0.15 195)",
              }}
            >
              via {provider}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch
        data-ocid={ocid}
        checked={enabled && !comingSoon}
        onCheckedChange={comingSoon ? undefined : onToggle}
        disabled={comingSoon}
      />
    </div>
  );
}

// ── Revenue Bar Chart ──────────────────────────────────────
function RevenueChart() {
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  const values = [1240, 1580, 1920, 2310, 2640, 3180];
  const max = Math.max(...values);

  return (
    <div className="flex items-end gap-2 h-28">
      {months.map((month, i) => (
        <div key={month} className="flex flex-col items-center gap-1.5 flex-1">
          <span className="text-[9px] text-muted-foreground">
            ${(values[i] / 1000).toFixed(1)}k
          </span>
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(values[i] / max) * 80}px`,
              background:
                i === months.length - 1
                  ? "oklch(0.78 0.15 195)"
                  : "oklch(0.78 0.15 195 / 0.4)",
            }}
          />
          <span className="text-[9px] text-muted-foreground">{month}</span>
        </div>
      ))}
    </div>
  );
}

export default function PaymentSettingsPage() {
  const { actor, isFetching } = useActor();

  // Stripe config
  const [secretKey, setSecretKey] = useState("");
  const [publishableKey, setPublishableKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [isStripeConfigured, setIsStripeConfigured] = useState(false);
  const [isSavingStripe, setIsSavingStripe] = useState(false);

  // PayPal config (UI only)
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalEnabled, setPaypalEnabled] = useState(false);

  // Payment methods
  const [methods, setMethods] = useState({
    creditCard: true,
    paypal: false,
    applePay: true,
    googlePay: true,
    bankTransfer: false,
    crypto: false,
  });

  // Load Stripe status
  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isStripeConfigured()
      .then(setIsStripeConfigured)
      .catch(() => {});
  }, [actor, isFetching]);

  const handleSaveStripe = async () => {
    if (!secretKey.startsWith("sk_") && !secretKey.startsWith("rk_")) {
      toast.error(
        "Invalid Stripe secret key format. Should start with sk_live_ or sk_test_",
      );
      return;
    }
    setIsSavingStripe(true);
    try {
      if (actor) {
        await actor.setStripeConfiguration({
          secretKey,
          allowedCountries: [
            "US",
            "GB",
            "CA",
            "AU",
            "DE",
            "FR",
            "ES",
            "IT",
            "NL",
            "SE",
          ],
        });
        setIsStripeConfigured(true);
        toast.success("Stripe configuration saved successfully!");
      } else {
        // Demo
        setIsStripeConfigured(true);
        toast.success("Stripe configuration saved (demo mode)");
      }
    } catch {
      toast.error("Failed to save Stripe configuration. Please try again.");
    } finally {
      setIsSavingStripe(false);
    }
  };

  const toggleMethod = (key: keyof typeof methods) => {
    setMethods((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Payment method updated");
  };

  // Revenue stats (demo)
  const familyCount = 234;
  const proCount = 87;
  const familyMRR = familyCount * 9.99;
  const proMRR = proCount * 19.99;
  const totalMRR = familyMRR + proMRR;

  return (
    <div
      data-ocid="payment_settings.page"
      className="flex flex-col gap-6 max-w-4xl"
    >
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.06 195 / 0.3), oklch(0.14 0.025 265))",
          border: "1px solid oklch(0.78 0.15 195 / 0.35)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(0.78 0.15 195 / 0.2)",
              color: "oklch(0.78 0.15 195)",
            }}
          >
            <Settings size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-foreground">
              Payment Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure how you receive subscription payments from customers
            </p>
          </div>
        </div>
        <div
          className="mt-4 rounded-xl p-3 flex items-center gap-2 text-xs"
          style={{
            background: "oklch(0.18 0.06 70 / 0.2)",
            border: "1px solid oklch(0.78 0.18 70 / 0.3)",
            color: "oklch(0.88 0.18 70)",
          }}
        >
          <Shield size={13} />
          This page is for the GuardianAI app owner to configure payment
          processing. These settings control how customers pay for
          subscriptions.
        </div>
      </div>

      {/* Dashboard image */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid oklch(0.22 0.04 265)" }}
      >
        <img
          src="/assets/generated/payment-settings-dashboard.dim_800x600.png"
          alt="Payment Settings Dashboard"
          className="w-full object-cover"
          style={{ maxHeight: "280px" }}
        />
      </div>

      {/* Stripe Configuration */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "oklch(0.14 0.025 265)",
          border: "1px solid oklch(0.22 0.04 265)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "oklch(0.2 0.06 195 / 0.25)",
                color: "oklch(0.78 0.15 195)",
              }}
            >
              <CreditCard size={17} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-foreground">
                Stripe Configuration
              </h2>
              <p className="text-xs text-muted-foreground">
                Connect your Stripe account to accept payments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isStripeConfigured ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.2 0.06 155 / 0.3)",
                  color: "oklch(0.72 0.18 155)",
                }}
              >
                <CheckCircle size={11} />
                Configured
              </div>
            ) : (
              <Badge
                className="border-0 text-xs"
                style={{
                  background: "oklch(0.18 0.06 25 / 0.3)",
                  color: "oklch(0.65 0.22 25)",
                }}
              >
                Not configured
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="stripe-secret"
              className="text-xs text-muted-foreground"
            >
              Stripe Secret Key
            </Label>
            <div className="relative">
              <Input
                id="stripe-secret"
                data-ocid="payment_settings.stripe_secret.input"
                type={showSecretKey ? "text" : "password"}
                placeholder="sk_live_..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="pr-10 bg-secondary border-border text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showSecretKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Found in Stripe Dashboard → Developers → API keys
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="stripe-pk"
              className="text-xs text-muted-foreground"
            >
              Stripe Publishable Key
            </Label>
            <Input
              id="stripe-pk"
              data-ocid="payment_settings.stripe_publishable.input"
              type="text"
              placeholder="pk_live_..."
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              className="bg-secondary border-border text-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label
              htmlFor="stripe-webhook"
              className="text-xs text-muted-foreground"
            >
              Stripe Webhook Secret
            </Label>
            <div className="relative">
              <Input
                id="stripe-webhook"
                data-ocid="payment_settings.stripe_webhook.input"
                type={showWebhookSecret ? "text" : "password"}
                placeholder="whsec_..."
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="pr-10 bg-secondary border-border text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showWebhookSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              From Stripe Dashboard → Developers → Webhooks → your endpoint →
              Signing secret
            </p>
          </div>
        </div>

        <Button
          data-ocid="payment_settings.stripe.save_button"
          onClick={handleSaveStripe}
          disabled={isSavingStripe || !secretKey}
          className="self-start bg-primary text-primary-foreground hover:opacity-90 gap-2"
        >
          {isSavingStripe ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {isSavingStripe ? "Saving..." : "Save Stripe Configuration"}
        </Button>
      </div>

      {/* PayPal Configuration */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "oklch(0.14 0.025 265)",
          border: "1px solid oklch(0.22 0.04 265)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
            style={{
              background: "oklch(0.2 0.1 225 / 0.3)",
              color: "oklch(0.65 0.18 225)",
            }}
          >
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-foreground">
                PayPal Configuration
              </h2>
              <Badge
                className="border-0 text-[10px]"
                style={{
                  background: "oklch(0.22 0.04 265)",
                  color: "oklch(0.58 0.04 265)",
                }}
              >
                Coming Soon
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect your PayPal Business account
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-4 text-sm text-muted-foreground"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          PayPal Business integration is coming soon. Configure your client ID
          and secret below to be ready when it launches.
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="paypal-client-id"
              className="text-xs text-muted-foreground"
            >
              PayPal Client ID
            </Label>
            <Input
              id="paypal-client-id"
              data-ocid="payment_settings.paypal_client_id.input"
              type="text"
              placeholder="AaBbCcDd..."
              value={paypalClientId}
              onChange={(e) => setPaypalClientId(e.target.value)}
              className="bg-secondary border-border text-sm font-mono"
              disabled
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-2.5 pb-2">
              <Switch
                data-ocid="payment_settings.paypal.toggle"
                checked={paypalEnabled}
                onCheckedChange={setPaypalEnabled}
                disabled
              />
              <Label className="text-xs text-muted-foreground">
                Enable PayPal as payment option
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Enabled */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: "oklch(0.14 0.025 265)",
          border: "1px solid oklch(0.22 0.04 265)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(0.2 0.06 195 / 0.25)",
              color: "oklch(0.78 0.15 195)",
            }}
          >
            <Zap size={17} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground">
              Payment Methods
            </h2>
            <p className="text-xs text-muted-foreground">
              Enable or disable payment methods for customers
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <PaymentMethodToggle
            label="Credit & Debit Cards"
            description="Visa, Mastercard, American Express, Discover"
            enabled={methods.creditCard}
            onToggle={() => toggleMethod("creditCard")}
            provider="Stripe"
            ocid="payment_settings.credit_card.toggle"
          />
          <PaymentMethodToggle
            label="PayPal"
            description="PayPal account or guest checkout"
            enabled={methods.paypal}
            onToggle={() => toggleMethod("paypal")}
            comingSoon
            ocid="payment_settings.paypal_method.toggle"
          />
          <PaymentMethodToggle
            label="Apple Pay"
            description="One-touch payments for Apple device users"
            enabled={methods.applePay}
            onToggle={() => toggleMethod("applePay")}
            provider="Stripe"
            ocid="payment_settings.apple_pay.toggle"
          />
          <PaymentMethodToggle
            label="Google Pay"
            description="Fast checkout for Android and Chrome users"
            enabled={methods.googlePay}
            onToggle={() => toggleMethod("googlePay")}
            provider="Stripe"
            ocid="payment_settings.google_pay.toggle"
          />
          <PaymentMethodToggle
            label="Bank Transfer (ACH)"
            description="Direct bank account debit for US customers"
            enabled={methods.bankTransfer}
            onToggle={() => toggleMethod("bankTransfer")}
            comingSoon
            ocid="payment_settings.bank_transfer.toggle"
          />
          <PaymentMethodToggle
            label="Cryptocurrency"
            description="Bitcoin, Ethereum, and stablecoins"
            enabled={methods.crypto}
            onToggle={() => toggleMethod("crypto")}
            comingSoon
            ocid="payment_settings.crypto.toggle"
          />
        </div>
      </div>

      {/* Revenue Summary */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "oklch(0.14 0.025 265)",
          border: "1px solid oklch(0.22 0.04 265)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(0.2 0.06 155 / 0.25)",
              color: "oklch(0.72 0.18 155)",
            }}
          >
            <DollarSign size={17} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground">
              Revenue Summary
            </h2>
            <p className="text-xs text-muted-foreground">
              Current month subscription overview (demo data)
            </p>
          </div>
        </div>

        {/* MRR cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Family Subscribers",
              value: familyCount.toString(),
              sub: `$${familyMRR.toFixed(0)}/mo`,
              color: "oklch(0.78 0.15 195)",
              icon: <Users size={16} />,
            },
            {
              label: "Guardian Pro",
              value: proCount.toString(),
              sub: `$${proMRR.toFixed(0)}/mo`,
              color: "oklch(0.68 0.22 310)",
              icon: <Shield size={16} />,
            },
            {
              label: "Total MRR",
              value: `$${totalMRR.toFixed(0)}`,
              sub: "monthly recurring",
              color: "oklch(0.72 0.18 155)",
              icon: <DollarSign size={16} />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.12 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
              }}
            >
              <div
                className="flex items-center gap-1.5 mb-2"
                style={{ color: stat.color }}
              >
                {stat.icon}
                <span className="text-[10px] font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <div className="font-display text-2xl font-black text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-medium">
            Monthly Revenue (last 6 months)
          </p>
          <RevenueChart />
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center pb-4">
        © {new Date().getFullYear()} GuardianAI Inc. — Payment configuration
        page for app owners.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/60 hover:text-primary"
        >
          Built with caffeine.ai
        </a>
      </p>
    </div>
  );
}
