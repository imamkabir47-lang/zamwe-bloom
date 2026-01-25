import HeroSection from "@/components/home/HeroSection";
import AnimatedStatsSection from "@/components/home/AnimatedStatsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedMembersSection from "@/components/home/FeaturedMembersSection";
import UpcomingEventsSection from "@/components/home/UpcomingEventsSection";
import MarketplacePreviewSection from "@/components/home/MarketplacePreviewSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HallOfWomenSection from "@/components/home/HallOfWomenSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AnimatedStatsSection />
      <ServicesSection />
      <FeaturedMembersSection />
      <UpcomingEventsSection />
      <MarketplacePreviewSection />
      <TestimonialsSection />
      <HallOfWomenSection />
      <CallToActionSection />
      <div className="container mx-auto px-4 py-16">
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default Home;
