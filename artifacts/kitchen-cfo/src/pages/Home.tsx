import { useState, useRef, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Camera,
  Upload,
  Utensils,
  X,
  Sparkles,
  ChevronRight,
  Flame,
  Beef,
  Wheat,
  Leaf,
  FlaskConical,
  Pencil,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAnalyzeFood,
  useCreateFoodLog,
  useGetFoodLogs,
  useGetFoodLogSummary,
  useGetInventory,
  useGetProfile,
} from "@workspace/api-client-react";
import type { LabValues } from "@workspace/api-client-react";
import { compressImage, fileToBase64, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CulturalFoodBackground from "@/components/ui/CulturalFoodBackground";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { FoodAnalysisResult } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  drink: "Drink",
  other: "Other",
};

const MEAL_OPTIONS = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch", label: "Lunch", emoji: "☀️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snack", label: "Snack", emoji: "🍎" },
  { value: "drink", label: "Drink", emoji: "🥤" },
  { value: "other", label: "Other", emoji: "🍽️" },
];

interface LeafProps {
  id: number;
  startX: number;
  driftX: number;
  duration: number;
  delay: number;
  size: number;
  rotate: number;
  opacity: number;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateLeafConfig(count: number): LeafProps[] {
  const step = 100 / count;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: rand(i * step, i * step + step * 0.8),
    driftX: rand(-22, 22) * (i % 2 === 0 ? 1 : -1),
    duration: rand(9, 15),
    delay: rand(0, 8),
    size: rand(5, 11),
    rotate: rand(-55, 55),
    opacity: rand(0.14, 0.28),
  }));
}

function FloatingLeaf({
  startX,
  driftX,
  duration,
  delay,
  size,
  rotate,
  opacity,
}: Omit<LeafProps, "id">) {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none"
      style={{ left: `${startX}%` }}
      initial={{ y: 0, x: 0, opacity: 0, rotate: rotate }}
      animate={{
        y: [-10, -100, -160, -200],
        x: [0, driftX * 0.3, driftX * 0.7, driftX],
        opacity: [0, opacity, opacity * 0.6, 0],
        rotate: [rotate, rotate + 12, rotate - 6, rotate + 4],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
        times: [0, 0.35, 0.7, 1],
      }}
    >
      <svg
        width={size}
        height={size * 1.6}
        viewBox="0 0 10 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 15 C5 15, 0 10, 0 6 C0 2.5, 2.5 0, 5 0 C7.5 0, 10 2.5, 10 6 C10 10, 5 15, 5 15Z"
          fill="white"
        />
        <line
          x1="5"
          y1="15"
          x2="5"
          y2="2"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.8"
        />
      </svg>
    </motion.div>
  );
}

