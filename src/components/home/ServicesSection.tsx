import { Award, BookOpen, DollarSign, Users, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Users,
    title: "Business Mentorship",
    description: "Connect with experienced entrepreneurs who guide you through challenges and celebrate your wins.",
    color: "text-primary"
  },
  {
    icon: BookOpen,
    title: "Training & Workshops",
    description: "Access hands-on training in business management, digital marketing, and financial literacy.",
    color: "text-accent"
  },
  {
    icon: DollarSign,
    title: "Funding & Grants",
    description: "Discover funding opportunities, grants, and micro-loans designed for women-led businesses.",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    title: "Networking Opportunities",
    description: "Join exclusive events, trade shows, and networking sessions with fellow entrepreneurs.",
    color: "text-accent"
  },
  {
    icon: Sparkles,
    title: "Digital Branding Support",
    description: "Build your online presence with our website builder and social media strategies.",
    color: "text-primary"
  },
  {
    icon: Award,
    title: "Recognition Programs",
    description: "Get recognized for your achievements through our awards and spotlight features.",
    color: "text-accent"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            How We <span className="text-gradient-primary">Support You</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive resources and support to help you build, grow, and scale your business successfully.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="glass-card hover-lift border-primary/20 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={service.color} size={28} />
                </div>
                <CardTitle className="text-xl font-serif">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
