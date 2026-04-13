"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface ICreateAdminPayload {
  name: string;
  email: string;
  password: string;
}

export async function createAdmin(payload: ICreateAdminPayload) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }
    console.log(payload, "payload");
    const url = `/admin/create-admin`;
    const res = await httpClient.post(url, payload, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    if (res.success) {
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (error: unknown) {
    console.error("Error creating admin:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to create admin",
      };
    }
    return { success: false, message: "Failed to create admin" };
  }
}
