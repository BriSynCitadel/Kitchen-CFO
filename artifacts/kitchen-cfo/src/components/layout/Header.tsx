import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Settings, LogOut } from "lucide-react";

export function Header({ title, showSettings = false }: { title: string; showSettings?: boolean }) {
  const [, setLocation] = useLocation();
  const [isDemo] = useState(() => localStorage.getItem("cfo_demo_mode") === "1");

  const handleExitDemo = () => {
    localStorage.removeItem("cfo_demo_mode");
    localStorage.removeItem("cfo_welcomed");
    setLocation("/landing");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
        <h1 className="text-xl font-display font-bold text-foreground tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          {isDemo && (
            <button
              type="button"
              onClick={handleExitDemo}
              className="flex items-center gap-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50 px-3 py-2.5 rounded-full text-xs font-semibold transition-colors min-h-[44px]"
            >
              <LogOut className="w-3 h-3" />
              Exit Demo
            </button>
          )}
          {showSettings && (
            <Link
              href="/settings"
              className="p-2 -mr-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
