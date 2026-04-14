"use client";

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

import { CheckIcon, EyeIcon, MoreHorizontalIcon, XIcon } from "lucide-react";

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
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/20 text-yellow-600"
          >
            Pending
          </Badge>
        );
      case "RESOLVED":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "DISMISSED":
        return <Badge variant="outline">Dismissed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-4 p-3 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Report Management</h1>
            <p className="text-sm text-muted-foreground">
              Review and act on user reports for reviews and comments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Reports</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="DISMISSED">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reporter</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports?.map((report: IReportResponse) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{report.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {report.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.targetType}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {report.reason.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 space-y-1"
                      >
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(report)}
                        >
                          <EyeIcon className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>
                        {report.status === "PENDING" && (
                          <>
                            <DropdownMenuItem
                              className="text-green-600 cursor-pointer"
                              onClick={() => handleResolve(report)}
                            >
                              <CheckIcon className="mr-2 size-4" />
                              Resolve Target
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-amber-600 cursor-pointer"
                              onClick={() => handleDismiss(report)}
                            >
                              <XIcon className="mr-2 size-4" />
                              Dismiss Report
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              reports
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page - 1);
                    }}
                    className={
                      meta.page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
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
                    className={
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Detailed information about the report.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Reporter Info */}
              <div className="grid gap-2 border rounded-md p-4 bg-muted/20">
                <h4 className="font-semibold text-sm">Reporter Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Name:</div>
                  <div>{selectedReport.user.name}</div>
                  <div className="font-medium">Email:</div>
                  <div>{selectedReport.user.email}</div>
                  <div className="font-medium">Reported At:</div>
                  <div>
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Target Content */}
              <div className="grid gap-2 border rounded-md p-4">
                <h4 className="font-semibold text-sm">
                  Reported target: {selectedReport.targetType}
                </h4>
                <div className="p-3 bg-muted/50 rounded-md text-sm border">
                  <p className="font-medium text-xs mb-1 text-muted-foreground">
                    Original Content Author:{" "}
                    {selectedReport.review?.user.name ||
                      selectedReport.comment?.user.name ||
                      "Unknown"}{" "}
                  </p>
                  <p>
                    {selectedReport.targetType === "REVIEW"
                      ? selectedReport.review?.content
                      : selectedReport.comment?.content}
                  </p>
                </div>
              </div>

              {/* Report Data */}
              <div className="grid gap-2 border rounded-md p-4">
                <h4 className="font-semibold text-sm">Report Reason</h4>
                <div className="text-sm">
                  <span className="font-medium inline-block min-w-24">
                    Reason:
                  </span>
                  {selectedReport.reason.replace(/_/g, " ")}
                </div>
                {selectedReport.description && (
                  <div className="text-sm mt-2">
                    <span className="font-medium block mb-1">
                      Additional User Description:
                    </span>
                    <div className="bg-muted/50 p-2 rounded whitespace-pre-wrap">
                      {selectedReport.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="grid gap-2 border rounded-md p-4">
                <h4 className="font-semibold text-sm">Status Information</h4>
                <div className="text-sm flex items-center gap-2 mb-2">
                  <span className="font-medium inline-block min-w-24">
                    Current state:
                  </span>
                  {getStatusBadge(selectedReport.status)}
                </div>

                {selectedReport.status !== "PENDING" && (
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium inline-block min-w-24">
                        Resolved At:
                      </span>{" "}
                      {selectedReport.resolvedAt
                        ? new Date(selectedReport.resolvedAt).toLocaleString()
                        : "N/A"}
                    </div>
                    {selectedReport.resolution && (
                      <div>
                        <span className="font-medium inline-block min-w-24">
                          Resolution:
                        </span>{" "}
                        {selectedReport.resolution}
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
                  >
                    Dismiss Report
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleResolve(selectedReport)}
                  >
                    Resolve & Take Action
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportManagement;
