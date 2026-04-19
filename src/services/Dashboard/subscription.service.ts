"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface ISubscriptionPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface ISubscription {
  id: string;
  userId: string;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "EXPIRED";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  payments: ISubscriptionPayment[];
}

export interface IGetSubscriptionResponse {
  success: boolean;
  message: string;
  data: ISubscription | null;
}

export async function getUserSubscriptions(queryString: string = ""): Promise<IGetSubscriptionResponse | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/subscriptions${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetSubscriptionResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return (res as any) ?? null;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return null;
  }
}

export async function cancelUserSubscription() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }

    const res = await httpClient.post("/subscriptions/cancel", {}, {
      headers: {
        Authorization: accessToken,
      },
    });

    return { success: true, message: "Subscription cancelled successfully", data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to cancel subscription",
    };
  }
}
