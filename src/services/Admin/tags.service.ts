"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface ITagResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count: {
    mediaTags: number;
    reviewTags: number;
  };
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  return { accessToken, sessionToken };
}

export async function getAllTags(): Promise<ITagResponse[] | null> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    const res = await httpClient.get<ITagResponse[]>("/tags", {
      headers: accessToken
        ? {
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
          }
        : undefined,
    });

    return (res.data as ITagResponse[]) ?? null;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return null;
  }
}

export interface ICreateTagResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export async function createTag(payload: {
  name: string;
  slug: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) return { success: false, message: "Not authenticated" };

    const res = await httpClient.post<ICreateTagResponse>("/tags", payload, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.success) {
      return { success: false, message: res.message };
    }

    return { success: true, message: res.message };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { success: false, message: "Failed to create tag" };
  }
}

export type IUpdateTagResponse = ITagResponse;

export async function updateTag(
  tagId: string,
  payload: { name?: string; slug?: string },
): Promise<{ success: boolean; message: string }> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) return { success: false, message: "Not authenticated" };

    const res = await httpClient.patch<IUpdateTagResponse>(
      `/tags/${tagId}`,
      payload,
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    if (!res.success) {
      return { success: false, message: res.message };
    }

    return { success: true, message: res.message };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { success: false, message: "Failed to update tag" };
  }
}

export async function deleteTag(
  tagId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) return { success: false, message: "Not authenticated" };

    const res = await httpClient.delete(`/tags/${tagId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.success) {
      return { success: false, message: res.message };
    }

    return { success: true, message: res.message };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, message: "Failed to delete tag" };
  }
}
