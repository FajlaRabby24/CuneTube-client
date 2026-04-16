"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface ICommentReview {
  id: string;
  title: string | null;
  media: {
    title: string;
    posterUrl: string | null;
  };
}

export interface IComment {
  id: string;
  userId: string;
  reviewId: string;
  parentId: string | null;
  content: string;
  likesCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  review?: ICommentReview;
  _count: {
    likes: number;
    replies: number;
  };
}

export interface ICommentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetCommentsResponse {
  success: boolean;
  message: string;
  data: IComment[];
  meta: ICommentMeta;
}

export async function getUserComments(queryString: string = ""): Promise<IGetCommentsResponse | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/comment${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetCommentsResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return (res as any) ?? null;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return null;
  }
}

export async function deleteUserComment(commentId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }

    const res = await httpClient.delete(`/comment/${commentId}`, {
      headers: {
        Authorization: accessToken,
      },
    });

    return { success: true, message: "Comment deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete comment",
    };
  }
}

export async function updateUserComment(commentId: string, content: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }

    const res = await httpClient.patch(`/comment/${commentId}`, { content }, {
      headers: {
        Authorization: accessToken,
      },
    });

    return { success: true, message: "Comment updated successfully", data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update comment",
    };
  }
}
