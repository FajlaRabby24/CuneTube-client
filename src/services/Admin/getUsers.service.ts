"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  bio: string | null;
  isActive: boolean;
  isBanned: boolean;
  bannedReason: string | null;
  phoneNumber: string | null;
  bannedAt: string | null;
  needPasswordChange: boolean;
  subscription: unknown | null;
}

export type IUsersResponse = IUser;

export interface IGetUsersApiResponse {
  data: IUsersResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAllUsers(queryString: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/admin/users${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetUsersApiResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    console.log(res.data, "users");
    return res.data ?? null; // ✅ return করো
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // ✅ undefined এর বদলে null return করো
  }
}
