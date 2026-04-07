/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "../../lib/axios/httpClient";
import { verifyEmailSchema } from "../../zod/auth.validation";

export const verifyEmailAction = async (email: string, otp: string) => {
  console.log({ email, otp }, "verify email");
  const parsedPayload = verifyEmailSchema.safeParse({ email, otp });
  console.log(parsedPayload.error, "parsed payloadd");
  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    await httpClient.post("/auth/verify-email-otp", {
      email,
      otp,
    });

    return {
      success: true,
      message: "Email verification successful.",
      route: "/",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Email verification failed: ${error?.response?.data?.message}`,
    };
  }
};
