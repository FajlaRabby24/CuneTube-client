export interface IReview {
  id: string;
  userId: string;
  mediaId: string;
  rating: number;
  title: string | null;
  content: string;
  hasSpoiler: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  publishedAt: string | null;
  rejectedReason: string | null;
  moderatedBy: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  media: {
    id: string;
    title: string;
    slug: string;
  };
  comments: IComment[];
  _count: {
    likes: number;
    comments: number;
  };
}

export interface IComment {
  id: string;
  content: string;
  parentId?: string | null;
  likesCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}
