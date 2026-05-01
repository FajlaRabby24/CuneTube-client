"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { httpClient } from "../../lib/axios/httpClient";
import { updateProfileSchema } from "../../zod/auth.validation";

export interface IUpdateProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
  };
  accessToken: string;
  refreshToken: string;
}
export const updateProfileAction = async (payload: {
  name?: string;
  image?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
}) => {
  const parsedPayload = updateProfileSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.patch<IUpdateProfileResponse>(
      "/auth/me",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Profile update failed",
      };
    }

    const { accessToken, refreshToken } = response.data;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);

    return {
      success: true,
      message: "Profile updated successfully",
      data: response.data,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to update profile",
    };
  }
};
