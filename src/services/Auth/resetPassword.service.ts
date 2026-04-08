"use server";

import { httpClient } from "../../lib/axios/httpClient";
import { resetPasswordSchema } from "../../zod/auth.validation";

export const resetPasswordAction = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const parsedPayload = resetPasswordSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    await httpClient.post("/auth/reset-password", parsedPayload.data);
    return {
      success: true,
      message: "Password reset successfully",
      route: "/login",
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to reset password",
    };
  }
};