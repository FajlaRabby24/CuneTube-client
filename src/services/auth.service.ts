"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import {
  ILoginPayload,
  ILoginResponse,
  IRegisterPayload,
  IRegisterResponse,
} from "@/types/auth.types";
import {
  loginZodSchema,
  registerZodSchema,
  verifyEmailSchema,
} from "@/zod/auth.validation";
import { getDefaultDashboardRoute, UserRole } from "../lib/authUtilts";
import { setTokenInCookies } from "../lib/tokenUtils";

export const registerAction = async (payload: IRegisterPayload) => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  const dataToSend = { ...parsedPayload.data };
  if (!dataToSend.image) {
    delete dataToSend.image;
  }

  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      dataToSend,
    );
    const {
      accessToken,
      refreshToken,
      token,
      user: { needPasswordChange, email, role, emailVerified },
    } = response.data;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      token,
      60 * 60 * 24 * 7, // 7 days
    );

    if (!emailVerified) {
      return {
        success: true,
        message: "Registration successful. Please verify your email.",
        route: `/verify-email?email=${email}`,
      };
    } else if (needPasswordChange) {
      return {
        success: true,
        message: "Registration successful. Please reset your password.",
        route: `/reset-password?email=${email}`,
      };
    }

    return {
      success: true,
      message: "Registration successful.",
      route: getDefaultDashboardRoute(role as UserRole),
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Registration failed: ${error.message}`,
    };
  }
};

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
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
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );
    const {
      accessToken,
      refreshToken,
      token,
      user: { needPasswordChange, email, role, emailVerified },
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
