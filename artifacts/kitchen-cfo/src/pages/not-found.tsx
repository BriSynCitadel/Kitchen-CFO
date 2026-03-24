import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-8xl font-display font-bold text-primary opacity-20">404</h1>
        <h2 className="text-2xl font-bold text-foreground">Page not found</h2>
        <p className="text-muted-foreground">The kitchen is closed here. Let's get back to tracking your nutrition.</p>
        <Link href="/" className="inline-block mt-4">
          <Button size="lg" className="w-full">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
