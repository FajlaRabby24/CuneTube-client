import ReportManagement from "@/components/modules/Admin/ReportManagement";
import { getAllReports } from "@/services/Admin/report.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const ReportManagementPage = async ({
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

  // const fetchString = queryString ? queryString.includes("status") ? queryString : `${queryString}&status=PENDING` : "status=PENDING";

  await queryClient.prefetchQuery({
    queryKey: ["admin-reports", queryString],
    queryFn: () => getAllReports(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportManagement initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default ReportManagementPage;
