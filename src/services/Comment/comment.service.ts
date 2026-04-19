"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IComment } from "@/types/review.types";
import { cookies } from "next/headers";

export const getReviewComments = async (reviewId: string) => {
  const res = await httpClient.get<IComment[]>(`/reviews/${reviewId}/comments`);
  console.log(res, "get review comments");
  return res;
};

export interface ICommentResposne {
  id: string;
  userId: string;
  reviewId: string;
  content: string;
  parentId: string | null;
  isDeleted: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  _count: {
    likes: number;
    replies: number;
  };
}

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

  if (!accessToken) return null;

  return (
    (await httpClient.post<IComment>(
      `/comments/${commentId}/reply`,
      { content },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    )) ?? null
  );
};

export const likeComment = async (commentId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return null;

  const res = await httpClient.post<{ liked: boolean; likesCount: number }>(
    `/comments/${commentId}/like`,
    {},
    {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    },
  );

  if (!res.success) {
    return null;
  }

  return res ?? null;
};
