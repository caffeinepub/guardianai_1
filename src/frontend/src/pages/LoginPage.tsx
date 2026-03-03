import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Loader2, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { hashPassword, useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { actor } = useActor();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      const passwordHash = await hashPassword(password);

      // Try backend login first
      if (actor) {
        try {
          const success = await actor.loginParent(email.trim(), passwordHash);
          if (success) {
            const account = await actor.getParentAccount();
            // Store in auth context
            const authData = {
              email: email.trim(),
              passwordHash,
              plan: account.plan,
            };
            localStorage.setItem("guardian_auth", JSON.stringify(authData));
            window.location.href = "/dashboard";
            return;
          }
          setError("Invalid email or password. Try creating an account.");
          return;
        } catch {
          // Backend unavailable, try local auth
        }
      }

      // Fallback: local auth
      const success = await login(email.trim(), password);
      if (success) {
        navigate({ to: "/dashboard" });
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = async () => {
    setIsDemoLoading(true);
    try {
      if (actor) {
        try {
          // Register a demo account
          const demoEmail = "demo@guardianai.com";
          const demoHash = await hashPassword("demo123");
          try {
            await actor.registerParent(demoEmail, demoHash);
          } catch {
            // Already registered
          }
          await actor.seedDemoData();
          localStorage.setItem(
            "guardian_auth",
            JSON.stringify({
              email: demoEmail,
              passwordHash: demoHash,
              plan: "free",
            }),
          );
          toast.success("Demo mode activated! Loading dashboard...");
          navigate({ to: "/dashboard" });
          return;
        } catch {
          // Continue with demo anyway
        }
      }
      // Offline demo
      localStorage.setItem(
        "guardian_auth",
        JSON.stringify({
          email: "demo@guardianai.com",
          passwordHash: "demo",
          plan: "free",
        }),
      );
      toast.success("Demo mode activated!");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to start demo. Please try again.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset coming soon");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      data-ocid="login.page"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, oklch(0.68 0.22 310 / 0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 20%, oklch(0.78 0.15 195 / 0.1) 0%, transparent 55%), oklch(0.1 0.02 265)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.15 195 / 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your parent dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 flex flex-col gap-5"
          style={{
            background: "oklch(0.14 0.025 265)",
            border: "1px solid oklch(0.25 0.04 265)",
            boxShadow: "0 24px 64px oklch(0.05 0.02 265 / 0.6)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email address
              </Label>
              <Input
                id="email"
                data-ocid="login.email.input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                autoComplete="email"
                className="h-10 bg-secondary border-border focus:border-primary transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Password
                </Label>
                <button
                  type="button"
                  data-ocid="login.forgot_password.button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  data-ocid="login.password.input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="current-password"
                  className="h-10 bg-secondary border-border focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                data-ocid="login.error_state"
                className="flex items-center gap-2 text-xs p-3 rounded-lg"
                style={{
                  background: "oklch(0.65 0.22 25 / 0.15)",
                  border: "1px solid oklch(0.65 0.22 25 / 0.3)",
                  color: "oklch(0.72 0.18 25)",
                }}
              >
                <AlertCircle size={12} />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="login.submit_button"
              disabled={isLoading}
              className="w-full h-11 font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-glow-teal"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Demo mode */}
          <Button
            type="button"
            data-ocid="login.demo_button"
            variant="outline"
            className="w-full h-11 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 gap-2"
            onClick={handleDemoMode}
            disabled={isDemoLoading}
          >
            {isDemoLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Zap size={14} className="text-primary" />
            )}
            Try Demo — No Sign Up Needed
          </Button>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              search={{ plan: undefined }}
              data-ocid="login.signup.link"
              className="text-primary hover:underline font-medium"
            >
              Sign up free
            </Link>
          </p>
        </div>

        {/* Back to site */}
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
