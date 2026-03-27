import { useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import {
  useGetInventory,
  useAddInventoryItem,
  useDeleteInventoryItem,
  useAnalyzeFood,
} from "@workspace/api-client-react";
import type { FoodAnalysisResult, CreateInventoryItemRequestCategory } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  Refrigerator,
  Leaf,
  Beef,
  Milk,
  Wheat,
  Camera,
  ImagePlus,
  X,
  Check,
  Sparkles,
  ChevronUp,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetInventoryQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { compressImage, fileToBase64 } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  produce: Leaf,
  protein: Beef,
  dairy: Milk,
  grains: Wheat,
  default: Refrigerator,
};

const CATEGORIES = [
  "produce",
  "protein",
  "dairy",
  "grains",
  "pantry",
  "beverages",
  "condiments",
  "frozen",
  "other",
];

interface ScannedItem {
  name: string;
  quantity: string;
  category: string;
  selected: boolean;
}

type ScanState = "idle" | "analyzing" | "confirm";

export default function Kitchen() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useGetInventory();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [scanDescription, setScanDescription] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("produce");
  const [formQuantity, setFormQuantity] = useState("");

  const analyzeMutation = useAnalyzeFood();

  const addMutation = useAddInventoryItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
      },
    },
  });

  const deleteMutation = useDeleteInventoryItem({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() }),
    },
  });

  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setScanState("analyzing");
    setScannedItems([]);

    try {
      const compressed = await compressImage(file);
      const { base64, mimeType } = await fileToBase64(compressed);

      analyzeMutation.mutate(
        { data: { imageBase64: base64, mimeType, analysisType: "inventory" } },
        {
          onSuccess: (result: FoodAnalysisResult) => {
            const items: ScannedItem[] = (result.inventoryItems ?? [])
              .filter((item) => !!item.name)
              .map((item) => ({
                name: item.name!,
                quantity: item.quantity ?? "",
                category: item.category ?? "other",
                selected: true,
              }));

            if (items.length === 0) {
              toast({
                title: "No items found",
                description: "Couldn't identify any food items in the photo. Try a clearer shot.",
              });
              setScanState("idle");
              setImagePreview(null);
              return;
            }

            setScanDescription(result.description ?? "");
            setScannedItems(items);
            setScanState("confirm");
          },
          onError: (err) => {
            toast({
              title: "Scan failed",
              description: err.message,
              variant: "destructive",
            });
            setScanState("idle");
            setImagePreview(null);
          },
        }
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
      setScanState("idle");
      setImagePreview(null);
    }
  };

  const toggleItem = (idx: number) => {
    setScannedItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleConfirmScan = async () => {
    const selected = scannedItems.filter((i) => i.selected);
    if (selected.length === 0) {
      cancelScan();
      return;
    }

    let added = 0;
    let skipped = 0;

    for (const item of selected) {
      await new Promise<void>((resolve) => {
        addMutation.mutate(
          {
            data: {
              name: item.name,
              category: (item.category || "other") as CreateInventoryItemRequestCategory,
              quantity: item.quantity || null,
              unit: null,
            },
          },
          {
            onSuccess: (result) => {
              const isDuplicate = (result as typeof result & { duplicate?: boolean }).duplicate;
              if (isDuplicate) {
                skipped++;
              } else {
                added++;
              }
              resolve();
            },
            onError: () => {
              resolve();
            },
          }
        );
      });
    }

    queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });

    const parts: string[] = [];
    if (added > 0) parts.push(`${added} item${added !== 1 ? "s" : ""} added`);
    if (skipped > 0) parts.push(`${skipped} already tracked`);

    toast({
      title: "Kitchen updated",
      description: parts.join(", "),
    });

    cancelScan();
  };

  const cancelScan = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setScanState("idle");
    setImagePreview(null);
    setScannedItems([]);
    setScanDescription("");
  };

  const handleManualAdd = () => {
    if (!formName.trim()) return;

    addMutation.mutate(
      {
        data: {
          name: formName.trim(),
          category: formCategory as CreateInventoryItemRequestCategory,
          quantity: formQuantity.trim() || null,
          unit: null,
        },
      },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
          const isDuplicate = (result as typeof result & { duplicate?: boolean }).duplicate;
          if (isDuplicate) {
            toast({
              title: "Already in your kitchen",
              description: `${result.name} is already in your inventory.`,
            });
          } else {
            toast({ title: `${formName.trim()} added to kitchen` });
            setFormName("");
            setFormQuantity("");
            setFormCategory("produce");
            setShowAddForm(false);
          }
        },
        onError: (err) => {
          toast({ title: "Failed to add item", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  const inventoryByCategory =
    data?.items.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, typeof data.items>
    ) || {};

  if (scanState === "analyzing") {
    return (
      <div className="pb-24 max-w-md mx-auto">
        <Header title="My Kitchen" showSettings />
        <div className="px-4 py-8 flex flex-col items-center gap-6">
          {imagePreview && (
            <div className="w-full rounded-2xl overflow-hidden border border-border/50 shadow-lg">
              <img src={imagePreview} alt="Scanning" className="w-full object-cover max-h-64" />
            </div>
          )}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary animate-pulse" />
            </div>
            <p className="font-display font-semibold text-lg">Scanning your kitchen…</p>
            <p className="text-sm text-muted-foreground">Gemini is identifying food items in the photo.</p>
          </div>
        </div>
      </div>
    );
  }

  if (scanState === "confirm") {
    const selectedCount = scannedItems.filter((i) => i.selected).length;
    return (
      <div className="pb-24 max-w-md mx-auto">
        <Header title="My Kitchen" showSettings />
        <div className="px-4 py-6 space-y-4">
          {imagePreview && (
            <div className="w-full rounded-2xl overflow-hidden border border-border/50 shadow-md">
              <img src={imagePreview} alt="Scanned" className="w-full object-cover max-h-48" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">{scanDescription || "Items identified:"}</p>
          </div>

          <div className="space-y-2">
            {scannedItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleItem(idx)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                  ${item.selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card opacity-50"}`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                    ${item.selected ? "border-primary bg-primary" : "border-border"}`}
                >
                  {item.selected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.category}{item.quantity ? ` · ${item.quantity}` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={cancelScan}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmScan}
              disabled={selectedCount === 0 || addMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              {addMutation.isPending ? "Adding…" : `Add ${selectedCount} to Kitchen`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-md mx-auto">
      <Header title="My Kitchen" showSettings />

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleImageSelected}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={galleryInputRef}
        onChange={handleImageSelected}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Header row */}
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground flex-1 text-sm">Scan or add items to get smarter recommendations.</p>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Take a photo"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Upload from gallery"
          >
            <ImagePlus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className={`p-2.5 rounded-xl transition-colors ${
              showAddForm
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
            title="Add item manually"
          >
            {showAddForm ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

        {/* Manual add form */}
        {showAddForm && (
          <Card className="border-primary/30">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Add item manually</p>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Item name</label>
                <Input
                  placeholder="e.g. Almond milk"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select
                    className="flex h-10 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Quantity (optional)</label>
                  <Input
                    placeholder="e.g. 1 litre"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormName("");
                    setFormQuantity("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleManualAdd}
                  disabled={!formName.trim() || addMutation.isPending}
                >
                  {addMutation.isPending ? "Adding…" : "Add to Kitchen"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan hint banner — only when inventory is empty */}
        {!isLoading && !data?.items.length && !showAddForm && (
          <div className="text-center py-10 flex flex-col items-center gap-3 opacity-70">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-7 h-7 text-primary" />
              </div>
            </div>
            <p className="text-base font-medium text-foreground">Your kitchen is empty</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tap the camera to scan your fridge or pantry, or use + to add items manually.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-secondary rounded-2xl" />
            ))}
          </div>
        )}

        {/* Inventory list */}
        {!isLoading &&
          Object.entries(inventoryByCategory).map(([category, items]) => {
            const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-semibold capitalize text-foreground">
                    {category}
                  </h3>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {items.length}
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.quantity && (
                              <Badge variant="secondary">
                                {item.quantity}
                                {item.unit ? ` ${item.unit}` : ""}
                              </Badge>
                            )}
                            {item.expiryDate && (
                              <span className="text-xs text-muted-foreground">
                                Exp: {format(new Date(item.expiryDate), "MMM d")}
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
          })}
      </div>
    </div>
  );
}
