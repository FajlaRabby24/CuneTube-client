import {
  loginZodSchema,
  registerZodSchema,
  verifyEmailSchema,
} from "@/zod/auth.validation";
import z from "zod";

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export type IRegisterPayload = z.infer<typeof registerZodSchema>;
export type IVerifyEmailOtpPayload = z.infer<typeof verifyEmailSchema>;

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
