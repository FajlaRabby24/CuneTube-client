export interface IReview {
  id: string;
  userId: string;
  mediaId: string;
  rating: number;
  title?: string;
  content: string;
  hasSpoiler: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export interface IComment {
  id: string;
  userId: string;
  reviewId: string;
  content: string;
  parentId?: string | null;
  isDeleted: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  replies?: IComment[];
  _count?: {
    likes: number;
    replies: number;
  };
}
