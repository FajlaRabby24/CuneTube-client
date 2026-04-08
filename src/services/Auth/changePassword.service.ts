"use server";

import { httpClient } from "../../lib/axios/httpClient";
import { changePasswordSchema } from "../../zod/auth.validation";

export const changePasswordAction = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  const parsedPayload = changePasswordSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    await httpClient.post("/auth/change-password", parsedPayload.data);
    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to change password",
    };
  }
};