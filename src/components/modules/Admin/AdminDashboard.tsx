"use client";

import { getDashboardStats } from "@/services/Dashboard/dashboardStats.service";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  LineChart,
  Line,
  Legend,
} from "recharts";

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}{suffix}</span>;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  subtitle,
  delay = 0,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  gradient: string;
  subtitle?: string;
  delay?: number;
}) => (
  <div
    className="group relative overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
    </div>
    <div className="relative flex items-start justify-between">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-4xl font-bold tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className={`rounded-2xl p-4 ${gradient}`}>
        <Icon className="size-8 text-white" />
      </div>
    </div>
    <div
      className={`absolute -bottom-8 -right-8 size-32 rounded-full opacity-20 transition-transform duration-300 group-hover:scale-150 ${gradient.replace("from-", "from-").replace("to-", "to-")}`}
    />
  </div>
);

// Custom tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-card p-3 shadow-lg ring-1 ring-border">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueCard = ({
  title,
  value,
  subValue,
  gradient,
  icon: Icon,
}: {
  title: string;
  value: number;
  subValue: string;
  gradient: string;
  icon: React.ElementType;
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-card p-5 ring-1 ring-border">
    <div className={`absolute right-0 top-0 size-20 ${gradient} opacity-20 blur-2xl`} />
    <div className="relative flex items-center gap-4">
      <div className={`rounded-xl p-3 ${gradient}`}>
        <Icon className="size-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">${value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{subValue}</p>
      </div>
    </div>
  </div>
);

const ActionCard = ({
  icon: Icon,
  label,
  count,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  href: string;
}) => (
  <a
    href={href}
    className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-transparent hover:shadow-lg"
  >
    <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${color} opacity-10`} />
    <div className="relative flex items-center gap-4">
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{count} pending</p>
      </div>
    </div>
  </a>
);

// Color palette for pie charts
const PIE_COLORS = ["#10b981", "#ef4444", "#3b82f6", "#a855f7", "#eab308", "#dc2626"];

const AdminDashboard = ({ sessionToken }: { sessionToken?: string }) => {
  const { data: stats, isLoading: loading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircleIcon className="size-8 text-red-500" />
          </div>
          <p className="text-lg font-medium">Unable to load dashboard stats</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  /* 
    =============================================================================
    DEMO DATA FOR DESIGN TESTING - REMOVE AFTER PROJECT COMPLETION
    The following data is for visual design purposes. When your project is complete
    and real data is available, replace these with actual backend data.
    =============================================================================
  */
  const demoMonthlyRevenueData = [
    { month: "Jan", revenue: 1250 },
    { month: "Feb", revenue: 1890 },
    { month: "Mar", revenue: 1560 },
    { month: "Apr", revenue: 2100 },
    { month: "May", revenue: 2450 },
    { month: "Jun", revenue: 1980 },
    { month: "Jul", revenue: 2680 },
    { month: "Aug", revenue: 2340 },
    { month: "Sep", revenue: 1890 },
    { month: "Oct", revenue: 2120 },
    { month: "Nov", revenue: 2560 },
    { month: "Dec", revenue: 2890 },
  ];

  const demoWeeklyUserGrowth = [
    { week: "Week 1", users: 45 },
    { week: "Week 2", users: 78 },
    { week: "Week 3", users: 62 },
    { week: "Week 4", users: 95 },
  ];

  const demoDailyMediaViews = [
    { day: "Mon", views: 1200 },
    { day: "Tue", views: 1800 },
    { day: "Wed", views: 2400 },
    { day: "Thu", views: 2100 },
    { day: "Fri", views: 3200 },
    { day: "Sat", views: 4500 },
    { day: "Sun", views: 3800 },
  ];
  /* 
    =============================================================================
    END OF DEMO DATA - REMOVE THIS COMMENT AFTER PROJECT COMPLETION
    =============================================================================
  */

  // Use real data from backend
  const usersPercentage = stats.users.total > 0 ? Math.round((stats.users.active / stats.users.total) * 100) : 0;

  // Pie chart data from real backend data
  const userPieData = [
    { name: "Active", value: stats.users.active },
    { name: "Banned", value: stats.users.banned },
  ];

  const mediaPieData = [
    { name: "Movies", value: stats.media.movies },
    { name: "Series", value: stats.media.series },
  ];

  const pendingPieData = [
    { name: "Reviews", value: stats.pending.reviews },
    { name: "Reports", value: stats.pending.reports },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
        </div>
        <div className="absolute -right-20 -top-20 size-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={<AnimatedCounter value={stats.users.total} />}
          icon={UsersIcon}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          subtitle={`${stats.users.active} active • ${stats.users.banned} banned`}
          delay={0}
        />
        <StatCard
          title="Media Content"
          value={<AnimatedCounter value={stats.media.total} />}
          icon={FilmIcon}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          subtitle={`${stats.media.movies} movies • ${stats.media.series} series`}
          delay={100}
        />
        <StatCard
          title="Total Revenue"
          value={<AnimatedCounter value={stats.revenue.total} suffix="$" />}
          icon={DollarSignIcon}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          subtitle={`$${stats.revenue.monthly.toLocaleString()}/mo avg`}
          delay={200}
        />
        <StatCard
          title="Pending Items"
          value={<AnimatedCounter value={stats.pending.reviews + stats.pending.reports} />}
          icon={AlertCircleIcon}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          subtitle={`${stats.pending.reviews} reviews • ${stats.pending.reports} reports`}
          delay={300}
        />
      </div>

      {/* Demo Data Chart - Monthly Revenue Trend using Recharts BarChart */}
      <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Monthly Revenue Trend</h3>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500">
            Demo Data - Replace with real data
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={demoMonthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* User Distribution Pie Chart - Real Data */}
        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">User Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {userPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Media Breakdown Pie Chart - Real Data */}
        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">Media Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mediaPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {mediaPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index + 2]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Actions Pie Chart - Real Data */}
        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">Pending Actions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pendingPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pendingPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index + 4]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard
          title="Monthly Revenue"
          value={stats.revenue.monthly}
          subValue="This month"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          icon={CalendarIcon}
        />
        <RevenueCard
          title="Yearly Revenue"
          value={stats.revenue.yearly}
          subValue="This year"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          icon={CalendarIcon}
        />
        <RevenueCard
          title="Total Revenue"
          value={stats.revenue.total}
          subValue="All time"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          icon={DollarSignIcon}
        />
        <RevenueCard
          title="Avg Monthly"
          value={stats.revenue.yearly > 0 ? Math.round(stats.revenue.yearly / 12) : 0}
          subValue="Per month"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          icon={TrendingUpIcon}
        />
      </div>

      {/* Demo Data Charts using Recharts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Growth (Weekly)</h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
              Demo
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={demoWeeklyUserGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Media Views (Daily)</h3>
            <span className="rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-500">
              Demo
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={demoDailyMediaViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal bar chart using Recharts Bar */}
        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Activity</h3>
            <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-500">
              Real
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={userPieData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* More Real Data Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">Media Content</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mediaPieData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">Pending Actions</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pendingPieData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#eab308" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">Revenue Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { name: "Monthly", value: stats.revenue.monthly },
                { name: "Yearly", value: stats.revenue.yearly / 12 },
              ]}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">Platform Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="font-medium">Active User Rate</span>
              <span className="text-2xl font-bold text-emerald-500">{usersPercentage}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="font-medium">Total Content</span>
              <span className="text-2xl font-bold text-blue-500">{stats.media.total}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="font-medium">Pending Actions</span>
              <span className="text-2xl font-bold text-orange-500">
                {stats.pending.reviews + stats.pending.reports}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/dashboard/user-management"
              className="group flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-blue-500/10 hover:border-blue-500"
            >
              <div className="rounded-lg bg-blue-500/20 p-2 group-hover:bg-blue-500">
                <UsersIcon className="size-5 text-blue-500" />
              </div>
              <span className="font-medium">Users</span>
            </a>
            <a
              href="/admin/dashboard/media-management"
              className="group flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-purple-500/10 hover:border-purple-500"
            >
              <div className="rounded-lg bg-purple-500/20 p-2 group-hover:bg-purple-500">
                <FilmIcon className="size-5 text-purple-500" />
              </div>
              <span className="font-medium">Media</span>
            </a>
            <a
              href="/admin/dashboard/report-management"
              className="group flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-red-500/10 hover:border-red-500"
            >
              <div className="rounded-lg bg-red-500/20 p-2 group-hover:bg-red-500">
                <FlagIcon className="size-5 text-red-500" />
              </div>
              <span className="font-medium">Reports</span>
            </a>
            <a
              href="/admin/dashboard/review-managment"
              className="group flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-yellow-500/10 hover:border-yellow-500"
            >
              <div className="rounded-lg bg-yellow-500/20 p-2 group-hover:bg-yellow-500">
                <ReviewIcon className="size-5 text-yellow-500" />
              </div>
              <span className="font-medium">Reviews</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard
          icon={ReviewIcon}
          label="Pending Reviews"
          count={stats.pending.reviews}
          color="bg-yellow-500"
          href="/admin/dashboard/review-managment"
        />
        <ActionCard
          icon={FlagIcon}
          label="Pending Reports"
          count={stats.pending.reports}
          color="bg-red-500"
          href="/admin/dashboard/report-management"
        />
      </div>
    </div>
  );
};

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FilmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
      <line x1="7" x2="7" y1="2" y2="22" />
      <line x1="17" x2="17" y1="2" y2="22" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function ReviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 15-6-6-6 6" />
      <path d="M12 9v6" />
      <path d="M6 21h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

export default AdminDashboard;
