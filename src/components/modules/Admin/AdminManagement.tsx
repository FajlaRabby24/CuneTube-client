"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createAdmin } from "@/services/Admin/createAdmin.service";
import {
  getAdminById,
  getAllAdmins,
  IAdminListItem,
} from "@/services/Admin/getAdmins.service";

import { createAdminZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return String(error);
};

import {
  CalendarIcon,
  MailIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  UserCheckIcon,
  UserIcon,
  UserXIcon,
} from "lucide-react";

import Image from "next/image";

import { toast } from "sonner";

interface AdminManagementProps {
  initialQueryString: string;
}

const AdminManagement = ({ initialQueryString }: AdminManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("searchTerm") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) {
    queryParams.set("searchTerm", debouncedSearch);
  }
  if (page) {
    queryParams.set("page", String(page));
  }

  const { data: adminsData, isLoading } = useQuery({
    queryKey: ["admin-admins", page, debouncedSearch],
    queryFn: () => getAllAdmins(queryParams.toString()),
  });
  // console.log(adminsData, "adminsData");

  const { data: selectedAdmin, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ["admin-admin", selectedAdminId],
    queryFn: () => getAdminById(selectedAdminId!),
    enabled: !!selectedAdminId && isDetailsOpen,
  });

  const { mutateAsync: createAdminMutate, isPending: isCreating } = useMutation(
    {
      mutationFn: createAdmin,
    },
  );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await createAdminMutate(value);
        if (result.success) {
          toast.success(result.message);
          setIsCreateOpen(false);
          form.reset();
        } else {
          setCreateError(result.message);
        }
      } catch (error) {
        setCreateError("Failed to create admin. Please try again.");
      }
    },
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(initialQueryString);
    params.set("page", String(newPage));
    if (debouncedSearch) params.set("searchTerm", debouncedSearch);
    router.push(`/admin/dashboard/admin-management?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams(initialQueryString);
    params.set("page", "1");
    if (value) params.set("searchTerm", value);
    router.push(`/admin/dashboard/admin-management?${params.toString()}`);
  };

  const handleViewDetails = (adminId: string) => {
    setSelectedAdminId(adminId);
    setIsDetailsOpen(true);
  };

  const admins = adminsData?.data || [];

  const meta = adminsData?.meta || {
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

  return (
    <>
      <div className="space-y-4 p-3 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all admins
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search admins..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchInput)
                }
                className="pl-9"
              />
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="shrink-0 cursor-pointer"
            >
              <PlusIcon className="mr-2 size-4" />
              Create Admin
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins?.map((admin: IAdminListItem) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full bg-muted">
                        {admin.image ? (
                          <Image
                            src={admin.image}
                            alt={admin.name}
                            width={40}
                            height={40}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm font-medium">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        admin.role === "SUPER_ADMIN"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }
                    >
                      {admin.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {admin.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : admin.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                          size="icon"
                        >
                          <MoreHorizontalIcon className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 space-y-1"
                      >
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(admin.admin.id)}
                        >
                          <UserIcon className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              admins
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

      {/* Admin Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admin Details</DialogTitle>
            <DialogDescription>
              Complete information about the admin
            </DialogDescription>
          </DialogHeader>

          {isLoadingAdmin ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : selectedAdmin ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="size-20 overflow-hidden rounded-full bg-muted">
                  {selectedAdmin.user.image ? (
                    <Image
                      src={selectedAdmin.user.image}
                      alt={selectedAdmin.user.name}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-2xl font-medium">
                      {selectedAdmin.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedAdmin.user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAdmin.user.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {selectedAdmin.user.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : selectedAdmin.user.isActive ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    <Badge
                      className={
                        selectedAdmin.user.role === "SUPER_ADMIN"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }
                    >
                      {selectedAdmin.user.role.replace("_", " ")}
                    </Badge>
                    {selectedAdmin.user.emailVerified ? (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-500"
                      >
                        <UserCheckIcon className="mr-1 size-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-destructive">
                        <UserXIcon className="mr-1 size-3" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Specific Details */}
              <div className="grid gap-4 rounded-lg border p-4">
                <h4 className="font-semibold">Admin Information</h4>

                <div className="grid gap-3">
                  {selectedAdmin.designation && (
                    <div className="flex items-center gap-3">
                      <ShieldIcon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Designation
                        </p>
                        <p className="text-sm font-medium">
                          {selectedAdmin.designation}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAdmin.address && (
                    <div className="flex items-center gap-3">
                      <UserIcon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="text-sm font-medium">
                          {selectedAdmin.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Information */}
              <div className="grid gap-4 rounded-lg border p-4">
                <h4 className="font-semibold">Personal Information</h4>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <MailIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        {selectedAdmin.user.email}
                      </p>
                    </div>
                  </div>

                  {selectedAdmin.user.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium">
                          {selectedAdmin.user.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAdmin.user.bio && (
                    <div className="flex items-start gap-3">
                      <UserIcon className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bio</p>
                        <p className="text-sm font-medium">
                          {selectedAdmin.user.bio}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Details */}
              <div className="grid gap-4 rounded-lg border p-4">
                <h4 className="font-semibold">Account Details</h4>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium">
                        {new Date(
                          selectedAdmin.user.createdAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(
                          selectedAdmin.user.updatedAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {selectedAdmin.user.needPasswordChange && (
                    <div className="flex items-center gap-3">
                      <ShieldIcon className="size-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Password Status
                        </p>
                        <p className="text-sm font-medium text-yellow-500">
                          Password change required
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              Unable to load admin details
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
            <DialogDescription>
              Add a new admin to the system. They will be able to access the
              admin dashboard.
            </DialogDescription>
          </DialogHeader>

          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="space-y-4">
              <Field>
                <form.Field
                  name="name"
                  validators={{ onChange: createAdminZodSchema.shape.name }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter admin name"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-red-500">
                            {getErrorMessage(field.state.meta.errors[0])}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>
              </Field>

              <Field>
                <form.Field
                  name="email"
                  validators={{ onChange: createAdminZodSchema.shape.email }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter admin email"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-red-500">
                            {getErrorMessage(field.state.meta.errors[0])}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>
              </Field>

              <Field>
                <form.Field
                  name="password"
                  validators={{ onChange: createAdminZodSchema.shape.password }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter password (min 8 characters)"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-red-500">
                            {getErrorMessage(field.state.meta.errors[0])}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>
              </Field>
            </FieldGroup>

            {createError && (
              <p className="mt-4 text-sm text-red-500">{createError}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setIsCreateOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminManagement;
