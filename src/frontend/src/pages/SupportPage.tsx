import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Laptop,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Smartphone,
  Star,
  User,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

interface FAQ {
  q: string;
  a: string;
  category: string;
}

const ALL_FAQS: FAQ[] = [
  // Getting Started
  {
    category: "Getting Started",
    q: "What is GuardianAI?",
    a: "GuardianAI is an AI-powered parental monitoring app that helps parents keep their children safe online. It tracks location in real-time, analyzes screen time and content, detects cyberbullying, monitors digital spending, and provides personalized parenting recommendations through an AI coach. It works silently in the background on your child's device and sends reports and alerts to your parent dashboard.",
  },
  {
    category: "Getting Started",
    q: "How do I install GuardianAI on my child's phone?",
    a: "Installation is a simple 4-step process: (1) Create your parent account at guardianai.com, (2) Add your child's profile in the dashboard, (3) Download 'GuardianAI Child' from the App Store or Google Play on your child's device, (4) Enter your parent code in the child app to link devices. Full step-by-step instructions with screenshots are available in our Setup Guide.",
  },
  {
    category: "Getting Started",
    q: "What devices are supported?",
    a: "GuardianAI Child supports Android 8.0 and above, and iOS 14 and above. The parent dashboard works on any modern web browser (Chrome, Safari, Firefox, Edge) on desktop, tablet, or mobile. We recommend Android for more comprehensive monitoring capabilities due to iOS restrictions.",
  },
  {
    category: "Getting Started",
    q: "How long does setup take?",
    a: "Most parents complete the full setup in under 5 minutes. Creating your account takes about 1 minute, adding your child's profile is another minute, and installing the child app and entering the parent code takes 2-3 minutes. The app starts monitoring immediately after the link is established.",
  },
  {
    category: "Getting Started",
    q: "Can I monitor multiple children?",
    a: "Yes! The Family plan supports up to 3 children, and the Guardian Pro plan supports unlimited children. Each child has their own profile, and you can easily switch between children in the dashboard dropdown. All children are managed from a single parent account.",
  },
  // Billing
  {
    category: "Billing & Payments",
    q: "How does the free trial work?",
    a: "The Family and Guardian Pro plans include a 14-day free trial. No credit card is required to start the trial. You get full access to all features during the trial period. At the end of 14 days, you'll need to add a payment method to continue. If you don't add one, your account automatically switches to the Basic (free) plan.",
  },
  {
    category: "Billing & Payments",
    q: "Can I cancel anytime?",
    a: "Absolutely. You can cancel your subscription at any time from the Dashboard Settings page. After cancellation, you retain access to your paid plan until the end of the current billing period. There are no cancellation fees. Your data is retained for 30 days after cancellation, then permanently deleted.",
  },
  {
    category: "Billing & Payments",
    q: "Do you offer refunds?",
    a: "We offer pro-rated refunds if you cancel within 7 days of a billing charge. After 7 days, we don't offer refunds for partial months. If you're experiencing a technical issue, contact support@guardianai.com and we'll work to resolve it or issue a goodwill credit.",
  },
  {
    category: "Billing & Payments",
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), Apple Pay, Google Pay, and PayPal. All payments are processed securely through Stripe. We don't store your card details — they're handled entirely by Stripe's secure infrastructure.",
  },
  {
    category: "Billing & Payments",
    q: "Is there a family discount or annual plan?",
    a: "We're currently working on annual billing options (which will save you about 20%) and family bundle discounts. Sign up for our newsletter to be notified when these become available. Contact support for current promotional pricing.",
  },
  // Device Setup
  {
    category: "Device Setup",
    q: "How does background monitoring work?",
    a: "GuardianAI Child runs as a background service on your child's device. On Android, it uses Accessibility Services, Usage Access, and Location permissions to monitor activity continuously. On iOS, it leverages Apple's Screen Time API and Family Sharing. The app uses minimal battery by batching data uploads and using efficient location polling.",
  },
  {
    category: "Device Setup",
    q: "Will my child know they're being monitored?",
    a: "On Android, a small shield notification icon appears in the status bar. We recommend being transparent with your child about monitoring — research shows this builds trust and is more effective long-term. GuardianAI includes a 'transparent mode' conversation guide in the AI Coach section to help you discuss digital safety with your child.",
  },
  {
    category: "Device Setup",
    q: "What permissions does the app need?",
    a: "For full monitoring: Location (Always Allow), Usage Access (to see which apps are used), Notification access (for bullying detection), and Battery optimization exempt (to stay running). Each permission serves a specific monitoring function. You can install with minimal permissions and still get basic location and screen time tracking.",
  },
  {
    category: "Device Setup",
    q: "Does it drain the battery?",
    a: "GuardianAI is engineered for minimal battery impact. In our testing, it uses approximately 3-5% of daily battery life on Android (similar to a weather app running in the background). On iOS, it uses even less. We use efficient location polling intervals and batch data uploads to minimize power consumption.",
  },
  {
    category: "Device Setup",
    q: "My child's device is offline. Does monitoring still work?",
    a: "Yes. GuardianAI stores monitoring data locally when offline and automatically syncs when the device reconnects. Location history will show gaps during offline periods, and screen time is tracked locally. You'll see a 'last synced' timestamp in the dashboard showing when data was last received.",
  },
  // Privacy & Safety
  {
    category: "Privacy & Safety",
    q: "What data do you collect?",
    a: "We collect: GPS location data, app usage statistics (names and duration), browsed URL domains (not full content), message snippets only when our AI flags potential bullying, and purchase/spending amounts. We do NOT collect passwords, full message contents, photos, or browsing history content. Full details in our Privacy Policy.",
  },
  {
    category: "Privacy & Safety",
    q: "Is my data sold to third parties?",
    a: "Never. GuardianAI does not sell, rent, or trade your personal data or your children's data to any third party, ever. We share data only with Stripe (for payment processing) and our ICP blockchain storage infrastructure. Your data is never used for advertising or sold to data brokers.",
  },
  {
    category: "Privacy & Safety",
    q: "How is data encrypted?",
    a: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We store data on the Internet Computer Protocol (ICP) blockchain, which provides additional tamper-resistance. Passwords are stored as bcrypt hashes and never in plain text. Stripe handles payment card data — we never see or store card numbers.",
  },
  {
    category: "Privacy & Safety",
    q: "Is GuardianAI COPPA compliant?",
    a: "Yes. We take children's privacy extremely seriously and are fully COPPA compliant. Account holders are always parents/guardians (18+), not children. We don't serve ads to children, don't use children's data commercially, and parents have full control to view, export, or delete their children's data at any time.",
  },
  // Technical Issues
  {
    category: "Technical Issues",
    q: "App not syncing — what should I do?",
    a: "First, ensure the child's device has an internet connection. Check that GuardianAI is not blocked by a firewall or VPN. On Android, verify battery optimization is disabled for GuardianAI. Try closing and reopening the child app. If the issue persists, go to Settings → Child Profiles → Re-link Device, or contact support with your parent code.",
  },
  {
    category: "Technical Issues",
    q: "Location not updating or showing incorrectly",
    a: "Ensure Location permission is set to 'Always Allow' (not just 'While Using'). Check that Location Services are enabled on the device globally. GPS accuracy depends on satellite signal — in buildings or dense urban areas, accuracy may be lower. Location updates every 5-15 minutes to conserve battery.",
  },
  {
    category: "Technical Issues",
    q: "How do I uninstall GuardianAI from my child's device?",
    a: "Android: Settings → Apps → GuardianAI Child → Uninstall. You may need to first disable Device Administrator: Settings → Security → Device Administrators → uncheck GuardianAI. iOS: Long-press the app icon → Remove App. You can also remotely deactivate monitoring from your parent dashboard Settings page without physically accessing the device.",
  },
  {
    category: "Technical Issues",
    q: "I forgot my password",
    a: "On the login page, click 'Forgot Password' and enter your email address. We'll send a password reset link within 2 minutes. Check your spam folder if you don't see it. If you no longer have access to your email, contact support@guardianai.com with your account details for identity verification.",
  },
];

