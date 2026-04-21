"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertTriangleIcon,
  ArrowRightCircleIcon,
  Calendar,
  CheckCircle2,
  CreditCard,
  History,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cancelUserSubscription,
  getUserSubscriptions,
} from "@/services/Dashboard/subscription.service";

interface SubscriptionsProps {
  initialQueryString: string;
}

const statusConfig = {
  ACTIVE: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    icon: CheckCircle2,
    border: "border-green-500/20",
    label: "Active Membership",
  },
  CANCELLED: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    icon: AlertTriangleIcon,
    border: "border-red-500/20",
    label: "Canceled",
  },
  PAST_DUE: {
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    icon: History,
    border: "border-amber-500/20",
    label: "Past Due",
  },
  EXPIRED: {
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
    icon: Info,
    border: "border-neutral-500/20",
    label: "Expired",
  },
};

const planDetails = {
  FREE: {
    price: "$0",
    features: ["Access to free content", "Standard quality", "Limited support"],
    color: "bg-neutral-600",
    accent: "text-neutral-500",
  },
  MONTHLY: {
    price: "$9.99/mo",
    features: [
      "4K Ultra HD Streaming",
      "Ad-free Experience",
      "Offline Downloads",
      "Priority Support",
    ],
    color: "bg-blue-600",
    accent: "text-blue-500",
  },
  YEARLY: {
    price: "$99.99/yr",
    features: [
      "All Monthly Features",
      "2 Months Free Included",
      "Exclusive Premiere Content",
      "VIP Dedicated Support",
    ],
    color: "bg-red-600",
    accent: "text-red-500",
  },
};

const UserSubscriptions = ({ initialQueryString }: SubscriptionsProps) => {
  const queryClient = useQueryClient();

  const {
    data: subData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-subscriptions", initialQueryString],
    queryFn: () => getUserSubscriptions(initialQueryString),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelUserSubscription(),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Subscription cancelled successfully");
        queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to cancel subscription"),
  });

  const handleCancel = () => {
    Swal.fire({
      title: "Cancel Subscription?",
      text: "You will still have access until the end of your current billing period.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancel Membership",
      cancelButtonText: "Keep Premium",
      confirmButtonColor: "#dc2626",
      background: "#0a0a0a",
      color: "#fff",
      customClass: {
        popup: "rounded-3xl border border-white/10",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate();
      }
    });
  };

  const subscription = subData?.data;

  if (isLoading && !subData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600/5">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/10" />
          <Zap className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  if (!subscription || subscription.plan === "FREE") {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-black/40 p-6 sm:p-10 backdrop-blur-2xl text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-5">
            <Zap className="h-64 w-64" />
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-600 uppercase mb-4">
            Tier Availability
          </p>
          <div className="relative z-10 space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-600/10 text-neutral-400">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
                Free Access Mode
              </h1>
              <p className="mt-2 mx-auto max-w-md text-sm text-neutral-500">
                You are currently exploring CineTube with standard access.
                Upgrade to unlock the full cinematic spectrum.
              </p>
            </div>
            <Button
              asChild
              className="px-8 bg-white text-black hover:bg-neutral-200 transition-colors rounded-xl font-black uppercase text-[12px] tracking-widest italic h-12"
            >
              <a href="/pricing">Unlock Premium Tier</a>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentPlan = planDetails[subscription.plan] || planDetails.FREE;
  const statusTab =
    statusConfig[subscription.status as keyof typeof statusConfig] ||
    statusConfig.EXPIRED;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 overflow-x-hidden px-4 py-5">
      {/* Cinematic Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-black/40 p-6 sm:p-8 backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck className="h-40 w-40" />
        </div>
        <p className="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase mb-2">
          Member Console
        </p>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
              {subscription.plan} PASS
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 border ${statusTab.border} ${statusTab.bg} ${statusTab.color}`}
              >
                <statusTab.icon className="h-3 w-3" />
                <span className="text-[10px] font-black tracking-tight uppercase">
                  {statusTab.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center md:justify-end">
            <div className="space-y-1 text-center md:text-right">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                Next Billing
              </p>
              <p className="text-xl font-black text-white italic transition-all hover:text-red-500 cursor-default">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Tier Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl"
        >
          <div className={`h-1 w-full ${currentPlan.color}`} />
          <div className="p-5 sm:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                    Authorized Cost
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white">
                      {currentPlan.price.split("/")[0]}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-neutral-600 uppercase italic">
                      /{currentPlan.price.split("/")[1]}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                    Premium Capabilities
                  </p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {currentPlan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm font-bold text-neutral-300"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-6">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest border-b border-white/5 pb-2">
                    Billing Node Detail
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase tracking-tight">
                        <Calendar className="h-3 w-3" /> Period End
                      </div>
                      <p className="text-xs font-black text-white italic">
                        {new Date(
                          subscription.currentPeriodEnd,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase tracking-tight">
                        <CreditCard className="h-3 w-3" /> Auto-Renew
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-md px-2 py-0 text-[9px] font-black tracking-widest uppercase ${subscription.cancelAtPeriodEnd ? "border-neutral-500 text-neutral-500" : "border-green-500/30 text-green-500"}`}
                      >
                        {subscription.cancelAtPeriodEnd ? "Inactive" : "Global"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {subscription.cancelAtPeriodEnd && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3">
                    <AlertTriangleIcon className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-red-400 leading-relaxed uppercase">
                      Access terminates on{" "}
                      <span className="text-white italic">
                        {new Date(
                          subscription.currentPeriodEnd,
                        ).toLocaleDateString()}
                      </span>
                      . Tier will downgrade to Standard.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row flex-wrap gap-4 border-t border-white/5">
              {!subscription.cancelAtPeriodEnd &&
              subscription.status === "ACTIVE" ? (
                <Button
                  onClick={handleCancel}
                  className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 transition-colors rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11 px-6"
                >
                  Terminate Membership
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-black text-neutral-600 uppercase tracking-widest italic px-2">
                  <Info className="h-4 w-4" /> Resumption available via portal
                </div>
              )}
              <Button
                variant="ghost"
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-white/5 font-black uppercase tracking-widest text-[10px] italic hover:bg-white/10 border border-white/5 group"
              >
                Update Secure Billing{" "}
                <ArrowRightCircleIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform text-red-600" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Info Stack */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neutral-400">
                <History className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                Last Encryption
              </p>
            </div>
            {subscription.payments && subscription.payments[0] ? (
              <div className="space-y-1">
                <p className="text-3xl font-black text-white italic tracking-tighter">
                  ${subscription.payments[0].amount}
                </p>
                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                  Processed:{" "}
                  {new Date(
                    subscription.payments[0].createdAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-xs font-bold text-neutral-700 uppercase italic">
                Scanning history...
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-white/5 p-6 sm:p-8 backdrop-blur-2xl relative  bg-red-600"
          >
            <div className="absolute p-8 opacity-20 transition-transform group-hover:scale-110 duration-500">
              <ShieldCheck className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Secure Direct Line
              </p>
              <h2 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">
                Premiere Tier Support
              </h2>
              <p className="text-xs font-bold text-white/70 leading-relaxed max-w-[180px]">
                As a {subscription.plan} member, your requests bypass standard
                traffic. 24/7 Priority encryption.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full h-10 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest italic hover:bg-neutral-200"
              >
                Contact Encryption Team
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserSubscriptions;
