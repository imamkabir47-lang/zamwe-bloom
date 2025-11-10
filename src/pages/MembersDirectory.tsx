import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, Phone, Mail, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const MembersDirectory = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();

    // Setup realtime subscription for instant updates
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          loadMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_active", true)
        .order("full_name");

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.business_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Our Members
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Connect with fellow women entrepreneurs across Zamfara State
          </p>
        </div>

        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
            <Input
              placeholder="Search by name, business, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                {member.photo_url && (
                  <img
                    src={member.photo_url}
                    alt={member.full_name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-primary mb-1 flex items-center gap-2">
                    {member.full_name}
                    {member.is_verified && (
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h3>
                  <Badge variant="outline" className="mb-2">
                    {member.user_type || 'Member'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-foreground/70">
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">
                      {member.business_name}
                    </div>
                    <div className="text-xs">{member.business_type}</div>
                  </div>
                </div>

                {member.email && (
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={`mailto:${member.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-foreground/70">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a
                    href={`https://wa.me/${member.phone_number.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {member.phone_number}
                  </a>
                </div>

                {member.contact_address && (
                  <div className="flex items-start gap-2 text-foreground/70">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">{member.contact_address}</span>
                  </div>
                )}
              </div>

              <Link to={`/members/${member.id}`}>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Profile
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="p-12 text-center text-foreground/60">
            <p>No members found matching your search.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MembersDirectory;
