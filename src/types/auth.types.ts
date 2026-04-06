import { loginZodSchema, registerZodSchema } from "@/zod/auth.validation";
import z from "zod";

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  needPasswordChange: boolean;
  email: string;
  name: string;
  role: string;
  image: string;
  emailVerified: boolean;
}

/**
 * {
    "success": true,
    "message": "User logged in successfully",
    "data": {
        "id": "OG8wnJPhyxnIUA4b0Uzeg0eoZBT1FARi",
        "name": "Super Admin",
        "email": "super.admin@gmail.com",
        "image": null,
        "bio": "This is super admin bio",
        "role": "SUPER_ADMIN"
    }
}
 */

export interface IRegisterResponse {
  success: boolean;
  message: string;
}
