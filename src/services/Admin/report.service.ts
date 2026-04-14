"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";
import { ReportReason, ReportStatus, ReportTargetType } from "@/lib/enum";

export interface IReportUser {
  id: string;
  name: string;
  email: string;
}

export interface IReportTargetData {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
}

export interface IReport {
  id: string;
  userId: string;
  targetType: keyof typeof ReportTargetType;
  targetId: string;
  reason: keyof typeof ReportReason;
  description: string | null;
  status: keyof typeof ReportStatus;
  resolvedBy: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  user: IReportUser;
  review?: IReportTargetData | null;
  comment?: IReportTargetData | null;
}

export interface IGetReportsApiResponse {
  data: IReport[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAllReports(queryString: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/reports/all${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetReportsApiResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    
    return { data: res.data ?? null, meta: res.meta ?? null };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return null;
  }
}

export async function resolveReport(reportId: string, resolution: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch(
      `/reports/${reportId}/resolve`,
      { resolution },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      }
    );

    return { success: res.success, message: res.message };
  } catch (error: any) {
    console.error("Error resolving report:", error);
    return { success: false, message: error?.message || "Failed to resolve report" };
  }
}

export async function dismissReport(reportId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch(
      `/reports/${reportId}/dismiss`,
      {},
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      }
    );

    return { success: res.success, message: res.message };
  } catch (error: any) {
    console.error("Error dismissing report:", error);
    return { success: false, message: error?.message || "Failed to dismiss report" };
  }
}
