import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    media_type: 'product' as 'product' | 'image' | 'video',
    caption: '',
    product_name: '',
    quantity: '',
    price: '',
    currency: 'NGN',
    location: '',
    availability: '',
    payment_method: '',
    account_details: '',
    whatsapp_number: '',
    category: 'other'
  });

  const categories = [
    'fashion', 'beauty', 'food', 'crafts', 'services', 'technology', 'other'
  ];

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('marketplace_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check if user owns this post
      if (data.user_id !== user.id) {
        toast.error('You can only edit your own posts');
        navigate('/dashboard');
        return;
      }

      // Populate form with existing data
      setFormData({
        media_type: (data.media_type || 'product') as 'product' | 'image' | 'video',
        caption: data.caption || '',
        product_name: data.product_name || '',
        quantity: data.quantity?.toString() || '',
        price: data.price?.toString() || '',
        currency: data.currency || 'NGN',
        location: data.location || '',
        availability: data.availability || '',
        payment_method: data.payment_method || '',
        account_details: data.account_details || '',
        whatsapp_number: data.whatsapp_number || '',
        category: data.category || 'other'
      });
      setMediaUrls(
        Array.isArray(data.media_urls) 
          ? (data.media_urls as string[]).filter((url): url is string => typeof url === 'string')
          : []
      );
    } catch (error: any) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
      navigate('/dashboard');
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `marketplace/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('applications')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setMediaUrls([...mediaUrls, ...uploadedUrls]);
      toast.success('Media uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('marketplace_posts')
        .update({
          media_urls: mediaUrls,
          ...formData,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          price: formData.price ? parseFloat(formData.price) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Post updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-16">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Edit Post</CardTitle>
            <CardDescription>Update your marketplace post details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="media_type">Post Type</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value: 'product' | 'image' | 'video') =>
                    setFormData({ ...formData, media_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product Listing</SelectItem>
                    <SelectItem value="image">Photo Post</SelectItem>
                    <SelectItem value="video">Video Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <Label htmlFor="media-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Add More Media'}
                    </span>
                  </Button>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  rows={3}
                  placeholder="Write a caption for your post..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.media_type === 'product' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      placeholder="e.g., In stock, Made to order"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Input
                      id="payment_method"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      placeholder="e.g., Bank transfer, Cash on delivery"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_details">Account Details</Label>
                    <Textarea
                      id="account_details"
                      value={formData.account_details}
                      onChange={(e) => setFormData({ ...formData, account_details: e.target.value })}
                      rows={2}
                      placeholder="Bank account number or payment details"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading || mediaUrls.length === 0}>
                {loading ? 'Updating Post...' : 'Update Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPost;
