import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";

// Pages
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Store from "@/pages/store";
import Students from "@/pages/students";
import Team from "@/pages/team";
import Settings from "@/pages/settings";
import Bursary from "@/pages/bursary";
import BusPass from "@/pages/buspass";
import Support from "@/pages/support";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ── Error Boundary ─────────────────────────────────────────────────────────
interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-3">
            <h1 className="text-lg font-semibold text-destructive">Something went wrong</h1>
            <p className="text-sm text-muted-foreground font-mono break-words">
              {this.state.error.message}
            </p>
            <button
              className="text-sm text-primary underline"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Router ─────────────────────────────────────────────────────────────────
function AuthenticatedRouter() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/store" component={Store} />
        <Route path="/students" component={Students} />
        <Route path="/bursary" component={Bursary} />
        <Route path="/buspass" component={BusPass} />
        <Route path="/support" component={Support} />
        <Route path="/team" component={Team} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AuthenticatedRouter />;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="nexus-theme">
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <AppRouter />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
