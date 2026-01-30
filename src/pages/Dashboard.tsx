import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

// Components
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { PostCard } from "@/components/dashboard/PostCard";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { GlassCard } from "@/components/dashboard/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Clock from "@/components/Clock";
import { SmartGreeting } from "@/components/GodModeFeatures";

// Icons
import { 
  Package, 
  Heart, 
  Eye, 
  Users,
  TrendingUp,
  Sparkles,
  LayoutGrid
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

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
      await loadAllData(user.id);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async (userId: string) => {
    // Get profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(profileData);

    // Load posts
    const { data: postsData } = await supabase
      .from("marketplace_posts")
      .select('*')
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setMyPosts(postsData || []);

    // Load followers
    const { data: followersData } = await supabase
      .from("user_follows")
      .select("follower_id")
      .eq("following_id", userId);
    setFollowers(followersData || []);

    // Load following
    const { data: followingData } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", userId);
    setFollowing(followingData || []);

    // Generate chart data from posts
    generateChartData(postsData || []);

    // Generate activity feed
    generateActivities(postsData || []);

    // Setup realtime
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_posts', filter: `user_id=eq.${userId}` }, () => loadAllData(userId))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const generateChartData = (posts: any[]) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map((name, i) => ({
      name,
      views: Math.floor(Math.random() * 100) + (posts.length * 10),
      likes: Math.floor(Math.random() * 50) + (posts.length * 5)
    }));
    setChartData(data);
  };

  const generateActivities = (posts: any[]) => {
    const activityTypes: Array<"like" | "comment" | "view" | "follow"> = ["like", "comment", "view", "follow"];
    const messages = {
      like: "Someone liked your post",
      comment: "New comment on your product",
      view: "Your post is getting views",
      follow: "You have a new follower"
    };

    const generated = Array.from({ length: 5 }, (_, i) => {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      return {
        id: `activity-${i}`,
        type,
        message: messages[type],
        timestamp: new Date(Date.now() - i * 3600000 * (i + 1)).toISOString()
      };
    });
    setActivities(generated);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({ title: "Logged out successfully" });
  };

  const reloadPosts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("marketplace_posts")
      .select('*')
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMyPosts(data || []);
  };

  // Calculate stats
  const stats = {
    posts: myPosts.length,
    followers: followers.length,
    following: following.length,
    totalLikes: myPosts.reduce((sum, post) => sum + (post.likes_count || 0), 0),
    totalViews: myPosts.reduce((sum, post) => sum + (post.views_count || 0), 0)
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Welcome back, <span className="text-primary">{profile?.full_name?.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your business today
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {user && <NotificationDropdown userId={user.id} />}
            <Button onClick={() => navigate('/create-post')} className="gap-2 rounded-xl">
              <Sparkles className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Profile & Quick Actions */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <ProfileCard
              profile={profile}
              user={user}
              stats={{ posts: stats.posts, followers: stats.followers, following: stats.following }}
              onLogout={handleLogout}
            />
            
            <GlassCard hover={false} className="p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                Quick Actions
              </h3>
              <QuickActionsGrid />
            </GlassCard>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Posts"
                value={stats.posts}
                icon={Package}
                trend={12}
                delay={0}
                variant="primary"
              />
              <StatCard
                title="Total Likes"
                value={stats.totalLikes}
                icon={Heart}
                trend={8}
                delay={0.1}
                variant="accent"
              />
              <StatCard
                title="Total Views"
                value={stats.totalViews}
                icon={Eye}
                trend={24}
                delay={0.2}
                variant="primary"
              />
              <StatCard
                title="Followers"
                value={stats.followers}
                icon={Users}
                trend={5}
                delay={0.3}
                variant="accent"
              />
            </div>

            {/* Engagement Chart */}
            <GlassCard hover={false} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Engagement Overview
                </h3>
                <Badge variant="secondary" className="rounded-full">Last 7 days</Badge>
              </div>
              <EngagementChart data={chartData} />
            </GlassCard>

            {/* My Posts */}
            <GlassCard hover={false} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  My Posts
                </h3>
                <Badge variant="outline" className="rounded-full">{myPosts.length} total</Badge>
              </div>
              
              {myPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
                  <Button onClick={() => navigate('/create-post')}>
                    Create Your First Post
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {myPosts.slice(0, 5).map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} onDelete={reloadPosts} />
                  ))}
                  {myPosts.length > 5 && (
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/marketplace')}>
                      View all {myPosts.length} posts
                    </Button>
                  )}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Column - Activity */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <GlassCard hover={false} className="p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Recent Activity
              </h3>
              <ActivityTimeline activities={activities} />
            </GlassCard>

            {/* Quick Stats Card */}
            <GlassCard hover={false} className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                  <span className="text-sm font-semibold text-primary">
                    {stats.totalViews > 0 ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stats.totalLikes / Math.max(stats.totalViews, 1)) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active Posts</span>
                    <span className="text-sm font-semibold">{myPosts.filter(p => p.is_active).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Draft Posts</span>
                    <span className="text-sm font-semibold">{myPosts.filter(p => !p.is_active).length}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
