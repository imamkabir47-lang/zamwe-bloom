import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Testimonial {
  id: string;
  member_name: string;
  business_name: string;
  content: string;
  photo_url: string | null;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, member_name, business_name, content, photo_url")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      setTestimonials(data || []);
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  // Fallback testimonials if database is empty
  const fallbackTestimonials = [
    {
      id: "1",
      member_name: "Fatima Abdullahi",
      business_name: "Fatima's Fabrics",
      content: "Joining ZAMWE was the best decision for my business. The networking opportunities and training have helped me expand to three new markets!",
      photo_url: null,
    },
    {
      id: "2",
      member_name: "Aisha Muhammad",
      business_name: "AM Catering Services",
      content: "The mentorship program connected me with experienced entrepreneurs who guided me through scaling my catering business. Forever grateful!",
      photo_url: null,
    },
    {
      id: "3",
      member_name: "Hauwa Ibrahim",
      business_name: "Hauwa's Beauty Hub",
      content: "Through ZAMWE, I accessed training that transformed how I run my business. My revenue has doubled in just one year!",
      photo_url: null,
    },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  if (loading) {
    return (
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[400px] animate-pulse">
                <div className="h-64 bg-muted rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary text-primary">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            What Our <span className="text-gradient-primary">Members</span> Say
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Hear from the women who have transformed their businesses through ZAMWE
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {displayTestimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full border-0 shadow-lg bg-card hover-lift">
                    <Quote className="w-10 h-10 text-primary/30 mb-4" />
                    <p className="text-foreground/80 mb-6 line-clamp-4">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <img
                        src={testimonial.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.member_name)}&background=random`}
                        alt={testimonial.member_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.member_name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.business_name}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
