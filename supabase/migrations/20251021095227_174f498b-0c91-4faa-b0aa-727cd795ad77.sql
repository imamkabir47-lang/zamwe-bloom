-- Create public storage bucket 'applications' if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'applications'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('applications', 'applications', true);
  END IF;
END $$;

-- Create policy for public read if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for applications'
  ) THEN
    CREATE POLICY "Public read access for applications"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'applications');
  END IF;
END $$;

-- Create policy for public insert if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can upload to applications'
  ) THEN
    CREATE POLICY "Anyone can upload to applications"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'applications');
  END IF;
END $$;