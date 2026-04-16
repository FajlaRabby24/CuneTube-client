"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface IPaymentUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface IPaymentResponse {
  id: string;
  userId: string;
  subscriptionId: string | null;
  stripePaymentIntentId: string | null;
  stripeInvoiceId: string | null;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  plan: "MONTHLY" | "YEARLY" | null;
  description: string | null;
  refundedAt: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  createdAt: string;
  updatedAt: string;
  user?: IPaymentUser;
  subscription?: any;
}

export async function getAllPayments(queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/payments/admin${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IPaymentResponse[]>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return res ?? null;
  } catch (error) {
    console.error("Error fetching admin payments:", error);
    return null;
  }
}
