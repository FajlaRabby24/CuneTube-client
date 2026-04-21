import UserSubscriptions from "@/components/modules/Dashboard/Subscriptions/UserSubscription";
import { getUserSubscriptions } from "@/services/Dashboard/subscription.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const SubscriptionPage = async ({
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
    queryKey: ["user-subscriptions", queryString],
    queryFn: () => getUserSubscriptions(queryString),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserSubscriptions initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default SubscriptionPage;
