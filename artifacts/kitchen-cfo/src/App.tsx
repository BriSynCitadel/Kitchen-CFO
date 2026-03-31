import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout & Components
import { BottomNav } from "@/components/layout/BottomNav";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Diary from "@/pages/Diary";
import Kitchen from "@/pages/Kitchen";
import Recommendations from "@/pages/Recommendations";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Landing from "@/pages/Landing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/diary" component={Diary} />
        <Route path="/kitchen" component={Kitchen} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/landing" component={Landing} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Show bottom nav on main app routes (hidden on settings and landing) */}
      <Switch>
        <Route path="/settings" /> {/* Hide on settings */}
        <Route path="/landing" /> {/* Hide on landing page */}
        <Route>
          <BottomNav />
        </Route>
      </Switch>

      {/* Feedback widget — hidden on landing page */}
      <Switch>
        <Route path="/landing" />
        <Route>
          <FeedbackWidget />
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
