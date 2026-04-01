import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FlaskConical, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProfile, useGetProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
import type { LabValues } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface LabMarker {
  key: keyof LabValues;
  label: string;
  unit: string;
  ref: string;
}

const LAB_MARKERS: LabMarker[] = [
  { key: "vitaminD", label: "Vitamin D", unit: "ng/mL", ref: "30–80 optimal" },
  { key: "vitaminB12", label: "Vitamin B12", unit: "pg/mL", ref: "300–900 optimal" },
  { key: "iron", label: "Serum Iron", unit: "mcg/dL", ref: "60–170 normal" },
  { key: "ferritin", label: "Ferritin", unit: "ng/mL", ref: "20–200 normal" },
  { key: "crp", label: "CRP", unit: "mg/L", ref: "<3.0 normal" },
  { key: "glucose", label: "Fasting Glucose", unit: "mg/dL", ref: "<100 normal" },
  { key: "totalCholesterol", label: "Total Cholesterol", unit: "mg/dL", ref: "<200 optimal" },
  { key: "ldl", label: "LDL Cholesterol", unit: "mg/dL", ref: "<130 normal" },
  { key: "hdl", label: "HDL Cholesterol", unit: "mg/dL", ref: ">40 (M) / >50 (F)" },
  { key: "magnesium", label: "Magnesium", unit: "mg/dL", ref: "1.7–2.2 normal" },
  { key: "zinc", label: "Zinc", unit: "mcg/dL", ref: "60–130 normal" },
  { key: "tsh", label: "TSH", unit: "mIU/L", ref: "0.4–4.0 normal" },
  { key: "folate", label: "Folate", unit: "ng/mL", ref: "2.7–17 normal" },
  { key: "uricAcid", label: "Uric Acid", unit: "mg/dL", ref: "2.4–7.0 normal" },
  { key: "potassium", label: "Potassium", unit: "mEq/L", ref: "3.5–5.0 normal" },
  { key: "freeT4", label: "Free T4", unit: "ng/dL", ref: "0.8–1.8 normal" },
  { key: "freeT3", label: "Free T3", unit: "pg/mL", ref: "2.3–4.2 normal" },
  { key: "sodium", label: "Sodium", unit: "mEq/L", ref: "136–145 normal" },
];

interface Props {
  open: boolean;
  extractedValues: Partial<Record<keyof LabValues, number | null>>;
  onClose: () => void;
}

export function LabImportModal({ open, extractedValues, onClose }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile } = useGetProfile();

  const buildValues = (ev: Partial<Record<keyof LabValues, number | null>>) => {
    const initial: Record<string, string> = {};
    for (const marker of LAB_MARKERS) {
      const extracted = ev[marker.key];
      initial[marker.key] = extracted != null ? String(extracted) : "";
    }
    return initial;
  };

  const [values, setValues] = useState<Record<string, string>>(() =>
    buildValues(extractedValues)
  );

  useEffect(() => {
    if (open) {
      setValues(buildValues(extractedValues));
    }
  }, [open, extractedValues]);

  const foundKeys = new Set(
    LAB_MARKERS
      .filter((m) => {
        const v = extractedValues[m.key];
        return v != null;
      })
      .map((m) => m.key)
  );

  const foundCount = foundKeys.size;

  const updateMutation = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        toast({
          title: "Lab results saved",
          description: `${foundCount} marker${foundCount !== 1 ? "s" : ""} imported to your health profile.`,
        });
        onClose();
      },
      onError: (err) => {
        toast({ title: "Save failed", description: err.message, variant: "destructive" });
      },
    },
  });

  const handleSave = () => {
    const existingLabs = (profile?.labValues ?? {}) as Record<string, number | null>;
    const newLabs: LabValues = { ...existingLabs };

    for (const marker of LAB_MARKERS) {
      const raw = values[marker.key];
      if (raw !== "" && raw != null) {
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          newLabs[marker.key] = num;
        }
      }
    }

    updateMutation.mutate({ data: { labValues: newLabs } });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lab-import-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base">Review Lab Results</h2>
                  <p className="text-xs text-muted-foreground">
                    {foundCount > 0
                      ? `${foundCount} of ${LAB_MARKERS.length} markers detected — review all and correct if needed`
                      : "No markers detected — enter your values manually below"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body — all 17 markers always visible */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {foundCount === 0 && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                  No lab values were automatically detected. Enter your values manually below.
                </div>
              )}

              {LAB_MARKERS.map((marker) => {
                const wasDetected = foundKeys.has(marker.key);
                return (
                  <div
                    key={marker.key}
                    className={`rounded-xl px-3 py-2.5 border ${
                      wasDetected
                        ? "border-primary/20 bg-primary/5"
                        : "border-border/50 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {wasDetected && (
                        <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-foreground">{marker.label}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{marker.ref}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={values[marker.key] ?? ""}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [marker.key]: e.target.value }))
                        }
                        placeholder="Not found"
                        className="h-8 text-sm"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap w-16 flex-shrink-0">
                        {marker.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 pb-8 pt-4 border-t border-border/50 flex gap-3 flex-shrink-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving…" : "Save to Profile"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
