import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail, CheckCircle2 } from "lucide-react";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email,
        full_name: name || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed!",
            description: "This email is already on our mailing list.",
          });
        } else {
          throw error;
        }
      } else {
        setSubscribed(true);
        toast({
          title: "Successfully subscribed!",
          description: "You'll receive our latest updates and news.",
        });
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <Card className="p-8 bg-primary/5 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-bold mb-2">You're all set!</h3>
        <p className="text-foreground/70">
          Thank you for subscribing to our newsletter.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-primary/5">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-serif font-bold">Stay Connected</h3>
      </div>
      <p className="text-foreground/70 mb-6">
        Subscribe to receive updates, event invitations, and business resources.
      </p>
      <form onSubmit={handleSubscribe} className="space-y-4">
        <Input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Subscribing..." : "Subscribe Now"}
        </Button>
      </form>
    </Card>
  );
};
