"use server";

import { getSessionCookieName, setTokenInCookies } from "@/lib/tokenUtils";

export const syncGoogleAuthAction = async (
  accessToken: string,
  refreshToken: string,
  sessionToken: string,
) => {
  if (!accessToken || !refreshToken || !sessionToken) {
    return { success: false, message: "Missing tokens" };
  }

  try {
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      await getSessionCookieName(),
      sessionToken,
      60 * 60 * 24 * 7, // 7 days
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to sync tokens:", error);
    return { success: false, message: "Token sync failed" };
  }
};
