/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "../../lib/authUtilts";
import { httpClient } from "../../lib/axios/httpClient";
import { setTokenInCookies } from "../../lib/tokenUtils";
import { IRegisterPayload, IRegisterResponse } from "../../types/auth.types";
import { registerZodSchema } from "../../zod/auth.validation";

export const registerAction = async (
  payload: IRegisterPayload,
  redirectPath?: string,
) => {
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
      route:
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole),
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Registration failed: ${error.message}`,
    };
  }
};
