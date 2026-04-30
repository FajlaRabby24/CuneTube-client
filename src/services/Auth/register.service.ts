"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "../../lib/axios/httpClient";
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

    // const {
    //   user: { needPasswordChange, email, role, emailVerified },
    // } = response.data;

    // if (!emailVerified) {
    //   return {
    //     success: true,
    //     message: "Registration successful. Please verify your email.",
    //     route: `/verify-email?email=${email}${redirectPath ? `&redirectPath=${redirectPath}` : ""}`,
    //   };
    // } else if (needPasswordChange) {
    //   return {
    //     success: true,
    //     message: "Registration successful. Please reset your password.",
    //     route: `/reset-password?email=${email}${redirectPath ? `&redirectPath=${redirectPath}` : ""}`,
    //   };
    // }

    if (!response.success) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }

    return {
      success: true,
      message: "Registration successful. Please login",
      route: "/login",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Registration failed: ${error.message}`,
    };
  }
};
