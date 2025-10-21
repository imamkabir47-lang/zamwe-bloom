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
  }, []);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("join_applications")
        .select("*")
        .eq("status", "approved")
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
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.business_type.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <h3 className="font-semibold text-lg text-primary mb-1">
                    {member.full_name}
                  </h3>
                  <Badge variant="outline" className="mb-2">
                    {member.membership_plan}
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
