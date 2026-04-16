"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  CalendarIcon, 
  CheckCircle2Icon, 
  CreditCardIcon, 
  InfoIcon, 
  ShieldCheckIcon,
  AlertTriangleIcon,
  XCircleIcon,
  ArrowRightCircleIcon,
  HistoryIcon
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUserSubscriptions, cancelUserSubscription, ISubscription } from "@/services/Dashboard/subscription.service";

interface SubscriptionsProps {
  initialQueryString: string;
}

const statusColorMap = {
  ACTIVE: "bg-green-500",
  CANCELLED: "bg-red-500",
  PAST_DUE: "bg-yellow-500",
  EXPIRED: "bg-gray-500",
};

const planDetails = {
  FREE: {
    price: "$0",
    features: ["Access to free content", "Standard quality", "Limited support"],
    color: "bg-slate-500",
  },
  MONTHLY: {
    price: "$9.99/mo",
    features: ["4K Ultra HD", "Ad-free experience", "Offline downloads", "Priority support"],
    color: "bg-blue-600",
  },
  YEARLY: {
    price: "$99.99/yr",
    features: ["All Monthly features", "2 months free", "Exclusive content", "VIP support"],
    color: "bg-purple-600",
  },
};

const Subscriptions = ({ initialQueryString }: SubscriptionsProps) => {
  const queryClient = useQueryClient();

  const { data: subData, isLoading, refetch } = useQuery({
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
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate();
      }
    });
  };

  const subscription = subData?.data;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!subscription || subscription.plan === "FREE") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-outfit">My Subscription</h1>
          <p className="text-sm text-muted-foreground">Manage your plan and billing preferences</p>
        </div>

        <Card className="border-dashed bg-muted/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-6" />
            </div>
            <CardTitle>You're on the Free Plan</CardTitle>
            <CardDescription>Upgrade to unlock premium features and exclusive content</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild className="cursor-pointer">
              <a href="/pricing">Upgrade Now</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentPlan = planDetails[subscription.plan];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-outfit">My Subscription</h1>
        <p className="text-sm text-muted-foreground">View and manage your current subscription plan</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Subscription Card */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-lg">
          <div className={`h-2 ${currentPlan.color}`} />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">{subscription.plan} PASS</CardTitle>
              <CardDescription>Your current active membership</CardDescription>
            </div>
            <Badge className={`${statusColorMap[subscription.status]} text-white px-3 py-1`}>
              {subscription.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{currentPlan.price.split('/')[0]}</span>
                  <span className="text-muted-foreground">/{currentPlan.price.split('/')[1] || 'one-time'}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-xs">Features Included</p>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2Icon className="size-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4 bg-muted/30 rounded-xl p-4 border border-muted">
                 <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-xs">Billing Details</p>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="size-4" />
                        Next Billing Date
                      </div>
                      <p className="text-sm font-medium">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-muted">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CreditCardIcon className="size-4" />
                          Auto-renew
                        </div>
                        <Badge variant={subscription.cancelAtPeriodEnd ? "outline" : "secondary"}>
                          {subscription.cancelAtPeriodEnd ? "Off" : "On"}
                        </Badge>
                    </div>

                    {subscription.cancelAtPeriodEnd && (
                      <div className="rounded-lg bg-red-50 p-3 mt-4 border border-red-100 flex items-start gap-3">
                         <AlertTriangleIcon className="size-4 text-red-500 mt-0.5" />
                         <p className="text-xs text-red-700 leading-relaxed">
                            Your subscription will end on <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</strong>.
                            After this, you will be downgraded to the Free plan.
                         </p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t border-muted flex justify-between gap-4 py-4">
            {!subscription.cancelAtPeriodEnd && subscription.status === "ACTIVE" ? (
              <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200" onClick={handleCancel}>
                <XCircleIcon className="mr-2 size-4" />
                Cancel Subscription
              </Button>
            ) : (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                   <InfoIcon className="size-4" />
                   Subscription can be resumed by re-subscribing.
                </div>
            )}
            
            <Button variant="ghost" className="cursor-pointer group">
              Update Billing Info <ArrowRightCircleIcon className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>

        {/* Small Stats / Info Cards */}
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                        <HistoryIcon className="size-4" />
                        Last Payment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                   {subscription.payments[0] ? (
                     <div className="space-y-1">
                        <p className="text-2xl font-bold">${subscription.payments[0].amount}</p>
                        <p className="text-xs text-muted-foreground">on {new Date(subscription.payments[0].createdAt).toLocaleDateString()}</p>
                     </div>
                   ) : (
                     <p className="text-sm text-muted-foreground">No payment history found</p>
                   )}
                </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ShieldCheckIcon className="size-4" />
                        Premium Support
                    </CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-xs opacity-90 leading-relaxed">
                      As a {subscription.plan} member, you have access to 24/7 dedicated support.
                   </p>
                </CardContent>
                <CardFooter>
                   <Button variant="secondary" size="sm" className="w-full text-xs h-8">Contact Support</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
