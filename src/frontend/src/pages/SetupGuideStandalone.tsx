import { Link } from "@tanstack/react-router";
import SetupGuidePage from "./SetupGuidePage";

export default function SetupGuideStandalone() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "radial-gradient(ellipse at 20% 30%, oklch(0.68 0.22 310 / 0.1) 0%, transparent 55%), oklch(0.1 0.02 265)",
      }}
    >
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/generated/guardian-shield-icon-transparent.dim_400x400.png"
              alt="GuardianAI"
              className="w-7 h-7 group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-lg font-black text-foreground">
              Guardian<span className="text-gradient-teal">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link to="/signup" search={{ plan: undefined }}>
              <span className="text-sm px-3 py-1.5 rounded-lg font-medium text-primary-foreground bg-primary hover:opacity-90 transition-opacity">
                Get Started
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <SetupGuidePage />
      </div>
    </div>
  );
}
