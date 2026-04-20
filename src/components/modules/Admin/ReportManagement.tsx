"use client";

import { motion } from "motion/react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

import { AlertTriangleIcon, CheckIcon, EyeIcon, MoreHorizontalIcon, XIcon } from "lucide-react";

import {
  dismissReport,
  getAllReports,
  IReportResponse,
  resolveReport,
} from "@/services/Admin/report.service";

interface ReportManagementProps {
  initialQueryString: string;
}

const ReportManagement = ({ initialQueryString }: ReportManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const statusFilter = searchParams.get("status") || "ALL";

  const [selectedReport, setSelectedReport] = useState<IReportResponse | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const queryParams = new URLSearchParams(initialQueryString);
  if (page) queryParams.set("page", String(page));
  if (statusFilter && statusFilter !== "ALL")
    queryParams.set("status", statusFilter);
  else if (statusFilter === "ALL") queryParams.delete("status");

  const {
    data: reportsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-reports", queryParams.toString()],
    queryFn: () => getAllReports(queryParams.toString()),
  });

  const resolveMutation = useMutation({
    mutationFn: ({
      reportId,
      resolution,
    }: {
      reportId: string;
      resolution: string;
    }) => resolveReport(reportId, resolution),
    onSuccess: (data) => {
      if (data) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error("Failed to resolve report");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const dismissMutation = useMutation({
    mutationFn: (reportId: string) => dismissReport(reportId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/admin/dashboard/report-management?${params.toString()}`);
  };

  const handleStatusFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value !== "ALL") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/admin/dashboard/report-management?${params.toString()}`);
  };

  const handleViewDetails = (report: IReportResponse) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleResolve = (report: IReportResponse) => {
    Swal.fire({
      title: "Resolve Report",
      input: "text",
      inputLabel: "Resolution Summary",
      inputPlaceholder: "E.g. Content removed and user warned...",
      showCancelButton: true,
      confirmButtonText: "Resolve",
      confirmButtonColor: "#10b981", // green-500
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        resolveMutation.mutate({
          reportId: report.id,
          resolution: result.value,
        });
        if (isDetailsOpen && selectedReport?.id === report.id)
          setIsDetailsOpen(false);
      }
    });
  };

  const handleDismiss = (report: IReportResponse) => {
    Swal.fire({
      title: "Dismiss Report?",
      text: "Are you sure you want to dismiss this report? No action will be taken.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Dismiss",
      confirmButtonColor: "#f59e0b", // amber-500
    }).then((result) => {
      if (result.isConfirmed) {
        dismissMutation.mutate(report.id);
        if (isDetailsOpen && selectedReport?.id === report.id)
          setIsDetailsOpen(false);
      }
    });
  };

  const reports = reportsData?.data || [];
  const meta = reportsData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <AlertTriangleIcon className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-600/20 text-yellow-400 ring-1 ring-yellow-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
             <span className="h-1 w-1 rounded-full bg-yellow-400 animate-pulse" />
             Pending
          </Badge>
        );
      case "RESOLVED":
        return (
          <Badge className="bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
             <span className="h-1 w-1 rounded-full bg-emerald-400" />
             Resolved
          </Badge>
        );
      case "DISMISSED":
        return (
          <Badge className="bg-neutral-600/20 text-neutral-400 ring-1 ring-neutral-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest w-fit">
            Dismissed
          </Badge>
        );
      default:
        return <Badge className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest w-fit">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen space-y-8 p-6 text-white lg:p-10">
      {/* Cinematic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl text-red-600" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              Report Intelligence
            </h1>
            <p className="text-neutral-500 font-medium tracking-wide">
              Monitor and neutralize flagged community transmissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[180px] border-white/5 bg-white/5 text-white focus:border-red-600/40 focus:ring-0">
                <SelectValue placeholder="System State" />
              </SelectTrigger>
              <SelectContent className="border-white/5 bg-black/90 text-white backdrop-blur-xl">
                <SelectItem value="ALL" className="focus:bg-red-600/20 focus:text-red-400">All Transmissions</SelectItem>
                <SelectItem value="PENDING" className="focus:bg-yellow-600/20 focus:text-yellow-400">Pending Review</SelectItem>
                <SelectItem value="RESOLVED" className="focus:bg-emerald-600/20 focus:text-emerald-400">Resolved</SelectItem>
                <SelectItem value="DISMISSED" className="focus:bg-neutral-600/20 focus:text-neutral-400">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Reporter</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Target Vector</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Flag Detail</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Operational Status</TableHead>
              <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-neutral-500 font-bold uppercase tracking-widest text-xs"
                >
                  No anomalous transmissions detected
                </TableCell>
              </TableRow>
            ) : (
              reports?.map((report: IReportResponse) => (
                <TableRow key={report.id} className="border-white/5 transition-colors hover:bg-white/5">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{report.user.name}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
                        {report.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                       {report.targetType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {report.reason.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 rounded-lg bg-white/5 p-0 text-neutral-400 transition-colors hover:bg-red-600/20 hover:text-red-600">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 border-white/5 bg-black/90 p-1 text-white backdrop-blur-xl"
                      >
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-red-600/20 hover:text-red-600"
                          onClick={() => handleViewDetails(report)}
                        >
                          <EyeIcon className="size-4" />
                          Target Console
                        </DropdownMenuItem>
                        {report.status === "PENDING" && (
                          <>
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-500"
                              onClick={() => handleResolve(report)}
                            >
                              <CheckIcon className="size-4" />
                              Execute Resolution
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-neutral-600/20 text-neutral-400 hover:text-neutral-300"
                              onClick={() => handleDismiss(report)}
                            >
                              <XIcon className="size-4" />
                              Dismiss Flag
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-white/5">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              Logs
            </p>
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page - 1);
                    }}
                    className={`rounded-xl border-white/5 bg-white/5 text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 ${
                      meta.page <= 1
                        ? "pointer-events-none opacity-20"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                         href="#"
                         onClick={(e) => {
                           e.preventDefault();
                           handlePageChange(pageNum);
                         }}
                         isActive={meta.page === pageNum}
                         className={`rounded-xl transition-all ${
                           meta.page === pageNum
                             ? "bg-red-600 text-white hover:bg-red-700 border-none"
                             : "bg-white/5 text-neutral-400 hover:bg-red-600/10 hover:text-red-600 border-white/5"
                         }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page + 1);
                    }}
                    className={`rounded-xl border-white/5 bg-white/5 text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 ${
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-20"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Target Logistics
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium tracking-wide">
              Detailed intelligence on the flagged transmission.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Reporter Info */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Operator Origin</h4>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                  <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Name:</div>
                  <div className="font-bold">{selectedReport.user.name}</div>
                  <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Transmission IP:</div>
                  <div className="font-bold text-neutral-300">{selectedReport.user.email}</div>
                  <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Logged At:</div>
                  <div className="font-bold text-neutral-300">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Target Content */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                  Target Vector: <span className="text-blue-400">{selectedReport.targetType}</span>
                </h4>
                <div className="mt-2 rounded-xl p-4 bg-black/40 border border-white/5 relative">
                   <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50 rounded-l-xl" />
                  <p className="font-black text-[10px] uppercase tracking-widest mb-2 text-neutral-500">
                    Author Origin:{" "}
                    <span className="text-white">
                    {selectedReport.review?.user.name ||
                      selectedReport.comment?.user.name ||
                      "Unknown"}
                    </span>
                  </p>
                  <p className="text-neutral-300 font-medium italic">
                    &quot;{selectedReport.targetType === "REVIEW"
                      ? selectedReport.review?.content
                      : selectedReport.comment?.content}&quot;
                  </p>
                </div>
              </div>

              {/* Report Data */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Flag Intelligence</h4>
                <div className="text-sm mt-2">
                  <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                    Primary Protocol:
                  </span>
                  <span className="font-bold text-red-400/80 uppercase">
                    {selectedReport.reason.replace(/_/g, " ")}
                  </span>
                </div>
                {selectedReport.description && (
                  <div className="text-sm mt-4">
                    <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                      Secondary Reconnaissance:
                    </span>
                    <div className="rounded-xl bg-black/40 p-4 font-medium text-neutral-300 border border-white/5">
                      {selectedReport.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Operational Log</h4>
                <div className="text-sm flex items-center gap-4 mt-2 mb-4">
                  <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                    Current State:
                  </span>
                  {getStatusBadge(selectedReport.status)}
                </div>

                {selectedReport.status !== "PENDING" && (
                  <div className="space-y-4 rounded-xl bg-black/40 p-4 border border-white/5">
                    <div>
                      <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                        Execution Timestamp:
                      </span>{" "}
                      <span className="font-bold text-neutral-300">
                      {selectedReport.resolvedAt
                        ? new Date(selectedReport.resolvedAt).toLocaleString()
                        : "N/A"}
                      </span>
                    </div>
                    {selectedReport.resolution && (
                      <div>
                        <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                          After Action Report:
                        </span>{" "}
                        <span className="font-bold text-white">
                        {selectedReport.resolution}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedReport.status === "PENDING" && (
                <div className="flex gap-4 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDismiss(selectedReport)}
                    className="border-white/10 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    Dismiss Flag
                  </Button>
                  <Button
                    onClick={() => handleResolve(selectedReport)}
                    className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/20"
                  >
                    Execute Resolution
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportManagement;
