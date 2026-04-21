"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface IReviewMedia {
  id: string;
  title: string;
  slug: string;
  posterUrl: string | null;
}

export interface IReview {
  id: string;
  userId: string;
  mediaId: string;
  rating: number;
  title: string | null;
  content: string;
  hasSpoiler: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedReason: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  media: IReviewMedia;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface IReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetReviewsResponse {
  success: boolean;
  message: string;
  data: IReview[];
  meta: IReviewMeta;
}

export async function getUserReviews(
  queryString: string = "",
): Promise<IGetReviewsResponse | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/reviews${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetReviewsResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return (res as any) ?? null;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return null;
  }
}

export async function deleteUserReview(reviewId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }

    const res = await httpClient.delete(`/reviews/${reviewId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return { success: true, message: "Review deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete review",
    };
  }
}
