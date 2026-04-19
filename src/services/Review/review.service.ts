"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview } from "@/types/review.types";
import { cookies } from "next/headers";

export const getMediaReviews = async (mediaId: string) => {
  return await httpClient.get<IReview[]>(`/media/${mediaId}/reviews`);
};

export const createReview = async (
  mediaId: string,
  data: { rating: number; content: string; title?: string; hasSpoiler?: boolean },
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return { success: false, message: "Unauthorized" };

  return await httpClient.post<IReview>(`/reviews/${mediaId}`, data, {
    headers: {
      Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
    },
  });
};

export const likeReview = async (reviewId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return { success: false, message: "Unauthorized" };

  return await httpClient.post<{ liked: boolean; likesCount: number }>(
    `/reviews/${reviewId}/like`,
    {},
    {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    },
  );
};
