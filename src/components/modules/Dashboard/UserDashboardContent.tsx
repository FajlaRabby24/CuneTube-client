"use client";

import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Clock,
  Film,
  Bookmark,
  Calendar,
  History,
  TrendingUp,
  PieChart as PieChartIcon,
} from "lucide-react";

// Mock Data for Visualization
const activityData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 0.5 },
  { day: "Fri", hours: 4.0 },
  { day: "Sat", hours: 5.5 },
  { day: "Sun", hours: 3.0 },
];

const genreData = [
  { genre: "Action", count: 12 },
  { genre: "Sci-Fi", count: 8 },
  { genre: "Thriller", count: 7 },
  { genre: "Comedy", count: 5 },
  { genre: "Drama", count: 4 },
];

const stats = [
  {
    label: "Watch Time",
    value: "156.4h",
    sub: "Total hours watched",
    icon: Clock,
    color: "from-blue-600 to-blue-900",
  },
  {
    label: "Movies Watched",
    value: "42",
    sub: "Unique titles",
    icon: Film,
    color: "from-red-600 to-red-900",
  },
  {
    label: "Watchlist",
    value: "18",
    sub: "Active items",
    icon: Bookmark,
    color: "from-purple-600 to-purple-900",
  },
  {
    label: "Premium",
    value: "22 Days",
    sub: "Subscription left",
    icon: Calendar,
    color: "from-amber-600 to-amber-900",
  },
];

const recentActivity = [
  { title: "The Dark Knight", type: "Movie", date: "2 hours ago", status: "Completed" },
  { title: "Stranger Things", type: "Series", date: "Yesterday", status: "In Progress" },
  { title: "Inception", type: "Movie", date: "2 days ago", status: "Completed" },
];

const UserDashboardContent = () => {
  return (
    <div className="min-h-screen space-y-8 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
            Streamer Dashboard
          </h1>
          <p className="text-neutral-500">Welcome back! Ready for another cinematic journey?</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-neutral-400">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-white/10"
          >
            <div className={`absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition-all group-hover:opacity-20`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-500 uppercase">{stat.label}</p>
                <h3 className="mt-2 text-3xl font-black tracking-tighter text-white">{stat.value}</h3>
                <p className="mt-1 text-xs text-neutral-600">{stat.sub}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-600/10 p-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-white">Watch Activity</h3>
                <p className="text-xs text-neutral-500">Weekly viewing hours</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e50914" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e50914" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#666", fontSize: 12 }} 
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#000", 
                    border: "1px solid #333", 
                    borderRadius: "12px",
                    color: "#fff"
                  }} 
                  itemStyle={{ color: "#e50914" }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#e50914"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Genre Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600/10 p-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-white">Genre Analysis</h3>
                <p className="text-xs text-neutral-500">Based on unique titles</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="genre" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#ccc", fontSize: 13 }} 
                />
                <Tooltip 
                   cursor={{ fill: "transparent" }}
                   contentStyle={{ 
                    backgroundColor: "#000", 
                    border: "1px solid #333", 
                    borderRadius: "12px"
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#e50914" : "#333"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-white/5 p-2">
            <History className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-bold text-white">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                <th className="pb-4 pl-2">Title</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Date</th>
                <th className="pb-4 text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentActivity.map((item, idx) => (
                <tr key={idx} className="group transition-colors hover:bg-white/5">
                  <td className="py-4 pl-2">
                    <span className="font-bold text-white">{item.title}</span>
                  </td>
                  <td className="py-4">
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-400">{item.type}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-neutral-500">{item.date}</span>
                  </td>
                  <td className="py-4 text-right pr-2">
                     <span className={`text-xs font-bold ${item.status === "Completed" ? "text-green-500" : "text-amber-500"}`}>
                        {item.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboardContent;
