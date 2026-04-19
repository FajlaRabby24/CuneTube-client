"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/lib/authUtilts";
import { getMyProfile } from "@/services/Auth/getMyProfile.service";
import { logoutSession } from "@/services/Auth/logoutSession.service";
import { ISessionDeletePayload } from "@/types/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Bookmark,
  ChevronRight,
  CreditCard,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";

const MyProfile = ({ sessionToken }: { sessionToken: string | undefined }) => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const logoutSingleMutation = useMutation({
    mutationFn: ({ sessionId, token }: ISessionDeletePayload) =>
      logoutSession(sessionId, token),
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <User className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-xl font-bold text-white uppercase tracking-tighter italic">
            Identity Sync Failed
          </p>
          <p className="text-sm text-neutral-500">
            Unable to establish connection with profile service.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Watchlist",
      value: profile.watchlists?.length || 0,
      icon: Bookmark,
    },
    { label: "Reviews", value: profile.reviews?.length || 0, icon: Star },
    {
      label: "Comments",
      value: profile.comments?.length || 0,
      icon: MessageSquare,
    },
    {
      label: "Payments",
      value: profile.payments?.length || 0,
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen space-y-8 p-4 lg:p-10">
      {/* Cinematic Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl"
      >
        <div className="relative h-48 bg-gradient-to-br from-black via-neutral-900 to-red-950/30 sm:h-64">
          {/* Abstract Decoration */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
        </div>

        <div className="relative px-6 pb-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <div className="relative -mt-16 sm:-mt-20">
              <div className="relative h-32 w-32 overflow-hidden rounded-3xl border-4 border-black/80 ring-1 ring-white/10 sm:h-40 sm:w-40">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-4xl font-black italic text-red-600">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {profile.isActive && (
                <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-black bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left sm:pb-2">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
                  {profile.name}
                </h1>
                <div className="flex gap-2">
                  {profile.isActive && (
                    <span className="rounded-full bg-green-600/10 px-3 py-1 text-[10px] font-black tracking-widest text-green-500 uppercase ring-1 ring-green-600/20">
                      Member
                    </span>
                  )}
                  {(profile.role === UserRole.SUPER_ADMIN ||
                    profile.role === UserRole.ADMIN) && (
                    <span className="rounded-full bg-red-600/10 px-3 py-1 text-[10px] font-black tracking-widest text-red-600 uppercase ring-1 ring-red-600/20">
                      {profile.role === UserRole.SUPER_ADMIN
                        ? "System Admin"
                        : "Admin"}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-1 flex items-center justify-center gap-2 text-neutral-500 sm:justify-start">
                <Mail className="h-3 w-3" /> {profile.email}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-white/10"
          >
            <stat.icon className="mb-2 h-5 w-5 text-neutral-600" />
            <h3 className="text-2xl font-black tracking-tighter text-white italic">
              {stat.value}
            </h3>
            <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info Side */}
        <div className="space-y-6 lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
          >
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black tracking-widest text-neutral-400 uppercase">
              <Activity className="h-4 w-4" /> Personal Trace
            </h3>
            <div className="space-y-6">
              {[
                { label: "Account ID", val: profile.name, icon: User },
                { label: "Secure Email", val: profile.email, icon: Mail },
                {
                  label: "Contact Phone",
                  val: profile.phoneNumber || "Not Configured",
                  icon: Phone,
                },
                { label: "Access Level", val: profile.role, icon: Shield },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="rounded-xl bg-white/5 p-3">
                    <item.icon className="h-4 w-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-neutral-700 uppercase">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-neutral-300">
                      {item.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
          >
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black tracking-widest text-neutral-400 uppercase">
              <Shield className="h-4 w-4" /> Subscription State
            </h3>
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-red-600/10 to-red-900/10 border border-red-600/10 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-600/20 p-2">
                  <CreditCard className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400">
                    Current Plan
                  </p>
                  <p className="text-sm font-black text-white italic">
                    {profile.subscription
                      ? "Premiere Member"
                      : "Standard Entry"}
                  </p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden"
        >
          <Tabs defaultValue="sessions">
            <TabsList className="flex h-16 w-full justify-start gap-8 border-b border-white/5 bg-black/20 px-8">
              {["Watchlist", "Reviews", "Comments", "Sessions"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="data-[state=active]:after:w-full relative h-full bg-transparent p-0 text-xs font-black tracking-widest text-neutral-600 uppercase transition-all hover:text-neutral-300 data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-red-600 data-[state=active]:after:content-['']"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-8">
              <TabsContent value="watchlist">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bookmark className="mb-4 h-12 w-12 text-neutral-800" />
                  <p className="text-sm font-bold text-neutral-600">
                    No cinematic saved items detected.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Star className="mb-4 h-12 w-12 text-neutral-800" />
                  <p className="text-sm font-bold text-neutral-600">
                    Your critic journey hasn't started yet.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="mb-4 h-12 w-12 text-neutral-800" />
                  <p className="text-sm font-bold text-neutral-600">
                    No active discussions found.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="mt-0">
                <div className="space-y-4">
                  {profile.sessions?.map((session, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 border border-white/5">
                          {sessionToken === session.token ? (
                            <>
                              <div className="absolute inset-0 animate-pulse rounded-xl bg-green-500/10" />
                              <Activity className="h-5 w-5 text-green-500" />
                            </>
                          ) : (
                            <Activity className="h-5 w-5 text-neutral-700" />
                          )}
                        </div>
                        <div className="max-w-[200px] sm:max-w-md">
                          <p className="truncate text-sm font-bold text-white">
                            {session.userAgent}
                          </p>
                          <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">
                            {sessionToken === session.token
                              ? "Authorized Interaction"
                              : "Inactive Link"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {sessionToken === session.token ? (
                          <span className="rounded-full bg-green-600/10 px-3 py-1 text-[10px] font-black tracking-widest text-green-500 uppercase">
                            Active
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              Swal.fire({
                                title: "Terminate Session?",
                                text: "You will be logged out on that device.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#e50914",
                                cancelButtonColor: "#1a1a1a",
                                confirmButtonText: "Terminate Link",
                                background: "#0a0a0a",
                                color: "#fff",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  logoutSingleMutation.mutate({
                                    sessionId: session.id,
                                    token: session.token,
                                  });
                                }
                              });
                            }}
                            disabled={logoutSingleMutation.isPending}
                            className="h-10 w-10 rounded-xl text-neutral-700 hover:bg-red-600/10 hover:text-red-600"
                          >
                            {logoutSingleMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <ChevronRight className="h-4 w-4 text-neutral-800" />
                      </div>
                    </div>
                  ))}
                  {profile.sessions?.length === 0 && (
                    <div className="py-12 text-center text-neutral-600">
                      No active sessions detected.
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default MyProfile;
