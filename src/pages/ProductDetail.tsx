import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Star, Heart, Eye, MessageCircle } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    reviewer_name: ''
  });

  useEffect(() => {
    checkUser();
    loadPost();
    loadReviews();

    // Setup realtime for reviews
    const channel = supabase
      .channel('product-reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_reviews',
          filter: `post_id=eq.${id}`
        },
        () => {
          loadReviews();
          loadPost();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_posts')
        .select(`
          *,
          profiles(full_name, username, business_name, photo_url, is_verified)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);

      // Increment view count
      await supabase
        .from('marketplace_posts')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.reviewer_name && !user) {
      toast.error('Please provide your name');
      return;
    }

    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          post_id: id,
          user_id: user?.id || null,
          reviewer_name: newReview.reviewer_name || user?.email || 'Anonymous',
          rating: newReview.rating,
          comment: newReview.comment
        });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setNewReview({ rating: 5, comment: '', reviewer_name: '' });
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: id, user_id: user.id });

      if (error) throw error;
      toast.success('Post liked!');
      loadPost();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('You already liked this post');
      } else {
        toast.error('Failed to like post');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            {post.media_urls && post.media_urls.length > 0 ? (
              <>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={post.media_urls[0]}
                    alt={post.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {post.media_urls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {post.media_urls.slice(1, 5).map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${post.product_name} ${index + 2}`}
                        className="aspect-square rounded-md object-cover cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <Eye className="h-24 w-24 text-primary" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {post.is_boosted && (
                <Badge className="mb-2">⭐ Boosted</Badge>
              )}
              <Badge variant="outline" className="mb-2 ml-2 capitalize">
                {post.category || 'other'}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{post.product_name}</h1>
              
              {/* Rating */}
              {post.reviews_count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= (post.average_rating || 0)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {post.average_rating?.toFixed(1)} ({post.reviews_count} reviews)
                  </span>
                </div>
              )}
              
              {post.price && (
                <p className="text-3xl font-bold text-primary mb-4">
                  {post.currency} {post.price.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-3 text-sm">
              {post.caption && (
                <div>
                  <span className="font-semibold">Description:</span>
                  <p className="text-muted-foreground mt-1">{post.caption}</p>
                </div>
              )}
              
              {post.location && (
                <div>
                  <span className="font-semibold">Location:</span> {post.location}
                </div>
              )}
              
              {post.availability && (
                <div>
                  <span className="font-semibold">Availability:</span> {post.availability}
                </div>
              )}
              
              {post.payment_method && (
                <div>
                  <span className="font-semibold">Payment:</span> {post.payment_method}
                </div>
              )}
              
              {post.whatsapp_number && (
                <div>
                  <span className="font-semibold">WhatsApp:</span> {post.whatsapp_number}
                </div>
              )}
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.profiles?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.profiles?.full_name || 'Seller')}`}
                    alt={post.profiles?.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {post.profiles?.business_name || post.profiles?.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{post.profiles?.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleLike} className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Like ({post.likes_count})
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views_count}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Submit Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 p-4 bg-secondary/20 rounded-lg">
              <h3 className="font-semibold">Write a Review</h3>
              
              <div>
                <label className="block text-sm mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        star <= newReview.rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>

              {!user && (
                <div>
                  <label className="block text-sm mb-2">Your Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={newReview.reviewer_name}
                    onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-2">Comment</label>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                />
              </div>

              <Button type="submit">Submit Review</Button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{review.reviewer_name}</p>
                          <div className="flex gap-1 my-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;