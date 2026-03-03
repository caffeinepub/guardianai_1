import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  Gavel,
  Mail,
  Scale,
  Shield,
  User,
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
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: <FileText size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          By accessing or using GuardianAI ("Service"), you agree to be bound by
          these Terms of Service ("Terms"). If you do not agree to these Terms,
          please do not use our Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you (the
          parent or legal guardian) and GuardianAI Inc. ("GuardianAI," "we,"
          "our," or "us").
        </p>
        <p>
          <strong className="text-foreground">Last Updated:</strong>{" "}
          {LAST_UPDATED}. We reserve the right to modify these Terms at any
          time. Continued use after changes constitutes acceptance.
        </p>
        <p>
          If you are accepting these Terms on behalf of a family, household, or
          organization, you represent that you have the authority to bind that
          entity to these Terms.
        </p>
      </div>
    ),
  },
  {
    id: "service-description",
    title: "2. Description of Service",
    icon: <Shield size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          GuardianAI is a parental monitoring and AI-powered child safety
          application that allows parents and legal guardians to monitor their
          minor children's digital activities. The Service includes:
        </p>
        <ul className="space-y-1.5 ml-4">
          {[
            "Real-time GPS location tracking and geofence monitoring",
            "Screen time analytics and app usage reporting",
            "AI-powered content safety analysis for browsed websites",
            "Cyberbullying detection through message metadata analysis",
            "Digital spending monitoring and purchase alerts",
            "Personalized AI parenting coach recommendations",
            "Weekly and daily activity reports",
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
          <strong className="text-foreground">Consent requirement:</strong> Use
          of GuardianAI requires that monitoring be conducted with appropriate
          legal authority. Parents and guardians must comply with all applicable
          laws regarding monitoring of minors in their jurisdiction.
        </p>
      </div>
    ),
  },
  {
    id: "account-registration",
    title: "3. Account Registration & Security",
    icon: <User size={16} />,
    content: (
      <div className="space-y-3">
        <p>To use GuardianAI, you must:</p>
        <ul className="space-y-1.5 ml-4">
          {[
            "Be at least 18 years of age",
            "Be the legal parent or guardian of the minor child being monitored",
            "Provide accurate and complete registration information",
            "Maintain the security of your account credentials",
            "Immediately notify us of any unauthorized account access",
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
          You are responsible for all activity that occurs under your account.
          GuardianAI is not liable for any loss or damage arising from your
          failure to protect your account credentials.
        </p>
        <p>
          One GuardianAI account may be used to monitor your own minor children
          only. Accounts may not be shared between households.
        </p>
      </div>
    ),
  },
  {
    id: "billing",
    title: "4. Subscription Plans & Billing",
    icon: <CreditCard size={16} />,
    content: (
      <div className="space-y-4">
        <p>GuardianAI offers the following subscription tiers:</p>
        <div className="space-y-2">
          {[
            {
              name: "Basic (Free)",
              price: "$0",
              features: "1 child, basic location & screen time",
            },
            {
              name: "Family",
              price: "$9.99/month",
              features:
                "Up to 3 children, all AI features, bullying detection, spending monitor",
            },
            {
              name: "Guardian Pro",
              price: "$19.99/month",
              features:
                "Unlimited children, priority AI, advanced reporting, phone support",
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="p-3 rounded-lg flex items-start gap-3"
              style={{
                background: "oklch(0.12 0.025 265)",
                border: "1px solid oklch(0.22 0.04 265)",
              }}
            >
              <div className="flex-1">
                <div className="font-semibold text-foreground text-sm">
                  {plan.name}
                </div>
                <div className="text-xs text-primary">{plan.price}</div>
                <div className="text-xs mt-0.5">{plan.features}</div>
              </div>
            </div>
          ))}
        </div>
        <ul className="space-y-1.5 ml-4">
          {[
            "14-day free trial included for Family and Guardian Pro plans — no credit card required",
            "Billing is monthly and recurs automatically on the same day each month",
            "Cancel anytime — access continues until the end of your billing period",
            "Refund policy: Pro-rated refund for unused days if cancelled within 7 days of billing; no refunds after 7 days",
            "Prices may change with 30 days notice to active subscribers",
            "Payments processed securely by Stripe — GuardianAI does not store payment card details",
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
      </div>
    ),
  },
  {
    id: "acceptable-use",
    title: "5. Acceptable Use Policy",
    icon: <BookOpen size={16} />,
    content: (
      <div className="space-y-4">
        <div
          className="rounded-lg p-4"
          style={{
            background: "oklch(0.18 0.06 25 / 0.15)",
            border: "1px solid oklch(0.65 0.22 25 / 0.3)",
          }}
        >
          <h4 className="font-semibold text-foreground text-sm mb-2">
            ⚠️ You MUST NOT use GuardianAI to:
          </h4>
          <ul className="space-y-1 ml-4">
            {[
              "Monitor any person without legal authority to do so (non-minor adults, other people's children)",
              "Conduct surveillance without appropriate legal consent where required by local law",
              "Stalk, harass, or intimidate any individual",
              "Use collected data for any purpose other than parental monitoring of your minor children",
              "Share monitoring access credentials with unauthorized persons",
              "Attempt to circumvent any security or technical measures",
              "Use the service for commercial espionage or competitive intelligence",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs">
                <span
                  className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                  style={{ background: "oklch(0.65 0.22 25)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground text-sm mb-2">
            Legal Compliance
          </h4>
          <p>
            GuardianAI is designed for parents/legal guardians monitoring their
            own minor children. Some jurisdictions require parents to inform
            their minor children about monitoring. You are solely responsible
            for ensuring your use complies with local laws.
          </p>
        </div>

        <p>
          Violation of this Acceptable Use Policy may result in immediate
          account termination without refund.
        </p>
      </div>
    ),
  },
  {
    id: "privacy-data",
    title: "6. Privacy & Data",
    icon: <Shield size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          Your use of GuardianAI is also governed by our{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          , which is incorporated into these Terms by reference.
        </p>
        <p>
          By using GuardianAI, you consent to the collection, use, and storage
          of data as described in the Privacy Policy, including data collected
          from devices belonging to your minor children under your legal
          guardianship.
        </p>
        <p>
          You warrant that you have the legal right to consent to data
          collection on behalf of your minor children.
        </p>
      </div>
    ),
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    icon: <BookOpen size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          GuardianAI and all its content, features, and functionality (including
          but not limited to text, graphics, logos, icons, images, and software)
          are the exclusive property of GuardianAI Inc. and are protected by
          international copyright, trademark, patent, trade secret, and other
          intellectual property laws.
        </p>
        <p>
          We grant you a limited, non-exclusive, non-transferable, revocable
          license to access and use the Service for its intended purpose of
          parental monitoring of your minor children.
        </p>
        <p>
          You may not: copy, modify, distribute, sell, or lease any part of the
          Service; reverse engineer the software; or use GuardianAI's branding
          without written permission.
        </p>
      </div>
    ),
  },
  {
    id: "disclaimers",
    title: "8. Disclaimer of Warranties",
    icon: <AlertTriangle size={16} />,
    content: (
      <div className="space-y-3">
        <p className="font-semibold text-foreground">
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
          OF ANY KIND.
        </p>
        <p>GuardianAI does not warrant that:</p>
        <ul className="space-y-1.5 ml-4">
          {[
            "The Service will be uninterrupted, error-free, or completely secure",
            "All inappropriate content will be detected or all alerts will be triggered",
            "Location data will be accurate in all circumstances (GPS limitations apply)",
            "The AI analysis will catch every instance of bullying or harmful content",
            "The Service will be compatible with all devices or operating system versions",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.65 0.22 25)" }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p>
          GuardianAI is a monitoring tool to assist parents — it is not a
          substitute for parental supervision, conversation with children, or
          professional counseling.
        </p>
      </div>
    ),
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    icon: <Scale size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, GUARDIANAI INC. SHALL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="space-y-1.5 ml-4">
          {[
            "Loss of data or inability to access data",
            "Harm to a child that was not detected by the monitoring service",
            "Actions taken or not taken based on the Service's recommendations",
            "Third-party conduct or content accessed through child devices",
            "Service interruptions or technical failures",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.65 0.22 25)" }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p>
          Our total liability to you for any claims shall not exceed the amount
          paid by you to GuardianAI in the 12 months preceding the claim.
        </p>
      </div>
    ),
  },
  {
    id: "indemnification",
    title: "10. Indemnification",
    icon: <Shield size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          You agree to indemnify, defend, and hold harmless GuardianAI Inc. and
          its officers, directors, employees, and agents from and against any
          claims, damages, obligations, losses, liabilities, costs, and expenses
          (including legal fees) arising from:
        </p>
        <ul className="space-y-1.5 ml-4">
          {[
            "Your use of the Service in violation of these Terms",
            "Your violation of any applicable law or regulation",
            "Your monitoring of any person without proper legal authority",
            "Any content or data you provide to us",
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
      </div>
    ),
  },
  {
    id: "termination",
    title: "11. Termination",
    icon: <AlertTriangle size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          We reserve the right to suspend or terminate your account immediately,
          without notice, if:
        </p>
        <ul className="space-y-1.5 ml-4">
          {[
            "You violate these Terms or the Acceptable Use Policy",
            "We believe your use of the Service may cause legal liability to GuardianAI",
            "Your payment fails and is not resolved within 7 days",
            "We are required to do so by law or court order",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.65 0.22 25)" }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p>
          You may terminate your account at any time through the Settings page
          in your dashboard. Upon termination, your data will be retained for 30
          days then permanently deleted.
        </p>
      </div>
    ),
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    icon: <Gavel size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the{" "}
          <strong className="text-foreground">State of California, USA</strong>,
          without regard to its conflict of law provisions.
        </p>
        <p>
          Any disputes arising from or relating to these Terms or your use of
          the Service shall be resolved through binding arbitration in San
          Francisco, California, under the rules of the American Arbitration
          Association, except that either party may seek injunctive relief in
          any court of competent jurisdiction.
        </p>
        <p>
          You waive any right to a jury trial and agree that any claim must be
          brought in your individual capacity, not as a class action.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "13. Contact",
    icon: <Mail size={16} />,
    content: (
      <div className="space-y-3">
        <p>
          For questions about these Terms of Service, please contact our legal
          team:
        </p>
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
            <strong className="text-foreground">Legal Email:</strong>{" "}
            <a
              href="mailto:legal@guardianai.com"
              className="text-primary hover:underline"
            >
              legal@guardianai.com
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
        </div>
      </div>
    ),
  },
];

export default function TermsPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["acceptance"]),
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
      data-ocid="terms.page"
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
              data-ocid="terms.legal.link"
            >
              Legal Hub
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
              data-ocid="terms.privacy.link"
            >
              Privacy
            </Link>
            <Link
              to="/support"
              className="hover:text-foreground transition-colors"
              data-ocid="terms.support.link"
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
                  to="/privacy"
                  className="block text-xs text-primary hover:underline"
                >
                  → Privacy Policy
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
                Terms of <span className="text-gradient-teal">Service</span>
              </h1>
              <p className="text-muted-foreground mb-4 max-w-xl">
                The legal agreement between you and GuardianAI Inc. governing
                your use of our parental monitoring service.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.18 0.06 265 / 0.3)",
                    color: "oklch(0.7 0.04 265)",
                    border: "1px solid oklch(0.35 0.05 265 / 0.3)",
                  }}
                >
                  Governed by California Law
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
              <Link to="/" className="hover:text-foreground transition-colors">
                ← Home
              </Link>
              <Link
                to="/legal"
                className="hover:text-foreground transition-colors"
                data-ocid="terms.footer_legal.link"
              >
                Legal Hub
              </Link>
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
                data-ocid="terms.footer_privacy.link"
              >
                Privacy Policy
              </Link>
              <Link
                to="/support"
                className="hover:text-foreground transition-colors"
                data-ocid="terms.footer_support.link"
              >
                Support Center
              </Link>
            </div>

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
