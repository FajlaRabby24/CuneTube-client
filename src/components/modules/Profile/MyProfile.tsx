"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/lib/authUtilts";
import { getMyProfile } from "@/services/Auth/getMyProfile.service";
import { logoutSession } from "@/services/Auth/logoutSession.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  Loader2Icon,
  MailIcon,
  PhoneIcon,
  ShieldAlert,
  ShieldIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const MyProfile = () => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const logoutSingleMutation = useMutation({
    mutationFn: logoutSession,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.refetchQueries({ queryKey: ["my-profile"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to logout session");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-svh bg-muted p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-svh bg-muted p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
            <p className="text-muted-foreground">Unable to load profile</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Watchlists", value: profile.watchlists?.length || 0 },
    { label: "Reviews", value: profile.reviews?.length || 0 },
    { label: "Comments", value: profile.comments?.length || 0 },
    { label: "Payments", value: profile.payments?.length || 0 },
  ];

  return (
    <div className="min-h-svh bg-muted p-3 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          <div className="relative h-32 bg-linear-to-r from-blue-500 to-purple-500" />
          <CardContent className="pb-6">
            <div className="relative -mt-16 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-start sm:gap-6 sm:pl-4">
              <div className="relative size-28 overflow-hidden rounded-full border-4 border-background ring-4 ring-border">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted text-3xl font-bold text-muted-foreground">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
                {profile?.bio && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {profile.bio}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {profile.isActive ? (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                    Inactive
                  </span>
                )}
                {(profile.role === UserRole.SUPER_ADMIN ||
                  profile.role === UserRole.ADMIN) && (
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500">
                    {profile?.role === UserRole.SUPER_ADMIN
                      ? "Super Admin"
                      : "Admin"}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Profile Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">
                    {profile.phoneNumber || "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldIcon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Accounts</p>
                  <p className="text-sm font-medium">
                    {profile.accounts?.length || 0} connected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                  <p className="text-sm font-medium">
                    {profile.sessions?.length || 0} active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Subscription</p>
                  <p className="text-sm font-medium">
                    {profile.subscription ? "Active" : "None"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <Tabs defaultValue="watchlist">
            <TabsList className="w-full justify-start border-b bg-transparent px-6 py-4">
              <TabsTrigger
                value="watchlist"
                className="data-[state=active]:bg-muted cursor-pointer py-3"
              >
                Watchlist
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-muted cursor-pointer py-3 "
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-muted cursor-pointer py-3"
              >
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="data-[state=active]:bg-muted cursor-pointer py-3"
              >
                Sessions
              </TabsTrigger>
            </TabsList>
            <CardContent className="p-6">
              <TabsContent value="watchlist">
                {profile.watchlists?.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No watchlists yet
                  </div>
                ) : (
                  // TODO: after added watchlist then redefined
                  <div className="text-sm">
                    {JSON.stringify(profile.watchlists, null, 2)}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="reviews">
                {profile.reviews?.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No reviews yet
                  </div>
                ) : (
                  <div className="text-sm">
                    // TODO: after added watchlist then redefined
                    {JSON.stringify(profile.reviews, null, 2)}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="comments">
                {profile.comments?.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No comments yet
                  </div>
                ) : (
                  <div className="text-sm">
                    // TODO: after added watchlist then redefined
                    {JSON.stringify(profile.comments, null, 2)}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="sessions">
                <div className="space-y-3">
                  {profile.sessions?.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* Green dot for current session */}
                        {index === 0 && (
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                          </span>
                        )}
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium truncate">
                            {session.userAgent}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {index === 0 ? "Current" : "Other"}
                        </span>
                        {index !== 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              logoutSingleMutation.mutate(session.id)
                            }
                            disabled={logoutSingleMutation.isPending}
                            className="size-8 text-muted-foreground hover:text-red-500 cursor-pointer"
                          >
                            {logoutSingleMutation.isPending ? (
                              <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                              <Trash2Icon className="size-4 cursor-pointer" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {profile.sessions?.length === 0 && (
                    <div className="py-4 text-center text-muted-foreground">
                      No sessions
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;
