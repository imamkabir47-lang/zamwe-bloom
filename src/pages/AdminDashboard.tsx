import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    loadData();
    setupRealtime();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast({
          title: "Unauthorized",
          description: "Admin access required",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      navigate("/admin/login");
    }
  };

  const loadData = async () => {
    try {
      const [appsResult, messagesResult] = await Promise.all([
        supabase
          .from("join_applications")
          .select("*")
          .order("submitted_at", { ascending: false }),
        supabase
          .from("contact_messages")
          .select("*")
          .order("submitted_at", { ascending: false }),
      ]);

      if (appsResult.data) setApplications(appsResult.data);
      if (messagesResult.data) setMessages(messagesResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const appsChannel = supabase
      .channel("applications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "join_applications" },
        () => loadData()
      )
      .subscribe();

    const messagesChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appsChannel);
      supabase.removeChannel(messagesChannel);
    };
  };

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("join_applications")
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Application marked as ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update failed",
        variant: "destructive",
      });
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({ title: "Logged out successfully" });
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">
            Admin Dashboard
          </h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-2xl font-bold text-primary">
              {applications.length}
            </div>
            <div className="text-sm text-foreground/70">Total Applications</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-accent">
              {applications.filter((a) => a.status === "pending").length}
            </div>
            <div className="text-sm text-foreground/70">Pending</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-primary">
              {messages.length}
            </div>
            <div className="text-sm text-foreground/70">Total Messages</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-accent">
              {messages.filter((m) => !m.is_read).length}
            </div>
            <div className="text-sm text-foreground/70">Unread Messages</div>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="flex gap-6 mb-4">
                  {app.photo_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={app.photo_url}
                        alt={app.full_name}
                        className="w-32 h-32 object-cover rounded-lg border-2 border-primary/20"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{app.full_name}</h3>
                        <p className="text-sm text-foreground/60">
                          {app.business_name} - {app.business_type}
                        </p>
                      </div>
                      <Badge
                        variant={
                          app.status === "pending"
                            ? "outline"
                            : app.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-foreground/60">Phone:</span>{" "}
                        {app.phone_number}
                      </div>
                      <div>
                        <span className="text-foreground/60">Email:</span> {app.email}
                      </div>
                      <div>
                        <span className="text-foreground/60">Plan:</span>{" "}
                        {app.membership_plan}
                      </div>
                      <div>
                        <span className="text-foreground/60">Submitted:</span>{" "}
                        {formatDistanceToNow(new Date(app.submitted_at))} ago
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-foreground/60 mb-1">Why Join:</div>
                  <p className="text-sm">{app.why_join}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(app.id, "approved")}
                    disabled={app.status !== "pending"}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateStatus(app.id, "rejected")}
                    disabled={app.status !== "pending"}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
            {applications.length === 0 && (
              <Card className="p-12 text-center text-foreground/60">
                No applications yet
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`p-6 ${!msg.is_read ? "border-primary" : ""}`}
                onClick={() => !msg.is_read && handleMarkRead(msg.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{msg.name}</h3>
                  {!msg.is_read && <Badge variant="default">New</Badge>}
                </div>
                <div className="text-sm text-foreground/60 mb-3">
                  {msg.email} • {msg.phone} •{" "}
                  {formatDistanceToNow(new Date(msg.submitted_at))} ago
                </div>
                <p className="text-sm">{msg.message}</p>
              </Card>
            ))}
            {messages.length === 0 && (
              <Card className="p-12 text-center text-foreground/60">
                No messages yet
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
