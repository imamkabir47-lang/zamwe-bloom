import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

const SuccessStories = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Success Stories
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Celebrating the achievements of our inspiring members
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="p-8 hover:shadow-lg transition-shadow relative"
            >
              <Quote className="w-12 h-12 text-primary/20 absolute top-4 right-4" />
              
              <div className="flex items-center gap-4 mb-6">
                {testimonial.photo_url ? (
                  <img
                    src={testimonial.photo_url}
                    alt={testimonial.member_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {testimonial.member_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.member_name}</h3>
                  <p className="text-sm text-foreground/70">{testimonial.business_name}</p>
                </div>
              </div>

              <p className="text-foreground/80 italic leading-relaxed">
                "{testimonial.content}"
              </p>

              {testimonial.is_featured && (
                <Badge variant="default" className="mt-4">
                  Featured Story
                </Badge>
              )}
            </Card>
          ))}
        </div>

        {testimonials.length === 0 && (
          <Card className="p-12 text-center text-foreground/60">
            <p>No success stories available yet. Check back soon!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SuccessStories;
