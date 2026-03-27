import { Switch, Route, Router as WouterRouter } from "wouter";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/diary" component={Diary} />
        <Route path="/kitchen" component={Kitchen} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Show bottom nav on main app routes (hidden on settings) */}
      <Switch>
        <Route path="/settings" /> {/* Hide on settings */}
        <Route>
          <BottomNav />
        </Route>
      </Switch>

      {/* Feedback widget is visible on every screen */}
      <FeedbackWidget />
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
