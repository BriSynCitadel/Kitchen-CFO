import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ShieldAlert, LogIn, LogOut, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings();
  const { user, isLoading: authLoading, isAuthenticated, login, logout } = useAuth();
  
  const updateMutation = useUpdateSettings({
    mutation: {
      onSuccess: () => {
        toast({ title: "Settings saved" });
        setApiKey(""); // Clear input after saving for security
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      },
      onError: (err) => {
        toast({ title: "Update failed", description: err.message, variant: "destructive" });
      }
    }
  });

  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    updateMutation.mutate({
      data: {
        geminiApiKey: apiKey || undefined, // Only send if user typed something
      }
    });
  };

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

        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" /> API Configuration
          </h2>
          
          <Card className="border-border">
            <CardContent className="p-5 space-y-4">
              {settings?.geminiApiKeySet ? (
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary mb-2">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Your API key is securely configured via {settings.geminiApiKeySource}.</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive mb-2">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">No API key set. App features will fail.</p>
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Gemini API Key</label>
                <Input 
                  type="password" 
                  placeholder={settings?.geminiApiKeySet ? "••••••••••••••••••••" : "Paste your Google Gemini key here"} 
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                  Stored securely in your private database. Never exposed to the client.
                </p>
              </div>

              <Button 
                className="w-full mt-2" 
                onClick={handleSave}
                disabled={updateMutation.isPending || !apiKey}
              >
                {updateMutation.isPending ? "Updating..." : "Update Key"}
              </Button>
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
