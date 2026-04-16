import Comments from "@/components/modules/Dashboard/Comments";
import { getUserComments } from "@/services/Dashboard/comment.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const CommentsPage = async ({
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
    queryKey: ["user-comments", queryString],
    queryFn: () => getUserComments(queryString),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default CommentsPage;
