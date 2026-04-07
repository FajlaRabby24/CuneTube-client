import Banner from "@/components/modules/Home/Banner";
import Stats from "@/components/modules/Home/Stats";
import TrendingMovies from "@/components/modules/Home/TrendingMovies";
import FeaturedReviews from "@/components/modules/Home/FeaturedReviews";
import TopRatedMovies from "@/components/modules/Home/TopRatedMovies";
import GenreCategories from "@/components/modules/Home/GenreCategories";
import CTASection from "@/components/modules/Home/CTASection";

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
