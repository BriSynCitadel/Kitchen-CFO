import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import {
  useGetProfile,
  useUpdateProfile,
  getGetProfileQueryKey,
  UpdateProfileRequestActivityLevel,
} from "@workspace/api-client-react";
import type { LabValues } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Activity, FlaskConical, Zap, Check, ExternalLink, FileUp, Loader2, Globe, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { fileToBase64 } from "@/lib/utils";
import { LabImportModal } from "@/components/LabImportModal";

const DIETS = ["vegan", "vegetarian", "keto", "paleo", "gluten_free", "dairy_free", "low_fodmap", "carnivore", "pork", "seafood", "pescatarian"];
const CULTURAL_BACKGROUNDS = [
  "No preference",
  "West African",
  "Caribbean",
  "South Asian",
  "East Asian",
  "Southeast Asian",
  "Latin American",
  "Middle Eastern",
  "Mediterranean",
  "Eastern European",
  "West European",
  "North American",
];
const GOALS = ["weight_loss", "muscle_gain", "energy", "longevity", "gut_health", "hormone_balance", "anti_inflammatory"];

const SYMPTOMS: { id: string; label: string }[] = [
  { id: "fatigue", label: "Fatigue" },
  { id: "brain_fog", label: "Brain Fog" },
  { id: "inflammation", label: "Inflammation" },
  { id: "digestive_issues", label: "Digestive Issues" },
  { id: "poor_sleep", label: "Poor Sleep" },
  { id: "hormonal_imbalance", label: "Hormonal Imbalance" },
];

interface LabMarker {
  key: keyof LabValues;
  label: string;
  unit: string;
  placeholder: string;
  ref: string;
}

const LAB_MARKERS: LabMarker[] = [
  { key: "vitaminD", label: "Vitamin D", unit: "ng/mL", placeholder: "e.g. 35", ref: "30–80 optimal" },
  { key: "vitaminB12", label: "Vitamin B12", unit: "pg/mL", placeholder: "e.g. 450", ref: "300–900 optimal" },
  { key: "iron", label: "Serum Iron", unit: "mcg/dL", placeholder: "e.g. 90", ref: "60–170 optimal" },
  { key: "ferritin", label: "Ferritin", unit: "ng/mL", placeholder: "e.g. 50", ref: "20–200 optimal" },
  { key: "crp", label: "CRP", unit: "mg/L", placeholder: "e.g. 1.2", ref: "<3.0 optimal" },
  { key: "glucose", label: "Fasting Glucose", unit: "mg/dL", placeholder: "e.g. 90", ref: "<100 optimal" },
  { key: "hba1c", label: "HbA1c", unit: "%", placeholder: "e.g. 5.2", ref: "<5.7% optimal" },
  { key: "insulin", label: "Insulin (fasting)", unit: "mIU/L", placeholder: "e.g. 4", ref: "2–6 optimal" },
  { key: "totalCholesterol", label: "Total Cholesterol", unit: "mg/dL", placeholder: "e.g. 180", ref: "<200 optimal" },
  { key: "ldl", label: "LDL Cholesterol", unit: "mg/dL", placeholder: "e.g. 100", ref: "<130 optimal" },
  { key: "hdl", label: "HDL Cholesterol", unit: "mg/dL", placeholder: "e.g. 55", ref: ">40 (M) / >50 (F) optimal" },
  { key: "cortisol", label: "Cortisol (morning)", unit: "mcg/dL", placeholder: "e.g. 15", ref: "10–20 optimal" },
  { key: "magnesium", label: "Magnesium", unit: "mg/dL", placeholder: "e.g. 2.0", ref: "1.7–2.2 optimal" },
  { key: "zinc", label: "Zinc", unit: "mcg/dL", placeholder: "e.g. 90", ref: "60–130 optimal" },
  { key: "tsh", label: "TSH", unit: "mIU/L", placeholder: "e.g. 2.0", ref: "0.4–4.0 optimal" },
  { key: "freeT4", label: "Free T4", unit: "ng/dL", placeholder: "e.g. 1.1", ref: "0.8–1.8 optimal" },
  { key: "freeT3", label: "Free T3", unit: "pg/mL", placeholder: "e.g. 3.2", ref: "2.3–4.2 optimal" },
  { key: "folate", label: "Folate", unit: "ng/mL", placeholder: "e.g. 12", ref: "2.7–17 optimal" },
  { key: "uricAcid", label: "Uric Acid", unit: "mg/dL", placeholder: "e.g. 5.5", ref: "2.4–7.0 optimal" },
  { key: "potassium", label: "Potassium", unit: "mEq/L", placeholder: "e.g. 4.1", ref: "3.5–5.0 optimal" },
  { key: "sodium", label: "Sodium", unit: "mEq/L", placeholder: "e.g. 140", ref: "136–145 optimal" },
];

