import { jwtVerify, decodeJwt, JWTPayload } from "jose";

export const jwtUtils = {
  verifyToken: async (token: string, secret: string) => {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
      );
      return {
        success: true,
        data: payload as JWTPayload & { role?: string },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  },

  decodedToken: (token: string) => {
    try {
      const decoded = decodeJwt(token);
      return decoded as JWTPayload & { role?: string };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};
