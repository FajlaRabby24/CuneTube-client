"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IMyProfileResponse {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isActive: boolean;
  role: string;
  phoneNumber: string | null;
  bio: string | null;
  accounts: { id: string }[];
  watchlists: unknown[];
  reviews: unknown[];
  subscription: unknown | null;
  comments: unknown[];
  notifications: unknown[];
  payments: unknown[];
  reports: unknown[];
  reviewLikes: unknown[];
  sessions: { id: string; userAgent: string; token: string }[];
  admin: { id: string } | null;
}

export async function getMyProfile() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await httpClient.get<IMyProfileResponse>("/auth/my-profile", {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching my profile:", error);
    return null;
  }
}
