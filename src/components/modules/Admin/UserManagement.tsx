"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getAllUsers,
  IGetUsersApiResponse,
  IUser,
} from "@/services/Admin/getUsers.service";
import {
  banUser,
  deleteUser,
  toggleUserActive,
  unbanUser,
} from "@/services/Admin/userActions.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BanIcon,
  MoreHorizontalIcon,
  SearchIcon,
  Trash2Icon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

const UserManagement = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const currentPage = Number(params.get("page")) || 1;
  const [page, setPage] = useState(currentPage);
  const [search, setSearch] = useState(params.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    const queryParams = new URLSearchParams(initialQueryString);
    queryParams.set("page", String(newPage));
    if (search) queryParams.set("search", search);
    router.push(`/admin/dashboard/user-management?${queryParams.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const queryParams = new URLSearchParams(initialQueryString);
    queryParams.set("page", "1");
    if (value) queryParams.set("search", value);
    router.push(`/admin/dashboard/user-management?${queryParams.toString()}`);
  };

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery<IGetUsersApiResponse | null>({
    queryKey: ["admin-users", page, debouncedSearch],
    queryFn: () => getAllUsers(new URLSearchParams(initialQueryString)),
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      banUser(userId, reason),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
  });

  const unbanMutation = useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      toggleUserActive(userId, isActive),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleBan = (user: IUser) => {
    Swal.fire({
      title: "Ban User",
      input: "text",
      inputLabel: "Reason (optional)",
      showCancelButton: true,
      confirmButtonText: "Ban",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        banMutation.mutate({ userId: user.id, reason: result.value });
      }
    });
  };

  const handleDelete = (user: IUser) => {
    Swal.fire({
      title: "Delete User",
      text: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(user.id);
      }
    });
  };

  const handleToggleActive = (user: IUser) => {
    toggleActiveMutation.mutate({ userId: user.id, isActive: !user.isActive });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const users = (usersData?.data || []).filter(
    (user) => user.role !== "admin" && user.role !== "super_admin",
  );
  const meta = usersData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="space-y-4 p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all users
          </p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md ">
        <table className="w-full border">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Verified
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: IUser) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full bg-muted">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : user.isActive ? (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    {user.bannedReason && (
                      <p className="mt-1 text-xs text-red-500">
                        {user.bannedReason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.emailVerified ? (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-500"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Quick Actions */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(user)}
                        disabled={toggleActiveMutation.isPending}
                        title={user.isActive ? "Deactivate" : "Activate"}
                      >
                        {user.isActive ? (
                          <UserXIcon className="size-4" />
                        ) : (
                          <UserCheckIcon className="size-4" />
                        )}
                      </Button>

                      {user.isBanned ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => unbanMutation.mutate(user.id)}
                          disabled={unbanMutation.isPending}
                          title="Unban"
                        >
                          <BanIcon className="size-4 text-green-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleBan(user)}
                          disabled={banMutation.isPending}
                          title="Ban"
                        >
                          <BanIcon className="size-4 text-orange-500" />
                        </Button>
                      )}

                      {/* More Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/dashboard/user-management/${user.id}`}
                            >
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/dashboard/user-management/${user.id}/edit`}
                            >
                              Edit User
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/dashboard/user-management/${user.id}/reviews`}
                            >
                              View Reviews
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2Icon className="mr-2 size-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} users
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
  );
};

export default UserManagement;
