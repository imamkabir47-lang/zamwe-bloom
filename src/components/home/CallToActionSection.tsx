import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CallToActionSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center text-primary-foreground"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Start Your Journey Today</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of women entrepreneurs who are already benefiting from ZAMWE's 
            resources, training, mentorship, and community support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 group"
              >
                Become a Member
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-primary-foreground/70 mb-4">Trusted by women across Zamfara State</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-primary-foreground/70">Members</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">14+</div>
                <div className="text-xs text-primary-foreground/70">LGAs Covered</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">₦50M+</div>
                <div className="text-xs text-primary-foreground/70">Business Value</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
