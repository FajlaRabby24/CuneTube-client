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

    const res = await httpClient.get<ISubscriptionResponse>("/subscriptions", {
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

    const res = await httpClient.post<{
      sessionId: string;
      paymentUrl: string;
    }>(
      "/subscriptions/create-checkout-session",
      { plan },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return res ?? null;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return null;
  }
}
export async function createCustomerPortalSession() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await httpClient.post<{
      url: string;
    }>(
      "/subscriptions/create-customer-portal",
      {},
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return res ?? null;
  } catch (error) {
    console.error("Error creating portal session:", error);
    return null;
  }
}
