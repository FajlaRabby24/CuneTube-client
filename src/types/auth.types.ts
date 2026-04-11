import {
  loginZodSchema,
  registerZodSchema,
  sessionDeleteSchema,
  verifyEmailSchema,
} from "@/zod/auth.validation";
import z from "zod";

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export type IRegisterPayload = z.infer<typeof registerZodSchema>;
export type IVerifyEmailOtpPayload = z.infer<typeof verifyEmailSchema>;
export type ISessionDeletePayload = z.infer<typeof sessionDeleteSchema>;

export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    needPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    image: string;
    emailVerified: boolean;
  };
}

export interface IRegisterResponse {
  user: {
    needPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    image: string;
    emailVerified: boolean;
  };
}

export interface IVerifyEmailOtpResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    image: string;
    emailVerified: boolean;
  };
}
