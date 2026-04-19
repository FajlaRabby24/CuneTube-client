"use client";

import { motion } from "motion/react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  Film,
  InfoIcon,
  MailIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";

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
  getAllPayments,
  IPaymentResponse,
} from "@/services/Admin/payment.service";

interface PaymentManagementProps {
  initialQueryString: string;
}


const PaymentManagement = ({ initialQueryString }: PaymentManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";
  const status = searchParams.get("status") || "ALL";
  const plan = searchParams.get("plan") || "ALL";

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedPayment, setSelectedPayment] =
    useState<IPaymentResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) queryParams.set("searchTerm", debouncedSearch);
  if (status !== "ALL") queryParams.set("status", status);
  if (plan !== "ALL") queryParams.set("plan", plan);
  queryParams.set("page", String(page));

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["admin-payments", page, debouncedSearch, status, plan],
    queryFn: () => getAllPayments(queryParams.toString()),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", String(newPage));
    router.push(`/admin/dashboard/payment-management?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(queryParams.toString());

    params.set(key, value);
    if (value === "ALL") {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/admin/dashboard/payment-management?${params.toString()}`);
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

  const handleViewDetails = (payment: IPaymentResponse) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <Film className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen space-y-8 p-6 text-white lg:p-10">
        {/* Cinematic Header */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl text-red-600" />
          <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                Payment Management
              </h1>
              <p className="text-neutral-500">Monitor all transactions and subscription parameters.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
               <div className="relative w-full sm:w-72">
                 <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
                 <input
                   placeholder="Search transactions..."
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.target.value)}
                   className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 pl-9 text-sm text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:outline-none focus:ring-0"
                 />
               </div>
            </div>
          </div>

          {/* Tactical Filters */}
          <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
             <Select
               value={status}
               onValueChange={(val) => handleFilterChange("status", val)}
             >
               <SelectTrigger className="border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:bg-white/10">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent className="border-white/5 bg-black/90 text-white backdrop-blur-xl">
                 <SelectItem value="ALL">All Statuses</SelectItem>
                 <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
                 <SelectItem value="PENDING">Pending</SelectItem>
                 <SelectItem value="FAILED">Failed</SelectItem>
               </SelectContent>
             </Select>

             <Select
               value={plan}
               onValueChange={(val) => handleFilterChange("plan", val)}
             >
               <SelectTrigger className="border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:bg-white/10">
                 <SelectValue placeholder="Sub Plan" />
               </SelectTrigger>
               <SelectContent className="border-white/5 bg-black/90 text-white backdrop-blur-xl">
                 <SelectItem value="ALL">All Plans</SelectItem>
                 <SelectItem value="MONTHLY">Monthly</SelectItem>
                 <SelectItem value="YEARLY">Yearly</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </motion.div>

        {/* Table Container */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="rounded-3xl border border-white/5 bg-black/40 p-1 backdrop-blur-xl"
        >
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent transition-colors">
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">User</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Amount</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Plan</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Date</TableHead>
                <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="py-20 text-center"
                  >
                     <div className="flex flex-col items-center gap-2">
                       <CreditCardIcon className="size-10 text-neutral-800" />
                       <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">No transactions found in logs</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment: IPaymentResponse) => (
                  <TableRow key={payment.id} className="border-white/5 transition-colors hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10 shadow-lg">
                          {payment.user?.image ? (
                            <Image
                              src={payment.user.image}
                              alt={payment.user.name}
                              width={40}
                              height={40}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-sm font-black text-red-600">
                              {payment.user?.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-tight">{payment.user?.name}</p>
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">
                            {payment.user?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black italic text-red-600 tracking-tighter">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.plan ? (
                        <Badge
                          className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-none ${
                            payment.plan === "YEARLY" 
                              ? "bg-purple-600/20 text-purple-400 ring-1 ring-purple-600/40" 
                              : "bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40"
                          }`}
                        >
                          {payment.plan}
                        </Badge>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex w-fit items-center gap-1.5 ${
                          payment.status === "SUCCEEDED"
                            ? "bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40"
                            : payment.status === "PENDING"
                              ? "bg-amber-600/20 text-amber-400 ring-1 ring-amber-600/40"
                              : "bg-red-600/20 text-red-400 ring-1 ring-red-600/40"
                        }`}
                      >
                        {payment.status === "SUCCEEDED" && (
                          <CheckCircle2Icon className="size-3" />
                        )}
                        {payment.status === "PENDING" && (
                          <ClockIcon className="size-3" />
                        )}
                        {payment.status === "FAILED" && (
                          <XCircleIcon className="size-3" />
                        )}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-neutral-500 tracking-tight">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        className="size-8 rounded-lg bg-white/5 p-0 text-neutral-400 transition-colors hover:bg-red-600/20 hover:text-red-600"
                        onClick={() => handleViewDetails(payment)}
                      >
                        <InfoIcon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              Transactions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
                className="rounded-xl border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 disabled:opacity-20"
              >
                <ChevronLeftIcon className="mr-1 size-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded-xl text-xs font-bold transition-all ${
                      meta.page === pageNum
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white/5 text-neutral-400 hover:bg-red-600/10 hover:text-red-600"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="rounded-xl border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 disabled:opacity-20"
              >
                Next
                <ChevronRightIcon className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Transaction Console
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium">
              Detailed transmission logs for ID: {selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              {/* Status Header Block */}
              <div className="flex items-center justify-between rounded-3xl bg-white/5 p-6 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Total Flux</p>
                    <p className="text-3xl font-black italic text-red-600 tracking-tighter">
                       {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                    </p>
                 </div>
                 <Badge
                    className={`rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-widest ${
                      selectedPayment.status === "SUCCEEDED"
                        ? "bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40"
                        : selectedPayment.status === "PENDING"
                          ? "bg-amber-600/20 text-amber-400 ring-1 ring-amber-600/40"
                          : "bg-red-600/20 text-red-400 ring-1 ring-red-600/40"
                    }`}
                  >
                    {selectedPayment.status}
                  </Badge>
              </div>

              {/* Data Grid */}
              <div className="grid gap-4">
                 {[
                   { label: "Transmission Intel", icon: CreditCardIcon, items: [
                     { key: "Subscription tier", val: selectedPayment.plan || "One-Time Access", icon: ShieldIcon },
                     { key: "Sync Timestamp", val: new Date(selectedPayment.createdAt).toLocaleString(), icon: ClockIcon },
                   ]},
                   { label: "User Credentials", icon: UserIcon, items: [
                     { key: "Operator Name", val: selectedPayment.user?.name, icon: UserIcon },
                     { key: "Comm Link", val: selectedPayment.user?.email, icon: MailIcon },
                   ]},
                   { label: "Stripe Uplink", icon: CheckCircle2Icon, items: [
                     { key: "Payment Intent ID", val: selectedPayment.stripePaymentIntentId, icon: ShieldIcon, mono: true },
                     { key: "Invoice ID", val: selectedPayment.stripeInvoiceId, icon: FileTextIcon, mono: true },
                   ]}
                 ].map((section: { label: string; icon: any; items: { key: string; val: any; icon: any; mono?: boolean }[] }) => (
                   <div key={section.label} className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]">
                     <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-red-600">
                        <section.icon className="size-3" /> {section.label}
                     </h4>
                     <div className="grid gap-4">
                        {section.items.map((item) => (
                          item.val && (
                            <div key={item.key} className="flex items-start gap-3">
                              <div className="mt-0.5 rounded-lg bg-white/5 p-1.5 ring-1 ring-white/5 group-hover:bg-red-600/10 group-hover:ring-red-600/20">
                                <item.icon className="size-3.5 text-neutral-500 group-hover:text-red-600" />
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-tighter">{item.key}</p>
                                <p className={`text-sm font-bold text-neutral-300 group-hover:text-white transition-colors truncate ${item.mono ? "font-mono text-[10px]" : ""}`}>
                                   {item.val}
                                </p>
                              </div>
                            </div>
                          )
                        ))}
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentManagement;
