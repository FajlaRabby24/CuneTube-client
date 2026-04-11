"use server";

import { envVars } from "@/config/env";
import { UserRole } from "@/lib/authUtilts";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

// ✅ Helper — সব cookie string এ convert
async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// ✅ Helper — backend set-cookie গুলো Next.js এ forward
async function forwardSetCookies(res: Response): Promise<void> {
  const setCookies = res.headers.getSetCookie();
  if (!setCookies.length) return;

  const cookieStore = await cookies();

  for (const cookieStr of setCookies) {
    const parts = cookieStr.split(";").map((p) => p.trim());
    const [nameValue, ...attributes] = parts;
    const eqIndex = nameValue.indexOf("=");
    if (eqIndex === -1) continue;

    const name = nameValue.slice(0, eqIndex).trim();
    const value = nameValue.slice(eqIndex + 1).trim();
    const options: Record<string, string | boolean | number | Date> = {};

    for (const attr of attributes) {
      const lAttr = attr.toLowerCase();
      if (lAttr === "httponly") options.httpOnly = true;
      else if (lAttr === "secure") options.secure = true;
      else if (lAttr.startsWith("max-age="))
        options.maxAge = parseInt(attr.split("=")[1]);
      else if (lAttr.startsWith("path=")) options.path = attr.split("=")[1];
      else if (lAttr.startsWith("samesite="))
        options.sameSite = attr.split("=")[1].toLowerCase() as
          | "strict"
          | "lax"
          | "none";
      else if (lAttr.startsWith("expires="))
        options.expires = new Date(attr.split("=")[1]);
    }

    cookieStore.set(name, value, options);
  }
}

// ✅ Refresh token
export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const cookieHeader = await getCookieHeader();

    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) return false;

    await forwardSetCookies(res);

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export interface IUserInfo {
  success: boolean;
  message: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  isActive: boolean;
  isBanned: boolean;
  id: string;
  emailVerified: boolean;
  needPasswordChange: boolean;
}

// ✅ Get user info
export async function getUserInfo(): Promise<IUserInfo | null> {
  try {
    const cookieHeader = await getCookieHeader();

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    await forwardSetCookies(res);

    const data = await res.json();
    return data?.data ?? null;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
