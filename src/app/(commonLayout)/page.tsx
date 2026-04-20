import Banner from "@/components/modules/Home/Banner";
import DeviceShowcase from "@/components/modules/Home/DeviceShowcase";
import FAQSection from "@/components/modules/Home/FAQSection";
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
      <DeviceShowcase />
      <FAQSection />
    </div>
  );
};

export default HomePage;
