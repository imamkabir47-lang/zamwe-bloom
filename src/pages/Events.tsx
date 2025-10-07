import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import tradeshowPoster from "@/assets/events/zamwe-tradeshow.jpeg";

const Events = () => {
  const featuredEvent = {
    title: "ZAMWE Tradeshow 3.0",
    date: "7th & 8th February 2026",
    time: "9am to 7pm",
    location: "Gusau Amusement Park",
    stallFee: "30,000",
    gateFee: "300",
    features: ["Shopping", "Networking", "Live Coverage"],
    poster: tradeshowPoster,
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Upcoming <span className="text-gradient-primary">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Join us at inspiring events designed to connect, empower, and uplift women entrepreneurs across Zamfara.
          </p>
        </div>

        {/* Featured Event */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="glass-card border-primary/20 overflow-hidden hover-lift">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Poster */}
                <div className="relative aspect-square md:aspect-auto">
                  <img
                    src={featuredEvent.poster}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-3xl font-serif font-bold mb-6 text-gradient-primary">
                    {featuredEvent.title}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Calendar className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-semibold">Date</p>
                        <p className="text-muted-foreground">{featuredEvent.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-semibold">Time</p>
                        <p className="text-muted-foreground">{featuredEvent.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-muted-foreground">{featuredEvent.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <DollarSign className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-semibold">Fees</p>
                        <p className="text-muted-foreground">
                          Stall Fee: ₦{featuredEvent.stallFee} • Gate Fee: ₦{featuredEvent.gateFee}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="font-semibold mb-2">Featuring</p>
                    <div className="flex flex-wrap gap-2">
                      {featuredEvent.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow">
                    RSVP Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact for Enquiries */}
        <div className="text-center max-w-2xl mx-auto">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold mb-4">
                For More Enquiries & Partnership
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact us for stall bookings, sponsorship opportunities, or any questions about the event.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:08169041781"
                  className="text-primary hover:underline font-medium"
                >
                  08169041781
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a
                  href="tel:08025858385"
                  className="text-primary hover:underline font-medium"
                >
                  08025858385
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Events;
