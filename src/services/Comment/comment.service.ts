"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IComment } from "@/types/review.types";
import { cookies } from "next/headers";

export const getReviewComments = async (reviewId: string) => {
  return await httpClient.get<IComment[]>(`/reviews/${reviewId}/comments`);
};

export const createComment = async (reviewId: string, content: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return { success: false, message: "Unauthorized" };

  return await httpClient.post<IComment>(
    `/reviews/${reviewId}/comments`,
    { content },
    {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    },
  );
};

export const createReply = async (commentId: string, content: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return { success: false, message: "Unauthorized" };

  return await httpClient.post<IComment>(
    `/comments/${commentId}/reply`,
    { content },
    {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    },
  );
};

export const likeComment = async (commentId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return { success: false, message: "Unauthorized" };

  return await httpClient.post<{ liked: boolean; likesCount: number }>(
    `/comments/${commentId}/like`,
    {},
    {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    },
  );
};
