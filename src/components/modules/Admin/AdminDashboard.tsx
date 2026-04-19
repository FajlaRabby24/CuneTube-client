"use client";

import { getDashboardStats } from "@/services/Dashboard/dashboardStats.service";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Film,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Calendar,
  Layers,
  Flag,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

// Cinematic Colors
const COLORS = ["#e50914", "#b20710", "#0070f3", "#a855f7", "#eab308", "#dc2626"];

const AdminDashboard = ({ sessionToken }: { sessionToken?: string }) => {
  const { data: stats, isLoading: loading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <Film className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
          <p className="text-lg font-bold text-white">System Data Offline</p>
          <p className="text-sm text-neutral-500">Failed to sync with command center</p>
        </div>
      </div>
    );
  }

  // Demo Monthly Revenue for premium visualization
  const demoRevenueData = [
    { name: "Jan", revenue: 4500 },
    { name: "Feb", revenue: 5200 },
    { name: "Mar", revenue: 4800 },
    { name: "Apr", revenue: 6100 },
    { name: "May", revenue: 5900 },
    { name: "Jun", revenue: 7500 },
    { name: "Jul", revenue: 8200 },
  ];

  return (
    <div className="min-h-screen space-y-8 p-6 lg:p-10">
      {/* Cinematic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl text-red-600" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              Command Center
            </h1>
            <p className="text-neutral-500">Platform orchestration and high-level cinematic metrics.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-center">
                <p className="text-[10px] font-bold text-neutral-600 uppercase">System Status</p>
                <p className="text-sm font-bold text-green-500 flex items-center gap-1.5 pt-0.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Live
                </p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", val: stats.users.total, sub: `${stats.users.active} Active`, icon: Users, color: "from-blue-600 to-blue-900" },
          { label: "Revenue", val: `$${stats.revenue.total.toLocaleString()}`, sub: `$${stats.revenue.monthly.toLocaleString()}/mo`, icon: DollarSign, color: "from-emerald-600 to-emerald-900" },
          { label: "Media Library", val: stats.media.total, sub: `${stats.media.movies} Movies`, icon: Film, color: "from-red-600 to-red-900" },
          { label: "Pending Issues", val: stats.pending.reviews + stats.pending.reports, sub: `${stats.pending.reports} Reports`, icon: AlertCircle, color: "from-amber-600 to-amber-900" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-white/10"
          >
            <div className={`absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">{stat.label}</p>
                <h3 className="mt-2 text-3xl font-black italic text-white tracking-tighter">{stat.val}</h3>
                <p className="mt-1 text-xs text-neutral-500 font-medium">{stat.sub}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Orchestration Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Growth Area Chart */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="lg:col-span-2 rounded-3xl border border-white/5 bg-black/40 p-8"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-red-600" /> Revenue Pulse
              </h3>
              <p className="text-xs text-neutral-600">Global platform earnings (Mock Projection)</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={demoRevenueData}>
                 <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#e50914" stopOpacity={0.4} />
                     <stop offset="95%" stopColor="#e50914" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 12 }} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: "#000", border: "1px solid #222", borderRadius: "12px" }}
                    itemStyle={{ color: "#e50914" }}
                 />
                 <Area type="monotone" dataKey="revenue" stroke="#e50914" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Status Pie */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="rounded-3xl border border-white/5 bg-black/40 p-8"
        >
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
             <Users className="h-5 w-5 text-blue-600" /> User Roles
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={[
                     { name: "Active", value: stats.users.active },
                     { name: "Banned", value: stats.users.banned },
                   ]}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={10}
                   dataKey="value"
                 >
                   {COLORS.map((color, i) => (
                     <Cell key={`cell-${i}`} fill={color} stroke="none" />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ backgroundColor: "#000", border: "1px solid #222", borderRadius: "12px" }} 
                 />
               </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
             <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Active Rate</span>
                <span className="text-green-500 font-bold">{Math.round((stats.users.active / stats.users.total) * 100)}%</span>
             </div>
             <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full" style={{ width: `${(stats.users.active / stats.users.total) * 100}%` }} />
             </div>
          </div>
        </motion.div>
      </div>

      {/* Tertiary Row: Quick Actions & Reports */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="lg:col-span-1 rounded-3xl border border-white/5 bg-black/40 p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Quick Orchestration</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Users", icon: Users, href: "/admin/dashboard/user-management" },
              { label: "Media", icon: Film, href: "/admin/dashboard/media-management" },
              { label: "Reports", icon: Flag, href: "/admin/dashboard/report-management" },
              { label: "Reviews", icon: MessageSquare, href: "/admin/dashboard/review-management" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-red-600/10 hover:border-red-600/40"
              >
                <action.icon className="h-8 w-8 text-neutral-500 mb-3 group-hover:text-red-600 transition-colors" />
                <span className="text-xs font-bold text-neutral-600 group-hover:text-white transition-colors">{action.label}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Content & Issue Tracking */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-2 rounded-3xl border border-white/5 bg-black/40 p-8"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-white">Pending Moderation</h3>
             <a href="/admin/dashboard/report-management" className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline">
               View All <ArrowUpRight className="h-3 w-3" />
             </a>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="p-2 rounded-lg bg-amber-500/20"><MessageSquare className="h-5 w-5 text-amber-500" /></div>
                   <div>
                      <p className="text-sm font-bold text-white">Inbound Reviews</p>
                      <p className="text-xs text-neutral-600">Pending moderation approval</p>
                   </div>
                </div>
                <div className="text-xl font-black text-white">{stats.pending.reviews}</div>
             </div>
             <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="p-2 rounded-lg bg-red-500/20"><Flag className="h-5 w-5 text-red-500" /></div>
                   <div>
                      <p className="text-sm font-bold text-white">System Reports</p>
                      <p className="text-xs text-neutral-600">Urgent safety/content flags</p>
                   </div>
                </div>
                <div className="text-xl font-black text-white">{stats.pending.reports}</div>
             </div>
             <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="p-2 rounded-lg bg-blue-500/20"><Film className="h-5 w-5 text-blue-600" /></div>
                   <div>
                      <p className="text-sm font-bold text-white">New Submission</p>
                      <p className="text-xs text-neutral-600">Media updates to verify</p>
                   </div>
                </div>
                <div className="text-xl font-black text-white">{stats.media.total}</div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
