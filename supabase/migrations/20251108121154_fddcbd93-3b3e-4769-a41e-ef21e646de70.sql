-- Fix function search path security issues
-- Update the update_marketplace_posts_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_marketplace_posts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the deactivate_expired_users function
CREATE OR REPLACE FUNCTION public.deactivate_expired_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Add RLS policies for quiz tables
CREATE POLICY "Users can view quizzes for enrolled courses"
ON public.quizzes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.lessons l ON l.course_id = e.course_id
    WHERE l.id = quizzes.lesson_id
    AND e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view quiz questions for accessible quizzes"
ON public.quiz_questions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes q
    JOIN public.lessons l ON l.id = q.lesson_id
    JOIN public.enrollments e ON e.course_id = l.course_id
    WHERE q.id = quiz_questions.quiz_id
    AND e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own quiz attempts"
ON public.quiz_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz attempts"
ON public.quiz_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);