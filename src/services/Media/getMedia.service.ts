"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ContentStatus } from "@/lib/enum";

export interface IMediasResponse {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  posterUrl: string | null;
  averageRating: number;
  releaseYear: number;
}

export interface IMediaResponse {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  type: string;
  releaseYear: number;
  ageRating: string;
  duration: number;
  totalSeasons: number | null;
  totalEpisodes: number | null;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  youtubeStreamUrl: string;
  imdbId: string;
  language: string;
  country: string;
  pricingType: string;
  averageRating: number;
  totalReviews: number;
  totalViews: number;
  isFeatured: boolean;
  status: ContentStatus;
  isEditorsPick: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
  genres: {
    id: string;
    genre: string;
  }[];
  platforms: {
    id: string;
    platform: string;
    streamUrl: string;
  }[];
  castMembers: {
    id: string;
    actorName: string;
    character: string;
    profileUrl: string;
    orderIndex: number;
  }[];
  directors: {
    id: string;
    directorName: string;
    profileUrl: string;
  }[];
  tags: {
    id: string;
    tag: {
      id: string;
      name: string;
      slug: string;
      createdAt: string;
    };
  }[];
}

export async function getAllMedia(queryString: string) {
  try {
    const url = `/media${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IMediasResponse[]>(url);
    console.log(res, "media service");
    return res ?? null;
  } catch (error) {
    console.error("Error fetching media:", error);
    return null;
  }
}

export async function getMediaBySlug(slug: string) {
  try {
    const url = `/media/${slug}`;
    const res = await httpClient.get<IMediaResponse>(url);
    return res.data ?? null;
  } catch (error) {
    console.error("Error fetching media by slug:", error);
    return null;
  }
}
