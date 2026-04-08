"use server";

import { envVars } from "@/config/env";
import { UserRole } from "@/lib/authUtilts";
import { cookies } from "next/headers";
import { httpClient } from "../../lib/axios/httpClient";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

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

    if (!res.success) {
      return false;
    }

    // Cookies are already set via set-cookie headers in the response
    // No need to manually set them
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
  isActive: boolean | null;
  isBanned: boolean | null;
  id: string;
  emailVerified: true;
  needPasswordChange: boolean;
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    // console.log(`tokens from client`, { accessToken, sessionToken });

    if (!accessToken) {
      return null;
    }

    const res = await httpClient.get<IUserInfo>("/auth/me", {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.success) {
      return null;
    }

    const data = res.data;
    console.log({ data }, "from get me service");

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
