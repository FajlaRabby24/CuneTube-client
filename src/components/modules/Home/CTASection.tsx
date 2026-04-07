"use client";

import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="w-full bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
          Join 50K+ Movie Lovers
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
          Start your movie journey today. Rate movies, write reviews, and connect with fellow cinema enthusiasts.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
