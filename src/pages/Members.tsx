import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Import member/event images
import turbaning from "@/assets/events/turbaning-ceremony.jpeg";
import government from "@/assets/events/government-meeting.jpeg";
import tradeshow1 from "@/assets/events/tradeshow-promo-1.jpeg";
import tradeshow2 from "@/assets/events/tradeshow-promo-2.jpeg";
import groupEvent from "@/assets/events/group-event.jpeg";
import teamPhoto from "@/assets/events/team-photo.jpeg";

const Members = () => {
  const memberImages = [
    { src: groupEvent, alt: "ZAMWE Members Group Event" },
    { src: teamPhoto, alt: "ZAMWE Team Photo" },
    { src: turbaning, alt: "Turbaning Ceremony" },
    { src: government, alt: "Government Meeting" },
    { src: tradeshow1, alt: "Tradeshow Event" },
    { src: tradeshow2, alt: "Tradeshow Promotion" },
  ];

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Our Members
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Celebrating the women entrepreneurs who are building the future of Zamfara
          </p>
        </div>

        {/* Apple-level carousel */}
        <div className="mb-20">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full max-w-5xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {memberImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="overflow-hidden hover-scale">
                      <CardContent className="p-0">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Member statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center p-8 hover-scale animate-fade-in">
            <div className="text-5xl font-bold text-primary mb-2">500+</div>
            <div className="text-foreground/80">Active Members</div>
          </Card>
          <Card className="text-center p-8 hover-scale animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="text-5xl font-bold text-primary mb-2">50+</div>
            <div className="text-foreground/80">Business Sectors</div>
          </Card>
          <Card className="text-center p-8 hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="text-5xl font-bold text-primary mb-2">100+</div>
            <div className="text-foreground/80">Success Stories</div>
          </Card>
        </div>

        {/* Member benefits */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
            Member Benefits
          </h2>
          <div className="grid gap-6">
            {[
              "Access to business mentorship and training programs",
              "Networking opportunities with fellow women entrepreneurs",
              "Priority access to grants and funding opportunities",
              "Marketing and branding support for your business",
              "Exclusive invitations to ZAMWE events and workshops",
              "Community support and sisterhood",
            ].map((benefit, index) => (
              <Card key={index} className="p-6 hover-scale animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <p className="text-foreground/90">{benefit}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
