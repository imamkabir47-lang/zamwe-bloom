import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Users, Calendar, Briefcase, TrendingUp } from "lucide-react";

interface StatProps {
  end: number;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
}

const AnimatedStat = ({ end, label, icon, suffix = "" }: StatProps) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center group">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-serif font-bold text-gradient-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
};

const AnimatedStatsSection = () => {
  const stats = [
    { end: 500, label: "Active Members", icon: <Users className="w-8 h-8 text-primary" />, suffix: "+" },
    { end: 50, label: "Events Hosted", icon: <Calendar className="w-8 h-8 text-primary" />, suffix: "+" },
    { end: 200, label: "Businesses Supported", icon: <Briefcase className="w-8 h-8 text-primary" />, suffix: "+" },
    { end: 95, label: "Success Rate", icon: <TrendingUp className="w-8 h-8 text-primary" />, suffix: "%" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Our <span className="text-gradient-primary">Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how ZAMWE is transforming women's entrepreneurship in Zamfara State
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStatsSection;
