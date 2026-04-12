"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IUserActionResponse {
  success: boolean;
  message: string;
}

export async function banUser(userId: string, reason?: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.post<{ success: boolean; message: string }>(
      `/admin/users/${userId}/ban`,
      { reason },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.data.success, message: res.data.message };
  } catch (error) {
    console.error("Error banning user:", error);
    return { success: false, message: "Failed to ban user" };
  }
}

export async function unbanUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.post<{ success: boolean; message: string }>(
      `/admin/users/${userId}/unban`,
      {},
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.data.success, message: res.data.message };
  } catch (error) {
    console.error("Error unbanning user:", error);
    return { success: false, message: "Failed to unban user" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.delete<{ success: boolean; message: string }>(
      `/admin/users/${userId}`,
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.data.success, message: res.data.message };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch<{ success: boolean; message: string }>(
      `/admin/users/${userId}/status`,
      { isActive },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.data.success, message: res.data.message };
  } catch (error) {
    console.error("Error toggling user active:", error);
    return { success: false, message: "Failed to update user status" };
  }
}