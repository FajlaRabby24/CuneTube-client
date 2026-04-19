"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IPayment {
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
}

export interface IPaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetPaymentsResponse {
  success: boolean;
  message: string;
  data: IPayment[];
  meta: IPaymentMeta;
}

export async function getUserPayments(
  queryString: string = "",
): Promise<IGetPaymentsResponse | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/payments${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetPaymentsResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    console.log(res, "payment.servicer");
    return (res as any) ?? null;
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return null;
  }
}
