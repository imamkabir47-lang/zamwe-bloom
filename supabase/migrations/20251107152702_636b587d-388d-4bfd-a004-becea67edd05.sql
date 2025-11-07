-- Update profiles table to support the new user system
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'permanent' CHECK (user_type IN ('permanent', 'temporary'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_reference text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by_admin uuid REFERENCES auth.users(id);

-- Create marketplace_posts table for product listings
CREATE TABLE IF NOT EXISTS public.marketplace_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video', 'product')),
  media_urls jsonb DEFAULT '[]'::jsonb,
  caption text,
  product_name text,
  quantity integer,
  price numeric,
  currency text DEFAULT 'NGN',
  location text,
  availability text,
  payment_method text,
  account_details text,
  whatsapp_number text,
  is_active boolean DEFAULT true,
  is_boosted boolean DEFAULT false,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on marketplace_posts
ALTER TABLE public.marketplace_posts ENABLE ROW LEVEL SECURITY;

-- Policies for marketplace_posts
CREATE POLICY "Anyone can view active posts"
ON public.marketplace_posts
FOR SELECT
USING (is_active = true OR user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own posts"
ON public.marketplace_posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins can update posts"
ON public.marketplace_posts
FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users and admins can delete posts"
ON public.marketplace_posts
FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Create post_likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.marketplace_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own likes"
ON public.post_likes
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes"
ON public.post_likes
FOR SELECT
USING (true);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.marketplace_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
ON public.post_comments
FOR SELECT
USING (true);

CREATE POLICY "Users can create comments"
ON public.post_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
ON public.post_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users and admins can delete comments"
ON public.post_comments
FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Create user_follows table
CREATE TABLE IF NOT EXISTS public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own follows"
ON public.user_follows
FOR ALL
USING (auth.uid() = follower_id);

CREATE POLICY "Anyone can view follows"
ON public.user_follows
FOR SELECT
USING (true);

-- Create post_views table for analytics
CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.marketplace_posts(id) ON DELETE CASCADE NOT NULL,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create views"
ON public.post_views
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Post owners and admins can view analytics"
ON public.post_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.marketplace_posts
    WHERE marketplace_posts.id = post_views.post_id
    AND (marketplace_posts.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Create site_analytics table
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  visitor_id text,
  visitor_ip text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log visits"
ON public.site_analytics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
ON public.site_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update updated_at on marketplace_posts
CREATE OR REPLACE FUNCTION update_marketplace_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_posts_updated_at
BEFORE UPDATE ON public.marketplace_posts
FOR EACH ROW
EXECUTE FUNCTION update_marketplace_posts_updated_at();

-- Create function to deactivate expired users
CREATE OR REPLACE FUNCTION deactivate_expired_users()
RETURNS void AS $$
BEGIN
  -- Deactivate expired temporary users
  UPDATE public.profiles
  SET is_active = false
  WHERE user_type = 'temporary'
    AND expires_at IS NOT NULL
    AND expires_at < now()
    AND is_active = true;
    
  -- Deactivate posts from expired users
  UPDATE public.marketplace_posts
  SET is_active = false
  WHERE user_id IN (
    SELECT user_id FROM public.profiles
    WHERE user_type = 'temporary'
      AND expires_at IS NOT NULL
      AND expires_at < now()
      AND is_active = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for marketplace
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;