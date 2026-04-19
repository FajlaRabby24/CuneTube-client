import Banner from "@/components/modules/Home/Banner";
import CTASection from "@/components/modules/Home/CTASection";
import FeaturedReviews from "@/components/modules/Home/FeaturedReviews";
import GenreCategories from "@/components/modules/Home/GenreCategories";
import Stats from "@/components/modules/Home/Stats";
import TopRatedMovies from "@/components/modules/Home/TopRatedMovies";
import TrendingMovies from "@/components/modules/Home/TrendingMovies";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <Stats />
      <TrendingMovies />
      <GenreCategories />
      <FeaturedReviews />
      <TopRatedMovies />
      <CTASection />
    </div>
  );
};

export default HomePage;
