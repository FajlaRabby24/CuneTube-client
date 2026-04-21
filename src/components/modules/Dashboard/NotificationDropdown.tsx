"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Star,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  getUserNotifications,
  INotification,
  markAllNotificationsAsRead,
} from "@/services/Dashboard/notification.service";

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  REVIEW_APPROVED: {
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  REVIEW_REJECTED: {
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  REVIEW_LIKED: {
    icon: ThumbsUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  COMMENT_RECEIVED: {
    icon: MessageSquare,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  COMMENT_REPLIED: {
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  SUBSCRIPTION_ACTIVATED: {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  SUBSCRIPTION_EXPIRED: {
    icon: XCircle,
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
  },
  PAYMENT_SUCCEEDED: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  PAYMENT_FAILED: {
    icon: XCircle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  REPORT_RESOLVED: {
    icon: ShieldCheck,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
};

const NotificationDropdown = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  // Keep local copy of notifications when opening to prevent flickering when they are marked as read
  const [displayNotifications, setDisplayNotifications] = useState<
    INotification[]
  >([]);

  const { data: notificationData, isLoading } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => getUserNotifications("isRead=false&limit=10"),
    refetchInterval: 30000,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      // Invalidate both unread and all notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadNotifications = notificationData?.data || [];
  const unreadCount = unreadNotifications.length;

  // Handle dropdown opening
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Capture current unread notifications to show in the open dropdown
      setDisplayNotifications(unreadNotifications);
      // Mark all as read on the server
      if (unreadCount > 0) {
        markAllReadMutation.mutate();
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
        >
          {unreadCount > 0 ? (
            <>
              <BellRing className="h-5 w-5 text-red-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-black italic text-white ring-2 ring-black">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-0 shadow-2xl backdrop-blur-3xl"
      >
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[10px] font-black italic tracking-widest text-white uppercase">
              Current Unread Triggers
            </h3>
          </div>
          <span className="text-[8px] font-black uppercase text-neutral-500 italic">
            SECURE_FEED_ACTIVE
          </span>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading && displayNotifications.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600/20 border-t-red-600" />
              <p className="text-[8px] font-black uppercase tracking-widest text-neutral-600 italic">
                Scanning frequencies...
              </p>
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="flex h-60 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-2xl bg-white/5 p-4 text-neutral-500">
                <Bell className="h-8 w-8 opacity-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white italic">
                All Systems Clear
              </p>
              <p className="mt-1 text-[9px] font-medium text-neutral-500 uppercase leading-relaxed">
                No new alerts detected in the current buffer.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayNotifications.map(
                (notification: INotification, i: number) => {
                  const config = typeConfig[notification.type] || {
                    icon: Bell,
                    color: "text-neutral-400",
                    bg: "bg-neutral-500/10",
                  };
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "group relative flex gap-4 border-b border-white/5 p-4 transition-colors hover:bg-white/[0.03]",
                        "bg-white/[0.01]",
                      )}
                    >
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-0.5 rounded-full bg-red-600" />

                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          config.bg,
                        )}
                      >
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          {notification.title}
                          <span className="flex items-center gap-1 shrink-0 text-[8px] font-black uppercase text-neutral-600">
                            <Clock className="h-2.5 w-2.5" />
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true },
                            )}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium leading-relaxed text-neutral-500 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </motion.div>
                  );
                },
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="border-t border-white/5 bg-white/[0.02] p-2">
          <Button
            asChild
            variant="ghost"
            className="h-10 w-full rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic text-neutral-400 hover:text-white transition-all"
          >
            <Link href="/dashboard/notifications">
              View All Transmission Logs
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
