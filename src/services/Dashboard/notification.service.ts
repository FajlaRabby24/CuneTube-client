"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface INotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface INotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getUserNotifications(queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/notifications${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<INotification[]>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    console.log(res, "notification service");

    return res ?? null;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }

    const res = await httpClient.patch(
      "/notifications/read-all",
      {},
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return res;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Failed to mark notifications as read",
    };
  }
}
