import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Camera,
  FlaskConical,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Leaf,
  Stethoscope,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";

const APP_URL = "https://app.brisyncitadel.com";

export default function Landing() {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [, setLocation] = useLocation();

  const handleTryDemo = async () => {
    try {
      await fetch("/api/demo/load", { method: "POST" });
    } catch {
      // navigate anyway — demo data will be missing but app is usable
    }
    localStorage.setItem("cfo_demo_mode", "1");
    localStorage.setItem("cfo_welcomed", "1");
    localStorage.removeItem("cfo_demo_banner_dismissed");
    setLocation("/");
  };

  useEffect(() => {
    if (qrCanvasRef.current) {
      void QRCode.toCanvas(qrCanvasRef.current, APP_URL, {
        width: 128,
        margin: 2,
        color: {
          dark: "#1a1a1a",
          light: "#ffffff",
        },
      });
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-base text-foreground">
              Kitchen CFO
            </span>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-primary pt-32 pb-20 px-5">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(134,239,172,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(20,83,45,0.55) 0%, transparent 70%)",
          }}
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
            <span className="text-white/80 text-xs font-medium tracking-wide">
              Bioindividual Nutrition
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Your body is finally
            <br className="hidden sm:block" /> being listened to.
          </h1>

          <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-8">
            The first food intelligence platform that connects your bloodwork to
            personalized nutrition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/api/login">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-xl shadow-primary/30"
              >
                Try it free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-white/30 text-white/90 text-base font-medium hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Try Demo
            </button>
          </div>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1 text-white/60 text-sm mt-4 hover:text-white/90 transition-colors"
          >
            See how it works <ChevronDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      <section className="py-20 px-5 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5 leading-tight">
            Your doctor says eat better.
            <br className="hidden sm:block" />
            <span className="text-primary"> But better for who?</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Generic nutrition advice ignores the thing that makes you{" "}
            <em>you</em> — your bloodwork, your symptoms, what's actually in
            your kitchen. Most apps count calories. None of them know that your
            Vitamin D is at 18, your ferritin is at 15, and your CRP is
            elevated. Kitchen CFO does.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              {
                stat: "72%",
                label: "of people are deficient in at least one micronutrient",
              },
              {
                stat: "0",
                label: "calorie counters that factor in your actual bloodwork",
              },
              {
                stat: "1 in 3",
                label:
                  "adults follow generic dietary advice that doesn't fit their biology",
              },
            ].map(({ stat, label }) => (
              <div
                key={stat}
                className="bg-card border border-border/60 rounded-2xl p-5 text-center"
              >
                <p className="font-display text-3xl font-bold text-primary mb-1">
                  {stat}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-5 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Simple by design
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              How it works
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-px bg-primary/20 hidden sm:block" />

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  icon: Camera,
                  title: "Scan your food",
                  description:
                    "Photograph any meal, snack, ingredient, or receipt. Vision technology instantly identifies everything — macronutrients, micronutrients, ingredients — with no manual entry.",
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
                    "Your Kitchen CFO cross-references your kitchen inventory, recent meals, and lab values to recommend exactly what you should eat next — and explains precisely why.",
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
                    <h3 className="font-display text-xl font-bold text-foreground mb-1.5">
                      {title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-5 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Real people, real results
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Loved by users
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                quote:
                  "I love the detail of the app and it helps to keep me in check.",
                initials: "S.M.",
              },
              {
                quote:
                  "Finally an app that connects what I eat to my actual bloodwork. The recommendations feel personal, not generic.",
                initials: "R.T.",
              },
            ].map(({ quote, initials }) => (
              <div
                key={initials}
                className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className="w-4 h-4 text-orange-400 fill-orange-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground text-base leading-relaxed flex-1">
                  "{quote}"
                </p>
                <p className="text-sm font-semibold text-muted-foreground">
                  — {initials}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-5 bg-primary text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">
              The difference
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Every app tracks what you ate.
              <br className="hidden sm:block" />
              Kitchen CFO tells you what to eat <em>next</em>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="font-semibold text-white/50 text-sm mb-4 uppercase tracking-wide">
                Other apps
              </p>
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
              <p className="font-semibold text-white text-sm mb-4 uppercase tracking-wide">
                Kitchen CFO
              </p>
              {[
                "Tracks 30+ micronutrients per meal via photo scan",
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
              { label: "Photo Scan", desc: "Identifies every nutrient" },
              {
                label: "Lab Integration",
                desc: "Your bloodwork shapes every recommendation",
              },
              {
                label: "Bioindividual Profile",
                desc: "Built around your unique biology",
              },
              { label: "Smart Guidance", desc: "Personal, never generic" },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="bg-white/10 rounded-xl p-3 text-center"
              >
                <p className="font-display font-bold text-white text-sm mb-0.5">
                  {label}
                </p>
                <p className="text-white/60 text-xs leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-5 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Why we built this
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              A tool I needed first
            </h2>
          </div>

          <div className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-primary/30 rounded-full" />
            <div className="pl-6 space-y-5 text-muted-foreground text-base leading-relaxed italic">
              <p>
                I'm a single dad. I can cook, but nothing fancy. And like most
                people, I already knew the food we were eating wasn't doing us
                any favors — the nutrition facts are everywhere. But knowing
                that and being able to do something about it are two different
                things.
              </p>
              <p>
                Eating healthy felt either too expensive, too complicated, or
                too generic. What works for someone else may not work for me.
                And nobody was telling me what to actually put on my plate based
                on my body.
              </p>
              <p>
                So I built a Telegram bot — my own personal chef. It tracked
                what was in my kitchen, helped me plan meals from what I already
                had, and flagged where to find the best grocery prices. It
                solved the logistics. But it still couldn't answer the deeper
                question.
              </p>
              <p className="font-semibold text-foreground not-italic">
                What should I eat for my specific body?
              </p>
              <p>
                That question led to Kitchen CFO. Not a calorie counter. A food
                intelligence system that connects your bloodwork, your kitchen,
                and your actual life — and tells you what to eat next based on
                what your body actually needs.
              </p>
              <p className="font-semibold text-foreground not-italic">
                Built by a dad who was tired of guessing. Designed so you don't
                have to.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-5 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
                For practitioners
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
                The bridge between labs and the dinner table
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nutritionists, functional medicine doctors, and integrative
                health coaches use Kitchen CFO to extend their care between
                appointments. When you order a patient's bloodwork, the results
                shouldn't sit in a portal — they should translate directly into
                what your patient puts on their plate that evening.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Kitchen CFO gives practitioners a shared language with their
                patients: not abstract lab ranges, but real food, real meals,
                real choices — grounded in the individual's biology, symptoms,
                and what's already in their kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

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
          <a href="/api/login">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-10 h-12 text-base shadow-xl shadow-primary/30"
            >
              Try it free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      <footer className="bg-background border-t border-border/40 py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-sm text-foreground">
                Kitchen CFO
              </span>
            </div>
            <a href="/api/login">
              <Button size="sm" className="h-8 px-5 text-xs font-semibold">
                Try it free <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </a>
          </div>

          <div className="flex flex-col items-center gap-2">
            <canvas
              ref={qrCanvasRef}
              className="rounded-lg shadow-sm"
              aria-label="QR code to open Kitchen CFO on your phone"
            />
            <p className="text-xs text-muted-foreground text-center">
              Scan to open Kitchen CFO on your phone.
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-md leading-relaxed">
            Kitchen CFO is not a medical device and does not provide medical
            advice. Always consult a qualified health professional.
          </p>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kitchen CFO
          </p>
        </div>
      </footer>
    </div>
  );
}
