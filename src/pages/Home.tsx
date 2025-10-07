import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import LeadersSection from "@/components/home/LeadersSection";
import HallOfWomenSection from "@/components/home/HallOfWomenSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <LeadersSection />
      <HallOfWomenSection />
    </div>
  );
};

export default Home;
