import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Lock,
  MapPin,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Particle Animation ────────────────────────────────────
function Particles() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {(
        [
          "p0",
          "p1",
          "p2",
          "p3",
          "p4",
          "p5",
          "p6",
          "p7",
          "p8",
          "p9",
          "p10",
          "p11",
          "p12",
          "p13",
          "p14",
          "p15",
          "p16",
          "p17",
          "p18",
          "p19",
        ] as const
      ).map((pid) => (
        <div
          key={pid}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-10px",
            background: `oklch(${0.7 + Math.random() * 0.2} ${0.1 + Math.random() * 0.1} ${180 + Math.random() * 40})`,
            animation: `particle-drift ${8 + Math.random() * 12}s linear ${Math.random() * 10}s infinite`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  delay = 0,
}: FeatureCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl p-6 bg-card-glass hover:border-teal transition-all duration-500 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.3s ease`,
      }}
    >
      {/* hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top left, ${color}15 0%, transparent 60%)`,
        }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// ── Stat Bar ──────────────────────────────────────────────
function StatBar() {
  const stats = [
    {
      icon: <Users size={20} />,
      value: "50,000+",
      label: "Families Protected",
    },
    { icon: <Activity size={20} />, value: "99.9%", label: "Uptime" },
    {
      icon: <Brain size={20} />,
      value: "AI-Powered",
      label: "Real-time Analysis",
    },
    {
      icon: <Lock size={20} />,
      value: "Privacy First",
      label: "End-to-end encrypted",
    },
  ];

  return (
    <div className="border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="text-primary">{stat.icon}</div>
              <div className="font-display text-2xl font-bold text-gradient-teal">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Testimonial Card ──────────────────────────────────────
interface TestimonialProps {
  name: string;
  role: string;
  text: string;
  rating: number;
  initials: string;
}

function TestimonialCard({
  name,
  role,
  text,
  rating,
  initials,
}: TestimonialProps) {
  return (
    <div className="rounded-2xl p-6 bg-card-glass flex flex-col gap-4">
      <div className="flex gap-1">
        {Array.from<number>({ length: rating })
          .fill(0)
          .map((_, idx) => (
            <Star
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star rating
              key={`star-${idx}`}
              size={14}
              className="fill-brand-amber text-brand-amber"
            />
          ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed italic">
        "{text}"
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-heading"
          style={{
            background: "oklch(0.2 0.06 195)",
            color: "oklch(0.78 0.15 195)",
          }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
}

// ── Pricing Card ──────────────────────────────────────────
interface PricingCardProps {
  index: number;
  tier: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

function PricingCard({
  index,
  tier,
  price,
  period,
  features,
  cta,
  highlighted,
  badge,
}: PricingCardProps) {
  return (
    <div
      data-ocid={`landing.pricing.item.${index}`}
      className={`relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 ${
        highlighted
          ? "bg-gradient-to-b from-[oklch(0.18_0.06_195/0.8)] to-card border border-[oklch(0.78_0.15_195/0.5)] shadow-glow-teal"
          : "bg-card-glass hover:border-teal"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
            {badge}
          </Badge>
        </div>
      )}
      <div>
        <h3 className="font-heading text-lg font-bold text-foreground mb-1">
          {tier}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-4xl font-bold text-gradient-teal">
            {price}
          </span>
          {period && (
            <span className="text-muted-foreground text-sm">{period}</span>
          )}
        </div>
      </div>
      <ul className="flex flex-col gap-3 flex-1">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Check size={14} className="mt-0.5 shrink-0 text-brand-teal" />
            {f}
          </li>
        ))}
      </ul>
      <Link to="/dashboard">
        <Button
          className={`w-full ${highlighted ? "bg-primary text-primary-foreground hover:opacity-90" : "variant-outline border-border hover:border-primary/50"}`}
          variant={highlighted ? "default" : "outline"}
        >
          {cta}
          <ArrowRight size={14} className="ml-1" />
        </Button>
      </Link>
    </div>
  );
}

// ── How It Works ──────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Add Your Child's Profile",
      desc: "Set up profiles for each child with their device information. Takes less than 2 minutes.",
      icon: <Users size={24} />,
    },
    {
      num: "02",
      title: "AI Monitors All Activity",
      desc: "Our AI engine continuously analyzes location, screen time, messages, and spending in real-time.",
      icon: <Brain size={24} />,
    },
    {
      num: "03",
      title: "Get Smart Recommendations",
      desc: "Receive personalized insights and actionable parenting tips based on your child's digital patterns.",
      icon: <Zap size={24} />,
    },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent text-accent-foreground border-0">
            How It Works
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Protection in{" "}
            <span className="text-gradient-teal">3 simple steps</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Getting started takes minutes. Our AI does the heavy lifting so you
            can focus on what matters.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-primary"
                  style={{
                    background: "oklch(0.18 0.06 195 / 0.3)",
                    border: "1px solid oklch(0.78 0.15 195 / 0.3)",
                    boxShadow: "0 0 30px oklch(0.78 0.15 195 / 0.15)",
                  }}
                >
                  {step.icon}
                </div>
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                  style={{
                    background: "oklch(0.78 0.15 195)",
                    color: "oklch(0.08 0.02 265)",
                  }}
                >
                  {i + 1}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-1">
                  {step.num}
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Landing Page ─────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const features = [
    {
      icon: <MapPin size={22} />,
      title: "Real-Time Location",
      description:
        "Live GPS tracking with geofencing. Receive instant alerts when your child enters or leaves designated safe zones.",
      color: "oklch(0.78 0.15 195)",
    },
    {
      icon: <Clock size={22} />,
      title: "Screen Time Analytics",
      description:
        "Detailed per-app usage reports with AI-generated insights. Understand exactly how your child spends their digital time.",
      color: "oklch(0.72 0.18 155)",
    },
    {
      icon: <Shield size={22} />,
      title: "Content Guardian",
      description:
        "AI scans browsed content in real-time flagging inappropriate material with risk scores and category classification.",
      color: "oklch(0.68 0.22 310)",
    },
    {
      icon: <AlertTriangle size={22} />,
      title: "Bullying Detection",
      description:
        "ML-powered message analysis identifies cyberbullying patterns, harsh language, and threatening behavior across all platforms.",
      color: "oklch(0.75 0.22 55)",
    },
    {
      icon: <CreditCard size={22} />,
      title: "Spending Monitor",
      description:
        "Track every in-app purchase, subscription, and digital transaction. Set spending limits with instant over-budget alerts.",
      color: "oklch(0.65 0.22 25)",
    },
    {
      icon: <Brain size={22} />,
      title: "AI Parenting Coach",
      description:
        "Receive personalized weekly tips and actionable recommendations tailored to your child's unique digital behavior patterns.",
      color: "oklch(0.78 0.18 195)",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Mother of 2, Austin TX",
      text: "GuardianAI caught signs of cyberbullying I would never have noticed on my own. The AI flagged concerning messages and gave me a script for talking to my daughter. Life-changing.",
      rating: 5,
      initials: "SM",
    },
    {
      name: "David Chen",
      role: "Father of 3, Seattle WA",
      text: "The screen time analytics are incredibly detailed. I had no idea my son was spending 4 hours a day on gaming apps. Now we have healthy limits and he's sleeping better.",
      rating: 5,
      initials: "DC",
    },
    {
      name: "Maria Rodriguez",
      role: "Parent, Miami FL",
      text: "The location tracking with safe zones gives me peace of mind when my kids walk to school. I love the weekly AI coaching tips — they've transformed how I communicate with my teenagers.",
      rating: 5,
      initials: "MR",
    },
  ];

  return (
    <div
      className="min-h-screen bg-mesh-dark relative"
      data-ocid="landing.page"
    >
      {/* ── Nav ─────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/guardian-shield-icon-transparent.dim_400x400.png"
              alt="GuardianAI"
              className="w-8 h-8"
            />
            <span className="font-display text-xl font-bold text-foreground">
              Guardian<span className="text-gradient-teal">AI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:opacity-90 shadow-glow-teal"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────── */}
      <section
        className="hero-bg relative min-h-screen flex items-center pt-16 overflow-hidden"
        data-ocid="landing.hero.section"
      >
        <Particles />

        {/* Dramatic glow layers */}
        <div
          className="absolute -top-20 left-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.22 310 / 0.16) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.15 195 / 0.14) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        {/* Subtle horizontal light beam */}
        <div
          className="absolute top-1/2 left-0 right-0 h-px pointer-events-none opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.78 0.15 195 / 0.4) 30%, oklch(0.68 0.22 310 / 0.3) 70%, transparent 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            {/* Left: Copy */}
            <div className="flex flex-col gap-7">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center gap-1.5 rounded-full py-1 pl-2 pr-3 text-xs font-semibold"
                  style={{
                    background: "oklch(0.2 0.06 195 / 0.5)",
                    border: "1px solid oklch(0.78 0.15 195 / 0.35)",
                    color: "oklch(0.85 0.15 195)",
                    boxShadow: "0 0 16px oklch(0.78 0.15 195 / 0.15)",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.78 0.15 195 / 0.3)" }}
                  >
                    <Zap size={9} />
                  </span>
                  AI-Powered Protection
                </div>
                <span
                  className="text-[11px] font-medium rounded-full px-2.5 py-0.5"
                  style={{
                    background: "oklch(0.68 0.22 310 / 0.15)",
                    border: "1px solid oklch(0.68 0.22 310 / 0.3)",
                    color: "oklch(0.78 0.22 310)",
                  }}
                >
                  New: Bullying v2.0
                </span>
              </div>

              <div>
                <h1 className="font-display font-black tracking-tight leading-[0.92]">
                  <span className="block text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] text-foreground">
                    Know Your
                  </span>
                  <span className="block text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] text-foreground">
                    Child is Safe.
                  </span>
                  <span className="block text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] text-gradient-teal italic mt-1">
                    Always.
                  </span>
                </h1>
              </div>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                AI-powered parental monitoring that protects what matters most —
                your child's digital world. Real-time location, content
                analysis, bullying detection, and personalized coaching.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/dashboard">
                  <Button
                    data-ocid="landing.hero_cta.primary_button"
                    size="lg"
                    className="text-base px-8 rounded-xl font-bold h-13 transition-all duration-200"
                    style={{
                      background: "oklch(0.78 0.15 195)",
                      color: "oklch(0.08 0.02 265)",
                      boxShadow:
                        "0 0 32px oklch(0.78 0.15 195 / 0.45), 0 4px 16px oklch(0.78 0.15 195 / 0.2)",
                    }}
                  >
                    Start Free Trial
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button
                    data-ocid="landing.hero_cta.secondary_button"
                    variant="outline"
                    size="lg"
                    className="text-base px-8 rounded-xl font-semibold h-13"
                    style={{
                      borderColor: "oklch(0.35 0.05 265)",
                      color: "oklch(0.85 0.02 265)",
                      background: "oklch(0.15 0.025 265 / 0.5)",
                    }}
                  >
                    See How It Works
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-5 text-xs text-muted-foreground/70">
                <span className="flex items-center gap-1.5">
                  <Check size={12} className="text-brand-teal" /> No credit card
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="flex items-center gap-1.5">
                  <Check size={12} className="text-brand-teal" /> 14-day free
                  trial
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="flex items-center gap-1.5">
                  <Check size={12} className="text-brand-teal" /> Cancel anytime
                </span>
              </div>
            </div>

            {/* Right: Hero image with layered glow pedestal */}
            <div className="relative flex items-center justify-center py-8">
              {/* Pedestal glow — bottom */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse, oklch(0.78 0.15 195 / 0.35) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              {/* Main atmospheric halo */}
              <div
                className="absolute w-80 h-80 rounded-full pointer-events-none animate-glow-pulse"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.78 0.15 195 / 0.22) 0%, oklch(0.68 0.22 310 / 0.08) 50%, transparent 70%)",
                  filter: "blur(32px)",
                }}
              />
              {/* Outer violet ring glow */}
              <div
                className="absolute w-96 h-96 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, transparent 40%, oklch(0.68 0.22 310 / 0.08) 60%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <img
                src="/assets/generated/hero-app-mockup.dim_800x900.png"
                alt="GuardianAI App Dashboard"
                className="relative z-10 animate-float w-full max-w-[320px] md:max-w-sm lg:max-w-[380px]"
                style={{
                  filter:
                    "drop-shadow(0 24px 48px oklch(0.05 0.02 265)) drop-shadow(0 0 40px oklch(0.78 0.15 195 / 0.25))",
                }}
              />
              {/* Floating stat pills — more prominent */}
              <div
                className="absolute top-12 -left-2 lg:-left-8 rounded-2xl px-4 py-2.5 text-xs font-semibold backdrop-blur-md flex items-center gap-2.5 z-20"
                style={{
                  background: "oklch(0.16 0.06 155 / 0.95)",
                  border: "1px solid oklch(0.72 0.18 155 / 0.5)",
                  color: "oklch(0.88 0.18 155)",
                  boxShadow:
                    "0 8px 24px oklch(0.05 0.02 265 / 0.6), 0 0 12px oklch(0.72 0.18 155 / 0.2)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "oklch(0.72 0.18 155)" }}
                />
                <span>Safe Zone: Home</span>
                <span className="ml-0.5 text-[10px] opacity-70">✓</span>
              </div>
              <div
                className="absolute bottom-20 -right-2 lg:-right-8 rounded-2xl px-4 py-2.5 text-xs font-semibold backdrop-blur-md flex items-center gap-2.5 z-20"
                style={{
                  background: "oklch(0.16 0.06 25 / 0.95)",
                  border: "1px solid oklch(0.65 0.22 25 / 0.5)",
                  color: "oklch(0.88 0.22 25)",
                  boxShadow:
                    "0 8px 24px oklch(0.05 0.02 265 / 0.6), 0 0 12px oklch(0.65 0.22 25 / 0.2)",
                }}
              >
                <AlertTriangle size={11} />
                <span>1 Alert Detected</span>
              </div>
              {/* Third pill — location */}
              <div
                className="absolute top-1/2 -right-2 lg:-right-6 rounded-2xl px-3.5 py-2 text-xs font-semibold backdrop-blur-md flex items-center gap-2 z-20"
                style={{
                  background: "oklch(0.16 0.06 195 / 0.95)",
                  border: "1px solid oklch(0.78 0.15 195 / 0.5)",
                  color: "oklch(0.88 0.15 195)",
                  boxShadow:
                    "0 8px 24px oklch(0.05 0.02 265 / 0.6), 0 0 12px oklch(0.78 0.15 195 / 0.2)",
                }}
              >
                <MapPin size={11} />
                <span>3.2h today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────── */}
      <StatBar />

      {/* ── Features ────────────────────────── */}
      <section
        id="features"
        className="py-24 px-6"
        data-ocid="landing.features.section"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent text-accent-foreground border-0">
              Features
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything a parent{" "}
              <span className="text-gradient-teal">needs to know</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six powerful AI-driven modules that give you complete visibility
              into your child's digital life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────── */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* ── Testimonials ────────────────────── */}
      <section
        id="testimonials"
        className="py-24 px-6"
        data-ocid="landing.testimonials.section"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent text-accent-foreground border-0">
              Testimonials
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Trusted by{" "}
              <span className="text-gradient-teal">50,000+ families</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────── */}
      <section
        id="pricing"
        className="py-24 px-6"
        data-ocid="landing.pricing.section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent text-accent-foreground border-0">
              Pricing
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent{" "}
              <span className="text-gradient-teal">pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start free. Upgrade when you need more. Cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              index={1}
              tier="Basic"
              price="Free"
              features={[
                "1 child profile",
                "Real-time location tracking",
                "Screen time overview",
                "Weekly digest emails",
                "Community support",
              ]}
              cta="Start Free"
            />
            <PricingCard
              index={2}
              tier="Family"
              price="$9.99"
              period="/month"
              highlighted
              badge="Most Popular"
              features={[
                "Up to 3 children",
                "All Basic features",
                "AI content analysis",
                "Bullying detection",
                "Spending monitor",
                "AI Parenting Coach",
                "Email + push alerts",
              ]}
              cta="Start Free Trial"
            />
            <PricingCard
              index={3}
              tier="Guardian Pro"
              price="$19.99"
              period="/month"
              features={[
                "Unlimited children",
                "All Family features",
                "Priority AI analysis",
                "Advanced reporting",
                "Custom alert rules",
                "Phone support",
                "Family dashboard sharing",
              ]}
              cta="Start Free Trial"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────── */}
      <section className="py-24 px-6" data-ocid="landing.cta.section">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.06 195 / 0.4), oklch(0.14 0.025 265), oklch(0.18 0.06 310 / 0.3))",
              border: "1px solid oklch(0.78 0.15 195 / 0.3)",
              boxShadow: "0 0 60px oklch(0.78 0.15 195 / 0.15)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.78 0.15 195 / 0.06) 0%, transparent 70%)",
              }}
            />
            <Shield size={48} className="text-primary mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ready to protect
              <br />
              <span className="text-gradient-teal">your family?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of parents who sleep better knowing their children
              are safe. Start your free trial today.
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:opacity-90 shadow-glow-teal text-base px-10 py-6 rounded-xl font-semibold"
              >
                Get Started Free
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required · 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="border-t border-border/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/generated/guardian-shield-icon-transparent.dim_400x400.png"
                  alt="GuardianAI"
                  className="w-8 h-8"
                />
                <span className="font-display text-xl font-bold text-foreground">
                  Guardian<span className="text-gradient-teal">AI</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                AI-powered parental monitoring that keeps your children safe in
                the digital world. Privacy-first, parent-friendly.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4 text-sm">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4 text-sm">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="hover:text-foreground transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="hover:text-foreground transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="hover:text-foreground transition-colors cursor-pointer">
                    Support
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GuardianAI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
