import { NextRequest, NextResponse } from "next/server";
import { envVars } from "./config/env";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtilts";
import { jwtUtils } from "./lib/jwtUtils";

const JWT_SECRET = envVars.JWT_ACCESS_SECRET as string;

export const proxy = async (request: NextRequest) => {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;

    // Securely verify and decode the token
    const verification = accessToken
      ? await jwtUtils.verifyToken(accessToken, JWT_SECRET)
      : null;
    const decodedToken = verification?.success ? verification.data : null;
    const userRole = (decodedToken?.role as UserRole) || null;

    // Unify SUPER_ADMIN and ADMIN
    const effectiveRole =
      userRole === UserRole.SUPER_ADMIN ? UserRole.ADMIN : userRole;

    const isAuthPath = isAuthRoute(pathname);
    const routeOwner = getRouteOwner(pathname);

    // Rule 1: User is logged in (valid token) and trying to access an Auth route
    if (isAuthPath && decodedToken) {
      return NextResponse.redirect(
        new URL(
          getDefaultDashboardRoute(effectiveRole as UserRole),
          request.url,
        ),
      );
    }

    // Rule 2: User is NOT logged in (no token or invalid token) but trying to access a protected route
    if (!decodedToken && routeOwner !== null) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 3: Role-Based Access Control (RBAC)
    if (decodedToken && routeOwner !== null && routeOwner !== "COMMON") {
      if (routeOwner !== effectiveRole) {
        return NextResponse.redirect(
          new URL(
            getDefaultDashboardRoute(effectiveRole as UserRole),
            request.url,
          ),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    return NextResponse.next();
  }
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
