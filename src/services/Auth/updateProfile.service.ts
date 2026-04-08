"use server";

import { httpClient } from "../../lib/axios/httpClient";
import { updateProfileSchema } from "../../zod/auth.validation";

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
    const response = await httpClient.put("/auth/profile", parsedPayload.data);
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