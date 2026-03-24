import { Header } from "@/components/layout/Header";
import { useGetRecommendations, useRefreshRecommendations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetRecommendationsQueryKey } from "@workspace/api-client-react";
import { formatNumber } from "@/lib/utils";

export default function Recommendations() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetRecommendations();
  
  const refreshMutation = useRefreshRecommendations({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() })
    }
  });

  return (
    <div className="pb-24 max-w-md mx-auto min-h-screen bg-background">
      <Header title="For You" showSettings />
      
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Chef</p>
              <p className="text-xs text-muted-foreground">Based on your profile & kitchen</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending || isLoading}
            className={refreshMutation.isPending ? "animate-spin" : ""}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
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
             <Button onClick={() => refreshMutation.mutate()} disabled={refreshMutation.isPending}>
                Generate Ideas
             </Button>
           </div>
        ) : (
          <div className="space-y-4">
            {data.recommendations.map((rec, i) => (
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
                    <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {rec.description}
                    </p>
                    
                    <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                      <p className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-primary" /> Why this fits you:
                      </p>
                      <p className="text-xs text-muted-foreground">{rec.reason}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                      <div className="flex -space-x-2">
                        {/* Placeholder ingredient icons based on names */}
                        {rec.ingredients?.slice(0, 3).map((ing, j) => (
                           <div key={j} className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold shadow-sm" title={ing}>
                             {ing.charAt(0).toUpperCase()}
                           </div>
                        ))}
                      </div>
                      
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
