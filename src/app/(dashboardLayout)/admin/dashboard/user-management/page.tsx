import UserManagement from "@/components/modules/Admin/UserManagement";
import { getAllUsers } from "@/services/Admin/getUsers.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const UserManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<URLSearchParams>;
}) => {
  const queryParamsObjects = await searchParams;

  const params = new URLSearchParams();
  Object.entries(queryParamsObjects).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-users", Object.fromEntries(params)],
    queryFn: () => getAllUsers(params),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserManagement initialQueryString={params.toString()} />
    </HydrationBoundary>
  );
};

export default UserManagementPage;
