import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Member {
  id: string;
  user_id: string;
  full_name: string;
  business_name: string | null;
  business_type: string | null;
  photo_url: string | null;
  is_verified: boolean | null;
}

const FeaturedMembersSection = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, business_name, business_type, photo_url, is_verified")
        .eq("is_verified", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);

      setMembers(data || []);
      setLoading(false);
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-2xl mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              Our Community
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Featured <span className="text-gradient-primary">Members</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Meet some of our verified members who are making waves in business
            </p>
          </div>
          <Link to="/members" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Members
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to={`/members/${member.user_id}`}>
                <Card className="group overflow-hidden hover-lift border-0 shadow-md">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={member.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=random`}
                      alt={member.full_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {member.is_verified && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-sm truncate">{member.full_name}</h3>
                    {member.business_type && (
                      <p className="text-xs text-muted-foreground truncate">{member.business_type}</p>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMembersSection;
