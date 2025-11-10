import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Eye, Users, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);

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

      // Load my posts
      const { data: postsData } = await supabase
        .from("marketplace_posts")
        .select(`
          *,
          profiles!marketplace_posts_user_id_fkey (
            full_name,
            photo_url,
            username,
            is_verified
          )
        `)
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      setMyPosts(postsData || []);

      // Load all posts feed
      const { data: feedData } = await supabase
        .from("marketplace_posts")
        .select(`
          *,
          profiles!marketplace_posts_user_id_fkey (
            full_name,
            photo_url,
            username,
            is_verified
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

      setAllPosts(feedData || []);

      // Load followers
      const { data: followersData } = await supabase
        .from("user_follows")
        .select("follower_id, profiles!user_follows_follower_id_fkey(full_name, photo_url, username)")
        .eq("following_id", user.id);

      setFollowers(followersData || []);

      // Load following
      const { data: followingData } = await supabase
        .from("user_follows")
        .select("following_id, profiles!user_follows_following_id_fkey(full_name, photo_url, username)")
        .eq("follower_id", user.id);

      setFollowing(followingData || []);

      // Setup realtime for posts
      const channel = supabase
        .channel('marketplace-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'marketplace_posts'
          },
          () => {
            // Reload posts on any change
            loadPosts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    if (!user) return;

    const { data: postsData } = await supabase
      .from("marketplace_posts")
      .select(`
        *,
        profiles!marketplace_posts_user_id_fkey (
          full_name,
          photo_url,
          username,
          is_verified
        )
      `)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    setMyPosts(postsData || []);

    const { data: feedData } = await supabase
      .from("marketplace_posts")
      .select(`
        *,
        profiles!marketplace_posts_user_id_fkey (
          full_name,
          photo_url,
          username,
          is_verified
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(20);

    setAllPosts(feedData || []);
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">
            My Dashboard
          </h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 sticky top-20">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}`}
                    alt={profile?.full_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                  />
                  {profile?.is_verified && (
                    <CheckCircle className="absolute bottom-0 right-0 h-6 w-6 text-primary bg-background rounded-full" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-primary mb-1">
                  {profile?.full_name || user?.email}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  @{profile?.username || 'user'}
                </p>
                
                <div className="grid grid-cols-3 gap-4 w-full mb-4 py-4 border-y">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{myPosts.length}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{followers.length}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{following.length}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                </div>

                <Button onClick={() => navigate('/profile')} className="w-full mb-2">
                  Edit Profile
                </Button>
                <Button onClick={() => navigate('/create-post')} variant="outline" className="w-full">
                  Create Post
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Posts Section */}
            {myPosts.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">My Posts</h2>
                  <Badge variant="secondary">{myPosts.length}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {myPosts.slice(0, 6).map((post) => (
                    <div
                      key={post.id}
                      className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => navigate('/marketplace')}
                    >
                      <img
                        src={post.media_urls?.[0] || 'https://via.placeholder.com/300'}
                        alt={post.product_name || 'Post'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-4 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Latest Posts Feed */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Latest from Community
              </h2>
              <div className="space-y-6">
                {allPosts.map((post) => (
                  <Card key={post.id} className="p-4 hover:shadow-lg transition">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={post.profiles?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.profiles?.full_name || 'User')}`}
                        alt={post.profiles?.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.profiles?.full_name}</span>
                          {post.profiles?.is_verified && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {post.media_urls?.[0] && (
                      <img
                        src={post.media_urls[0]}
                        alt={post.product_name || 'Post'}
                        className="w-full rounded-lg mb-3 max-h-96 object-cover cursor-pointer"
                        onClick={() => navigate('/marketplace')}
                      />
                    )}
                    
                    <div className="space-y-2">
                      {post.product_name && (
                        <h3 className="font-semibold text-lg">{post.product_name}</h3>
                      )}
                      {post.caption && (
                        <p className="text-sm text-foreground/80">{post.caption}</p>
                      )}
                      {post.price && (
                        <p className="text-lg font-bold text-primary">
                          {post.currency} {post.price}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes_count} likes
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments_count} comments
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views_count} views
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
