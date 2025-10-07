import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            About <span className="text-gradient-primary">ZAMWE</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The Zamfara Women Entrepreneur Association (ZAMWE) is a dynamic community dedicated 
            to empowering women across Zamfara State to achieve economic independence and business success.
          </p>
        </div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, ZAMWE emerged from a vision to create a supportive ecosystem where 
                  women entrepreneurs could thrive, regardless of their background or business stage. 
                  What started as a small gathering of ambitious women has grown into a movement of over 
                  500 members across various sectors.
                </p>
                <p>
                  We recognized that women entrepreneurs face unique challenges - from limited access to 
                  capital and mentorship to balancing business with family responsibilities. ZAMWE was 
                  created to bridge these gaps, offering practical support, valuable connections, and 
                  unwavering encouragement.
                </p>
                <p>
                  Today, we're proud to have supported hundreds of ventures, hosted numerous training 
                  programs and trade shows, and created a community where women lift each other up. 
                  Our members represent diverse sectors including fashion, technology, agriculture, 
                  education, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="glass-card hover-lift border-primary/20 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower women entrepreneurs through accessible resources, mentorship, and 
                opportunities that enable them to build sustainable and impactful businesses.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-primary/20 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary mx-auto mb-6 flex items-center justify-center">
                <Eye className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                A future where every woman in Zamfara has the tools, confidence, and support 
                to turn her entrepreneurial dreams into reality.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-primary/20 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Our Values</h3>
              <p className="text-muted-foreground">
                Empowerment, Community, Excellence, Integrity, and Innovation guide everything 
                we do at ZAMWE.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Impact Stats */}
        <div className="glass-card border-primary/20 p-12 rounded-3xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-gradient-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-gradient-primary mb-2">50+</div>
              <div className="text-muted-foreground">Events Organized</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-gradient-primary mb-2">200+</div>
              <div className="text-muted-foreground">Businesses Supported</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-gradient-primary mb-2">₦50M+</div>
              <div className="text-muted-foreground">Funding Facilitated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
