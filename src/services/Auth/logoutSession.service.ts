"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface ILogoutSessionResponse {
  success: boolean;
  message: string;
}

export async function logoutSession(sessionId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.delete<ILogoutSessionResponse>(
      `/auth/logout/${sessionId}`,
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.success, message: res.message };
  } catch (error) {
    console.error("Error logging out session:", error);
    return { success: false, message: "Failed to logout session" };
  }
}
