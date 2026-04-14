import AdminDashboard from "@/components/modules/Admin/AdminDashboard";
import { getDashboardStats } from "@/services/Dashboard/dashboardStats.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";

const AdminDashboardPage = async () => {
  const queryClient = new QueryClient();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  await queryClient.prefetchQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboard sessionToken={sessionToken!} />
    </HydrationBoundary>
  );
};

export default AdminDashboardPage;