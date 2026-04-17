"use server";

import { decodeJwt, JWTPayload } from "jose";
import { setCookie } from "./cookieUtils";

const getTokenSecondRemaining = (token: string): number => {
  if (!token) {
    return 0;
  }

  try {
    const tokenPayload = decodeJwt(token) as JWTPayload;
    if (tokenPayload && !tokenPayload.exp) {
      return 0;
    }

    const remainingSeconds =
      (tokenPayload.exp as number) - Math.floor(Date.now() / 1000);

    return remainingSeconds > 0 ? remainingSeconds : 0;
  } catch (error) {
    console.log(`Error decoding token: ${error}`);
    return 0;
  }
};

export const setTokenInCookies = async (
  name: string,
  token: string,
  fallbackMaxAgeInSeconds = 60 * 60 * 24 * 7,
) => {
  let maxAgeInSeconds;

  if (name !== "better-auth.session_token") {
    maxAgeInSeconds = getTokenSecondRemaining(token);
  }

  await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
};

export async function isTokenExpiringSoon(
  token: string,
  thresholdInSeconds = 300,
): Promise<boolean> {
  const remainingSeconds = getTokenSecondRemaining(token);
  return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}

export async function isTokenExpired(token: string): Promise<boolean> {
  const remainingSeconds = getTokenSecondRemaining(token);
  return remainingSeconds === 0;
}
