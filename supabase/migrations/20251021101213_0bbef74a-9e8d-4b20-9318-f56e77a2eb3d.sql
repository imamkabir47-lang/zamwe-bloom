-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  max_attendees INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event RSVPs table
CREATE TABLE public.event_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Event RSVPs policies
CREATE POLICY "Anyone can create RSVP" ON public.event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all RSVPs" ON public.event_rsvps FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own RSVPs" ON public.event_rsvps FOR SELECT USING (auth.uid() = user_id);

-- Newsletter policies
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Resources policies
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Testimonials policies
CREATE POLICY "Anyone can view featured testimonials" ON public.testimonials FOR SELECT USING (is_featured = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Storage policies for resources
CREATE POLICY "Anyone can view resources" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Admins can upload resources" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources' AND has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_rsvps;