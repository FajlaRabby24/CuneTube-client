import PaymentManagement from "@/components/modules/Admin/PaymentManagement";
import { getAllPayments } from "@/services/Admin/payment.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const PaymentManagementPage = async ({
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
    queryKey: ["admin-payments", queryString],
    queryFn: () => getAllPayments(queryString),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentManagement initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default PaymentManagementPage;

// TODO: tags and payment management
