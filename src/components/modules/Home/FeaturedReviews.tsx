"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reviews = [
  {
    id: 1,
    movieTitle: "The Dark Knight",
    user: { name: "John Doe", avatar: "/placeholder-avatar.jpg" },
    rating: 10,
    content: "A masterpiece of cinema. Heath Ledger's Joker is legendary...",
    likes: 245,
  },
  {
    id: 2,
    movieTitle: "Inception",
    user: { name: "Jane Smith", avatar: "/placeholder-avatar.jpg" },
    rating: 9,
    content: "Mind-bending concept executed perfectly. The ending...",
    likes: 189,
  },
  {
    id: 3,
    movieTitle: "Interstellar",
    user: { name: "Mike Wilson", avatar: "/placeholder-avatar.jpg" },
    rating: 9,
    content: "Visually stunning and emotionally powerful. Hans Zimmer...",
    likes: 156,
  },
];

const FeaturedReviews = () => {
  return (
    <section className="w-full bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Featured Reviews
        </h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={review.user.avatar}
                      alt={review.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base">{review.movieTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {review.user.name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-2 flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < review.rating ? "text-yellow-500" : "text-muted"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{review.content}</p>
              </CardContent>
              <CardContent className="pt-0">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <span>♥</span>
                  <span>{review.likes} likes</span>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
