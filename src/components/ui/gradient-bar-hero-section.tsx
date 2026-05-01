"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface AvatarProps {
  imageSrc: string;
  delay: number;
}

const Avatar: React.FC<AvatarProps> = ({ imageSrc, delay }) => {
  return (
    <div
      className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img
        src={imageSrc}
        alt="User avatar"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
};

const TrustElements: React.FC = () => {
  const avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
  ];

  return (
    <div className="inline-flex items-center gap-3 bg-gray-900/60 backdrop-blur-sm rounded-full py-2 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm">
      <div className="flex -space-x-2 sm:-space-x-3">
        {avatars.map((avatar, index) => (
          <Avatar key={index} imageSrc={avatar} delay={index * 200} />
        ))}
      </div>
      <p
        className="text-white animate-fade-in whitespace-nowrap"
        style={{ animationDelay: "800ms" }}
      >
        <span className="text-white font-semibold">2.4K</span> movie lovers
        already joined
      </p>
    </div>
  );
};

const MovieSearchForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    router.push(`/media?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="relative z-10 w-full">
      <form onSubmit={handleSubmit} className="flex ">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie..."
          className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-l-full rounded-r-none bg-gray-900/60 border border-gray-700 focus:border-white outline-none text-white text-sm sm:text-base shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          required
        />
        <Button
          type="submit"
          className="px-6 sm:px-8 py-3 cursor-pointer sm:py-4 rounded-r-full rounded-l-none transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base bg-white hover:bg-gray-100 text-black h-auto"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

const GradientBars: React.FC = () => {
  const [numBars] = useState(15);

  const calculateHeight = (index: number, total: number) => {
    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;

    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);

    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="flex h-full"
        style={{
          width: "100%",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              style={{
                flex: "1 0 calc(100% / 15)",
                maxWidth: "calc(100% / 15)",
                // height: "95%",
                background:
                  "linear-gradient(to top, rgb(255, 60, 0), transparent)",
                transform: `scaleY(${height / 100})`,
                transformOrigin: "bottom",
                transition: "transform 0.5s ease-in-out",
                animation: "pulseBar 2s ease-in-out infinite alternate",
                animationDelay: `${index * 0.1}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const GradientBarHeroSection: React.FC = () => {
  return (
    <section
      className="relative flex flex-col items-center px-6 sm:px-8 md:px-12 overflow-hidden"
      // style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="absolute inset-0 bg-gray-950" />
      <GradientBars />
      {/*  */}
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col md:items-center md:justify-center h-full py-8 sm:py-16">
        <div>
          <div className="mb-1 sm:mb-2">
            <TrustElements />
          </div>

          <h1 className="w-full text-white leading-tight tracking-tight mb-2 sm:mb-3 animate-fade-in px-4">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap font-medium">
              Explore The World Of Cinema
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap italic">
              Search, Rate & Review Movies.
            </span>
          </h1>

          <div className="mb-2 sm:mb-4 px-4">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed animate-fade-in">
              Find your favorite movies and share your thoughts with the world.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed animate-fade-in mt-2">
              Start searching for your next cinematic adventure below.
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-6 md:mb-6 px-4">
            <MovieSearchForm />
          </div>
        </div>

        {/* <div className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto mt-auto px-2 sm:px-4"> */}
        <Image
          height={200}
          width={200}
          loading="eager"
          src="/banner.webp"
          alt="Movie streaming preview"
          className="w-full h-auto rounded-lg shadow-2xl opacity-80"
          style={{
            boxShadow:
              "0 0 50px rgba(229, 9, 20, 0.5), 0 0 100px rgba(229, 9, 20, 0.2)",
          }}
        />
        {/* </div> */}
      </div>
    </section>
  );
};

export default GradientBarHeroSection;
