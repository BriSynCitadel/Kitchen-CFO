import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

export default function Settings() {
  const { user, isLoading: authLoading, isAuthenticated, login, logout } = useAuth();

  return (
    <div className="pb-24 max-w-md mx-auto">
      <Header title="Settings" />

      <div className="px-4 py-6 space-y-6">

        {/* Account section */}
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Account
          </h2>
          <Card className="border-border">
            <CardContent className="p-5">
              {authLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : isAuthenticated && user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Logged in"}
                      </p>
                      {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-1.5 flex-shrink-0">
                    <LogOut className="w-3.5 h-3.5" /> Log out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">You're in guest mode. Log in to save your data.</p>
                  <Button size="sm" onClick={login} className="flex items-center gap-1.5 flex-shrink-0">
                    <LogIn className="w-3.5 h-3.5" /> Log in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="text-center pt-8 opacity-50">
          <p className="text-xs text-muted-foreground font-mono">Kitchen CFO v1.0.0</p>
        </section>
      </div>
    </div>
  );
}
