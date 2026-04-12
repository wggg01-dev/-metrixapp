import { useState } from "react";
import { Eye, EyeOff, BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthLoading } from "@/components/auth-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setAuthenticating(true);
    const result = await login(email.trim(), password);
    if (!result.success) {
      setAuthenticating(false);
      setError(result.error ?? "Authentication failed.");
    }
  };

  if (authenticating) {
    return <AuthLoading />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left panel — branding */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "hsl(218, 32%, 16%)" }}>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(215,25%,85%) 1px, transparent 1px), linear-gradient(90deg, hsl(215,25%,85%) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(213,48%,58%), transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(213,48%,58%)" }}>
            <BarChart2 className="w-5 h-5" style={{ color: "hsl(222,30%,8%)" }} />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: "hsl(215,25%,92%)" }}>
            Metrix
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "hsl(215,20%,92%)" }}>
            Your business,<br />
            in full command.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "hsl(215,18%,60%)" }}>
            A real-time command center for revenue, customers, and team — built for operators who don't guess.
          </p>

          {/* Feature list */}
          <ul className="mt-8 space-y-3">
            {[
              "Live revenue & MRR tracking",
              "Customer lifecycle management",
              "Team & permission controls",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "hsl(215,18%,68%)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(213,48%,58%)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs" style={{ color: "hsl(215,18%,40%)" }}>
          Secure · Encrypted · Enterprise-grade
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile logo */}
        <div className="flex md:hidden items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
            <BarChart2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Metrix</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Admin sign in
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-sm"
                disabled={authenticating}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-sm pr-10"
                  disabled={authenticating}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-destructive font-medium" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-10 text-sm font-semibold"
              disabled={authenticating}
            >
              Sign in to Dashboard
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">Demo credentials</p>
            <p className="text-xs text-muted-foreground">
              Email: <span className="text-foreground font-mono">admin@metrix.com</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Password: <span className="text-foreground font-mono">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
