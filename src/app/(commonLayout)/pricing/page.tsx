import PricingSection from "@/components/modules/Home/PricingSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | CineTube",
  description: "Choose the perfect plan for your cinematic journey with CineTube.",
};

const PricingPage = () => {
  return (
    <div className="min-h-screen">
      <PricingSection />
    </div>
  );
};

export default PricingPage;
