import { Link } from "wouter";
import { Camera, FlaskConical, Sparkles, Check, X, ArrowRight, Leaf, Stethoscope, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleScrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-base text-foreground">Kitchen CFO</span>
          </div>
          <Link href="/">
            <Button size="sm" className="h-8 px-4 text-xs font-semibold">
              Open App
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-primary pt-32 pb-20 px-5">
        {/* Animated orbs */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(134,239,172,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(20,83,45,0.55) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 60% 30%, hsla(142,60%,55%,0.18) 0%, transparent 65%), " +
              "radial-gradient(ellipse 35% 30% at 25% 70%, hsla(148,55%,48%,0.12) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white/80 text-xs font-medium tracking-wide">AI-Powered Bioindividual Nutrition</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Your body is finally<br className="hidden sm:block" /> being listened to.
          </h1>

          <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-8">
            The first food intelligence platform that connects your bloodwork to personalized nutrition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-xl shadow-primary/30"
              >
                Try it free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <button
              onClick={handleScrollToHowItWorks}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-white/30 text-white/90 text-base font-medium hover:bg-white/10 transition-colors"
            >
              See how it works <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 px-5 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5 leading-tight">
            Your doctor says eat better.<br className="hidden sm:block" />
            <span className="text-primary"> But better for who?</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Generic nutrition advice ignores the thing that makes you <em>you</em> — your bloodwork, your symptoms, what's actually in your kitchen. Most apps count calories. None of them know that your Vitamin D is at 18, your ferritin is at 15, and your CRP is elevated. Kitchen CFO does.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              { stat: "72%", label: "of people are deficient in at least one micronutrient" },
              { stat: "0", label: "calorie counters that factor in your actual bloodwork" },
              { stat: "1 in 3", label: "adults follow generic dietary advice that doesn't fit their biology" },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-card border border-border/60 rounded-2xl p-5 text-center">
                <p className="font-display text-3xl font-bold text-primary mb-1">{stat}</p>
                <p className="text-sm text-muted-foreground leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-5 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Simple by design</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">How it works</h2>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-primary/20 hidden sm:block" />

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  icon: Camera,
                  title: "Scan your food",
                  description:
                    "Photograph any meal, snack, ingredient, or receipt. Gemini Vision AI instantly identifies everything — macronutrients, micronutrients, ingredients — with no manual entry.",
                },
                {
                  step: "02",
                  icon: FlaskConical,
                  title: "Enter your labs",
                  description:
                    "Upload your recent bloodwork: Vitamin D, B12, ferritin, CRP, zinc, magnesium, fasting glucose. Kitchen CFO uses these to understand what your body is actually missing.",
                },
                {
                  step: "03",
                  icon: Sparkles,
                  title: "Get personalized guidance",
                  description:
                    "Your AI Chef cross-references your kitchen inventory, recent meals, and lab values to recommend exactly what you should eat next — and explains precisely why.",
                },
              ].map(({ step, icon: Icon, title, description }) => (
                <div key={step} className="flex gap-5 sm:gap-7 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 z-10 relative">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {step.slice(-1)}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1.5">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR ── */}
      <section className="py-20 px-5 bg-primary text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">The difference</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Every app tracks what you ate.<br className="hidden sm:block" />
              Kitchen CFO tells you what to eat <em>next</em>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="font-semibold text-white/50 text-sm mb-4 uppercase tracking-wide">Other apps</p>
              {[
                "Counts calories and macros",
                "Generic food database lookups",
                "No knowledge of your bloodwork",
                "One-size-fits-all meal plans",
                "Tracks what you ate yesterday",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <p className="font-semibold text-white text-sm mb-4 uppercase tracking-wide">Kitchen CFO</p>
              {[
                "Tracks 30+ micronutrients per meal via AI vision",
                "Connects your bloodwork to food choices",
                "Knows what's in your kitchen right now",
                "Recommends based on your unique biology",
                "Tells you exactly what to eat next",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 shrink-0" />
                  <span className="text-white text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Photo Scan", desc: "AI identifies every nutrient" },
              { label: "Lab Integration", desc: "Your bloodwork shapes every rec" },
              { label: "Kitchen Inventory", desc: "Recs from what you have" },
              { label: "AI Guidance", desc: "Personal, not generic" },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="font-display font-bold text-white text-sm mb-0.5">{label}</p>
                <p className="text-white/60 text-xs leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE STORY ── */}
      <section className="py-20 px-5 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Why we built this</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">A digital heirloom</h2>
          </div>

          <div className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-primary/30 rounded-full" />
            <div className="pl-6 space-y-5 text-muted-foreground text-base leading-relaxed italic">
              <p>
                My grandmother used to pick flowers from the grass, boil them in water, make teas and remedies. I thought she was crazy. She passed before I could ask her what she knew.
              </p>
              <p>
                She knew something we've forgotten — that food is medicine. That what you put in your body determines how it performs. We existed for thousands of years without doctors because we understood that.
              </p>
              <p>
                I built Kitchen CFO because I want that knowledge back. Not just for me — for anyone who's tired of being told to 'eat better' with zero guidance on what that actually means for their body, their kitchen, their life.
              </p>
              <p>
                This isn't a calorie counter. It's a food intelligence system that learns you — your bloodwork, your pantry, your health goals — and tells you what to eat next based on what you actually have and what your body actually needs.
              </p>
              <p className="font-semibold text-foreground not-italic">
                My grandmother knew. Kitchen CFO helps you know too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR PRACTITIONERS ── */}
      <section className="py-20 px-5 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">For practitioners</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
                The bridge between labs and the dinner table
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nutritionists, functional medicine doctors, and integrative health coaches use Kitchen CFO to extend their care between appointments. When you order a patient's bloodwork, the results shouldn't sit in a portal — they should translate directly into what your patient puts on their plate that evening.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Kitchen CFO gives practitioners a shared language with their patients: not abstract lab ranges, but real food, real meals, real choices — grounded in the individual's biology, symptoms, and what's already in their kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-5 bg-primary text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, hsla(142,60%,55%,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Start eating for your biology.
          </h2>
          <p className="text-white/75 text-lg mb-8">
            Free to try. No account required. Just a photo and a few minutes.
          </p>
          <Link href="/">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-10 h-12 text-base shadow-xl shadow-primary/30"
            >
              Try it free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-background border-t border-border/40 py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">Kitchen CFO</span>
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-md leading-relaxed">
            Kitchen CFO is not a medical device and does not provide medical advice. Always consult a qualified health professional before making changes to your diet or health regimen.
          </p>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kitchen CFO
          </p>
        </div>
      </footer>
    </div>
  );
}
