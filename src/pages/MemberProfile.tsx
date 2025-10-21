import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    try {
      const { data, error } = await supabase
        .from("join_applications")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error) throw error;
      setMember(data);
    } catch (error) {
      console.error("Error loading member:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <Card className="p-12 text-center">
          <p className="text-foreground/60 mb-4">Member not found</p>
          <Button onClick={() => navigate("/members")}>Back to Directory</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/members")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>

        <Card className="p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {member.photo_url && (
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="w-48 h-48 rounded-lg object-cover border-4 border-primary/20 mx-auto md:mx-0"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                {member.full_name}
              </h1>
              <Badge variant="default" className="mb-4">
                {member.membership_plan} Member
              </Badge>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-foreground/70">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Member since{" "}
                    {formatDistanceToNow(new Date(member.submitted_at))} ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-secondary/10">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Business Information</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-foreground/60 mb-1">Business Name</div>
                  <div className="font-semibold">{member.business_name}</div>
                </div>
                <div>
                  <div className="text-xs text-foreground/60 mb-1">Industry</div>
                  <div>{member.business_type}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-secondary/10">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Contact Information</h2>
              </div>
              <div className="space-y-3">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-foreground/60" />
                    <a
                      href={`mailto:${member.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-foreground/60" />
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
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-foreground/60 mt-0.5" />
                    <span className="text-sm">{member.contact_address}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {member.why_join && (
            <Card className="p-6 bg-secondary/10">
              <h2 className="font-semibold text-lg mb-3">Why I Joined ZAMWE</h2>
              <p className="text-foreground/80">{member.why_join}</p>
            </Card>
          )}

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() =>
                window.open(
                  `https://wa.me/${member.phone_number.replace(/\D/g, "")}`,
                  "_blank"
                )
              }
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            {member.email && (
              <Button
                variant="outline"
                onClick={() => window.open(`mailto:${member.email}`)}
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MemberProfile;
