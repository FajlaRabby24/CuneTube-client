"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { 
  CreditCardIcon, 
  SearchIcon, 
  UserIcon, 
  CalendarIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getAllPayments, IPayment } from "@/services/Admin/payment.service";

interface PaymentManagementProps {
  initialQueryString: string;
}

const statusColorMap = {
  SUCCEEDED: "bg-green-500",
  PENDING: "bg-yellow-500",
  FAILED: "bg-red-500",
};

const planColorMap = {
  MONTHLY: "bg-blue-500",
  YEARLY: "bg-purple-500",
};

const PaymentManagement = ({ initialQueryString }: PaymentManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";
  const status = searchParams.get("status") || "ALL";
  const plan = searchParams.get("plan") || "ALL";

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
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
    params.set("page", "1");
    router.push(`/admin/dashboard/payment-management?${params.toString()}`);
  };

  const payments = paymentsData?.data || [];
  const meta = paymentsData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const handleViewDetails = (payment: IPayment) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 p-3 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Management</h1>
            <p className="text-sm text-muted-foreground">
              Monitor all transactions and subscriptions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by user or transaction ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={status} onValueChange={(val) => handleFilterChange("status", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={plan} onValueChange={(val) => handleFilterChange("plan", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sub Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Plans</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment: IPayment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-8 overflow-hidden rounded-full bg-muted">
                          {payment.user?.image ? (
                            <Image
                              src={payment.user.image}
                              alt={payment.user.name}
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs font-medium uppercase">
                              {payment.user?.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="max-w-[150px] truncate text-sm font-medium">
                            {payment.user?.name}
                          </p>
                          <p className="max-w-[150px] truncate text-xs text-muted-foreground">
                            {payment.user?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.plan ? (
                        <Badge variant="secondary" className={planColorMap[payment.plan as keyof typeof planColorMap] + " text-white border-none"}>
                          {payment.plan}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusColorMap[payment.status as keyof typeof statusColorMap]} bg-opacity-10 text-${statusColorMap[payment.status as keyof typeof statusColorMap].split("-")[1]}-600 border-${statusColorMap[payment.status as keyof typeof statusColorMap].split("-")[1]}-200 flex w-fit items-center gap-1`}>
                        {payment.status === "SUCCEEDED" && <CheckCircle2Icon className="size-3" />}
                        {payment.status === "PENDING" && <ClockIcon className="size-3" />}
                        {payment.status === "FAILED" && <XCircleIcon className="size-3" />}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(payment)}>
                        <InfoIcon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
              >
                <ChevronLeftIcon className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
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
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCardIcon className="size-5 text-primary" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Detailed information for transaction {selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6 pt-4">
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={statusColorMap[selectedPayment.status as keyof typeof statusColorMap] + " text-white"}>
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-medium">{selectedPayment.plan || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <UserIcon className="size-4" />
                  User Information
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{selectedPayment.user?.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{selectedPayment.user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <CalendarIcon className="size-4" />
                  Stripe Identifiers
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-xs text-muted-foreground">Payment Intent ID</span>
                    <span className="font-mono text-[10px] break-all">
                      {selectedPayment.stripePaymentIntentId || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-xs text-muted-foreground">Invoice ID</span>
                    <span className="font-mono text-[10px] break-all">
                      {selectedPayment.stripeInvoiceId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground italic">
                <span>Transaction date:</span>
                <span>{new Date(selectedPayment.createdAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentManagement;
