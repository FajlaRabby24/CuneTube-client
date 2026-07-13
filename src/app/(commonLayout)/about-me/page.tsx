import AboutMeContent from "@/components/about/AboutMeContent";
import { BackgroundEffects } from "@/components/ui/background-effects";

export const metadata = {
  title: "About Me - CineTube",
  description: "Learn more about Fajla Rabby, Full Stack Web Developer and the creator of CineTube.",
};

export default function AboutMePage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-start justify-center pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Cinematic theme background effects */}
      <BackgroundEffects />

      <div className="max-w-6xl w-full space-y-6 z-10">
        {/* About Me Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            About <span className="text-red-500">Me</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto font-medium">
            Discover my programming journey, skill stack, projects, and future engineering goals.
          </p>
        </div>

        {/* Bento Grid Content */}
        <AboutMeContent />
      </div>
    </div>
  );
}
