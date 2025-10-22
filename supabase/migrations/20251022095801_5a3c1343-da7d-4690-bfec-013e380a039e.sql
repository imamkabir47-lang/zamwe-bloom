-- Fix foreign key relationships to use profiles table instead of auth.users

-- Add user_id to profiles as foreign key to auth.users if not exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop and recreate tables with correct foreign keys

-- Fix videos table
ALTER TABLE public.videos DROP CONSTRAINT IF EXISTS videos_created_by_fkey;
ALTER TABLE public.videos ADD CONSTRAINT videos_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

-- Fix messages table
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT messages_recipient_id_fkey 
  FOREIGN KEY (recipient_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix forum_posts table
ALTER TABLE public.forum_posts DROP CONSTRAINT IF EXISTS forum_posts_author_id_fkey;
ALTER TABLE public.forum_posts ADD CONSTRAINT forum_posts_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix forum_comments table
ALTER TABLE public.forum_comments DROP CONSTRAINT IF EXISTS forum_comments_author_id_fkey;
ALTER TABLE public.forum_comments ADD CONSTRAINT forum_comments_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix forum_likes table
ALTER TABLE public.forum_likes DROP CONSTRAINT IF EXISTS forum_likes_user_id_fkey;
ALTER TABLE public.forum_likes ADD CONSTRAINT forum_likes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix courses table
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;
ALTER TABLE public.courses ADD CONSTRAINT courses_instructor_id_fkey 
  FOREIGN KEY (instructor_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix enrollments table
ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;
ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix quiz_attempts table
ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_user_id_fkey;
ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix products table
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
ALTER TABLE public.products ADD CONSTRAINT products_seller_id_fkey 
  FOREIGN KEY (seller_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix orders table
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_seller_id_fkey;
ALTER TABLE public.orders ADD CONSTRAINT orders_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
ALTER TABLE public.orders ADD CONSTRAINT orders_seller_id_fkey 
  FOREIGN KEY (seller_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix bookings table
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_mentor_id_fkey;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_mentor_id_fkey 
  FOREIGN KEY (mentor_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix user_achievements table
ALTER TABLE public.user_achievements DROP CONSTRAINT IF EXISTS user_achievements_user_id_fkey;
ALTER TABLE public.user_achievements ADD CONSTRAINT user_achievements_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix points_history table
ALTER TABLE public.points_history DROP CONSTRAINT IF EXISTS points_history_user_id_fkey;
ALTER TABLE public.points_history ADD CONSTRAINT points_history_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix user_points table
ALTER TABLE public.user_points DROP CONSTRAINT IF EXISTS user_points_user_id_fkey;
ALTER TABLE public.user_points ADD CONSTRAINT user_points_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix notifications table
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix payments table
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE public.payments ADD CONSTRAINT payments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix blog_posts table
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Fix resources table
ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_created_by_fkey;
ALTER TABLE public.resources ADD CONSTRAINT resources_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

-- Fix events table
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_created_by_fkey;
ALTER TABLE public.events ADD CONSTRAINT events_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

-- Fix event_rsvps table
ALTER TABLE public.event_rsvps DROP CONSTRAINT IF EXISTS event_rsvps_user_id_fkey;
ALTER TABLE public.event_rsvps ADD CONSTRAINT event_rsvps_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;