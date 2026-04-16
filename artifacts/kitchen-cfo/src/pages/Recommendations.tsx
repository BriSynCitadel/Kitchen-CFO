import { Header } from "@/components/layout/Header";
import {
  useGetRecommendations,
  useRefreshRecommendations,
  useGetProfile,
  useGetGroceryList,
  useRefreshGroceryList,
  getGetRecommendationsQueryKey,
  getGetGroceryListQueryKey,
  type GroceryItem,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  RefreshCw,
  FlaskConical,
  Brain,
  ShoppingBasket,
  ClipboardList,
  Loader2,
  BookOpen,
  ShoppingCart,
  CheckCircle2,
  Leaf,
  Flame,
  Package,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
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
  insight?: string | null;
};

const LOADING_STEPS = [
  { message: "Analyzing your lab values...", icon: FlaskConical },
  { message: "Checking your kitchen inventory...", icon: ShoppingBasket },
  { message: "Building your personalized plan...", icon: ClipboardList },
  { message: "Almost ready...", icon: Brain },
];

const GROCERY_LOADING_STEPS = [
  { message: "Reviewing your lab markers...", icon: FlaskConical },
  { message: "Scanning your kitchen inventory...", icon: ShoppingBasket },
  { message: "Selecting culturally relevant foods...", icon: Leaf },
  { message: "Finalising your list...", icon: ShoppingCart },
];

const STEP_DURATION_MS = 2500;

const CATEGORY_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  whole_food: {
    label: "Whole Food",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: Flame,
  },
  produce: {
    label: "Produce",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    icon: Leaf,
  },
  spice: {
    label: "Spice",
    className: "bg-accent/10 text-accent border-accent/20",
    icon: Flame,
  },
  condiment: {
    label: "Condiment",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    icon: Package,
  },
  pantry: {
    label: "Pantry",
    className: "bg-secondary text-secondary-foreground border-border",
    icon: Package,
  },
};

function GroceryItemCard({ item }: { item: GroceryItem }) {
  const config = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.pantry;
  const CategoryIcon = config.icon;
  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border/60 bg-background">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-sm text-foreground leading-tight">{item.name}</p>
        <Badge
          variant="outline"
          className={`text-[10px] shrink-0 flex items-center gap-1 h-5 px-1.5 ${config.className}`}
        >
          <CategoryIcon className="w-2.5 h-2.5" />
          {config.label}
        </Badge>
      </div>

      {item.why && (
        <p className="text-xs text-muted-foreground leading-relaxed">{item.why}</p>
      )}

      {item.targetMarker && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/15 w-fit">
          <FlaskConical className="w-3 h-3 text-primary shrink-0" />
          <span className="text-[11px] font-medium text-primary">{item.targetMarker}</span>
        </div>
      )}
    </div>
  );
}