function SectionHeader({ icon: Icon, label, color = "text-primary" }: { icon: React.ElementType; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <h2 className="font-display font-semibold text-lg">{label}</h2>
    </div>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-1.5
        ${active
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}
    >
      {active && <Check className="w-3 h-3 shrink-0" />}
      {children}
    </button>
  );
}

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useGetProfile();

  const labFileInputRef = useRef<HTMLInputElement>(null);
  const [labImportLoading, setLabImportLoading] = useState(false);
  const [showLabFields, setShowLabFields] = useState(false);
  const [labImportModalOpen, setLabImportModalOpen] = useState(false);
  const [labExtractedValues, setLabExtractedValues] = useState<Partial<Record<keyof LabValues, number | null>>>({});
  const [isDragging, setIsDragging] = useState(false);

  const normalizeMimeType = (rawType: string, fileName: string): string => {
    const name = fileName.toLowerCase();
    if (rawType === "application/pdf" || rawType === "image/jpeg" ||
        rawType === "image/png"       || rawType === "image/webp") return rawType;
    if (name.endsWith(".pdf") || rawType === "application/x-pdf" || rawType === "application/octet-stream" && name.endsWith(".pdf")) return "application/pdf";
    if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
    if (name.endsWith(".png")) return "image/png";
    if (name.endsWith(".webp")) return "image/webp";
    return "image/jpeg";
  };

  const processLabFile = async (file: File) => {
    const MAX_SIZE_MB = 15;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${MAX_SIZE_MB} MB. Lab reports are usually well under this limit.`,
        variant: "destructive",
      });
      return;
    }

    setLabImportLoading(true);

    try {
      const { base64, mimeType: rawMime } = await fileToBase64(file);
      const mimeType = normalizeMimeType(rawMime, file.name);

      const res = await fetch("/api/import-labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64, mimeType }),
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error("File is too large for the server to process. Please try a smaller file.");
        }
        const err = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(err.message ?? `Request failed (${res.status})`);
      }

      const data = await res.json() as { labValues: Partial<Record<keyof LabValues, number | null>>; found: number };
      setLabExtractedValues(data.labValues);
      setLabImportModalOpen(true);
    } catch (err) {
      toast({
        title: "Lab import failed",
        description: err instanceof Error ? err.message : "Unable to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLabImportLoading(false);
    }
  };

  const handleLabFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    await processLabFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (labImportLoading) return;
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await processLabFile(file);
  };

  const updateMutation = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile saved", description: "Your bioindividual profile has been updated." });
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      },
      onError: (err) => {
        toast({ title: "Update failed", description: err.message, variant: "destructive" });
      },
    },
  });

  const [formData, setFormData] = useState({
    age: "",
    weightKg: "",
    heightCm: "",
    activityLevel: UpdateProfileRequestActivityLevel.moderately_active as UpdateProfileRequestActivityLevel,
    dietaryPreferences: [] as string[],
    healthGoals: [] as string[],
    symptoms: [] as string[],
    culturalBackground: "",
    labValues: {} as Record<keyof LabValues, string>,
  });

  useEffect(() => {
    if (profile) {
      const labStr = {} as Record<keyof LabValues, string>;
      if (profile.labValues) {
        for (const [k, v] of Object.entries(profile.labValues) as [keyof LabValues, number | null | undefined][]) {
          if (v != null) labStr[k] = String(v);
        }
      }
      setFormData({
        age: profile.age?.toString() ?? "",
        weightKg: profile.weightKg?.toString() ?? "",
        heightCm: profile.heightCm?.toString() ?? "",
        activityLevel: (profile.activityLevel ?? UpdateProfileRequestActivityLevel.moderately_active) as UpdateProfileRequestActivityLevel,
        dietaryPreferences: profile.dietaryPreferences ?? [],
        healthGoals: profile.healthGoals ?? [],
        symptoms: profile.symptoms ?? [],
        culturalBackground: profile.culturalBackground ?? "",
        labValues: labStr,
      });
    }
  }, [profile]);

  const toggleChip = (field: "dietaryPreferences" | "healthGoals" | "symptoms", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const setLabValue = (key: keyof LabValues, val: string) => {
    setFormData((prev) => ({ ...prev, labValues: { ...prev.labValues, [key]: val } }));
  };

  const handleSave = () => {
    const labValuesTyped: LabValues = {};
    for (const [k, v] of Object.entries(formData.labValues) as [keyof LabValues, string][]) {
      labValuesTyped[k] = v !== "" ? parseFloat(v) : null;
    }

    updateMutation.mutate({
      data: {
        age: formData.age ? parseInt(formData.age) : null,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
        activityLevel: formData.activityLevel,
        dietaryPreferences: formData.dietaryPreferences,
        healthGoals: formData.healthGoals,
        symptoms: formData.symptoms,
        culturalBackground: formData.culturalBackground || null,
        labValues: labValuesTyped,
      },
    });
  };

  return (
    <div className="pb-28 max-w-md mx-auto">
      <Header title="My Health Profile" showSettings />

      <div className="px-4 py-6 space-y-8">
        {/* ── BASIC INFO ── */}
        <section>
          <SectionHeader icon={User} label="Basic Info" />
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Age</label>
                  <Input
                    type="number"
                    placeholder="e.g. 34"
                    value={formData.age}
                    onChange={(e) => setFormData((f) => ({ ...f, age: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 70"
                    value={formData.weightKg}
                    onChange={(e) => setFormData((f) => ({ ...f, weightKg: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Height (cm)</label>
                <Input
                  type="number"
                  placeholder="e.g. 175"
                  value={formData.heightCm}
                  onChange={(e) => setFormData((f) => ({ ...f, heightCm: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Activity Level</label>
                <select
                  className="flex h-10 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData((f) => ({ ...f, activityLevel: e.target.value as UpdateProfileRequestActivityLevel }))}
                >
                  {(
                    [
                      { v: UpdateProfileRequestActivityLevel.sedentary, l: "Sedentary (desk job, no exercise)" },
                      { v: UpdateProfileRequestActivityLevel.lightly_active, l: "Lightly Active (1-2×/week)" },
                      { v: UpdateProfileRequestActivityLevel.moderately_active, l: "Moderately Active (3-5×/week)" },
                      { v: UpdateProfileRequestActivityLevel.very_active, l: "Very Active (6-7×/week)" },
                      { v: UpdateProfileRequestActivityLevel.extremely_active, l: "Extremely Active (athlete)" },
                    ] as const
                  ).map(({ v, l }) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── LAB RESULTS ── */}
        <section>
          <button
            id="lab-import"
            onClick={() => labFileInputRef.current?.click()}
            disabled={labImportLoading}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-2xl border-2 transition-colors shadow-sm mb-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDragging
                ? "border-violet-500 bg-violet-100 dark:bg-violet-900/50 scale-[1.01]"
                : "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 hover:bg-violet-100 dark:hover:bg-violet-900/40"
            }`}
          >
            <div className="flex items-center gap-3 text-violet-700 dark:text-violet-300">
              {labImportLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <FileUp className="w-6 h-6" />
              )}
              <span className="text-base font-bold">
                {labImportLoading ? "Reading your lab report…" : "Import Lab Results"}
              </span>
            </div>
            <span className="text-xs text-violet-500 dark:text-violet-400 font-medium">
              PDF or image · Gemini AI reads your bloodwork instantly
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowLabFields((v) => !v)}
            className="w-full text-xs text-muted-foreground text-center mb-3 hover:text-foreground transition-colors py-1"
          >
            {showLabFields ? "Hide manual entry ↑" : "Or enter values manually below ↓"}
          </button>

          <div className="mb-3 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FlaskConical className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-foreground">Don't have bloodwork yet?</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              These services let you order lab tests directly — no doctor's referral required.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Quest Diagnostics", href: "https://www.questdiagnostics.com/patients/get-tested" },
                { label: "LabCorp OnDemand", href: "https://www.labcorpondemand.com" },
                { label: "Any Lab Test Now", href: "https://www.anylabtestnow.com" },
                { label: "Ulta Lab Tests", href: "https://www.ultalab.com" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-2 w-full rounded-xl border border-violet-200 dark:border-violet-700 px-4 py-2.5 text-sm font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                >
                  {label}
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                </a>
              ))}
            </div>
          </div>

          {showLabFields && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {LAB_MARKERS.map(({ key, label, unit, placeholder, ref }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">{label}</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder={placeholder}
                        value={formData.labValues[key] ?? ""}
                        onChange={(e) => setLabValue(key, e.target.value)}
                        className="pr-14 text-sm h-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium pointer-events-none">
                        {unit}
                      </span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/70 leading-tight">{ref}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          )}

        </section>

        {/* ── CULTURAL BACKGROUND ── */}
        <section>
          <SectionHeader icon={Globe} label="Cultural Background" color="text-blue-500" />
          <p className="text-xs text-muted-foreground mb-3 -mt-1">
            Helps us recommend foods familiar to your culture that meet your nutritional needs.
          </p>
          <Card>
            <CardContent className="p-4">
              <select
                value={formData.culturalBackground}
                onChange={(e) => setFormData((prev) => ({ ...prev, culturalBackground: e.target.value }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {CULTURAL_BACKGROUNDS.map((bg) => (
                  <option key={bg} value={bg === "No preference" ? "" : bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground/70 mt-2">
                Optional — skip this if you prefer general recommendations.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ── DIETARY PREFERENCES ── */}
        <section>
          <SectionHeader icon={Activity} label="Dietary Preferences" color="text-accent" />
          <div className="flex flex-wrap gap-2">
            {DIETS.map((diet) => (
              <ToggleChip
                key={diet}
                active={formData.dietaryPreferences.includes(diet)}
                onClick={() => toggleChip("dietaryPreferences", diet)}
              >
                {diet.replace(/_/g, " ")}
              </ToggleChip>
            ))}
          </div>
        </section>

        {/* ── HEALTH GOALS ── */}
        <section>
          <SectionHeader icon={Activity} label="Health Goals" color="text-primary" />
          <div className="flex flex-wrap gap-2">
            {GOALS.map((goal) => (
              <ToggleChip
                key={goal}
                active={formData.healthGoals.includes(goal)}
                onClick={() => toggleChip("healthGoals", goal)}
              >
                {goal.replace(/_/g, " ")}
              </ToggleChip>
            ))}
          </div>
        </section>

        {/* ── SYMPTOMS ── */}
        <section>
          <SectionHeader icon={Zap} label="Current Symptoms" color="text-amber-500" />
          <p className="text-xs text-muted-foreground mb-3 -mt-1">
            Select symptoms you're currently experiencing so recommendations can be tailored to you.
          </p>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(({ id, label }) => (
              <ToggleChip
                key={id}
                active={formData.symptoms.includes(id)}
                onClick={() => toggleChip("symptoms", id)}
              >
                {label}
              </ToggleChip>
            ))}
          </div>
        </section>

        {/* ── SAVE ── */}
        <Button
          className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20"
          onClick={handleSave}
          disabled={updateMutation.isPending || isLoading}
        >
          {updateMutation.isPending ? "Saving..." : "Save Profile"}
        </Button>

        {/* ── LEGAL ── */}
        <div className="flex items-center justify-center gap-1 pt-2 pb-2">
          <Shield className="w-3 h-3 text-muted-foreground/50" />
          <button
            onClick={() => setLocation("/privacy")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Privacy Policy
          </button>
          <span className="text-xs text-muted-foreground/40 mx-1">·</span>
          <button
            onClick={() => setLocation("/terms")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Terms of Service
          </button>
        </div>
      </div>

      <input
        type="file"
        accept="application/pdf,.pdf,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="hidden"
        ref={labFileInputRef}
        onChange={handleLabFileSelect}
      />

      <LabImportModal
        open={labImportModalOpen}
        extractedValues={labExtractedValues}
        onClose={() => setLabImportModalOpen(false)}
      />
    </div>
  );
}