const CATEGORIES = [
  {
    name: "All Topics",
    icon: <HelpCircle size={16} />,
    count: ALL_FAQS.length,
  },
  {
    name: "Getting Started",
    icon: <Zap size={16} />,
    count: ALL_FAQS.filter((f) => f.category === "Getting Started").length,
  },
  {
    name: "Billing & Payments",
    icon: <CreditCard size={16} />,
    count: ALL_FAQS.filter((f) => f.category === "Billing & Payments").length,
  },
  {
    name: "Device Setup",
    icon: <Smartphone size={16} />,
    count: ALL_FAQS.filter((f) => f.category === "Device Setup").length,
  },
  {
    name: "Privacy & Safety",
    icon: <Lock size={16} />,
    count: ALL_FAQS.filter((f) => f.category === "Privacy & Safety").length,
  },
  {
    name: "Technical Issues",
    icon: <Laptop size={16} />,
    count: ALL_FAQS.filter((f) => f.category === "Technical Issues").length,
  },
];

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      data-ocid={`support.faq.item.${index}`}
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${open ? "oklch(0.78 0.15 195 / 0.35)" : "oklch(0.22 0.04 265)"}`,
        background: open
          ? "oklch(0.15 0.03 195 / 0.1)"
          : "oklch(0.14 0.025 265)",
      }}
    >
      <button
        type="button"
        className="w-full flex items-start justify-between p-4 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground leading-relaxed">
          {faq.q}
        </span>
        <span
          className="shrink-0 mt-0.5 transition-transform duration-200"
          style={{ color: "oklch(0.78 0.15 195)" }}
        >
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border/30">
          <p className="pt-3 text-sm text-muted-foreground leading-relaxed">
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Topics");

  const filteredFAQs = useMemo(() => {
    let results = ALL_FAQS;
    if (activeCategory !== "All Topics") {
      results = results.filter((f) => f.category === activeCategory);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      results = results.filter(
        (f) =>
          f.q.toLowerCase().includes(s) ||
          f.a.toLowerCase().includes(s) ||
          f.category.toLowerCase().includes(s),
      );
    }
    return results;
  }, [search, activeCategory]);

  return (
    <div
      className="min-h-screen"
      data-ocid="support.page"
      style={{ background: "oklch(0.1 0.02 265)" }}
    >
      {/* Header */}
      <header
        className="border-b border-border/50 py-4 px-6 sticky top-0 z-40 backdrop-blur-xl"
        style={{ background: "oklch(0.1 0.02 265 / 0.9)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/assets/generated/guardian-shield-icon-transparent.dim_400x400.png"
              alt="GuardianAI"
              className="w-7 h-7"
            />
            <span className="font-display text-lg font-black text-foreground">
              Guardian<span className="text-gradient-teal">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              to="/setup-guide"
              className="hover:text-foreground transition-colors"
              data-ocid="support.setup_guide.link"
            >
              Setup Guide
            </Link>
            <Link
              to="/legal"
              className="hover:text-foreground transition-colors"
              data-ocid="support.legal.link"
            >
              Legal
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-foreground transition-colors"
              data-ocid="support.dashboard.link"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with search */}
      <section
        className="relative py-20 px-6 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.78 0.15 195 / 0.12) 0%, transparent 60%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <Badge
            className="mb-4"
            style={{
              background: "oklch(0.2 0.06 195 / 0.4)",
              color: "oklch(0.85 0.15 195)",
              border: "1px solid oklch(0.78 0.15 195 / 0.3)",
            }}
          >
            Support Center
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
            How can we <span className="text-gradient-teal">help you?</span>
          </h1>
          <p className="text-muted-foreground mb-8 text-base">
            Find answers to common questions, or reach out to our team directly.
          </p>

          <div className="relative max-w-lg mx-auto">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              data-ocid="support.search.input"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base bg-card border-border focus:border-primary/50 rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {/* Email support */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{
                background: "oklch(0.14 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.2 0.06 195 / 0.25)",
                    color: "oklch(0.78 0.15 195)",
                  }}
                >
                  <Mail size={18} />
                </div>
                <Badge
                  className="text-[10px] border-0"
                  style={{
                    background: "oklch(0.2 0.04 265)",
                    color: "oklch(0.6 0.04 265)",
                  }}
                >
                  48h response
                </Badge>
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">
                  Email Support
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Available to all users
                </p>
                <a
                  href="mailto:support@guardianai.com"
                  className="text-primary text-sm hover:underline flex items-center gap-1"
                >
                  support@guardianai.com <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Priority support */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.06 195 / 0.3), oklch(0.14 0.025 265))",
                border: "1px solid oklch(0.78 0.15 195 / 0.4)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.78 0.15 195 / 0.2)",
                    color: "oklch(0.78 0.15 195)",
                  }}
                >
                  <Star size={18} />
                </div>
                <Badge
                  className="text-[10px] border-0"
                  style={{
                    background: "oklch(0.78 0.15 195 / 0.2)",
                    color: "oklch(0.85 0.15 195)",
                  }}
                >
                  4h response
                </Badge>
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">
                  Priority Support
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Guardian Pro users
                </p>
                <a
                  href="mailto:priority@guardianai.com"
                  className="text-primary text-sm hover:underline flex items-center gap-1"
                >
                  priority@guardianai.com <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Setup guide */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{
                background: "oklch(0.14 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.2 0.06 155 / 0.25)",
                    color: "oklch(0.72 0.18 155)",
                  }}
                >
                  <Smartphone size={18} />
                </div>
                <Badge
                  className="text-[10px] border-0"
                  style={{
                    background: "oklch(0.2 0.06 155 / 0.3)",
                    color: "oklch(0.72 0.18 155)",
                  }}
                >
                  Instant
                </Badge>
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">
                  Setup Guide
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Step-by-step device setup
                </p>
                <Link
                  to="/setup-guide"
                  className="text-primary text-sm hover:underline flex items-center gap-1"
                  data-ocid="support.setup_guide_card.link"
                >
                  View Setup Guide <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Response time badges */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {[
              {
                plan: "Basic (Free)",
                time: "48h email response",
                icon: <User size={12} />,
              },
              {
                plan: "Family Plan",
                time: "24h email response",
                icon: <MessageCircle size={12} />,
              },
              {
                plan: "Guardian Pro",
                time: "4h priority response",
                icon: <Phone size={12} />,
              },
            ].map((item) => (
              <div
                key={item.plan}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
                style={{
                  background: "oklch(0.14 0.025 265)",
                  border: "1px solid oklch(0.22 0.04 265)",
                }}
              >
                <span className="text-muted-foreground">{item.icon}</span>
                <span className="text-foreground font-medium">
                  {item.plan}:
                </span>
                <span className="text-muted-foreground">{item.time}</span>
                <Clock size={10} className="text-muted-foreground" />
              </div>
            ))}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                data-ocid="support.category.tab"
                onClick={() => setActiveCategory(cat.name)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                style={
                  activeCategory === cat.name
                    ? {
                        background: "oklch(0.78 0.15 195)",
                        color: "oklch(0.08 0.02 265)",
                        boxShadow: "0 0 12px oklch(0.78 0.15 195 / 0.3)",
                      }
                    : {
                        background: "oklch(0.14 0.025 265)",
                        color: "oklch(0.7 0.03 265)",
                        border: "1px solid oklch(0.22 0.04 265)",
                      }
                }
              >
                {cat.icon}
                {cat.name}
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px]"
                  style={{
                    background:
                      activeCategory === cat.name
                        ? "oklch(0.08 0.02 265 / 0.3)"
                        : "oklch(0.22 0.04 265)",
                  }}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ list */}
          {filteredFAQs.length === 0 ? (
            <div
              data-ocid="support.faq.empty_state"
              className="text-center py-16"
              style={{
                background: "oklch(0.14 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
                borderRadius: "16px",
              }}
            >
              <Search
                size={36}
                className="mx-auto mb-3 text-muted-foreground/30"
              />
              <p className="text-foreground font-medium mb-1">
                No results found
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try different search terms or browse all categories
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Topics");
                }}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq, i) => (
                <FAQItem key={`${faq.category}-${i}`} faq={faq} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still need help */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl p-10 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.06 195 / 0.3), oklch(0.14 0.025 265))",
              border: "1px solid oklch(0.78 0.15 195 / 0.3)",
            }}
          >
            <Shield size={40} className="text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-black text-foreground mb-3">
              Still need help?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Our support team is here for you. Reach out via email or check out
              the detailed setup guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:support@guardianai.com">
                <Button
                  data-ocid="support.contact_email.button"
                  className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                >
                  <Mail size={15} />
                  Email Support
                </Button>
              </a>
              <Link to="/setup-guide">
                <Button
                  data-ocid="support.setup_guide_cta.button"
                  variant="outline"
                  className="gap-2"
                >
                  <ExternalLink size={15} />
                  Setup Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
              data-ocid="support.footer_privacy.link"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
              data-ocid="support.footer_terms.link"
            >
              Terms
            </Link>
            <Link
              to="/legal"
              className="hover:text-foreground transition-colors"
              data-ocid="support.footer_legal.link"
            >
              Legal
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} GuardianAI Inc. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
