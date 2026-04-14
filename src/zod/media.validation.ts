import { z } from "zod";

export const MediaTypeEnum = z.enum(["MOVIE", "SERIES"]);
export const AgeRatingEnum = z.enum(["G", "PG", "PG_13", "R", "NC_17", "TV_Y", "TV_14", "TV_MA"]);
export const PricingTypeEnum = z.enum(["FREE", "PREMIUM"]); // BASIC removed per prisma
export const ContentStatusEnum = z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]);
export const StreamingPlatformEnum = z.enum(["YOUTUBE"]);
export const GenreEnum = z.enum([
  "ACTION", "ADVENTURE", "ANIMATION", "COMEDY", "CRIME",
  "DOCUMENTARY", "DRAMA", "FANTASY", "HORROR", "MYSTERY",
  "ROMANCE", "SCI_FI", "THRILLER", "WESTERN", "FAMILY",
  "MUSICAL", "BIOGRAPHY", "SPORT", "WAR", "HISTORY"
]);

export const createMediaZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  type: MediaTypeEnum,
  releaseYear: z.coerce.number().int().min(1800).max(new Date().getFullYear() + 5),
  ageRating: AgeRatingEnum.optional(),
  duration: z.coerce.number().int().optional(),
  totalSeasons: z.coerce.number().int().optional(),
  totalEpisodes: z.coerce.number().int().optional(),
  posterUrl: z.string().url().optional().or(z.literal("")),
  backdropUrl: z.string().url().optional().or(z.literal("")),
  trailerUrl: z.string().url().optional().or(z.literal("")),
  youtubeStreamUrl: z.string().url().optional().or(z.literal("")),
  imdbId: z.string().optional(),
  language: z.string().optional(),
  country: z.string().optional(),
  pricingType: PricingTypeEnum.optional(),
  status: ContentStatusEnum.optional(),
  isFeatured: z.boolean().optional(),
  isEditorsPick: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  genres: z.array(GenreEnum).min(1, "At least one genre is required"),
  platforms: z.array(
    z.object({
      platform: StreamingPlatformEnum,
      streamUrl: z.string().url().optional().or(z.literal("")),
    })
  ).optional(),
  castMembers: z.array(
    z.object({
      actorName: z.string(),
      character: z.string().optional(),
      profileUrl: z.string().url().optional().or(z.literal("")),
    })
  ).optional(),
  directors: z.array(
    z.object({
      directorName: z.string(),
      profileUrl: z.string().url().optional().or(z.literal("")),
    })
  ).optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateMediaInput = z.infer<typeof createMediaZodSchema>;
