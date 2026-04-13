import AdminManagement from "@/components/modules/Admin/AdminManagement";
import { getAllAdmins } from "@/services/Admin/getAdmins.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// opencode -s ses_27f836a96ffetbgJ8EEDetJVsD

const AdminManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) {
        return "";
      }

      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-admins", queryString],
    queryFn: () => getAllAdmins(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminManagement initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default AdminManagementPage;
