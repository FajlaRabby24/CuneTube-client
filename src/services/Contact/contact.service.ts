"use server";

import { cookies } from "next/headers";
import { httpClient } from "@/lib/axios/httpClient";

export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export async function submitContactForm(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    const res = await httpClient.post("/contact", payload);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Something went wrong while sending message",
    };
  }
}

export async function getAllContactMessages(queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/contact${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IContactMessage[]>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return res ?? null;
  } catch (error) {
    return null;
  }
}
