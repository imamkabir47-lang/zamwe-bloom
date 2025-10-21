import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HallOfWomenSection from "@/components/home/HallOfWomenSection";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <HallOfWomenSection />
      <div className="container mx-auto px-4 py-16">
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default Home;