export default function Recommendations() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetRecommendations();
  const { data: profileData } = useGetProfile();
  const { data: groceryData, isLoading: isGroceryLoading } = useGetGroceryList();
  const [, setLocation] = useLocation();

  const [loadingStep, setLoadingStep] = useState(0);
  const [groceryLoadingStep, setGroceryLoadingStep] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [groceryBusyError, setGroceryBusyError] = useState(false);

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
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() }),
    },
  });

  const groceryMutation = useRefreshGroceryList({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetGroceryListQueryKey() }),
      onError: (err: unknown) => {
        const e = err as { status?: number; data?: { error?: string } };
        if (e?.status === 503 || e?.data?.error === "ai_busy") {
          setGroceryBusyError(true);
        }
      },
    },
  });

  useEffect(() => {
    if (!refreshMutation.isPending) {
      setLoadingStep(0);
      return;
    }
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
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

  useEffect(() => {
    if (!groceryMutation.isPending) {
      setGroceryLoadingStep(0);
      return;
    }
    setGroceryBusyError(false);
    setGroceryLoadingStep(0);
    const interval = setInterval(() => {
      setGroceryLoadingStep((prev) => {
        const next = prev + 1;
        if (next >= GROCERY_LOADING_STEPS.length - 1) {
          clearInterval(interval);
          return GROCERY_LOADING_STEPS.length - 1;
        }
        return next;
      });
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, [groceryMutation.isPending]);

  const isRefreshing = refreshMutation.isPending;
  const isGroceryRefreshing = groceryMutation.isPending;
  const currentStep = LOADING_STEPS[loadingStep];
  const StepIcon = currentStep.icon;
  const currentGroceryStep = GROCERY_LOADING_STEPS[groceryLoadingStep];
  const GroceryStepIcon = currentGroceryStep.icon;

  const groceryItems = (groceryData?.items ?? []) as GroceryItem[];
  const newItems = groceryItems.filter((i) => !i.alreadyOwned);
  const ownedItems = groceryItems.filter((i) => i.alreadyOwned);

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
          <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FlaskConical className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug pt-1.5">Your symptoms have a nutritional fingerprint.</p>
            </div>
            <div className="space-y-2 mb-3 pl-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                🔋 <span className="text-foreground font-medium">Always tired?</span> Chronically low ferritin, B12, or vitamin D is the most common cause — and it won't show up without a blood test.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                🧠 <span className="text-foreground font-medium">Brain fog and poor focus</span> are often low magnesium or omega-3. Both are fixable through food once you know your levels.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                🌙 <span className="text-foreground font-medium">Waking up at 3am or sleeping badly?</span> That's frequently low progesterone, high cortisol, or magnesium deficiency — all visible in a standard panel.
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Upload your bloodwork and we'll show you exactly which foods address your specific markers.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-violet-300 text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/30 text-xs h-8"
              onClick={() => setLocation("/profile")}
            >
              Add Lab Results →
            </Button>
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
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-secondary animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : !data?.recommendations?.length ? (
          <div className="text-center py-8 px-4">
            <div className="w-14 h-14 mx-auto bg-secondary rounded-full flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No meal ideas yet</p>
            <p className="text-xs text-muted-foreground mb-4">Generate personalised meal ideas based on your profile and kitchen.</p>
            <Button size="sm" onClick={() => refreshMutation.mutate()} disabled={isRefreshing}>
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
                        {rec.category.replace("_", " ")}
                      </Badge>
                      {rec.priority === "high" && (
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
                    </div>

                    {expandedCards.has(i) && rec.insight && (
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-3">
                        <p className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1.5">
                          <BookOpen className="w-3 h-3 text-primary" /> Why this recommendation:
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rec.insight}</p>
                      </div>
                    )}

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
                          <p className="text-sm font-bold text-foreground">{formatNumber(rec.estimatedNutrients.calories ?? 0)} kcal</p>
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

        {/* ── This Week's Groceries ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">This Week's Groceries</p>
                <p className="text-[11px] text-muted-foreground">AI-curated for your markers</p>
              </div>
            </div>
            {groceryItems.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => groceryMutation.mutate()}
                disabled={isGroceryRefreshing || isGroceryLoading}
                title="Refresh grocery list"
              >
                <RefreshCw className={`w-4 h-4 ${isGroceryRefreshing ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>

          {isGroceryRefreshing ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-5 rounded-2xl border border-border/60 bg-primary/5">
              <div className="relative flex items-center justify-center w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <GroceryStepIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-center space-y-1.5">
                <p className="font-semibold text-foreground text-sm transition-all duration-500">
                  {currentGroceryStep.message}
                </p>
                <p className="text-xs text-muted-foreground">Takes about 10–15 seconds</p>
              </div>

              <div className="flex gap-2">
                {GROCERY_LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === groceryLoadingStep
                        ? "w-6 bg-primary"
                        : i < groceryLoadingStep
                        ? "w-3 bg-primary/40"
                        : "w-3 bg-border"
                    }`}
                  />
                ))}
              </div>

              <div className="w-full space-y-2">
                {GROCERY_LOADING_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-500 ${
                        i === groceryLoadingStep
                          ? "bg-primary/10 border-primary/20 opacity-100"
                          : i < groceryLoadingStep
                          ? "bg-secondary/50 border-transparent opacity-60"
                          : "bg-secondary/20 border-transparent opacity-30"
                      }`}
                    >
                      {i < groceryLoadingStep ? (
                        <div className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      ) : i === groceryLoadingStep ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${i <= groceryLoadingStep ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.message}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : isGroceryLoading ? (
            <div className="h-32 bg-secondary animate-pulse rounded-2xl" />
          ) : groceryBusyError ? (
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 flex flex-col items-center gap-3 text-center">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Our AI is a little busy right now
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Grocery list generation usually takes just a moment — please try again.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
                onClick={() => {
                  setGroceryBusyError(false);
                  groceryMutation.mutate();
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </Button>
            </div>
          ) : groceryItems.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-border/60">
              <div className="w-12 h-12 mx-auto bg-secondary rounded-full flex items-center justify-center mb-3">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No grocery list yet</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-[200px] mx-auto">
                Generate a personalised shopping list based on your lab results and cultural background.
              </p>
              <Button
                size="sm"
                onClick={() => groceryMutation.mutate()}
                disabled={isGroceryRefreshing}
              >
                Generate Grocery List
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {newItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                    New to buy · {newItems.length} item{newItems.length !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2">
                    {newItems.map((item, i) => (
                      <GroceryItemCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {ownedItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Already in your kitchen · {ownedItems.length} item{ownedItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="space-y-2 opacity-70">
                    {ownedItems.map((item, i) => (
                      <GroceryItemCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground text-center pt-1">
                {groceryData?.generatedAt
                  ? `Generated ${new Date(groceryData.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                  : "AI-generated list"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
