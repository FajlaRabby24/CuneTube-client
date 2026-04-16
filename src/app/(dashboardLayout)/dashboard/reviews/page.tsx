import Reviews from "@/components/modules/Dashboard/Reviews";
import { getUserReviews } from "@/services/Dashboard/review.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const ReviewsPage = async ({
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
    queryKey: ["user-reviews", queryString],
    queryFn: () => getUserReviews(queryString),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Reviews initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default ReviewsPage;
