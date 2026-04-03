import { Header } from "@/components/layout/Header";
import { useGetRecommendations, useRefreshRecommendations, useGetProfile } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, FlaskConical, Brain, ShoppingBasket, ClipboardList, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetRecommendationsQueryKey } from "@workspace/api-client-react";
import { formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

type RecommendationWithLabTarget = {
  title: string;
  description: string;
  reason: string;
  category: string;
  ingredients?: string[];
  priority: string;
  cookTime?: string | null;
  difficulty?: string | null;
  estimatedNutrients?: { calories?: number };
  targetMarker?: string | null;
  userValue?: number | null;
  optimalRange?: string | null;
};

const LOADING_STEPS = [
  { message: "Analyzing your lab values...", icon: FlaskConical },
  { message: "Checking your kitchen inventory...", icon: ShoppingBasket },
  { message: "Building your personalized plan...", icon: ClipboardList },
  { message: "Almost ready...", icon: Brain },
];

const STEP_DURATION_MS = 2500;

export default function Recommendations() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetRecommendations();
  const { data: profileData } = useGetProfile();
  const [, setLocation] = useLocation();
  const [loadingStep, setLoadingStep] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (i: number) =>
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const rawLabValues = profileData?.labValues as Record<string, number | null | undefined> | null | undefined;
  const hasAnyLabValue = rawLabValues
    ? Object.values(rawLabValues).some((v) => v !== null && v !== undefined && v !== 0)
    : false;

  const refreshMutation = useRefreshRecommendations({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() })
    }
  });

  useEffect(() => {
    if (!refreshMutation.isPending) {
      setLoadingStep(0);
      return;
    }

    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        const next = prev + 1;
        if (next >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          return LOADING_STEPS.length - 1;
        }
        return next;
      });
    }, STEP_DURATION_MS);

    return () => clearInterval(interval);
  }, [refreshMutation.isPending]);

  const isRefreshing = refreshMutation.isPending;
  const currentStep = LOADING_STEPS[loadingStep];
  const StepIcon = currentStep.icon;

  return (
    <div className="pb-24 max-w-md mx-auto min-h-screen bg-background">
      <Header title="For You" />
      
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Your Kitchen CFO</p>
              <p className="text-xs text-muted-foreground">Based on your profile & kitchen</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refreshMutation.mutate()}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {!hasAnyLabValue && (
          <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FlaskConical className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-0.5">Unlock personalised recommendations</p>
              <p className="text-xs text-muted-foreground mb-3">Add your lab results to get food guidance tailored to your specific biology.</p>
              <Button
                size="sm"
                variant="outline"
                className="border-violet-300 text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/30 text-xs h-8"
                onClick={() => setLocation("/profile")}
              >
                Add Lab Results →
              </Button>
            </div>
          </div>
        )}

        {isRefreshing ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-6">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <StepIcon className="w-7 h-7" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="font-semibold text-foreground text-base transition-all duration-500">
                {currentStep.message}
              </p>
              <p className="text-xs text-muted-foreground">This takes about 10–15 seconds</p>
            </div>

            <div className="flex gap-2">
              {LOADING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === loadingStep
                      ? "w-6 bg-primary"
                      : i < loadingStep
                      ? "w-3 bg-primary/40"
                      : "w-3 bg-border"
                  }`}
                />
              ))}
            </div>

            <div className="w-full space-y-3 mt-2">
              {LOADING_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                      i === loadingStep
                        ? "bg-primary/10 border-primary/20 opacity-100"
                        : i < loadingStep
                        ? "bg-secondary/50 border-transparent opacity-60"
                        : "bg-secondary/20 border-transparent opacity-30"
                    }`}
                  >
                    {i < loadingStep ? (
                      <div className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    ) : i === loadingStep ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                    ) : (
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${i <= loadingStep ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.message}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-secondary animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : !data?.recommendations?.length ? (
           <div className="text-center py-12 px-4">
             <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
               <Sparkles className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="font-display text-xl font-semibold mb-2">No recommendations yet</h3>
             <p className="text-muted-foreground text-sm mb-6">Complete your profile and add items to your kitchen to get personalized meal ideas.</p>
             <Button onClick={() => refreshMutation.mutate()} disabled={isRefreshing}>
                Generate Ideas
             </Button>
           </div>
        ) : (
          <div className="space-y-4">
            {(data.recommendations as RecommendationWithLabTarget[]).map((rec, i) => (
              <Card key={i} className="overflow-hidden border-border/60 hover:border-primary/30 transition-colors">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="bg-background text-xs capitalize">
                        {rec.category.replace('_', ' ')}
                      </Badge>
                      {rec.priority === 'high' && (
                        <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-0">Highly Recommended</Badge>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-1">
                      {rec.title}
                    </h3>
                    {(rec.cookTime || rec.difficulty) && (
                      <p className="text-xs text-muted-foreground mb-2">
                        ⏱ {rec.cookTime} · {rec.difficulty}
                      </p>
                    )}
                    <p className={`text-sm text-muted-foreground mb-1 ${expandedCards.has(i) ? "" : "line-clamp-2"}`}>
                      {rec.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleCard(i)}
                      className="text-xs text-primary font-medium mb-3 hover:underline"
                    >
                      {expandedCards.has(i) ? "Show less" : "Read more"}
                    </button>
                    
                    <div className="bg-secondary/50 rounded-xl p-3 mb-3">
                      <p className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-primary" /> Why this fits you:
                      </p>
                      <p className="text-xs text-muted-foreground">{rec.reason}</p>
                      {rec.userValue != null && (() => {
                        const m = rec.targetMarker?.toLowerCase() ?? "";
                        if (m.includes("b12") || m.includes("b-12")) {
                          return (
                            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/40">
                              B12 works alongside folate in your methylation cycle. Low levels can impair energy metabolism and neurological function.
                            </p>
                          );
                        }
                        if (m.includes("b9") || m.includes("folate") || m.includes("folic")) {
                          return (
                            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/40">
                              Low folate directly impacts your methylation cycle — a biological process that affects energy production, mood regulation, and cellular repair.
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {rec.targetMarker && (
                      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-primary/10 border border-primary/15">
                        <FlaskConical className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs font-medium text-primary">
                          {rec.targetMarker}:
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {rec.userValue != null
                            ? `${formatNumber(rec.userValue)} → target ${rec.optimalRange}`
                            : rec.optimalRange}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-end mt-2 pt-4 border-t border-border/50">
                      {rec.estimatedNutrients && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatNumber(rec.estimatedNutrients.calories)} kcal</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Estimated</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
