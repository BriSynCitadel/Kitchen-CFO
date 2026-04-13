import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Terms() {
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
          <h1 className="font-semibold text-base">Terms of Service</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 pb-16 space-y-6 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground">Last updated: April 13, 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By using Kitchen CFO you agree to these terms. If you do not agree, do not use the app.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Not Medical Advice</h2>
          <p className="text-muted-foreground">
            Kitchen CFO provides general nutritional information based on data you voluntarily enter. Nothing in this app constitutes medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare professional with any questions you have regarding a medical condition.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Your Data</h2>
          <p className="text-muted-foreground">
            You own your health data. You voluntarily provide it to receive personalized recommendations. You may delete it at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">User Responsibilities</h2>
          <p className="text-muted-foreground">
            You are responsible for the accuracy of the information you enter. Kitchen CFO recommendations are only as accurate as the data you provide.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            BriSyn Citadel LLC is not liable for any health decisions made based on information provided by Kitchen CFO.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-foreground text-base">Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these terms at any time. Continued use of the app constitutes acceptance of updated terms.
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
