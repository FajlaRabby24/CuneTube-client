export enum Role {
  USER,
  ADMIN,
  SUPER_ADMIN,
}

export enum MediaType {
  MOVIE,
  SERIES,
}

export enum ContentStatus {
  DRAFT,
  PUBLISHED,
  UNPUBLISHED,
}

export enum ReviewStatus {
  PENDING, // awaiting admin approval
  APPROVED,
  REJECTED,
}

export enum PricingType {
  FREE,
  PREMIUM,
}

// FREE added for homepage pricing card (free tier)
export enum SubscriptionPlan {
  FREE,
  MONTHLY,
  YEARLY,
}

export enum SubscriptionStatus {
  ACTIVE,
  CANCELLED,
  EXPIRED,
  PAST_DUE,
}

export enum PaymentStatus {
  PENDING,
  SUCCEEDED,
  FAILED,
  REFUNDED,
}

export enum AgeRating {
  G, // General audiences
  PG, // Parental guidance
  PG_13, // Parents strongly cautioned
  R, // Restricted
  NC_17, // Adults only
  TV_Y, // All children
  TV_14, // Parents strongly cautioned (TV)
  TV_MA, // Mature audiences only
}

export enum Genre {
  ACTION,
  ADVENTURE,
  ANIMATION,
  COMEDY,
  CRIME,
  DOCUMENTARY,
  DRAMA,
  FANTASY,
  HORROR,
  MYSTERY,
  ROMANCE,
  SCI_FI,
  THRILLER,
  WESTERN,
  FAMILY,
  MUSICAL,
  BIOGRAPHY,
  SPORT,
  WAR,
  HISTORY,
}

export enum StreamingPlatform {
  YOUTUBE,
}

export enum NotificationType {
  REVIEW_APPROVED,
  REVIEW_REJECTED,
  REVIEW_LIKED,
  COMMENT_RECEIVED,
  COMMENT_REPLIED,
  SUBSCRIPTION_ACTIVATED,
  SUBSCRIPTION_EXPIRED,
  PAYMENT_SUCCEEDED,
  PAYMENT_FAILED,
  REPORT_RESOLVED,
}

export enum ReportReason {
  SPAM,
  SPOILER_WITHOUT_WARNING,
  HATE_SPEECH,
  INAPPROPRIATE_CONTENT,
  MISINFORMATION,
  OTHER,
}

export enum ReportStatus {
  PENDING,
  REVIEWED,
  RESOLVED,
  DISMISSED,
}

export enum ReportTargetType {
  REVIEW,
  COMMENT,
}

export enum AuditAction {
  REVIEW_APPROVED,
  REVIEW_REJECTED,
  REVIEW_DELETED,
  COMMENT_DELETED,
  USER_BANNED,
  USER_UNBANNED,
  MEDIA_CREATED,
  MEDIA_UPDATED,
  MEDIA_DELETED,
  REPORT_RESOLVED,
  REPORT_DISMISSED,
  SUBSCRIPTION_REFUNDED,
  PRICING_PLAN_CREATED,
  PRICING_PLAN_UPDATED,
}
