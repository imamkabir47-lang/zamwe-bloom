import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Eye, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface MarketplacePost {
  id: string;
  media_type: string;
  media_urls: any;
  caption: string;
  product_name: string;
  price: number;
  currency: string;
  location: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  is_boosted: boolean;
  created_at: string;
  category: string;
  average_rating: number;
  reviews_count: number;
  profiles?: { 
    full_name: string; 
    username: string;
    business_name?: string;
    photo_url?: string;
    is_verified: boolean;
  };
}

const Marketplace = () => {
  const [posts, setPosts] = useState<MarketplacePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productOfDay, setProductOfDay] = useState<MarketplacePost | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const categories = [
    'all', 'fashion', 'beauty', 'food', 'crafts', 'services', 'technology', 'other'
  ];

  useEffect(() => {
    checkUser();
    loadPosts();

    // Setup realtime subscription for instant updates
    const channel = supabase
      .channel('marketplace-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marketplace_posts'
        },
        () => {
          loadPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_posts')
        .select(`
          *,
          profiles(full_name, username, business_name, photo_url, is_verified)
        `)
        .eq('is_active', true)
        .order('is_boosted', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data as any || []);

      // Find product of the day (most reviewed product)
      if (data && data.length > 0) {
        const topProduct = [...data].sort((a, b) => 
          (b.reviews_count || 0) - (a.reviews_count || 0)
        )[0];
        setProductOfDay(topProduct as any);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
      toast.success('Post liked!');
      loadPosts();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('You already liked this post');
      } else {
        toast.error('Failed to like post');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Card key={i}>
              <Skeleton className="h-64 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Share and discover amazing content from the community</p>
          </div>
          {user && (
            <Button onClick={() => navigate('/create-post')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>

        {/* Product of the Day */}
        {productOfDay && productOfDay.reviews_count > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                🏆 Product of the Day
                <Badge variant="default">Most Reviewed</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={productOfDay.media_urls?.[0] || 'https://via.placeholder.com/400'}
                    alt={productOfDay.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{productOfDay.product_name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= (productOfDay.average_rating || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {productOfDay.average_rating?.toFixed(1)} ({productOfDay.reviews_count} reviews)
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {productOfDay.currency} {productOfDay.price?.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">{productOfDay.caption}</p>
                  <Button onClick={() => navigate(`/post/${productOfDay.id}`)}>
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="max-w-xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <Skeleton className="h-64 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <Card key={post.id} className="hover-lift overflow-hidden">
                {post.is_boosted && (
                  <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs py-1 px-3 text-center font-semibold">
                    ⭐ BOOSTED POST
                  </div>
                )}
                
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                  {post.media_urls && post.media_urls.length > 0 ? (
                    <img
                      src={post.media_urls[0]}
                      alt={post.product_name || 'Post'}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => navigate(`/post/${post.id}`)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="h-16 w-16 text-primary" />
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    {post.profiles?.photo_url && (
                      <img
                        src={post.profiles.photo_url}
                        alt={post.profiles.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-sm">
                          {post.profiles?.business_name || post.profiles?.full_name || 'Member'}
                        </p>
                        {post.profiles?.is_verified && (
                          <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">@{post.profiles?.username}</p>
                    </div>
                  </div>

                  {post.product_name && (
                    <CardTitle className="text-lg">{post.product_name}</CardTitle>
                  )}

                  {/* Star Rating */}
                  {post.reviews_count > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-sm ${star <= (post.average_rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({post.reviews_count})
                      </span>
                    </div>
                  )}
                  
                  {post.caption && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>
                  )}

                  <Badge variant="outline" className="w-fit capitalize">
                    {post.category || 'other'}
                  </Badge>

                  {post.price && (
                    <p className="text-xl font-bold text-primary">
                      {post.currency} {post.price.toLocaleString()}
                    </p>
                  )}

                  {post.location && (
                    <p className="text-xs text-muted-foreground">📍 {post.location}</p>
                  )}
                </CardHeader>

                <div className="px-6 pb-4 flex items-center justify-between text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    disabled={!user}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes_count}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments_count}
                  </Button>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views_count}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
