import { useState, useEffect } from "react";
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
import { User, Activity, FlaskConical, Zap, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const DIETS = ["vegan", "vegetarian", "keto", "paleo", "gluten_free", "dairy_free", "low_fodmap", "carnivore"];
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
  { key: "iron", label: "Serum Iron", unit: "mcg/dL", placeholder: "e.g. 90", ref: "60–170 normal" },
  { key: "ferritin", label: "Ferritin", unit: "ng/mL", placeholder: "e.g. 50", ref: "20–200 normal" },
  { key: "crp", label: "CRP", unit: "mg/L", placeholder: "e.g. 1.2", ref: "<3.0 normal" },
  { key: "glucose", label: "Fasting Glucose", unit: "mg/dL", placeholder: "e.g. 90", ref: "<100 normal" },
  { key: "totalCholesterol", label: "Total Cholesterol", unit: "mg/dL", placeholder: "e.g. 180", ref: "<200 optimal" },
  { key: "ldl", label: "LDL Cholesterol", unit: "mg/dL", placeholder: "e.g. 100", ref: "<130 normal" },
  { key: "hdl", label: "HDL Cholesterol", unit: "mg/dL", placeholder: "e.g. 55", ref: ">40 (M) / >50 (F)" },
  { key: "magnesium", label: "Magnesium", unit: "mg/dL", placeholder: "e.g. 2.0", ref: "1.7–2.2 normal" },
  { key: "zinc", label: "Zinc", unit: "mcg/dL", placeholder: "e.g. 90", ref: "60–130 normal" },
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
  const { data: profile, isLoading } = useGetProfile();

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
          <SectionHeader icon={FlaskConical} label="Lab Results" color="text-violet-500" />
          <p className="text-xs text-muted-foreground mb-3 -mt-1">
            Enter your most recent bloodwork. AI will flag out-of-range values and suggest targeted foods.
          </p>
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
            Select symptoms you're currently experiencing so AI can tailor recommendations.
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
      </div>
    </div>
  );
}
