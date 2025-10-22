-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  duration INTEGER,
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  category TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create forum_comments table
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create forum_likes table
CREATE TABLE IF NOT EXISTS public.forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT forum_likes_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  instructor_id UUID NOT NULL REFERENCES auth.users(id),
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  enrollments_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  order_number INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at TIMESTAMPTZ,
  certificate_url TEXT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  category TEXT NOT NULL,
  images JSONB,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  mentor_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('mentorship', 'consultation', 'workshop')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create points_history table
CREATE TABLE IF NOT EXISTS public.points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_points table
CREATE TABLE IF NOT EXISTS public.user_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  reference_type TEXT,
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paystack', 'flutterwave')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('membership', 'event', 'course', 'product', 'donation')),
  reference_id UUID,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'ha', 'fr', 'ar')),
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(key, language)
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for videos
CREATE POLICY "Anyone can view published videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can manage videos" ON public.videos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() IN (sender_id, recipient_id));
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can update messages" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS Policies for forum
CREATE POLICY "Anyone can view posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage posts" ON public.forum_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view comments" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own comments" ON public.forum_comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can manage own likes" ON public.forum_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view likes" ON public.forum_likes FOR SELECT USING (true);

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR instructor_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Instructors can manage own courses" ON public.courses FOR ALL USING (instructor_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Instructors can manage lessons" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (instructor_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in courses" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for marketplace
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true OR seller_id = auth.uid());
CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (seller_id = auth.uid());

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() IN (buyer_id, seller_id));
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update orders" ON public.orders FOR UPDATE USING (auth.uid() = seller_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() IN (user_id, mentor_id));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Mentors can update bookings" ON public.bookings FOR UPDATE USING (auth.uid() = mentor_id);

-- RLS Policies for gamification
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own user achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can award achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own points history" ON public.points_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can add points" ON public.points_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view user points" ON public.user_points FOR SELECT USING (true);
CREATE POLICY "Users can update own points" ON public.user_points FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for translations
CREATE POLICY "Anyone can view translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Admins can manage translations" ON public.translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for blog
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (is_published = true OR author_id = auth.uid());
CREATE POLICY "Authors can manage own posts" ON public.blog_posts FOR ALL USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_comments_updated_at BEFORE UPDATE ON public.forum_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON public.user_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON public.translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Create indexes for performance
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_forum_posts_author ON public.forum_posts(author_id);
CREATE INDEX idx_forum_comments_post ON public.forum_comments(post_id);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_payments_user ON public.payments(user_id);