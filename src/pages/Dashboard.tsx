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
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalViews: 0,
    totalFollowers: 0
  });

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

      // Load ALL my posts (including inactive)
      const { data: postsData } = await supabase
        .from("marketplace_posts")
        .select('*')
        .eq("user_id", user.id)
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

      // Calculate stats
      const totalLikes = postsData?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;
      const totalViews = postsData?.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0;
      setStats({
        totalPosts: postsData?.length || 0,
        totalLikes,
        totalViews,
        totalFollowers: followersData?.length || 0
      });

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
      .select('*')
      .eq("user_id", user.id)
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
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
                <div className="text-xs text-muted-foreground">Total Posts</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-accent">{stats.totalLikes}</div>
                <div className="text-xs text-muted-foreground">Total Likes</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalViews}</div>
                <div className="text-xs text-muted-foreground">Total Views</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-accent">{stats.totalFollowers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </Card>
            </div>

            {/* My Posts Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">My Posts</h2>
                <Badge variant="secondary">{myPosts.length}</Badge>
              </div>
              {myPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
                  <Button onClick={() => navigate('/create-post')}>
                    Create Your First Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <Card key={post.id} className="p-4">
                      <div className="flex gap-4">
                        <div 
                          className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/post/${post.id}`)}
                        >
                          <img
                            src={post.media_urls?.[0] || 'https://via.placeholder.com/300'}
                            alt={post.product_name || 'Post'}
                            className="w-full h-full object-cover hover:scale-110 transition"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">{post.product_name || 'Post'}</h3>
                              {post.caption && (
                                <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>
                              )}
                            </div>
                            <Badge variant={post.is_active ? "default" : "secondary"}>
                              {post.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes_count || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments_count || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views_count || 0}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/post/${post.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/edit-post/${post.id}`)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={async () => {
                                if (!confirm('Delete this post? This cannot be undone.')) return;
                                try {
                                  const { error } = await supabase
                                    .from('marketplace_posts')
                                    .delete()
                                    .eq('id', post.id);
                                  if (error) throw error;
                                  toast({ title: 'Post deleted successfully' });
                                  loadPosts();
                                } catch (err) {
                                  toast({ title: 'Failed to delete post', variant: 'destructive' });
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

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
