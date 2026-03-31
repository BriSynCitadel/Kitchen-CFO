import { Link, useRoute } from "wouter";
import { Camera, Book, Refrigerator, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [isHome] = useRoute("/");
  const [isDiary] = useRoute("/diary");
  const [isKitchen] = useRoute("/kitchen");
  const [isRecommendations] = useRoute("/recommendations");
  const [isProfile] = useRoute("/profile");

  const navItems = [
    { href: "/", icon: Camera, label: "Scan", active: isHome },
    { href: "/recommendations", icon: Sparkles, label: "For You", active: isRecommendations },
    { href: "/kitchen", icon: Refrigerator, label: "Kitchen", active: isKitchen },
    { href: "/diary", icon: Book, label: "Diary", active: isDiary },
    { href: "/profile", icon: User, label: "Profile", active: isProfile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
      <nav className="flex items-center justify-around px-2 h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200",
              item.active ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground hover:scale-105"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-colors",
              item.active && "bg-primary/10"
            )}>
              <item.icon className={cn("w-5 h-5", item.active && "fill-primary/20")} strokeWidth={item.active ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
