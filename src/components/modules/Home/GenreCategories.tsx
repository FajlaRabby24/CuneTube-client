"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const genres = [
  { id: 1, name: "Action", count: 1250 },
  { id: 2, name: "Comedy", count: 980 },
  { id: 3, name: "Drama", count: 1560 },
  { id: 4, name: "Horror", count: 720 },
  { id: 5, name: "Sci-Fi", count: 540 },
  { id: 6, name: "Thriller", count: 890 },
  { id: 7, name: "Romance", count: 760 },
  { id: 8, name: "Animation", count: 380 },
];

const GenreCategories = () => {
  return (
    <section className="w-full bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Browse by Genre
        </h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {genres.map((genre) => (
            <Link key={genre.id} href={`/movies?genre=${genre.id}`}>
              <Button
                variant="outline"
                className="h-auto w-full flex-col py-4 hover:bg-primary hover:text-primary-foreground"
              >
                <span className="text-base font-semibold">{genre.name}</span>
                <span className="text-xs opacity-70">{genre.count} movies</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreCategories;
