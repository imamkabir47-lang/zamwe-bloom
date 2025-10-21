import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Check } from "lucide-react";
import { format } from "date-fns";

const EventsNew = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
    setupRealtime();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date");

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => loadEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("event_rsvps").insert({
        event_id: selectedEvent.id,
        full_name: rsvpData.full_name,
        email: rsvpData.email,
        phone_number: rsvpData.phone_number,
      });

      if (error) throw error;

      toast({
        title: "RSVP Confirmed!",
        description: "We look forward to seeing you at the event.",
      });

      setRsvpData({ full_name: "", email: "", phone_number: "" });
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "RSVP Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Upcoming Events
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Join us at inspiring events designed to connect, empower, and uplift women
            entrepreneurs across Zamfara
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <h3 className="text-2xl font-serif font-bold text-primary mb-3">
                {event.title}
              </h3>

              <p className="text-foreground/80 mb-4">{event.description}</p>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-foreground/70">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(event.event_date), "PPP 'at' p")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                {event.max_attendees && (
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Users className="w-4 h-4" />
                    <span>Limited to {event.max_attendees} attendees</span>
                  </div>
                )}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedEvent(event)}
                  >
                    RSVP Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>RSVP for {event.title}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRSVP} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={rsvpData.full_name}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, full_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={rsvpData.email}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={rsvpData.phone_number}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, phone_number: e.target.value })
                        }
                      />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? "Confirming..." : "Confirm RSVP"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <Card className="p-12 text-center text-foreground/60">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="mb-2">No upcoming events at the moment.</p>
            <p className="text-sm">Check back soon for exciting new events!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventsNew;
