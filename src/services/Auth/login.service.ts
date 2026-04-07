"use server";

import { getDefaultDashboardRoute, UserRole } from "../../lib/authUtilts";
import { httpClient } from "../../lib/axios/httpClient";
import { setTokenInCookies } from "../../lib/tokenUtils";
import { ILoginPayload, ILoginResponse } from "../../types/auth.types";
import { loginZodSchema } from "../../zod/auth.validation";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const loginAction = async (payload: ILoginPayload) => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );
    const {
      accessToken,
      refreshToken,
      token,
      user: { needPasswordChange, email, role },
    } = response.data;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      token,
      60 * 60 * 24 * 7, // 7 days
    );

    if (needPasswordChange) {
      return {
        success: true,
        message: "Please first reset your password.",
        route: `/reset-password?email=${email}`,
      };
    }

    return {
      success: true,
      message: "Registration successful.",
      route: getDefaultDashboardRoute(role as UserRole),
    };
  } catch (error: any) {
    if (
      !error?.response?.data?.success &&
      error?.response?.data?.message === "Email not verified"
    ) {
      return {
        success: true,
        message: "Login successful. Please verify your email.",
        route: `/verify-email?email=${payload.email}`,
      };
    }
    return {
      success: false,
      message: `Login failed: ${error?.response?.data?.message}`,
    };
  }
};
