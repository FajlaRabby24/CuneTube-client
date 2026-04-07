"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const trendingMovies = [
  { id: 1, title: "The Dark Knight", year: 2008, rating: 9.0, image: "/placeholder-movie.jpg" },
  { id: 2, title: "Inception", year: 2010, rating: 8.8, image: "/placeholder-movie.jpg" },
  { id: 3, title: "Interstellar", year: 2014, rating: 8.6, image: "/placeholder-movie.jpg" },
  { id: 4, title: "The Prestige", year: 2006, rating: 8.5, image: "/placeholder-movie.jpg" },
  { id: 5, title: "Tenet", year: 2020, rating: 7.3, image: "/placeholder-movie.jpg" },
];

const TrendingMovies = () => {
  return (
    <section className="w-full bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Trending Movies
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/movies">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {trendingMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-muted">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-sm font-medium text-white">
                    <span>★</span>
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <CardContent className="p-3">
                  <CardTitle className="line-clamp-1 text-base">{movie.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{movie.year}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
