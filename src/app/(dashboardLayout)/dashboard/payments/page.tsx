import Payments from "@/components/modules/Dashboard/Payments/Payment";
import { getUserPayments } from "@/services/Dashboard/payment.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const PaymentsPage = async ({
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
    queryKey: ["user-payments", queryString],
    queryFn: () => getUserPayments(queryString),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Payments initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default PaymentsPage;
