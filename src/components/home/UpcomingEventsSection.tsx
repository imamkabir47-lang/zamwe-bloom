import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { format, isAfter } from "date-fns";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string | null;
}

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString();
      const { data } = await supabase
        .from("events")
        .select("id, title, description, event_date, location, image_url")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(3);

      setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-2xl"></div>
                <div className="p-6 bg-card rounded-b-2xl space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <Badge variant="outline" className="mb-4 border-accent text-accent-foreground bg-accent/10">
              Don't Miss Out
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Upcoming <span className="text-gradient-primary">Events</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Join us at our next events and connect with fellow entrepreneurs
            </p>
          </div>
          <Link to="/events" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover-lift border-0 shadow-lg h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-2xl font-bold leading-none">
                        {format(new Date(event.event_date), "d")}
                      </div>
                      <div className="text-xs uppercase mt-1">
                        {format(new Date(event.event_date), "MMM")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {format(new Date(event.event_date), "h:mm a")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
