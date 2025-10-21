import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import logoZamwe from "@/assets/logo-zamwe.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Logged out successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">
            My Dashboard
          </h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* ID Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10 animate-fade-in">
          <div className="flex items-center gap-6">
            <img
              src={logoZamwe}
              alt="ZAMWE Logo"
              className="w-24 h-24 object-contain"
            />
            <div className="flex-1">
              <div className="text-sm text-foreground/60 mb-1">Member ID Card</div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                {profile?.full_name || user?.email}
              </h2>
              <div className="text-sm text-foreground/70">
                Joined: {new Date(user?.created_at || "").toLocaleDateString()}
              </div>
            </div>
            {/* Three wise women illustration */}
            <div className="hidden md:flex gap-2">
              {["🙈", "🙉", "🙊"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            className="p-6 hover-scale cursor-pointer animate-fade-in"
            onClick={() => navigate("/templates")}
          >
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-semibold mb-1">My Templates</h3>
            <p className="text-sm text-foreground/70">Manage your templates</p>
          </Card>
          <Card
            className="p-6 hover-scale cursor-pointer animate-fade-in"
            onClick={() => navigate("/events")}
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-semibold mb-1">Events</h3>
            <p className="text-sm text-foreground/70">View upcoming events</p>
          </Card>
          <Card
            className="p-6 hover-scale cursor-pointer animate-fade-in"
            onClick={() => navigate("/contact")}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold mb-1">Messages</h3>
            <p className="text-sm text-foreground/70">Contact support</p>
          </Card>
          <Card
            className="p-6 hover-scale cursor-pointer animate-fade-in"
            onClick={() => navigate("/builder")}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="text-3xl mb-3">🏗️</div>
            <h3 className="font-semibold mb-1">Builder</h3>
            <p className="text-sm text-foreground/70">Create new template</p>
          </Card>
        </div>

        {/* Account Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-foreground/60">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-foreground/60">Member Since:</span>
              <span className="font-medium">
                {new Date(user?.created_at || "").toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-foreground/60">Templates Limit:</span>
              <span className="font-medium">5 (Free Member)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
