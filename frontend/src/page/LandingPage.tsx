import FeaturedCategories from "@/components/home/RecentBooks";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import OurServices from "@/components/home/OurServices";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <OurServices />
      <FeaturedCategories />
      <HowItWorks />
    </div>
  );
}
