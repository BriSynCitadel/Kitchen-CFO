import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full -ml-1"
            onClick={() => setLocation("/profile")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-base">Privacy Policy</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 pb-16 space-y-6 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground">Last updated: April 13, 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Information We Collect</h2>
          <p className="text-muted-foreground">
            When you use Kitchen CFO, you may voluntarily provide personal health information including lab results, biomarker values, food logs, and dietary preferences. This information is provided at your own discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">How We Use Your Information</h2>
          <p className="text-muted-foreground">
            Your health data is used solely to generate personalized food recommendations within the app. We do not sell, share, or transfer your personal health information to any third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">How We Store Your Information</h2>
          <p className="text-muted-foreground">
            Your data is stored securely in an encrypted database. We use industry-standard security practices to protect your information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Your Rights</h2>
          <p className="text-muted-foreground">
            You may delete your account and all associated data at any time by contacting us at{" "}
            <a href="mailto:brisyncitadel@proton.me" className="text-primary underline underline-offset-2">
              brisyncitadel@proton.me
            </a>
            . You may also request a copy of your data at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Health Disclaimer</h2>
          <p className="text-muted-foreground">
            Kitchen CFO is a wellness tool designed to help you understand the relationship between your nutrition and your biomarkers. It is not a medical device, does not provide medical advice, and is not a substitute for professional medical care. Always consult a qualified healthcare provider before making changes to your diet or health regimen.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">FTC Health Breach Notification</h2>
          <p className="text-muted-foreground">
            In the event of a data breach involving your health information, we will notify affected users promptly in accordance with the FTC Health Breach Notification Rule.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Contact</h2>
          <p className="text-muted-foreground">
            BriSyn Citadel LLC
            <br />
            <a href="mailto:brisyncitadel@proton.me" className="text-primary underline underline-offset-2">
              brisyncitadel@proton.me
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
