import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Building,
  Cookie,
  FileText,
  Gavel,
  Mail,
  Shield,
  UserCheck,
} from "lucide-react";

interface LegalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  badge?: string;
  ocid: string;
}

function LegalCard({
  icon,
  title,
  description,
  to,
  badge,
  ocid,
}: LegalCardProps) {
  return (
    <Link
      to={to}
      data-ocid={ocid}
      className="group rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "oklch(0.14 0.025 265)",
        border: "1px solid oklch(0.22 0.04 265)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "oklch(0.78 0.15 195 / 0.4)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 24px oklch(0.78 0.15 195 / 0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "oklch(0.22 0.04 265)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "oklch(0.2 0.06 195 / 0.25)",
            color: "oklch(0.78 0.15 195)",
          }}
        >
          {icon}
        </div>
        {badge && (
          <Badge
            className="text-[10px] border-0"
            style={{
              background: "oklch(0.2 0.06 195 / 0.3)",
              color: "oklch(0.78 0.15 195)",
            }}
          >
            {badge}
          </Badge>
        )}
      </div>

      <div>
        <h3 className="font-heading font-bold text-foreground text-base mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div
        className="flex items-center gap-1.5 text-sm font-medium mt-auto group-hover:gap-2.5 transition-all duration-200"
        style={{ color: "oklch(0.78 0.15 195)" }}
      >
        Read document <ArrowRight size={14} />
      </div>
    </Link>
  );
}

export default function LegalPage() {
  const legalDocuments = [
    {
      icon: <Shield size={20} />,
      title: "Privacy Policy",
      description:
        "How we collect, use, and protect your family's data. COPPA-compliant with end-to-end encryption and no data selling.",
      to: "/privacy" as const,
      badge: "COPPA Compliant",
      ocid: "legal.privacy.card",
    },
    {
      icon: <FileText size={20} />,
      title: "Terms of Service",
      description:
        "The legal agreement governing your use of GuardianAI, including subscription billing, acceptable use, and liability.",
      to: "/terms" as const,
      badge: undefined,
      ocid: "legal.terms.card",
    },
    {
      icon: <UserCheck size={20} />,
      title: "COPPA Notice",
      description:
        "Our compliance with the Children's Online Privacy Protection Act. How we protect data collected from children's devices.",
      to: "/privacy#coppa" as const,
      badge: "Age 13+",
      ocid: "legal.coppa.card",
    },
    {
      icon: <Cookie size={20} />,
      title: "Cookie Policy",
      description:
        "Information about the cookies and local storage we use to maintain your session and improve the application.",
      to: "/privacy" as const,
      badge: "Minimal",
      ocid: "legal.cookies.card",
    },
    {
      icon: <Gavel size={20} />,
      title: "Acceptable Use Policy",
      description:
        "Rules governing acceptable use of GuardianAI. Parents/guardians only, proper consent required, no surveillance of adults.",
      to: "/terms#acceptable-use" as const,
      badge: undefined,
      ocid: "legal.aup.card",
    },
    {
      icon: <BookOpen size={20} />,
      title: "Data Processing Agreement",
      description:
        "For organizations or large families, our DPA outlines data processor responsibilities under GDPR.",
      to: "/privacy" as const,
      badge: "Enterprise",
      ocid: "legal.dpa.card",
    },
  ];

  return (
    <div
      className="min-h-screen"
      data-ocid="legal.page"
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
              to="/privacy"
              className="hover:text-foreground transition-colors"
              data-ocid="legal.nav_privacy.link"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
              data-ocid="legal.nav_terms.link"
            >
              Terms
            </Link>
            <Link
              to="/support"
              className="hover:text-foreground transition-colors"
              data-ocid="legal.nav_support.link"
            >
              Support
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <Badge
            className="mb-4"
            style={{
              background: "oklch(0.2 0.06 195 / 0.4)",
              color: "oklch(0.85 0.15 195)",
              border: "1px solid oklch(0.78 0.15 195 / 0.3)",
            }}
          >
            Legal Center
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
            Legal <span className="text-gradient-teal">Documents</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            All of GuardianAI's legal documents in one place. We believe in
            transparency and giving you full visibility into how we operate.
          </p>
        </div>

        {/* Legal document cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {legalDocuments.map((doc) => (
            <LegalCard key={doc.title} {...doc} />
          ))}
        </div>

        {/* Company info */}
        <div
          className="rounded-2xl p-8 mb-10"
          style={{
            background: "oklch(0.14 0.025 265)",
            border: "1px solid oklch(0.22 0.04 265)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "oklch(0.2 0.06 195 / 0.25)",
                color: "oklch(0.78 0.15 195)",
              }}
            >
              <Building size={20} />
            </div>
            <h2 className="font-heading font-bold text-foreground text-xl">
              Company Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Company Name
                </div>
                <div className="text-foreground font-medium">
                  GuardianAI Inc.
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Registered Address
                </div>
                <div className="text-foreground">
                  548 Market Street, Suite 12345
                  <br />
                  San Francisco, CA 94104
                  <br />
                  United States
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Jurisdiction
                </div>
                <div className="text-foreground">State of California, USA</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Privacy Officer
                </div>
                <a
                  href="mailto:privacy@guardianai.com"
                  className="text-primary hover:underline flex items-center gap-1.5"
                >
                  <Mail size={13} />
                  privacy@guardianai.com
                </a>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Legal Inquiries
                </div>
                <a
                  href="mailto:legal@guardianai.com"
                  className="text-primary hover:underline flex items-center gap-1.5"
                >
                  <Mail size={13} />
                  legal@guardianai.com
                </a>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  General Support
                </div>
                <a
                  href="mailto:support@guardianai.com"
                  className="text-primary hover:underline flex items-center gap-1.5"
                >
                  <Mail size={13} />
                  support@guardianai.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { label: "COPPA Compliant", color: "oklch(0.72 0.18 155)" },
            { label: "GDPR Aware", color: "oklch(0.78 0.15 195)" },
            { label: "SSL/TLS Encrypted", color: "oklch(0.68 0.22 310)" },
            { label: "No Data Selling", color: "oklch(0.75 0.22 55)" },
            { label: "ICP Blockchain Storage", color: "oklch(0.78 0.15 195)" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: `${badge.color}15`,
                border: `1px solid ${badge.color}30`,
                color: badge.color,
              }}
            >
              <Shield size={11} />
              {badge.label}
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div className="text-center pt-8 border-t border-border/50">
          <div className="flex justify-center gap-6 mb-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              ← Home
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
              data-ocid="legal.footer_privacy.link"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
              data-ocid="legal.footer_terms.link"
            >
              Terms of Service
            </Link>
            <Link
              to="/support"
              className="hover:text-foreground transition-colors"
              data-ocid="legal.footer_support.link"
            >
              Support
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} GuardianAI Inc. All rights reserved.
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
