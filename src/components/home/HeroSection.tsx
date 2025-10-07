import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import event1 from "@/assets/events/turbaning-ceremony.jpeg";
import event2 from "@/assets/events/government-meeting.jpeg";
import event3 from "@/assets/events/group-event.jpeg";
import event4 from "@/assets/events/team-photo.jpeg";
import event5 from "@/assets/events/tradeshow-promo-1.jpeg";

const heroImages = [event1, event2, event3, event4, event5];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary">Est. 2020</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
                Empowering Women{" "}
                <span className="text-gradient-primary">Entrepreneurs</span>
                {" "}of Zamfara
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join a community of ambitious women transforming ideas into thriving businesses. 
                Access mentorship, training, funding, and opportunities designed to help you succeed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow text-lg px-8">
                  Join ZAMWE Today
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Events
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <div className="text-3xl md:text-4xl font-serif font-bold text-gradient-primary">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Active Members</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl md:text-4xl font-serif font-bold text-gradient-primary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Events Hosted</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl md:text-4xl font-serif font-bold text-gradient-primary">200+</div>
                <div className="text-sm text-muted-foreground mt-1">Ventures Supported</div>
              </div>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-elegant aspect-[4/3]">
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`ZAMWE Event ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="text-white" size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="text-white" size={24} />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImage
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 glass-card px-6 py-4 rounded-2xl shadow-xl">
              <div className="text-sm text-muted-foreground">Trusted by</div>
              <div className="text-2xl font-serif font-bold text-gradient-primary">500+ Women</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
