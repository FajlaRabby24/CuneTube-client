"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface IAdminUser {
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
}

export interface IAdminListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isBanned: boolean;
  image: string | null;
  createdAt: string;
  admin: {
    id: string;
  };
}

export interface IAdminDetails {
  id: string;
  userId: string;
  designation: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  user: IAdminUser;
}

export async function getAllAdmins(queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/admin/admins${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IAdminListItem[]>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    // console.log(res, "get admin service");
    return res ?? null;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return null;
  }
}

export async function getAdminById(adminId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }
    const url = `/admin/admins/${adminId}`;
    const res = await httpClient.get<IAdminDetails>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    return res.data ?? null;
  } catch (error) {
    console.error("Error fetching admin:", error);
    return null;
  }
}
