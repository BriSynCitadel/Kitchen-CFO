import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ShieldAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetSettingsQueryKey } from "@workspace/api-client-react";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings();
  
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
