"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getUserInfo } from "@/services/Auth/getMe.service";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  getUserSubscription,
  ISubscriptionResponse,
} from "@/services/Subscription/subscription.service";
import { useEffect, useState } from "react";

import { getAllPricingPlans } from "@/services/Pricing/pricing.service";
import { useQuery } from "@tanstack/react-query";

const PricingSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [subscription, setSubscription] =
    useState<ISubscriptionResponse | null>(null);

  const { data: fetchedPlans, isLoading } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: getAllPricingPlans,
  });

  useEffect(() => {
    const fetchSub = async () => {
      const sub = await getUserSubscription();
      setSubscription(sub);
    };
    fetchSub();
  }, []);

  const handleSubscribe = async (planKey: string) => {
    try {
      setLoadingPlan(planKey);
      const user = await getUserInfo();

      if (!user) {
        toast.error("Please login to subscribe to a plan");
        router.push(`/login?redirectPath=${pathname}`);
        return;
      }

      // If user is already on this exact plan
      if (subscription?.plan === planKey && subscription?.status === "ACTIVE") {
        toast.info("You are already on this plan!");
        return;
      }

      // If user has ANY paid plan and wants to manage/change
      if (subscription && subscription.plan !== "FREE") {
        toast.loading("Opening management portal...", { id: "portal" });
        const res = await createCustomerPortalSession();
        if (res?.success && res?.data?.url) {
          window.location.href = res.data.url;
          return;
        } else {
          toast.error("Failed to open management portal", { id: "portal" });
          return;
        }
      }

      if (planKey === "FREE") {
        toast.success("You are already on the Free plan!");
        return;
      }

      toast.loading("Preparing checkout...", { id: "checkout" });
      const res = await createCheckoutSession(planKey);

      if (res?.success && res?.data?.paymentUrl) {
        toast.success("Redirecting to checkout...", { id: "checkout" });
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error(res?.message || "Failed to create checkout session", {
          id: "checkout",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("An error occurred. Please try again.", { id: "checkout" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "FREE":
        return "bg-slate-800";
      case "MONTHLY":
        return "bg-primary";
      case "YEARLY":
        return "bg-blue-600";
      default:
        return "bg-slate-800";
    }
  };

  return (
    <section className="w-full bg-[#020617] py-24 relative overflow-hidden  flex items-center">
      {/* Banner-Style Vertical Gradient Bars */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-full overflow-hidden pointer-events-none select-none">
        <div className="flex h-full items-end justify-center w-full">
          {Array.from({ length: 20 }).map((_, index) => {
            // Replicate the height calculation from the banner
            const total = 20;
            const position = index / (total - 1);
            const maxHeight = 100;
            const minHeight = 40;
            const center = 0.5;
            const distanceFromCenter = Math.abs(position - center);
            const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);
            const height =
              minHeight + (maxHeight - minHeight) * heightPercentage;

            return (
              <div
                key={index}
                style={{
                  flex: "1 0 calc(100% / 20)",
                  maxWidth: "calc(100% / 20)",
                  height: "100%",
                  background:
                    "linear-gradient(to top, rgba(229, 9, 20, 0.35), transparent)",
                  transform: `scaleY(${height / 100})`,
                  transformOrigin: "bottom",
                  transition: "transform 0.5s ease-in-out",
                  animation: "pulseBar 3s ease-in-out infinite alternate",
                  animationDelay: `${index * 0.15}s`,
                }}
              />
            );
          })}
        </div>
        {/* Filmic Grain */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="relative inline-block">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative text-3xl font-black text-white md:text-6xl uppercase font-outfit tracking-tighter"
            >
              Choose Your <span className="text-primary italic">Adventure</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Unlock the ultimate cinematic experience with plans tailored to your
            needs.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2Icon className="size-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {fetchedPlans?.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative group rounded-[2.5rem] p-10 flex flex-col justify-between border transition-all duration-500 hover:-translate-y-2 backdrop-blur-md w-full md:w-[calc(33.333%-1.5rem)] min-w-[320px] max-w-[400px] ${
                  plan.isPopular
                    ? "bg-white/[0.08] border-primary/50 shadow-[0_0_40px_-15px_rgba(229,9,20,0.3)] scale-[1.02]"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Most Popular
                  </div>
                )}

                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white font-outfit">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white font-outfit tracking-tighter">
                        ${plan.price}
                      </span>
                      <span className="text-slate-500 font-bold uppercase text-xs">
                        {plan.plan === "YEARLY" ? "/year" : "/mo"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 group/feat"
                      >
                        <div
                          className={`p-1 rounded-full ${plan.isPopular ? "bg-white text-slate-950" : "bg-white/10 text-slate-400"}`}
                        >
                          <CheckIcon className="size-3" />
                        </div>
                        <span className="text-slate-300 text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12">
                  <Button
                    onClick={() => handleSubscribe(plan.plan)}
                    disabled={loadingPlan === plan.plan}
                    className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                      plan.isPopular
                        ? "bg-white text-slate-950 hover:bg-primary hover:text-slate-950"
                        : "bg-white/10 text-white hover:bg-white hover:text-slate-950"
                    }`}
                  >
                    {loadingPlan === plan.plan ? (
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                    ) : subscription?.plan === plan.plan &&
                      subscription?.status === "ACTIVE" ? (
                      "Current Plan"
                    ) : subscription && subscription.plan !== "FREE" ? (
                      "Manage Subscription"
                    ) : (
                      <>
                        {plan.plan === "FREE"
                          ? "Current Plan"
                          : "Start Your Journey"}{" "}
                        <ChevronRightIcon className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          Prices may vary based on your location. Cancel anytime.
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
