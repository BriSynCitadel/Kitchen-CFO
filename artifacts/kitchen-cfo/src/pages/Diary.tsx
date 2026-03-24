import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useGetFoodLogs, useGetFoodLogSummary, useDeleteFoodLog } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Flame, Droplet, Wheat, Trash2, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { getGetFoodLogsQueryKey, getGetFoodLogSummaryQueryKey } from "@workspace/api-client-react";

export default function Diary() {
  const [date, setDate] = useState(new Date());
  const dateStr = format(date, 'yyyy-MM-dd');
  const queryClient = useQueryClient();

  const { data: summary, isLoading: loadingSummary } = useGetFoodLogSummary({ date: dateStr });
  const { data: logsData, isLoading: loadingLogs } = useGetFoodLogs({ date: dateStr });
  
  const deleteMutation = useDeleteFoodLog({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetFoodLogsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFoodLogSummaryQueryKey() });
      }
    }
  });

  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    setDate(newDate);
  };

  // Group logs by meal type
  const logsByMeal = logsData?.logs.reduce((acc, log) => {
    if (!acc[log.mealType]) acc[log.mealType] = [];
    acc[log.mealType].push(log);
    return acc;
  }, {} as Record<string, typeof logsData.logs>) || {};

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];

  const targetCalories = 2000; // In a real app, fetch from profile
  const calPercent = Math.min(100, ((summary?.totalCalories || 0) / targetCalories) * 100);

  return (
    <div className="pb-24 max-w-md mx-auto">
      <Header title="Diary" />
      
      {/* Date Navigation */}
      <div className="flex items-center justify-between px-4 py-4 bg-background">
        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-secondary rounded-full">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="font-display font-medium text-lg">
          {format(date, 'EEEE, MMM d')}
        </h2>
        <button onClick={() => changeDate(1)} className="p-2 hover:bg-secondary rounded-full" disabled={dateStr === format(new Date(), 'yyyy-MM-dd')}>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="px-4 space-y-6 mt-2">
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calories</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-display font-bold text-foreground">
                    {formatNumber(summary?.totalCalories)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ {targetCalories}</span>
                </div>
              </div>
              
              {/* Simple SVG Ring */}
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary/20" />
                  <circle 
                    cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" 
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeDasharray="175"
                    strokeDashoffset={175 - (175 * calPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <Flame className="absolute inset-0 m-auto w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent" /> Protein
                </div>
                <p className="font-semibold">{formatNumber(summary?.totalProtein)}g</p>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${Math.min(100, ((summary?.totalProtein || 0)/100)*100)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-400" /> Carbs
                </div>
                <p className="font-semibold">{formatNumber(summary?.totalCarbohydrates)}g</p>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${Math.min(100, ((summary?.totalCarbohydrates || 0)/250)*100)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-orange-400" /> Fat
                </div>
                <p className="font-semibold">{formatNumber(summary?.totalFat)}g</p>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: `${Math.min(100, ((summary?.totalFat || 0)/65)*100)}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {!loadingLogs && (!logsData?.logs || logsData.logs.length === 0) && (
          <div className="text-center py-12 flex flex-col items-center opacity-60">
            <img src={`${import.meta.env.BASE_URL}images/empty-diary.png`} alt="Empty Diary" className="w-32 h-32 mb-4" />
            <p className="text-lg font-medium text-foreground">Nothing logged yet</p>
            <p className="text-sm text-muted-foreground mt-1">Tap the Scan tab to analyze your first meal.</p>
          </div>
        )}

        {/* Meals List */}
        <div className="space-y-6">
          {mealTypes.map(meal => {
            const logs = logsByMeal[meal];
            if (!logs || logs.length === 0) return null;
            
            const mealCalories = logs.reduce((sum, l) => sum + (l.nutrients.calories || 0), 0);
            
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={meal} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <h3 className="font-display font-semibold capitalize text-foreground">{meal}</h3>
                  <span className="text-sm font-medium text-muted-foreground">{formatNumber(mealCalories)} kcal</span>
                </div>
                
                <div className="space-y-3">
                  {logs.map(log => (
                    <div key={log.id} className="group flex items-center justify-between p-3 rounded-2xl bg-card border border-border/30 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{log.foodName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatNumber(log.nutrients.protein)}g P • {formatNumber(log.nutrients.carbohydrates)}g C • {formatNumber(log.nutrients.fat)}g F
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">{formatNumber(log.nutrients.calories)}</span>
                        <button 
                          onClick={() => deleteMutation.mutate({ id: log.id })}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
