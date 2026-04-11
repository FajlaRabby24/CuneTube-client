"use server";

import { UserRole } from "@/lib/authUtilts";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

// ✅ Refresh token
export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await httpClient.post("/auth/refresh-token", {
      headers: {
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    if (!res.success) return false;
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export interface IUserInfo {
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  isActive: boolean;
  isBanned: boolean;
  id: string;
  emailVerified: boolean;
  needPasswordChange: boolean;
  sessions: {
    id: string;
    token: string;
  }[];
}

// ✅ Get user info
export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await httpClient.get<IUserInfo>("/auth/me", {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.success) return null;

    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
