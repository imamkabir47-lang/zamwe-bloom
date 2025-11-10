-- Create product reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.marketplace_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON public.product_reviews
  FOR SELECT
  USING (true);

-- Anyone can create reviews (with or without account)
CREATE POLICY "Anyone can create reviews"
  ON public.product_reviews
  FOR INSERT
  WITH CHECK (true);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.product_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add average rating and review count to marketplace posts
ALTER TABLE public.marketplace_posts 
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'other';

-- Create function to update post ratings
CREATE OR REPLACE FUNCTION public.update_post_ratings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE marketplace_posts
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM product_reviews
      WHERE post_id = NEW.post_id
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM product_reviews
      WHERE post_id = NEW.post_id
    )
  WHERE id = NEW.post_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update ratings on review insert/update/delete
CREATE TRIGGER update_ratings_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_ratings();

-- Enable realtime for reviews
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_reviews;