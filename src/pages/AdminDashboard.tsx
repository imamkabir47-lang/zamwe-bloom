import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Components
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AnalyticsOverview } from "@/components/admin/AnalyticsOverview";
import { ApplicationCard } from "@/components/admin/ApplicationCard";
import { MessageCard } from "@/components/admin/MessageCard";
import { GlassCard } from "@/components/dashboard/GlassCard";
import ThemeSelector from "@/components/admin/ThemeSelector";
import Clock from "@/components/Clock";

// Icons
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Mail,
  TrendingUp,
  Clock as ClockIcon,
  CheckCircle,
  XCircle,
  UserPlus,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
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
        navigate("/admin");
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
      navigate("/admin");
    }
  };

  const loadData = async () => {
    try {
      const [appsResult, messagesResult, profilesResult] = await Promise.all([
        supabase
          .from("join_applications")
          .select("*")
          .order("submitted_at", { ascending: false }),
        supabase
          .from("contact_messages")
          .select("*")
          .order("submitted_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      if (appsResult.data) setApplications(appsResult.data);
      if (messagesResult.data) setMessages(messagesResult.data);
      if (profilesResult.data) setProfiles(profilesResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const appsChannel = supabase
      .channel("admin-applications")
      .on("postgres_changes", { event: "*", schema: "public", table: "join_applications" }, () => loadData())
      .subscribe();

    const messagesChannel = supabase
      .channel("admin-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => loadData())
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
      loadData();
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await supabase
        .from("contact_messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", id);
      loadData();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({ title: "Logged out successfully" });
  };

  // Stats calculations
  const stats = {
    totalUsers: profiles.length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === "pending").length,
    approvedApplications: applications.filter(a => a.status === "approved").length,
    rejectedApplications: applications.filter(a => a.status === "rejected").length,
    totalMessages: messages.length,
    unreadMessages: messages.filter(m => !m.is_read).length
  };

  // Chart data
  const userGrowthData = [
    { name: "Jan", users: 12 },
    { name: "Feb", users: 19 },
    { name: "Mar", users: 28 },
    { name: "Apr", users: 35 },
    { name: "May", users: 42 },
    { name: "Jun", users: profiles.length }
  ];

  const applicationsData = [
    { name: "Pending", value: stats.pendingApplications },
    { name: "Approved", value: stats.approvedApplications },
    { name: "Rejected", value: stats.rejectedApplications }
  ];

  const activityData = [
    { name: "Mon", applications: 3, messages: 5 },
    { name: "Tue", applications: 5, messages: 4 },
    { name: "Wed", applications: 2, messages: 8 },
    { name: "Thu", applications: 6, messages: 3 },
    { name: "Fri", applications: 4, messages: 6 },
    { name: "Sat", applications: 1, messages: 2 },
    { name: "Sun", applications: 2, messages: 1 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        {/* Decorative background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 p-8 pt-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your platform, users, and content
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminStatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              trend={12}
              variant="primary"
              delay={0}
            />
            <AdminStatCard
              title="Applications"
              value={stats.totalApplications}
              icon={FileText}
              description={`${stats.pendingApplications} pending`}
              variant="accent"
              delay={0.1}
            />
            <AdminStatCard
              title="Messages"
              value={stats.totalMessages}
              icon={MessageSquare}
              description={`${stats.unreadMessages} unread`}
              variant="success"
              delay={0.2}
            />
            <AdminStatCard
              title="New This Week"
              value={stats.pendingApplications + stats.unreadMessages}
              icon={Activity}
              trend={8}
              variant="warning"
              delay={0.3}
            />
          </div>

          {/* Analytics Section */}
          <div className="mb-8">
            <AnalyticsOverview 
              userData={userGrowthData}
              applicationsData={applicationsData}
              activityData={activityData}
            />
          </div>

          {/* Tabs for Applications and Messages */}
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="bg-card/80 backdrop-blur-sm p-1 rounded-2xl">
              <TabsTrigger 
                value="applications" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
              >
                <FileText className="h-4 w-4 mr-2" />
                Applications
                {stats.pendingApplications > 0 && (
                  <Badge className="ml-2 bg-accent text-accent-foreground">
                    {stats.pendingApplications}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="messages"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
              >
                <Mail className="h-4 w-4 mr-2" />
                Messages
                {stats.unreadMessages > 0 && (
                  <Badge className="ml-2 bg-accent text-accent-foreground">
                    {stats.unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-4">
              {/* Quick Filters */}
              <div className="flex gap-3 mb-6">
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Pending ({stats.pendingApplications})
                </Badge>
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Approved ({stats.approvedApplications})
                </Badge>
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Rejected ({stats.rejectedApplications})
                </Badge>
              </div>

              {applications.length === 0 ? (
                <GlassCard hover={false} className="p-12 text-center">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications yet</p>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onApprove={(id) => handleUpdateStatus(id, "approved")}
                      onReject={(id) => handleUpdateStatus(id, "rejected")}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              {messages.length === 0 ? (
                <GlassCard hover={false} className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onMarkRead={handleMarkRead}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
