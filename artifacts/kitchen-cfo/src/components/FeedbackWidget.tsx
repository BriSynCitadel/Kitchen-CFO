import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [liked, setLiked] = useState("");
  const [improvements, setImprovements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpen = () => {
    setOpen(true);
    setRating(0);
    setHovered(0);
    setLiked("");
    setImprovements("");
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          liked: liked.trim() || null,
          improvements: improvements.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast({ title: "Thanks for your feedback!", description: "Your thoughts help improve Kitchen CFO." });
      setOpen(false);
    } catch {
      toast({ title: "Couldn't submit feedback", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-20 right-4 z-40 w-11 h-11 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25 flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
        aria-label="Send feedback"
      >
        <MessageSquare className="w-4.5 h-4.5" strokeWidth={2} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[22rem] mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Share Your Feedback</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">How would you rate Kitchen CFO?</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="p-0.5 transition-transform active:scale-90"
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hovered || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/25"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">What did you like?</label>
              <Textarea
                placeholder="e.g. The nutrition scanning is amazing!"
                rows={2}
                value={liked}
                onChange={(e) => setLiked(e.target.value)}
                className="resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">What would you improve?</label>
              <Textarea
                placeholder="e.g. I'd love to see meal planning…"
                rows={2}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="resize-none text-sm"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!rating || submitting}
              className="w-full"
            >
              {submitting ? "Submitting…" : "Submit Feedback"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
