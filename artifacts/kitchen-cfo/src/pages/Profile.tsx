import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Activity, Droplet, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetProfileQueryKey } from "@workspace/api-client-react";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetProfile();
  
  const updateMutation = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile updated" });
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      },
      onError: (err) => {
        toast({ title: "Update failed", description: err.message, variant: "destructive" });
      }
    }
  });

  const [formData, setFormData] = useState({
    age: "",
    weightKg: "",
    heightCm: "",
    bloodType: "O+" as any,
    dietaryPreferences: [] as string[]
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age?.toString() || "",
        weightKg: profile.weightKg?.toString() || "",
        heightCm: profile.heightCm?.toString() || "",
        bloodType: profile.bloodType || "O+",
        dietaryPreferences: profile.dietaryPreferences || []
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateMutation.mutate({
      data: {
        age: formData.age ? parseInt(formData.age) : null,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
        bloodType: formData.bloodType,
        dietaryPreferences: formData.dietaryPreferences
      }
    });
  };

  const toggleDiet = (diet: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(diet)
        ? prev.dietaryPreferences.filter(d => d !== diet)
        : [...prev.dietaryPreferences, diet]
    }));
  };

  const diets = ["vegan", "vegetarian", "keto", "paleo", "gluten_free", "dairy_free"];

  return (
    <div className="pb-24 max-w-md mx-auto">
      <Header title="Nutrition Profile" showSettings />
      
      <div className="px-4 py-6 space-y-8">
        {/* Basic Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">Basic Info</h2>
          </div>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Age</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 30" 
                    value={formData.age}
                    onChange={e => setFormData(f => ({...f, age: e.target.value}))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Weight (kg)</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 70" 
                    value={formData.weightKg}
                    onChange={e => setFormData(f => ({...f, weightKg: e.target.value}))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Height (cm)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 175" 
                  value={formData.heightCm}
                  onChange={e => setFormData(f => ({...f, heightCm: e.target.value}))}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Biology */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-5 h-5 text-red-400" />
            <h2 className="font-display font-semibold text-lg">Biology</h2>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Blood Type</label>
                <select 
                  className="flex h-12 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:border-primary"
                  value={formData.bloodType}
                  onChange={e => setFormData(f => ({...f, bloodType: e.target.value as any}))}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">Used to tailor specific nutrient recommendations.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dietary Prefs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="font-display font-semibold text-lg">Dietary Preferences</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {diets.map(diet => {
              const isActive = formData.dietaryPreferences.includes(diet);
              return (
                <button
                  key={diet}
                  onClick={() => toggleDiet(diet)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-1.5
                    ${isActive 
                      ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'}`}
                >
                  {isActive && <Check className="w-3.5 h-3.5" />}
                  {diet.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </section>

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
