"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export const createReport = async (payload: {
  targetType: "REVIEW" | "COMMENT";
  targetId: string;
  reason: string;
  description?: string;
  reviewId?: string;
  commentId?: string;
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) return { success: false, message: "Unauthorized" };

  return await httpClient.post("/reports", payload, {
    headers: {
      Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
    },
  });
};
