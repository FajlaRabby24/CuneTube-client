import MyProfile from "@/components/modules/Profile/MyProfile";
import { getMyProfile } from "@/services/Auth/getMyProfile.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const MyProfilePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyProfile />
    </HydrationBoundary>
  );
};

export default MyProfilePage;
