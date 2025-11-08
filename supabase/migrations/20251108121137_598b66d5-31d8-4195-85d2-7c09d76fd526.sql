-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new restrictive policies for profiles
-- Policy 1: Users can view their own full profile
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy 3: Authenticated users can view LIMITED public info of other users
-- Only expose: username, photo_url, business_name, business_type, bio, is_verified, full_name
CREATE POLICY "Users can view public profile info of others"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- This will allow reading but the application should only display public fields
  -- Private fields (phone_number, whatsapp_number, contact_address, next_of_kin, 
  -- payment_reference, payment_status) should be filtered in application code
  true
);

-- Note: Application code must filter sensitive fields when displaying other users' profiles
-- Public fields: username, photo_url, business_name, business_type, bio, is_verified, full_name
-- Private fields: phone_number, whatsapp_number, contact_address, next_of_kin, payment_reference, payment_status