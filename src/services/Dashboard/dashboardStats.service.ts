"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface IDashboardStats {
  users: {
    total: number;
    active: number;
    banned: number;
  };
  media: {
    total: number;
    movies: number;
    series: number;
  };
  revenue: {
    total: number;
    monthly: number;
    yearly: number;
  };
  pending: {
    reviews: number;
    reports: number;
  };
}

export const getDashboardStats = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }
    const res = await httpClient.get<IDashboardStats>("/admin/stats", {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.success) {
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};
