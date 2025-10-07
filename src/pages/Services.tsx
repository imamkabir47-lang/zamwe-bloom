import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, DollarSign, Users, Sparkles, TrendingUp, MessageSquare, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Users,
    title: "Business Mentorship",
    description: "One-on-one mentorship with successful entrepreneurs who understand your journey.",
    features: [
      "Personalized business guidance",
      "Monthly mentorship sessions",
      "Access to experienced advisors",
      "Industry-specific expertise"
    ],
    color: "from-primary to-primary/80"
  },
  {
    icon: BookOpen,
    title: "Training & Workshops",
    description: "Comprehensive training programs to build essential business skills.",
    features: [
      "Business management fundamentals",
      "Digital marketing strategies",
      "Financial literacy & accounting",
      "Leadership development"
    ],
    color: "from-accent to-accent/80"
  },
  {
    icon: DollarSign,
    title: "Funding & Grants",
    description: "Connect with funding opportunities tailored for women-led businesses.",
    features: [
      "Grant application support",
      "Micro-loan connections",
      "Investor pitch preparation",
      "Funding database access"
    ],
    color: "from-primary to-primary/80"
  },
  {
    icon: TrendingUp,
    title: "Networking Opportunities",
    description: "Build valuable connections through our exclusive events and community.",
    features: [
      "Monthly networking mixers",
      "Trade shows & exhibitions",
      "Business matchmaking",
      "Partnership opportunities"
    ],
    color: "from-accent to-accent/80"
  },
  {
    icon: Sparkles,
    title: "Digital Branding Support",
    description: "Establish your online presence and reach more customers.",
    features: [
      "Website builder access",
      "Social media templates",
      "Branding consultations",
      "Content creation workshops"
    ],
    color: "from-primary to-primary/80"
  },
  {
    icon: Briefcase,
    title: "Business Development",
    description: "Strategic support to help you scale and grow your venture.",
    features: [
      "Market research assistance",
      "Business plan development",
      "Growth strategy consulting",
      "Operational optimization"
    ],
    color: "from-accent to-accent/80"
  },
  {
    icon: MessageSquare,
    title: "Community Support",
    description: "Join a supportive community of women who understand your journey.",
    features: [
      "Private member forums",
      "Peer support groups",
      "Success celebrations",
      "24/7 online community"
    ],
    color: "from-primary to-primary/80"
  },
  {
    icon: Award,
    title: "Recognition Programs",
    description: "Get the recognition you deserve for your hard work and achievements.",
    features: [
      "Annual awards ceremony",
      "Featured member spotlights",
      "Achievement badges",
      "Media coverage opportunities"
    ],
    color: "from-accent to-accent/80"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Our <span className="text-gradient-primary">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Comprehensive support designed to help you at every stage of your entrepreneurial journey, 
            from ideation to scaling your business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="glass-card hover-lift border-primary/20 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-serif mb-2 flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} bg-opacity-10`}>
                        <service.icon className="text-primary" size={24} />
                      </div>
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="glass-card border-primary/20 p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join ZAMWE today and unlock access to all our services, programs, and a supportive 
            community of women entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow">
                Become a Member
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
