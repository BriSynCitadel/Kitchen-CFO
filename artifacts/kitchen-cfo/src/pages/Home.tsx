import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Camera, Upload, Utensils, Zap, Plus, X, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalyzeFood, useCreateFoodLog } from "@workspace/api-client-react";
import { fileToBase64, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { FoodAnalysisResult } from "@workspace/api-client-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      }
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setAnalysis(null);

    try {
      const { base64, mimeType } = await fileToBase64(file);
      analyzeMutation.mutate({
        data: {
          imageBase64: base64,
          mimeType,
          analysisType: "meal"
        }
      }, {
        onSuccess: (res) => setAnalysis(res),
        onError: (err) => {
          toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
          setImagePreview(null);
        }
      });
    } catch (err) {
      toast({ title: "Error", description: "Failed to process image", variant: "destructive" });
      setImagePreview(null);
    }
  };

  const handleLog = () => {
    if (!analysis) return;
    
    // Default to the first item's name or the description
    const foodName = analysis.items[0]?.name || "Analyzed Meal";
    const quantity = analysis.items[0]?.quantity || "1 serving";
    
    createLogMutation.mutate({
      data: {
        foodName,
        quantity,
        mealType: "other", // User can edit this later
        nutrients: analysis.totalNutrients,
      }
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative max-w-md mx-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-pattern.png`} 
          alt="" 
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4">
        <div className="pt-8 pb-6">
          <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
            What's on <br/><span className="text-primary">your plate?</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Snap a photo to instantly track macros and micronutrients.</p>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center gap-6 mt-8"
            >
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-48 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 group"
              >
                <div className="p-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <Camera className="w-10 h-10" />
                </div>
                <span className="font-semibold text-lg tracking-wide">Take Photo</span>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload from Gallery
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col gap-4 mt-2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-border/50 aspect-square bg-black/5">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                
                {/* Close Button */}
                <button 
                  onClick={() => {
                    setImagePreview(null);
                    setAnalysis(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur text-white rounded-full hover:bg-black/70"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Loading Overlay */}
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

              {/* Results */}
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

                      {/* Macros */}
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
                        {createLogMutation.isPending ? "Saving..." : (
                          <>
                            <Utensils className="w-5 h-5 mr-2" />
                            Log to Diary
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Micronutrients Teaser */}
                  <div className="px-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Detected Micronutrients</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(analysis.totalNutrients.micronutrients || {})
                        .filter(([_, val]) => val && val > 0)
                        .slice(0, 6)
                        .map(([key, val]) => (
                          <Badge key={key} variant="outline" className="bg-background">
                            {key.replace(/([A-Z])/g, ' $1').trim()} {formatNumber(val)}
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
    </div>
  );
}
