import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Camera, Upload, Utensils, X, Sparkles, ChevronRight, Flame, Beef, Wheat, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAnalyzeFood,
  useCreateFoodLog,
  useGetFoodLogs,
  useGetFoodLogSummary,
} from "@workspace/api-client-react";
import { compressImage, fileToBase64, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { FoodAnalysisResult } from "@workspace/api-client-react";

const todayStr = format(new Date(), "yyyy-MM-dd");

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  other: "Meal",
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysisResult | null>(null);

  const analyzeMutation = useAnalyzeFood();
  const createLogMutation = useCreateFoodLog({
    mutation: {
      onSuccess: () => {
        toast({ title: "Logged successfully!", description: "Added to your food diary." });
        setImagePreview(null);
        setAnalysis(null);
        setLocation("/diary");
      },
      onError: (err) => {
        toast({ title: "Failed to log", description: err.message, variant: "destructive" });
      },
    },
  });

  const { data: summary, isLoading: loadingSummary } = useGetFoodLogSummary({ date: todayStr });
  const { data: logsData, isLoading: loadingLogs } = useGetFoodLogs({ date: todayStr });

  const recentLogs = (logsData?.logs ?? []).slice(0, 3);
  const microCount = Object.values(summary?.micronutrientTotals ?? {}).filter((v) => v && v > 0).length;
  const hasAnyData =
    (summary?.totalCalories ?? 0) > 0 ||
    (summary?.totalProtein ?? 0) > 0 ||
    microCount > 0;

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
            toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
            setImagePreview(null);
          },
        }
      );
    } catch {
      toast({ title: "Error", description: "Failed to process image", variant: "destructive" });
      setImagePreview(null);
    }
  };

  const handleLog = () => {
    if (!analysis) return;
    const foodName = analysis.items[0]?.name || "Analyzed Meal";
    const quantity = analysis.items[0]?.quantity || "1 serving";
    createLogMutation.mutate({
      data: { foodName, quantity, mealType: "other", nutrients: analysis.totalNutrients },
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative max-w-md mx-auto overflow-x-hidden">
      {/* Hidden file inputs */}
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
              {/* Animated radial glow orbs */}
              <motion.div
                className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/10 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              {/* Leaf accent dots */}
              <div className="absolute top-6 left-4 flex gap-1 opacity-30">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Leaf className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white/70 text-sm font-medium tracking-wide uppercase">Kitchen CFO</span>
                </div>

                <h1 className="text-3xl font-display font-bold text-white leading-snug">
                  Food is Medicine.
                </h1>
                <p className="text-white/75 text-base mt-1 font-medium">
                  Know What You're Eating.
                </p>
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
                      <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />
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

            {/* ── Camera Button ── */}
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="relative">
                {/* Animated pulse rings */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.35, 1.35], opacity: [0.6, 0, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/15"
                  animate={{ scale: [1, 1.55, 1.55], opacity: [0.4, 0, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
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
                  <span className="text-white font-semibold text-base tracking-wide">Take Photo</span>
                </motion.button>
              </div>

              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-4 py-2"
              >
                <Upload className="w-4 h-4" />
                Upload from Gallery
              </button>
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
                    <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
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
                  <p className="text-sm font-medium text-muted-foreground">No scans yet today</p>
                  <p className="text-xs text-muted-foreground/70">Start with a photo to log your first meal.</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {recentLogs.map((log, i) => (
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
                        <p className="font-medium text-sm text-foreground truncate">{log.foodName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {MEAL_LABELS[log.mealType] ?? "Meal"}
                          {log.nutrients?.calories ? ` · ${formatNumber(log.nutrients.calories)} kcal` : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                    </motion.button>
                  ))}
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
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />

              <button
                onClick={() => {
                  setImagePreview(null);
                  setAnalysis(null);
                  if (cameraInputRef.current) cameraInputRef.current.value = "";
                  if (galleryInputRef.current) galleryInputRef.current.value = "";
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
                  <p className="mt-4 font-medium text-foreground animate-pulse">Kitchen CFO is analyzing...</p>
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
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-xl font-bold">{analysis.items[0]?.name || "Meal"}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{analysis.description}</p>
                      </div>
                      <Badge variant="accent" className="bg-primary/10 text-primary">
                        {formatNumber(analysis.totalNutrients.calories)} kcal
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Protein</p>
                        <p className="font-bold text-lg">{formatNumber(analysis.totalNutrients.protein)}g</p>
                      </div>
                      <div className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Carbs</p>
                        <p className="font-bold text-lg">{formatNumber(analysis.totalNutrients.carbohydrates)}g</p>
                      </div>
                      <div className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Fat</p>
                        <p className="font-bold text-lg">{formatNumber(analysis.totalNutrients.fat)}g</p>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-5 text-lg h-14"
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
                    {Object.entries(analysis.totalNutrients.micronutrients || {})
                      .filter(([, val]) => val && val > 0)
                      .slice(0, 6)
                      .map(([key, val]) => (
                        <Badge key={key} variant="outline" className="bg-background">
                          {key.replace(/([A-Z])/g, " $1").trim()} {formatNumber(val)}
                        </Badge>
                      ))}
                    <Badge variant="ghost" className="text-primary hover:bg-primary/10">
                      + more
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-lg text-foreground leading-none">{value}</span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
