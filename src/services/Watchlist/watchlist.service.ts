"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export async function addToWatchlist(mediaId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "User not logged in" };
    }

    const res = await httpClient.post(
      `/watchlist/${mediaId}`,
      {},
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return res;
  } catch (error: any) {
    console.error("Error adding to watchlist:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
}
