DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Admins can update profiles'
  ) THEN
    CREATE POLICY "Admins can update profiles"
      ON public.profiles
      FOR UPDATE
      USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;