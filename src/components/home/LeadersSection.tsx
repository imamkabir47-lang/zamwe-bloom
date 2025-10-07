import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

const leaders = [
  {
    name: "Hajiya Aisha Bello",
    role: "President",
    sector: "Retail & Fashion",
    achievement: "Built a network of 50+ boutiques"
  },
  {
    name: "Dr. Fatima Usman",
    role: "Vice President",
    sector: "Education & Tech",
    achievement: "Founded 3 educational startups"
  },
  {
    name: "Hajiya Zainab Ibrahim",
    role: "Secretary General",
    sector: "Agriculture & Food",
    achievement: "Empowered 200+ farmers"
  },
  {
    name: "Mrs. Hauwa Mohammed",
    role: "Treasurer",
    sector: "Finance & Banking",
    achievement: "20+ years in microfinance"
  }
];

const LeadersSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Meet Our <span className="text-gradient-primary">Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Visionary women leading ZAMWE to empower the next generation of entrepreneurs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader, index) => (
            <Card 
              key={index} 
              className="glass-card hover-lift text-center border-primary/20 group overflow-hidden"
            >
              <CardContent className="p-6 space-y-4">
                {/* Avatar with gradient */}
                <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-2xl font-serif font-bold text-primary">
                        {leader.name.split(' ')[1][0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold mb-1">{leader.name}</h3>
                  <p className="text-sm font-medium text-primary mb-2">{leader.role}</p>
                  <p className="text-sm text-muted-foreground">{leader.sector}</p>
                </div>

                <div className="flex items-start space-x-2 text-left bg-accent/10 rounded-lg p-3">
                  <Award className="text-accent flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-muted-foreground">{leader.achievement}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadersSection;
