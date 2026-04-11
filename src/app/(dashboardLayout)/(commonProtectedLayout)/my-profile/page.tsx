import MyProfile from "@/components/modules/Profile/MyProfile";
import { getMyProfile } from "@/services/Auth/getMyProfile.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

const MyProfilePage = async () => {
  const queryClient = new QueryClient();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  await queryClient.prefetchQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyProfile sessionToken={sessionToken} />
    </HydrationBoundary>
  );
};

export default MyProfilePage;
