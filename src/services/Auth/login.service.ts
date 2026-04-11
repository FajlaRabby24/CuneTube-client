"use server";

import { envVars } from "@/config/env";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "../../lib/authUtilts";
import { httpClient } from "../../lib/axios/httpClient";
import { setTokenInCookies } from "../../lib/tokenUtils";
import { ILoginPayload, ILoginResponse } from "../../types/auth.types";
import { loginZodSchema } from "../../zod/auth.validation";

/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
  userAgent?: string,
) => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }
  try {
    const response = await httpClient.post<ILoginResponse>("/auth/login", {
      ...parsedPayload.data,
      userAgent: userAgent ?? "unknown",
    });
    const {
      accessToken,
      refreshToken,
      token,
      user: { needPasswordChange, email, role },
    } = response.data;

    if (!accessToken || !refreshToken || !token) {
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }

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
        route: `/reset-password?email=${email}${redirectPath ? `&redirectPath=${redirectPath}` : ""}`,
      };
    }

    return {
      success: true,
      message: "Login successful.",
      route:
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole),
    };
  } catch (error: any) {
    if (
      !error?.response?.data?.success &&
      error?.response?.data?.message === "Email not verified"
    ) {
      return {
        success: true,
        message: "Login successful. Please verify your email.",
        route: `/verify-email?email=${payload.email}${redirectPath ? `&redirectPath=${redirectPath}` : ""}`,
      };
    }
    return {
      success: false,
      message: `Login failed: ${error?.response?.data?.message}`,
    };
  }
};
