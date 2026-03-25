import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useGetInventory, useAddInventoryItem, useDeleteInventoryItem } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Trash2, Refrigerator, Leaf, Beef, Milk, Wheat } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetInventoryQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  produce: Leaf,
  protein: Beef,
  dairy: Milk,
  grains: Wheat,
  default: Refrigerator
};

export default function Kitchen() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useGetInventory();
  
  const addMutation = useAddInventoryItem({
    mutation: {
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
        if ((result as typeof result & { duplicate?: boolean }).duplicate) {
          toast({
            title: "Already in your kitchen",
            description: `${result.name} is already tracked in your inventory.`,
          });
        }
      }
    }
  });
  
  const deleteMutation = useDeleteInventoryItem({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() }) }
  });

  const handleAddSample = () => {
    addMutation.mutate({
      data: {
        name: "Avocado",
        category: "produce",
        quantity: "2",
        unit: "items"
      }
    });
  };

  const inventoryByCategory = data?.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof data.items>) || {};

  return (
    <div className="pb-24 max-w-md mx-auto">
      <Header title="My Kitchen" showSettings />
      
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Track what you have to get smarter recipes.</p>
          <Button size="sm" onClick={handleAddSample} disabled={addMutation.isPending}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-secondary rounded-2xl" />
            ))}
          </div>
        ) : !data?.items.length ? (
          <div className="text-center py-12 flex flex-col items-center opacity-60">
            <img src={`${import.meta.env.BASE_URL}images/empty-kitchen.png`} alt="Empty Kitchen" className="w-40 h-40 mb-4" />
            <p className="text-lg font-medium text-foreground">Your kitchen is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Scan grocery receipts or add items manually.</p>
          </div>
        ) : (
          Object.entries(inventoryByCategory).map(([category, items]) => {
            const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-semibold capitalize text-foreground">{category}</h3>
                </div>
                <div className="grid gap-3">
                  {items.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{item.quantity} {item.unit}</Badge>
                            {item.expiryDate && (
                              <span className="text-xs text-muted-foreground">
                                Exp: {format(new Date(item.expiryDate), 'MMM d')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteMutation.mutate({ id: item.id })}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
