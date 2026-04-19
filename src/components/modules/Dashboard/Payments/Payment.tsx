"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Info,
  Receipt,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getUserPayments,
  IPayment,
} from "@/services/Dashboard/payment.service";

interface PaymentsProps {
  initialQueryString: string;
}

const statusConfig = {
  SUCCEEDED: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    icon: CheckCircle2,
    border: "border-green-500/20",
  },
  PENDING: {
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    icon: Clock,
    border: "border-amber-500/20",
  },
  FAILED: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    icon: XCircle,
    border: "border-red-500/20",
  },
};

const Payments = ({ initialQueryString }: PaymentsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "ALL";
  const plan = searchParams.get("plan") || "ALL";

  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Sync logic with page.tsx prefetch
  const queryParams = new URLSearchParams();
  if (status !== "ALL") queryParams.set("status", status);
  if (plan !== "ALL") queryParams.set("plan", plan);
  queryParams.set("page", String(page));

  const currentQueryString = queryParams.toString();

  const { data: paymentsData, isLoading } = useQuery({
    // IMPORTANT: Aligning key with prefetchQuery in page.tsx
    // The key must match exactly for initial data to show without a refetch gap
    queryKey: ["user-payments", currentQueryString || initialQueryString],
    queryFn: () => getUserPayments(currentQueryString || initialQueryString),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(currentQueryString);
    params.set("page", String(newPage));
    router.push(`/dashboard/payments?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(currentQueryString);
    params.set(key, value);
    params.set("page", "1");
    if (value === "ALL") {
      params.delete(key);
    }
    router.push(`/dashboard/payments?${params.toString()}`);
  };

  const payments = paymentsData?.data || [];
  const meta = paymentsData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (isLoading && !paymentsData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600/5">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/10" />
          <CreditCard className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Billing Hero */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Receipt className="h-32 w-32" />
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase mb-2">
            Member Billing Portal
          </p>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
                Payment History
              </h1>
              <p className="mt-2 max-w-md text-sm text-neutral-500">
                Securely manage your cinematic subscriptions and track your
                platform investment.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                  Active Tier
                </p>
                <p className="text-xl font-black text-white italic transition-all hover:text-red-500 cursor-default">
                  PREMIERE MEMBER
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                  Billing Cycle
                </p>
                <p className="text-xl font-black text-white italic">MONTHLY</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col justify-center gap-4 rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
              Next Renewal
            </p>
            <p className="text-2xl font-black text-white italic">
              MAY 15, 2026
            </p>
          </div>
          <Button className="w-full bg-white/5 font-black uppercase tracking-widest text-[10px] italic hover:bg-white/10 border-white/5">
            Manage Securely
          </Button>
        </motion.div>
      </div>

      <div className="space-y-6 px-4">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex flex-wrap gap-3">
            <Select
              value={status}
              onValueChange={(val) => handleFilterChange("status", val)}
            >
              <SelectTrigger className="w-[160px] rounded-xl border-white/5 bg-black/20 text-[10px] font-black tracking-widest uppercase italic">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-white/5 bg-black/90 backdrop-blur-xl">
                <SelectItem
                  value="ALL"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  value="SUCCEEDED"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Succeeded
                </SelectItem>
                <SelectItem
                  value="PENDING"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="FAILED"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Failed
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={plan}
              onValueChange={(val) => handleFilterChange("plan", val)}
            >
              <SelectTrigger className="w-[160px] rounded-xl border-white/5 bg-black/20 text-[10px] font-black tracking-widest uppercase italic">
                <SelectValue placeholder="Billing Plan" />
              </SelectTrigger>
              <SelectContent className="border-white/5 bg-black/90 backdrop-blur-xl">
                <SelectItem
                  value="ALL"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  All Plans
                </SelectItem>
                <SelectItem
                  value="MONTHLY"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Monthly
                </SelectItem>
                <SelectItem
                  value="YEARLY"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase italic">
            Records Detected: {meta.total}
          </p>
        </div>

        {/* Responsive Transaction History Console */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5">
                  <TableHead className="py-5 text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Secure Hash
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Plan
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    State
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Authorization
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <AlertCircle className="h-10 w-10 mb-2" />
                        <p className="text-xs font-black italic tracking-widest uppercase">
                          No Transactional Flows Found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {payments.map((payment: IPayment, i: number) => {
                      const status =
                        statusConfig[
                          payment.status as keyof typeof statusConfig
                        ] || statusConfig.PENDING;
                      return (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group border-white/5 hover:bg-white/[0.02] cursor-default"
                        >
                          <TableCell className="py-4 font-mono text-[10px] text-neutral-600 transition-colors group-hover:text-neutral-400 px-6">
                            {payment.id.slice(0, 12)}...
                          </TableCell>
                          <TableCell className="px-6">
                            <span className="text-sm font-black text-white italic group-hover:text-red-500 transition-colors">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                          </TableCell>
                          <TableCell className="px-6">
                            {payment.plan ? (
                              <Badge
                                variant="outline"
                                className="rounded-lg border-white/10 bg-white/5 px-2 py-0 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
                              >
                                {payment.plan}
                              </Badge>
                            ) : (
                              <span className="text-[10px] font-bold text-neutral-700">
                                STD
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="px-6">
                            <div
                              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 border ${status.border} ${status.bg} ${status.color}`}
                            >
                              <status.icon className="h-3 w-3" />
                              <span className="text-[9px] font-black tracking-tight uppercase">
                                {payment.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[10px] font-bold text-neutral-500 italic px-6">
                            {new Date(payment.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsDetailsOpen(true);
                              }}
                              className="h-8 w-8 rounded-xl bg-white/5 transition-all hover:bg-red-600 hover:text-white"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Cinematic Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 pb-8">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest italic">
              Console Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
                className="rounded-xl border-white/5 bg-black/40 px-4 font-black uppercase tracking-widest text-[9px] italic hover:bg-red-600 hover:text-white"
              >
                <ChevronLeft className="mr-1 h-3 w-3" />
                PREW
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="rounded-xl border-white/5 bg-black/40 px-4 font-black uppercase tracking-widest text-[9px] italic hover:bg-red-600 hover:text-white"
              >
                NEXT
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Receipt Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md border-white/10 bg-neutral-950 p-0 text-white shadow-2xl overflow-hidden rounded-3xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-red-600/20 to-black p-8">
            {/* Decorative Receipt Head */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CreditCard className="h-32 w-32" />
            </div>

            <DialogHeader className="relative z-10 text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10">
                <Receipt className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                Transaction Receipt
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black tracking-widest text-neutral-500 uppercase italic">
                AUTHORIZATION NO: {selectedPayment?.id.slice(0, 16)}
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedPayment && (
            <div className="p-8 space-y-8 animate-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-end justify-between border-b border-white/5 pb-6">
                <div>
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">
                    Total Authorized
                  </p>
                  <p className="text-4xl font-black italic tracking-tight text-white uppercase">
                    {formatCurrency(
                      selectedPayment.amount,
                      selectedPayment.currency,
                    )}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest ${statusConfig[selectedPayment.status as keyof typeof statusConfig]?.bg} ${statusConfig[selectedPayment.status as keyof typeof statusConfig]?.color} border ${statusConfig[selectedPayment.status as keyof typeof statusConfig]?.border}`}
                >
                  {selectedPayment.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                    Subscription Tier
                  </p>
                  <p className="text-sm font-bold text-neutral-300">
                    {selectedPayment.plan || "Standard Media Access"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                    System Time
                  </p>
                  <p className="text-sm font-bold text-neutral-300">
                    {new Date(selectedPayment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="col-span-2 space-y-3">
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                    Network Reference
                  </p>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 font-mono text-[9px] text-neutral-500 break-all leading-relaxed">
                    {selectedPayment.stripePaymentIntentId}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-white text-black hover:bg-neutral-200 transition-colors rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11">
                  <Download className="mr-2 h-4 w-4" /> Download Receipt
                </Button>
                <Button
                  variant="outline"
                  className="border-white/5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11"
                >
                  <ArrowUpRight className="h-4 w-4" /> View in Stripe
                </Button>
              </div>

              <p className="text-center text-[8px] font-black text-neutral-800 uppercase tracking-[0.2em] pt-4 italic">
                Secure Encrypted Transmission • CineTube V2.0
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
