import { Link } from "wouter";
import { Settings } from "lucide-react";

export function Header({ title, showSettings = false }: { title: string, showSettings?: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
        <h1 className="text-xl font-display font-bold text-foreground tracking-tight">{title}</h1>
        {showSettings && (
          <Link 
            href="/settings" 
            className="p-2 -mr-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