export default function Home() {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const leafConfig = useMemo(() => generateLeafConfig(6), []);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysisResult | null>(null);
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem("cfo_welcomed"),
  );
  const [showDemoBanner, setShowDemoBanner] = useState(
    () =>
      !!localStorage.getItem("cfo_demo_mode") &&
      !localStorage.getItem("cfo_demo_banner_dismissed"),
  );

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("cfo_demo_mode");
      localStorage.removeItem("cfo_demo_banner_dismissed");
      setShowDemoBanner(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setEditedFoodName(analysis?.items[0]?.name || "Meal");
    setEditedDescription(analysis?.description || "");
    setEditedItems(
      analysis?.items.map((item) => ({
        name: item.name,
        quantity: item.quantity || "",
      })) ?? [],
    );
    setShowAllMicros(false);
    setSelectedMealType("other");
    setIsEditingDescription(false);
    setIsEditingItems(false);
  }, [analysis]);

  type QuickSuggestion = {
    title: string;
    description: string;
    cookTime: string | null;
    difficulty: string | null;
    labMarker: string | null;
    userValue: number | null;
    optimalRange: string | null;
  };
  const [suggestion, setSuggestion] = useState<QuickSuggestion | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [showAllMicros, setShowAllMicros] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("other");
  const [editedFoodName, setEditedFoodName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedItems, setEditedItems] = useState<
    { name: string; quantity: string }[]
  >([]);
  const [isEditingItems, setIsEditingItems] = useState(false);

  const fetchSuggestion = async () => {
    setSuggestionLoading(true);
    setSuggestionError(null);
    try {
      const res = await fetch("/api/quick-suggestion", { method: "POST" });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(err.message ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as QuickSuggestion;
      setSuggestion(data);
    } catch (err) {
      setSuggestionError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSuggestionLoading(false);
    }
  };

  const analyzeMutation = useAnalyzeFood();
  const createLogMutation = useCreateFoodLog({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Logged successfully!",
          description: "Added to your food diary.",
        });
        setImagePreview(null);
        setAnalysis(null);
        setLocation("/diary");
      },
      onError: (err) => {
        toast({
          title: "Failed to log",
          description: err.message,
          variant: "destructive",
        });
      },
    },
  });

  const { data: summary, isLoading: loadingSummary } = useGetFoodLogSummary({
    date: todayStr,
  });
  const { data: logsData, isLoading: loadingLogs } = useGetFoodLogs({
    date: todayStr,
  });
  const { data: inventoryData, isLoading: loadingInventory } =
    useGetInventory();
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfile();

  const recentLogs = (logsData?.logs ?? []).slice(0, 3);

  type LabInsight = {
    label: string;
    userValue: number;
    optimalRange: string;
    isHigh?: boolean;
  };

  const labInsights = useMemo<LabInsight[]>(() => {
    const labValues = profileData?.labValues as
      | Record<string, number>
      | null
      | undefined;
    const micros = analysis?.totalNutrients?.micronutrients as
      | Record<string, number>
      | null
      | undefined;
    if (!labValues || !micros) return [];

    const insights: LabInsight[] = [];

    if (
      labValues.vitaminD != null &&
      labValues.vitaminD < 50 &&
      (micros.vitaminD ?? 0) > 0
    ) {
      insights.push({
        label: "Vitamin D",
        userValue: labValues.vitaminD,
        optimalRange: "≥50 ng/mL",
      });
    }
    if (
      labValues.vitaminB12 != null &&
      labValues.vitaminB12 < 400 &&
      (micros.vitaminB12 ?? 0) > 0
    ) {
      insights.push({
        label: "Vitamin B12",
        userValue: labValues.vitaminB12,
        optimalRange: "≥400 pg/mL",
      });
    }
    if (
      labValues.ferritin != null &&
      labValues.ferritin < 30 &&
      (micros.iron ?? 0) > 0
    ) {
      insights.push({
        label: "Ferritin",
        userValue: labValues.ferritin,
        optimalRange: "≥30 ng/mL",
      });
    } else if (
      labValues.iron != null &&
      labValues.iron < 80 &&
      (micros.iron ?? 0) > 0
    ) {
      insights.push({
        label: "Iron",
        userValue: labValues.iron,
        optimalRange: "≥80 mcg/dL",
      });
    }
    if (
      labValues.magnesium != null &&
      labValues.magnesium < 2.0 &&
      (micros.magnesium ?? 0) > 0
    ) {
      insights.push({
        label: "Magnesium",
        userValue: labValues.magnesium,
        optimalRange: "≥2.0 mg/dL",
      });
    }
    if (
      labValues.zinc != null &&
      labValues.zinc < 80 &&
      (micros.zinc ?? 0) > 0
    ) {
      insights.push({
        label: "Zinc",
        userValue: labValues.zinc,
        optimalRange: "≥80 mcg/dL",
      });
    }
    if (
      labValues.crp != null &&
      labValues.crp > 1.0 &&
      (micros.omega3 ?? 0) > 0
    ) {
      insights.push({
        label: "CRP (inflammation)",
        userValue: labValues.crp,
        optimalRange: "≤1.0 mg/L",
        isHigh: true,
      });
    }

    return insights;
  }, [profileData, analysis]);

  const rawLabValues = profileData?.labValues as
    | Record<string, number | null | undefined>
    | null
    | undefined;
  const hasAnyLabValue = rawLabValues
    ? Object.values(rawLabValues).some(
        (v) => v !== null && v !== undefined && v !== 0,
      )
    : false;

  const microCount = Object.values(summary?.micronutrientTotals ?? {}).filter(
    (v) => v && v > 0,
  ).length;
  const hasAnyData =
    (summary?.totalCalories ?? 0) > 0 ||
    (summary?.totalProtein ?? 0) > 0 ||
    microCount > 0;

  const isEmptyState =
    !loadingSummary &&
    !loadingInventory &&
    (summary?.totalCalories ?? 0) === 0 &&
    (inventoryData?.items?.length ?? 0) === 0;

  const shouldShowWelcome = showWelcome;

  const dismissWelcome = () => {
    localStorage.setItem("cfo_welcomed", "1");
    setShowWelcome(false);
  };

  const handleLoadDemo = async () => {
    dismissWelcome();

    const { dismiss: dismissLoadingToast } = toast({
      title: "Loading demo data…",
      description: "Setting up your personalized sample profile and meals.",
    });

    const attemptLoad = () => fetch("/api/demo/load", { method: "POST" });
    const MAX_ATTEMPTS = 3;
    const RETRY_DELAY_MS = 3000;

    let succeeded = false;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await attemptLoad();
        if (res.ok) {
          succeeded = true;
          break;
        }
      } catch {
        // network error — will retry
      }
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }

    dismissLoadingToast();

    if (succeeded) {
      localStorage.setItem("cfo_demo_mode", "1");
      localStorage.removeItem("cfo_demo_banner_dismissed");
      setShowDemoBanner(true);
      try {
        await queryClient.invalidateQueries();
      } catch {
        // cache refresh failure should not block the success toast
      }
      toast({
        title: "Demo data loaded!",
        description:
          "Explore your diary, kitchen, and personalized recommendations.",
      });
    } else {
      toast({
        title: "Demo data couldn't load",
        description:
          "The app is yours to explore — try reloading if data is missing.",
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setAnalysis(null);

    try {
      const compressed = await compressImage(file);
      const { base64, mimeType } = await fileToBase64(compressed);
      analyzeMutation.mutate(
        { data: { imageBase64: base64, mimeType, analysisType: "meal" } },
        {
          onSuccess: (res) => setAnalysis(res),
          onError: (err) => {
            toast({
              title: "Analysis failed",
              description: err.message,
              variant: "destructive",
            });
            setImagePreview(null);
          },
        },
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
      setImagePreview(null);
    }
  };

  const handleLog = () => {
    if (!analysis) return;
    const foodName =
      editedFoodName.trim() || analysis.items[0]?.name || "Analyzed Meal";
    const quantity = analysis.items[0]?.quantity || "1 serving";
    createLogMutation.mutate({
      data: {
        foodName,
        quantity,
        mealType: selectedMealType,
        nutrients: analysis.totalNutrients,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative max-w-md mx-auto overflow-x-hidden">
      {/* Welcome / Demo overlay */}
      <AnimatePresence>
        {shouldShowWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl px-6 pt-6 pb-10 sm:pb-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6 sm:hidden" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg leading-tight">
                    Welcome to Kitchen CFO
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Your personal food intelligence app
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Kitchen CFO connects your bloodwork to your kitchen and tells
                you exactly what to eat next — based on your biology, not
                someone else's. Load demo data to explore all features, or log
                in to start tracking your own.
              </p>

              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-base font-semibold"
                  onClick={handleLoadDemo}
                >
                  Load Demo Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={dismissWelcome}
                >
                  Explore Without Demo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo mode banner */}
      <AnimatePresence>
        {showDemoBanner && (
          <motion.div
            key="demo-banner"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-4 mt-3 flex items-center justify-between gap-2 rounded-xl bg-accent/10 border border-accent/20 px-4 py-2.5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <span className="text-xs font-medium text-foreground/80">
                Viewing demo data — explore freely.
              </span>
            </div>
            <button
              onClick={() => {
                localStorage.setItem("cfo_demo_banner_dismissed", "1");
                setShowDemoBanner(false);
              }}
              className="p-1 hover:bg-accent/10 rounded-lg text-muted-foreground"
              aria-label="Dismiss demo banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleFileSelect}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={galleryInputRef}
        onChange={handleFileSelect}
      />
      <AnimatePresence mode="wait">
        {!imagePreview ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {/* ── Hero Section ── */}
            <div className="relative overflow-hidden bg-primary px-6 pt-10 pb-8">
              {/* Depth orbs — 4 orbs, different greens/sizes/timings so they never sync */}
              <motion.div
                className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(134,239,172,0.18) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(20,83,45,0.6) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />
              <motion.div
                className="absolute top-1/2 -right-4 w-28 h-28 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(187,247,208,0.12) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3,
                }}
              />
              <motion.div
                className="absolute -top-4 left-1/3 w-20 h-20 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(240,253,244,0.1) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              />

              {/* Drifting light-dapple gradient — simulates sunlight moving through a canopy */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 55% 45% at 60% 30%, hsla(142,60%,55%,0.22) 0%, transparent 65%), " +
                    "radial-gradient(ellipse 35% 30% at 25% 70%, hsla(148,55%,48%,0.14) 0%, transparent 60%)",
                }}
                animate={{ x: [-8, 12, -4, 8, -8], y: [-4, 8, -10, 4, -4] }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Floating leaf particles */}
              {leafConfig.map((leaf) => (
                <FloatingLeaf key={leaf.id} {...leaf} />
              ))}
              {/* Cultural food background — swaps by user's selected culture */}
              <CulturalFoodBackground
                culture={profileData?.culturalBackground ?? ""}
              />

              {/* Accent dots — kept, now above animation layers */}
              <div className="absolute top-6 left-4 flex gap-1 opacity-30">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Leaf className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white/70 text-sm font-medium tracking-wide uppercase">
                    Kitchen CFO
                  </span>
                </div>

                <h1 className="text-3xl font-display font-bold text-white leading-snug">
                  Your body is finally
                  <br />
                  being listened to.
                </h1>
              </div>
            </div>

            {/* ── Today's Stats Strip ── */}
            <div className="px-4 -mt-4">
              <div className="bg-card rounded-2xl shadow-md shadow-primary/8 border border-border/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Today's Progress
                </p>

                {loadingSummary ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-muted rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : hasAnyData ? (
                  <div className="grid grid-cols-3 gap-3">
                    <StatPill
                      icon={<Flame className="w-3.5 h-3.5" />}
                      label="Calories"
                      value={`${formatNumber(summary?.totalCalories ?? 0)}`}
                      unit="kcal"
                      color="text-orange-500"
                      bg="bg-orange-50"
                    />
                    <StatPill
                      icon={<Beef className="w-3.5 h-3.5" />}
                      label="Protein"
                      value={`${formatNumber(summary?.totalProtein ?? 0)}`}
                      unit="g"
                      color="text-primary"
                      bg="bg-primary/8"
                    />
                    <StatPill
                      icon={<Wheat className="w-3.5 h-3.5" />}
                      label="Nutrients"
                      value={`${microCount}`}
                      unit="tracked"
                      color="text-emerald-600"
                      bg="bg-emerald-50"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Log your first meal to start tracking today's nutrients.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Lab Results Prompt ── */}
            {!isLoadingProfile && !hasAnyLabValue && (
              <div className="px-4 mt-3">
                <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FlaskConical className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      Unlock personalised recommendations
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Add your lab results to get food guidance tailored to your
                      specific biology.
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
                </div>
              </div>
            )}

            {/* ── What Should I Eat Next? ── */}
            <div className="px-4 mt-3">
              <AnimatePresence mode="wait">
                {suggestionLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Personalizing your suggestion…
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Checking your labs, kitchen & today's meals
                      </p>
                    </div>
                  </motion.div>
                ) : suggestion ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-card border border-primary/20 rounded-2xl p-4 shadow-sm shadow-primary/5"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-0.5">
                          Eat This Next
                        </p>
                        <p className="font-display font-bold text-foreground text-base leading-snug">
                          {suggestion.title}
                        </p>
                        {(suggestion.cookTime || suggestion.difficulty) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            ⏱ {suggestion.cookTime} · {suggestion.difficulty}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1 leading-snug">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                    {suggestion.labMarker && (
                      <div className="mt-3 rounded-xl bg-primary/5 border border-primary/15 px-3 py-2 flex items-center gap-2">
                        <FlaskConical className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-xs text-foreground font-medium">
                          Targets{" "}
                          <span className="text-primary font-semibold">
                            {suggestion.labMarker}
                          </span>
                          {suggestion.userValue != null && (
                            <>
                              {" "}
                              · you're at{" "}
                              <span className="font-semibold">
                                {suggestion.userValue}
                              </span>
                            </>
                          )}
                          {suggestion.optimalRange && (
                            <> · target {suggestion.optimalRange}</>
                          )}
                        </span>
                      </div>
                    )}
                    {suggestionError && (
                      <p className="mt-2 text-xs text-destructive">
                        {suggestionError}
                      </p>
                    )}
                    <button
                      onClick={fetchSuggestion}
                      className="mt-3 text-xs text-primary/70 hover:text-primary font-medium transition-colors"
                    >
                      Refresh suggestion →
                    </button>
                  </motion.div>
                ) : suggestionError ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-card border border-border/50 rounded-2xl p-4"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      {suggestionError}
                    </p>
                    <button
                      onClick={fetchSuggestion}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Try again
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onClick={fetchSuggestion}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5 transition-all text-left group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">
                        What Should I Eat Next?
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Personalized meal suggestion based on your labs, kitchen
                        & today's food
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* ── Camera Button ── */}
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="relative">
                {/* Animated pulse rings */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.35, 1.35], opacity: [0.6, 0, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/15"
                  animate={{ scale: [1, 1.55, 1.55], opacity: [0.4, 0, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.4,
                  }}
                />

                <motion.button
                  onClick={() => cameraInputRef.current?.click()}
                  className="relative w-40 h-40 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex flex-col items-center justify-center gap-2"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" strokeWidth={1.8} />
                  </div>
                  <span className="text-white font-semibold text-base tracking-wide">
                    Take Photo
                  </span>
                </motion.button>
              </div>

              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-4 py-2"
              >
                <Upload className="w-4 h-4" />
                Upload from Gallery
              </button>

              <p className="text-xs text-muted-foreground text-center max-w-[260px] leading-relaxed">
                For best results: hold phone 12 inches above food, ensure good
                lighting, keep food in center of frame.
              </p>
            </div>

            {/* ── Recent Scans ── */}
            <div className="px-4 pb-28">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent Scans
                </h2>
                {recentLogs.length > 0 && (
                  <button
                    onClick={() => setLocation("/diary")}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>

              {loadingLogs ? (
                <div className="space-y-2">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : recentLogs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col items-center gap-2 py-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mb-1">
                    <Camera className="w-6 h-6 text-primary/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    No scans yet today
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Start with a photo to log your first meal.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {recentLogs.map((log, i) => {
                    const score = calcNutritionScore(
                      log.nutrients as Record<string, unknown> | null,
                    );
                    return (
                      <motion.button
                        key={log.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => setLocation("/diary")}
                        className="w-full bg-card border border-border/50 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5 transition-all text-left group"
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {log.foodName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-4 leading-none"
                            >
                              {MEAL_LABELS[log.mealType] ?? "Meal"}
                            </Badge>
                            {log.nutrients?.calories ? (
                              <span className="text-xs text-muted-foreground">
                                {formatNumber(log.nutrients.calories)} kcal
                              </span>
                            ) : null}
                          </div>
                        </div>
                        {score !== null && (
                          <NutritionScoreBadge score={score} />
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ── Analysis / Results View (unchanged) ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col gap-4 p-4 mt-2"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-border/50 aspect-square bg-black/5">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => {
                  setImagePreview(null);
                  setAnalysis(null);
                  if (cameraInputRef.current) cameraInputRef.current.value = "";
                  if (galleryInputRef.current)
                    galleryInputRef.current.value = "";
                }}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur text-white rounded-full hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>

              {analyzeMutation.isPending && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-primary w-6 h-6 animate-pulse" />
                  </div>
                  <p className="mt-4 font-medium text-foreground animate-pulse">
                    Analyzing your food...
                  </p>
                </div>
              )}
            </div>

            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pb-24"
              >
                <Card className="border-primary/20 shadow-md shadow-primary/5">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0 mr-3">
                        <input
                          type="text"
                          value={editedFoodName}
                          onChange={(e) => setEditedFoodName(e.target.value)}
                          className="font-display text-xl font-bold bg-transparent border-b border-transparent focus:border-primary/40 focus:outline-none w-full leading-tight"
                          aria-label="Food name"
                        />
                      </div>
                      <Badge
                        variant="accent"
                        className="bg-primary/10 text-primary shrink-0"
                      >
                        {formatNumber(analysis.totalNutrients.calories)} kcal
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground/60 mb-3">
                      Not quite right? Tap to edit any field before logging.
                    </p>

                    <div className="flex items-start gap-2 mb-4">
                      {isEditingDescription ? (
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="flex-1 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 min-h-[60px]"
                          rows={3}
                          autoFocus
                        />
                      ) : (
                        <p className="flex-1 text-sm text-muted-foreground capitalize">
                          {editedDescription || analysis.description}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsEditingDescription((v) => !v)}
                        className="shrink-0 p-1.5 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          isEditingDescription
                            ? "Done editing description"
                            : "Edit description"
                        }
                      >
                        {isEditingDescription ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Pencil className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          Protein
                        </p>
                        <p className="font-bold text-lg">
                          {formatNumber(analysis.totalNutrients.protein)}g
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          Carbs
                        </p>
                        <p className="font-bold text-lg">
                          {formatNumber(analysis.totalNutrients.carbohydrates)}g
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          Fat
                        </p>
                        <p className="font-bold text-lg">
                          {formatNumber(analysis.totalNutrients.fat)}g
                        </p>
                      </div>
                    </div>

                    {editedItems.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Ingredients / Items
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsEditingItems((v) => !v)}
                            className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 transition-colors"
                          >
                            {isEditingItems ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Done
                              </>
                            ) : (
                              <>
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                              </>
                            )}
                          </button>
                        </div>
                        {isEditingItems ? (
                          <div className="space-y-2">
                            {editedItems.map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Input
                                  value={item.name}
                                  onChange={(e) =>
                                    setEditedItems((prev) =>
                                      prev.map((it, idx) =>
                                        idx === i
                                          ? { ...it, name: e.target.value }
                                          : it,
                                      ),
                                    )
                                  }
                                  placeholder="Food name"
                                  className="flex-1 h-9 text-sm"
                                />
                                <Input
                                  value={item.quantity}
                                  onChange={(e) =>
                                    setEditedItems((prev) =>
                                      prev.map((it, idx) =>
                                        idx === i
                                          ? { ...it, quantity: e.target.value }
                                          : it,
                                      ),
                                    )
                                  }
                                  placeholder="qty"
                                  className="w-20 h-9 text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditedItems((prev) =>
                                      prev.filter((_, idx) => idx !== i),
                                    )
                                  }
                                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  aria-label="Remove ingredient"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                setEditedItems((prev) => [
                                  ...prev,
                                  { name: "", quantity: "" },
                                ])
                              }
                              className="flex items-center gap-1.5 text-xs text-primary font-medium py-1 hover:text-primary/80 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add ingredient
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {editedItems.map((item, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-background"
                              >
                                {item.name}
                                {item.quantity ? ` · ${item.quantity}` : ""}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {labInsights.length > 0 && (
                      <div className="mt-4 rounded-xl bg-primary/5 border border-primary/15 p-4">
                        <p className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-3">
                          <FlaskConical className="w-3.5 h-3.5" />
                          How this helps you
                        </p>
                        <div className="space-y-2">
                          {labInsights.map((insight) => (
                            <div
                              key={insight.label}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="text-xs font-medium text-foreground flex items-center gap-1">
                                <span className="text-primary">
                                  {insight.isHigh ? "↓" : "↑"}
                                </span>{" "}
                                {insight.label}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                you're at{" "}
                                <span className="font-semibold text-foreground">
                                  {formatNumber(insight.userValue)}
                                </span>{" "}
                                · target {insight.optimalRange}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meal type selector */}
                    <div className="mt-5">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Log as</p>
                      <div className="flex flex-wrap gap-2">
                        {MEAL_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setSelectedMealType(opt.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              selectedMealType === opt.value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                            }`}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 text-lg h-14"
                      size="lg"
                      onClick={handleLog}
                      disabled={createLogMutation.isPending}
                    >
                      {createLogMutation.isPending ? (
                        "Saving..."
                      ) : (
                        <>
                          <Utensils className="w-5 h-5 mr-2" />
                          Log to Diary
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <div className="px-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Detected Micronutrients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(
                      analysis.totalNutrients.micronutrients || {},
                    )
                      .filter(([, val]) => val && val > 0)
                      .slice(0, showAllMicros ? undefined : 6)
                      .map(([key, val]) => (
                        <Badge
                          key={key}
                          variant="outline"
                          className="bg-background"
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}{" "}
                          {formatNumber(val)}
                        </Badge>
                      ))}
                    <Badge
                      variant="ghost"
                      className="text-primary hover:bg-primary/10 cursor-pointer"
                      onClick={() => setShowAllMicros((v) => !v)}
                    >
                      {showAllMicros ? "Show less" : "+ more"}
                    </Badge>
                  </div>
                </div>

                {!isLoadingProfile && !hasAnyLabValue && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mx-2 rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 p-4 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FlaskConical className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Want recommendations based on your biology?
                      </p>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        Add your lab results to unlock personalized guidance.
                      </p>
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-8"
                        onClick={() => setLocation("/profile")}
                      >
                        Add Lab Results →
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TRACKED_MICRONUTRIENTS = [
  "vitaminA",
  "vitaminB1",
  "vitaminB2",
  "vitaminB3",
  "vitaminB6",
  "vitaminB9",
  "vitaminB12",
  "vitaminC",
  "vitaminD",
  "vitaminE",
  "vitaminK",
  "calcium",
  "iron",
  "magnesium",
  "phosphorus",
  "potassium",
  "sodium",
  "zinc",
  "selenium",
  "copper",
  "manganese",
  "chromium",
  "iodine",
  "omega3",
  "omega6",
] as const;

const TRACKED_TOTAL = TRACKED_MICRONUTRIENTS.length;

function calcNutritionScore(
  nutrients: Record<string, unknown> | null | undefined,
): number | null {
  if (!nutrients) return null;
  const micros = nutrients.micronutrients as
    | Record<string, unknown>
    | null
    | undefined;
  if (!micros || typeof micros !== "object") return null;

  const nonZeroCount = TRACKED_MICRONUTRIENTS.filter(
    (key) => typeof micros[key] === "number" && (micros[key] as number) > 0,
  ).length;

  const base = Math.max(1, Math.round((nonZeroCount / TRACKED_TOTAL) * 9) + 1);

  const fiber = typeof nutrients.fiber === "number" ? nutrients.fiber : 0;
  const protein = typeof nutrients.protein === "number" ? nutrients.protein : 0;
  const bonus = fiber > 2 && protein > 10 ? 1 : 0;

  return Math.min(10, base + bonus);
}

function NutritionScoreBadge({ score }: { score: number }) {
  const tier =
    score >= 7
      ? { bg: "bg-green-100", text: "text-green-700" }
      : score >= 4
        ? { bg: "bg-yellow-100", text: "text-yellow-700" }
        : { bg: "bg-red-100", text: "text-red-700" };

  return (
    <div
      title="Micronutrient variety score — add your labs for a personalized health score."
      className={`${tier.bg} ${tier.text} rounded-lg px-2 py-1 flex flex-col items-center flex-shrink-0 min-w-[56px] cursor-default`}
    >
      <span className="font-bold text-sm leading-none">
        {score}
        <span className="font-normal opacity-60">/10</span>
      </span>
      <span className="text-[8px] font-medium leading-none mt-0.5 whitespace-nowrap">
        Nutrition Score
      </span>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  unit,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3 flex flex-col gap-1`}>
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-lg text-foreground leading-none">
          {value}
        </span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
