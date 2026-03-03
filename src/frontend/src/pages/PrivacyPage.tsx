import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  Shield,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

const LAST_UPDATED = "March 3, 2026";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

function AccordionSection({
  section,
  isOpen,
  onToggle,
}: {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      id={section.id}
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${isOpen ? "oklch(0.78 0.15 195 / 0.4)" : "oklch(0.22 0.04 265)"}`,
        background: isOpen
          ? "oklch(0.15 0.03 195 / 0.15)"
          : "oklch(0.14 0.025 265)",
      }}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "oklch(0.2 0.06 195 / 0.3)",
              color: "oklch(0.78 0.15 195)",
            }}
          >
            {section.icon}
          </span>
          <span className="font-heading font-semibold text-foreground text-base">
            {section.title}
          </span>
        </div>
        <span
          className="transition-transform duration-200"
          style={{ color: "oklch(0.78 0.15 195)" }}
        >
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 border-t border-border/30">
          <div className="pt-4 text-sm text-muted-foreground leading-relaxed space-y-3">
            {section.content}
          </div>
        </div>
      )}
    </div>
  );
}

const sections: Section[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: <FileText size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          Welcome to GuardianAI ("we," "our," or "us"). We are committed to
          protecting the privacy of parents and children who use our parental
          monitoring service. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use the GuardianAI
          application and website.
        </p>
        <p>
          <strong className="text-foreground">Company:</strong> GuardianAI Inc.
        </p>
        <p>
          <strong className="text-foreground">Last Updated:</strong>{" "}
          {LAST_UPDATED}
        </p>
        <p>
          By using GuardianAI, you agree to the collection and use of
          information in accordance with this policy. If you disagree, please
          discontinue use of our services.
        </p>
        <p>
          This policy applies to parents/guardians who create accounts and to
          the monitoring data collected from children's devices. Parents are the
          account holders and data controllers for their children's information.
        </p>
      </div>
    ),
  },
  {
    id: "data-collection",
    title: "Information We Collect",
    icon: <Database size={16} />,
    content: (
      <div className="space-y-4">
        <p>
          We collect the following categories of information to provide our
          monitoring services:
        </p>

        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <h4 className="font-semibold text-foreground text-sm">
            📍 Location Data
          </h4>
          <p>
            GPS coordinates, location history, address details. Used for
            real-time location tracking and safe zone monitoring. Collected
            continuously while the child app is active.
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <h4 className="font-semibold text-foreground text-sm">
            📱 App Usage Data
          </h4>
          <p>
            App names, usage duration per app, app categories, and screen time.
            We do not collect the content displayed within apps, only which apps
            are used and for how long.
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <h4 className="font-semibold text-foreground text-sm">
            🌐 Browsed URL Metadata
          </h4>
          <p>
            Domain names and URL categories of visited websites. We do NOT
            collect the full content of web pages, form inputs, passwords, or
            the complete URL including query parameters that may contain
            personal information.
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <h4 className="font-semibold text-foreground text-sm">
            💬 Message Metadata (Bullying Detection Only)
          </h4>
          <p>
            Brief text snippets flagged by our AI for bullying indicators. We do
            NOT collect full message content, contact lists, or private
            conversations. Only snippets where our ML model detects potential
            bullying patterns are stored, and only to show parents the
            concerning content.
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <h4 className="font-semibold text-foreground text-sm">
            💳 Spending Data
          </h4>
          <p>
            In-app purchase amounts, merchant names, and purchase categories
            from app stores and digital platforms. We do NOT store full payment
            card details — those remain with payment processors only.
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <h4 className="font-semibold text-foreground text-sm">
            👤 Account Information
          </h4>
          <p>
            Parent email address, encrypted password hash, subscription plan,
            children's names, ages, and device names (as entered by the parent).
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "data-use",
    title: "How We Use Your Data",
    icon: <Eye size={16} />,
    content: (
      <div className="space-y-3">
        <p>We use collected data exclusively for the following purposes:</p>
        <ul className="space-y-2 ml-4">
          {[
            "Providing real-time monitoring alerts to parents via push notifications and email",
            "Powering AI-driven content analysis and risk scoring for browsed websites",
            "Running machine learning bullying detection models on flagged message snippets",
            "Generating personalized parenting recommendations through our AI Coach",
            "Creating weekly and daily summary reports for parents",
            "Displaying location history, screen time charts, and spending breakdowns in the dashboard",
            "Processing subscription payments through Stripe",
            "Improving our AI detection accuracy (using anonymized, aggregated data only)",
            "Sending important service updates and security notices",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.78 0.15 195)" }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <strong className="text-foreground">
            We never use your data for:
          </strong>{" "}
          targeted advertising, selling to data brokers, profiling children for
          commercial purposes, or sharing with third parties for marketing.
        </p>
      </div>
    ),
  },
  {
    id: "coppa",
    title: "Children's Privacy & COPPA Compliance",
    icon: <UserCheck size={16} />,
    content: (
      <div className="space-y-4">
        <div
          className="rounded-lg p-4"
          style={{
            background: "oklch(0.18 0.06 155 / 0.15)",
            border: "1px solid oklch(0.72 0.18 155 / 0.3)",
          }}
        >
          <p className="font-semibold text-foreground mb-1">
            ✅ GuardianAI is fully compliant with the Children's Online Privacy
            Protection Act (COPPA)
          </p>
          <p>
            We take children's privacy extremely seriously. Our service is
            designed for parents/guardians to monitor their minor children, not
            for children to use directly.
          </p>
        </div>

        <ul className="space-y-2 ml-4">
          {[
            "Account holders are always parents or legal guardians — not children",
            "We do not allow children under 13 to create GuardianAI accounts",
            "All children's data is collected with explicit parental consent (the parent sets up monitoring)",
            "We do not serve advertisements to or based on children's data",
            "Children's data is not used for any commercial purpose beyond providing the monitoring service",
            "Parents have full control over their children's data — they can view, export, or delete it at any time",
            "We never share children's personal data with third parties except as required for core service delivery (e.g., encrypted storage)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.72 0.18 155)" }}
              />
              {item}
            </li>
          ))}
        </ul>

        <p>
          If you believe a child has somehow created a GuardianAI account
          without parental consent, please contact us immediately at{" "}
          <a
            href="mailto:privacy@guardianai.com"
            className="text-primary hover:underline"
          >
            privacy@guardianai.com
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    id: "security",
    title: "Data Storage & Security",
    icon: <Lock size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          We take data security seriously and implement multiple layers of
          protection:
        </p>
        <ul className="space-y-2 ml-4">
          {[
            "End-to-end encryption for all data transmitted between child devices, our servers, and the parent dashboard",
            "Storage on the Internet Computer Protocol (ICP) blockchain — a decentralized, tamper-resistant infrastructure",
            "Passwords stored as cryptographic hashes (bcrypt) — never in plain text",
            "All API communications secured with TLS/SSL",
            "Stripe handles all payment card data — GuardianAI never stores raw card numbers",
            "Regular security audits and penetration testing",
            "Data stored in sovereign jurisdictions with strict data protection laws",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.78 0.15 195)" }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p>
          <strong className="text-destructive">
            Data breach notification:
          </strong>{" "}
          In the unlikely event of a data breach, we will notify affected users
          within 72 hours via email, as required by applicable data protection
          regulations.
        </p>
      </div>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: <Database size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          We retain data only for as long as necessary to provide our services:
        </p>
        <div className="space-y-2">
          {[
            {
              label: "Active subscription",
              value: "All data kept for the duration of your subscription",
            },
            {
              label: "After cancellation",
              value: "Data retained for 30 days, then permanently deleted",
            },
            {
              label: "Location history",
              value: "Rolling 90-day window (older data auto-deleted)",
            },
            {
              label: "Message snippets",
              value:
                "Retained until manually reviewed/dismissed by parent or 6 months",
            },
            {
              label: "Payment records",
              value: "Retained 7 years for legal/tax compliance (Stripe)",
            },
            { label: "Account logs", value: "90 days for security purposes" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: "oklch(0.12 0.025 265)" }}
            >
              <span className="font-semibold text-foreground shrink-0 w-40 text-xs">
                {item.label}:
              </span>
              <span className="text-xs">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: <UserCheck size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          As a GuardianAI account holder, you have the following rights
          regarding your data:
        </p>
        <ul className="space-y-2 ml-4">
          {[
            "Right to Access: Download all data we hold about you and your children",
            "Right to Deletion: Request permanent deletion of your account and all associated data",
            "Right to Portability: Export your data in machine-readable format (JSON/CSV)",
            "Right to Correction: Update or correct any inaccurate personal information",
            "Right to Restriction: Opt out of AI analysis features while keeping basic monitoring active",
            "Right to Object: Object to certain processing activities",
            "Right to Know: Request information about who has accessed your data",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.78 0.15 195)" }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p>
          To exercise these rights, visit your Dashboard Settings or contact{" "}
          <a
            href="mailto:privacy@guardianai.com"
            className="text-primary hover:underline"
          >
            privacy@guardianai.com
          </a>
          . We respond to all requests within 30 days.
        </p>
      </div>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    icon: <Shield size={16} />,
    content: (
      <div className="space-y-3">
        <p>We use the following third-party services to operate GuardianAI:</p>
        <div className="space-y-2">
          {[
            {
              name: "Stripe",
              purpose: "Payment processing for subscriptions",
              privacy: "stripe.com/privacy",
              sharing: "Payment data only — no browsing or monitoring data",
            },
            {
              name: "Internet Computer Protocol (ICP)",
              purpose: "Decentralized data storage and smart contracts",
              privacy: "internetcomputer.org",
              sharing: "Encrypted data storage only",
            },
          ].map((service) => (
            <div
              key={service.name}
              className="p-4 rounded-lg space-y-1.5"
              style={{
                background: "oklch(0.12 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
              }}
            >
              <div className="font-semibold text-foreground text-sm">
                {service.name}
              </div>
              <div className="text-xs">Purpose: {service.purpose}</div>
              <div className="text-xs">Data shared: {service.sharing}</div>
            </div>
          ))}
        </div>
        <p className="text-xs">
          <strong className="text-foreground">
            We do not share data with:
          </strong>{" "}
          advertising networks, social media platforms, data brokers, analytics
          companies, or any other third party not listed above.
        </p>
      </div>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    icon: <FileText size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          We may update this Privacy Policy from time to time. When we make
          significant changes, we will:
        </p>
        <ul className="space-y-2 ml-4">
          {[
            "Update the 'Last Updated' date at the top of this page",
            "Send an email notification to all registered account holders",
            "Display a prominent notice in the parent dashboard for 30 days",
            "For material changes affecting children's data, seek renewed parental consent",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.78 0.15 195)" }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Your continued use of GuardianAI after changes are posted constitutes
          acceptance of the revised policy.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: <Mail size={16} />,
    content: (
      <div className="space-y-3">
        <p>For privacy-related questions, data requests, or concerns:</p>
        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "oklch(0.12 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <div className="text-sm">
            <strong className="text-foreground">Company:</strong> GuardianAI
            Inc.
          </div>
          <div className="text-sm">
            <strong className="text-foreground">Privacy Officer Email:</strong>{" "}
            <a
              href="mailto:privacy@guardianai.com"
              className="text-primary hover:underline"
            >
              privacy@guardianai.com
            </a>
          </div>
          <div className="text-sm">
            <strong className="text-foreground">General Support:</strong>{" "}
            <a
              href="mailto:support@guardianai.com"
              className="text-primary hover:underline"
            >
              support@guardianai.com
            </a>
          </div>
          <div className="text-sm">
            <strong className="text-foreground">Response Time:</strong> Within
            30 business days for data requests; 72 hours for security concerns
          </div>
        </div>
        <p>
          You also have the right to lodge a complaint with your local data
          protection authority if you believe we have not handled your data
          appropriately.
        </p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["introduction"]),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className="min-h-screen"
      data-ocid="privacy.page"
      style={{ background: "oklch(0.1 0.02 265)" }}
    >
      {/* Header */}
      <header
        className="border-b border-border/50 py-4 px-6 sticky top-0 z-40 backdrop-blur-xl"
        style={{ background: "oklch(0.1 0.02 265 / 0.9)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
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
              to="/legal"
              className="hover:text-foreground transition-colors"
              data-ocid="privacy.legal.link"
            >
              Legal Hub
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
              data-ocid="privacy.terms.link"
            >
              Terms
            </Link>
            <Link
              to="/support"
              className="hover:text-foreground transition-colors"
              data-ocid="privacy.support.link"
            >
              Support
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Sticky TOC sidebar — desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div
              className="sticky top-20 rounded-xl p-4"
              style={{
                background: "oklch(0.14 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
              }}
            >
              <h3 className="font-heading font-semibold text-foreground text-sm mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      document.getElementById(section.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                      setOpenSections((prev) => new Set([...prev, section.id]));
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                <Link
                  to="/legal"
                  className="block text-xs text-primary hover:underline"
                >
                  → Legal Hub
                </Link>
                <Link
                  to="/terms"
                  className="block text-xs text-primary hover:underline"
                >
                  → Terms of Service
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            {/* Hero */}
            <div className="mb-10">
              <Badge
                className="mb-4"
                style={{
                  background: "oklch(0.2 0.06 195 / 0.4)",
                  color: "oklch(0.85 0.15 195)",
                  border: "1px solid oklch(0.78 0.15 195 / 0.3)",
                }}
              >
                Legal Document
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3">
                Privacy <span className="text-gradient-teal">Policy</span>
              </h1>
              <p className="text-muted-foreground mb-4 max-w-xl">
                How GuardianAI collects, uses, and protects your family's data.
                We are committed to transparency and privacy-first design.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.2 0.06 155 / 0.3)",
                    color: "oklch(0.72 0.18 155)",
                    border: "1px solid oklch(0.72 0.18 155 / 0.3)",
                  }}
                >
                  ✓ COPPA Compliant
                </span>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.2 0.06 195 / 0.3)",
                    color: "oklch(0.78 0.15 195)",
                    border: "1px solid oklch(0.78 0.15 195 / 0.3)",
                  }}
                >
                  ✓ GDPR Aware
                </span>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.18 0.06 265 / 0.3)",
                    color: "oklch(0.7 0.04 265)",
                    border: "1px solid oklch(0.35 0.05 265 / 0.3)",
                  }}
                >
                  Last Updated: {LAST_UPDATED}
                </span>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="space-y-3">
              {sections.map((section) => (
                <AccordionSection
                  key={section.id}
                  section={section}
                  isOpen={openSections.has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                />
              ))}
            </div>

            {/* Footer nav */}
            <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link
                to="/"
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                ← Home
              </Link>
              <Link
                to="/legal"
                className="hover:text-foreground transition-colors"
                data-ocid="privacy.footer_legal.link"
              >
                Legal Hub
              </Link>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
                data-ocid="privacy.footer_terms.link"
              >
                Terms of Service
              </Link>
              <Link
                to="/support"
                className="hover:text-foreground transition-colors"
                data-ocid="privacy.footer_support.link"
              >
                Support Center
              </Link>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center text-xs text-muted-foreground/50">
              <p>
                © {new Date().getFullYear()} GuardianAI Inc. All rights
                reserved. Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/60 hover:text-primary transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
