"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Bell, Clock, Inbox, Search } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  getUserNotifications,
  INotification,
} from "@/services/Dashboard/notification.service";
import {
  CheckCircle2,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Star,
  ThumbsUp,
  XCircle,
} from "lucide-react";

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

export default function UserNotification() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: notificationData, isLoading } = useQuery({
    queryKey: ["notifications", "all"],
    queryFn: () => getUserNotifications("limit=15"),
  });
  console.log(notificationData, "user notification");

  const notifications = notificationData?.data || [];

  return (
    <div className="min-h-screen space-y-12 animate-in fade-in duration-700 px-4 py-8 sm:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-1.5 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
              Central Intelligence <span className="text-red-600">Feed</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 italic mt-1">
              Complete historical transmission logs • Unified Data Stream
            </p>
          </div>
        </div>

        {/* Search/Filter Bar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              placeholder="Search frequencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-2xl border border-white/5 bg-black/40 pl-10 pr-4 text-[11px] font-black uppercase italic tracking-wider text-white placeholder:text-neutral-700 focus:border-red-600/40 focus:outline-none transition-all backdrop-blur-xl"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600/20 border-t-red-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 italic">
              Decrypting Feed...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-64 flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center backdrop-blur-sm"
          >
            <Inbox className="h-12 w-12 text-neutral-800 mb-4" />
            <p className="text-[12px] font-black uppercase tracking-widest text-white italic">
              No Logs Found
            </p>
            <p className="mt-2 text-sm text-neutral-500 font-medium max-w-xs uppercase leading-relaxed">
              Your transmission history is currently empty or encrypted.
            </p>
          </motion.div>
        ) : (
          notifications.map((notification: INotification, i: number) => {
            const config = typeConfig[notification.type] || {
              icon: Bell,
              color: "text-neutral-400",
              bg: "bg-neutral-500/10",
            };
            const Icon = config.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:bg-white/[0.05] hover:border-white/10",
                  !notification.isRead &&
                    "bg-white/[0.01] border-red-600/10 shadow-[inner_0_0_20px_rgba(220,38,38,0.05)]",
                )}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
                )}

                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-2xl",
                      config.bg,
                    )}
                  >
                    <Icon className={cn("h-7 w-7", config.color)} />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-[14px] font-black italic text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 border border-white/5">
                        <Clock className="h-3 w-3 text-neutral-600" />
                        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            { addSuffix: true },
                          )}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-2xl">
                      {notification.message}
                    </p>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-2 pr-4">
                    <span
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest italic px-3 py-1 rounded-lg",
                        !notification.isRead
                          ? "text-red-500 bg-red-500/10"
                          : "text-neutral-600 bg-white/5",
                      )}
                    >
                      {notification.type.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
