"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface ISubscriptionResponse {
  id: string;
  userId: string;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export async function getUserSubscription() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await httpClient.get<ISubscriptionResponse>("/subscription", {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.success) return null;
    return res.data;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

export async function createCheckoutSession(plan: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await httpClient.post<{ sessionId: string; paymentUrl: string }>(
      "/subscription/create-checkout-session",
      { plan },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return res;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { success: false, message: "Failed to create checkout session" };
  }
}
