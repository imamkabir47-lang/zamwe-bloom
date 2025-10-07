import { Card, CardContent } from "@/components/ui/card";

const inspiringWomen = [
  {
    name: "Ada Lovelace",
    era: "1815-1852",
    achievement: "World's First Computer Programmer",
    impact: "Pioneered the foundation of modern computing"
  },
  {
    name: "Funmilayo Ransome-Kuti",
    era: "1900-1978",
    achievement: "Nigerian Women's Rights Activist",
    impact: "Champion of women's education and political participation"
  },
  {
    name: "Amina of Zazzau",
    era: "1533-1610",
    achievement: "Warrior Queen of Zaria",
    impact: "Expanded Hausa territory and trade networks"
  },
  {
    name: "Oprah Winfrey",
    era: "1954-Present",
    achievement: "Media Mogul & Philanthropist",
    impact: "First Black female billionaire, transformed media landscape"
  },
  {
    name: "Malala Yousafzai",
    era: "1997-Present",
    achievement: "Youngest Nobel Laureate",
    impact: "Global advocate for girls' education"
  },
  {
    name: "Ngozi Okonjo-Iweala",
    era: "1954-Present",
    achievement: "WTO Director-General",
    impact: "First woman and African to lead the WTO"
  }
];

const HallOfWomenSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="text-gradient-primary">Hall of Women</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Celebrating trailblazing women who changed the world and inspire us every day.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary hidden lg:block"></div>

          <div className="space-y-12">
            {inspiringWomen.map((woman, index) => (
              <div
                key={index}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className="flex-1">
                  <Card className="glass-card hover-lift border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-2xl font-bold mb-1">{woman.name}</h3>
                          <p className="text-sm text-accent font-medium">{woman.era}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-serif font-bold text-lg">
                            {woman.name[0]}
                          </span>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-primary mb-2">{woman.achievement}</p>
                      <p className="text-sm text-muted-foreground">{woman.impact}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className="hidden lg:block flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent ring-4 ring-background"></div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground italic">
            "Every woman has the power to change the world. Join ZAMWE and write your own inspiring story."
          </p>
        </div>
      </div>
    </section>
  );
};

export default HallOfWomenSection;
