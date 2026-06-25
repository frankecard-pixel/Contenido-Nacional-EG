-- SQL to create missing tables and columns for Advertisements and News Management

-- 1. Advertisements Table
CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'pending'
    budget NUMERIC DEFAULT 0,
    spend NUMERIC DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    format TEXT DEFAULT 'top_banner',
    created_by UUID REFERENCES public.users(id),
    validation_status TEXT DEFAULT 'approved', -- 'approved', 'pending_validation'
    pending_budget NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Update News Articles Table (Add missing columns)
ALTER TABLE public.news_articles 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- 3. Update Opportunities Table (Add missing columns)
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS scope_of_work TEXT,
ADD COLUMN IF NOT EXISTS awarded_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT 'Nacional';

-- 4. Storage Buckets (Run these in Supabase Dashboard or via API if possible)
-- Note: You need to create these buckets in the Supabase Storage dashboard:
-- 'advertisements'
-- 'news'
-- 'avatars'
-- 'cvs'
-- 'documents'
-- 'banners' (required for customizable page banners)

-- Enable RLS for advertisements
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Create policies for advertisements (Allow all for now, or restrict by role)
DROP POLICY IF EXISTS "Allow all for advertisements" ON public.advertisements;
CREATE POLICY "Allow all for advertisements" ON public.advertisements FOR ALL USING (true);

-- 5. Web Banners Table (Super Admin Web Customization)
CREATE TABLE IF NOT EXISTS public.web_banners (
    id TEXT PRIMARY KEY, -- e.g., 'home_hero_0', 'home_hero_1', 'opportunities_banner'
    page_key TEXT NOT NULL,
    banner_key TEXT NOT NULL,
    image_url TEXT NOT NULL,
    title TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for web_banners
ALTER TABLE public.web_banners ENABLE ROW LEVEL SECURITY;

-- Create policies for web_banners
DROP POLICY IF EXISTS "Allow public select for web_banners" ON public.web_banners;
CREATE POLICY "Allow public select for web_banners" ON public.web_banners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on web_banners" ON public.web_banners;
CREATE POLICY "Allow all for authenticated users on web_banners" ON public.web_banners FOR ALL TO authenticated USING (true);


-- 6. Certifications Table (Revised with all required properties)
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuer TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'valid', 'expired', 'rejected'
    date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    file_url TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for certifications
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for certifications
DROP POLICY IF EXISTS "Allow public select for certifications" ON public.certifications;
CREATE POLICY "Allow public select for certifications" ON public.certifications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on certifications" ON public.certifications;
CREATE POLICY "Allow all for authenticated users on certifications" ON public.certifications FOR ALL USING (true);


-- 7. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    type TEXT DEFAULT 'Persona', -- 'Persona' or 'Empresa'
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_subscribers
DROP POLICY IF EXISTS "Allow all for newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow all for newsletter_subscribers" ON public.newsletter_subscribers FOR ALL USING (true);


-- 8. Newsletter Campaigns Table
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'
    recipients INTEGER DEFAULT 0,
    open_rate TEXT DEFAULT '-',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for newsletter_campaigns
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_campaigns
DROP POLICY IF EXISTS "Allow all for newsletter_campaigns" ON public.newsletter_campaigns;
CREATE POLICY "Allow all for newsletter_campaigns" ON public.newsletter_campaigns FOR ALL USING (true);


-- 9. Web FAQs Table
CREATE TABLE IF NOT EXISTS public.web_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question JSONB NOT NULL, -- Multilingual: {es, en, fr}
    answer JSONB NOT NULL,   -- Multilingual: {es, en, fr}
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.web_faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select for web_faqs" ON public.web_faqs;
CREATE POLICY "Allow public select for web_faqs" ON public.web_faqs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on web_faqs" ON public.web_faqs;
CREATE POLICY "Allow all for authenticated users on web_faqs" ON public.web_faqs FOR ALL TO authenticated USING (true);


-- 10. Web Images / Gallery Table
CREATE TABLE IF NOT EXISTS public.web_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    title JSONB NOT NULL, -- Multilingual: {es, en, fr}
    group_name TEXT NOT NULL, -- e.g. 'Instalaciones', 'Capacitación', 'Eventos'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.web_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select for web_images" ON public.web_images;
CREATE POLICY "Allow public select for web_images" ON public.web_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on web_images" ON public.web_images;
CREATE POLICY "Allow all for authenticated users on web_images" ON public.web_images FOR ALL TO authenticated USING (true);


-- 11. Web Normativas (Regulations) Table
CREATE TABLE IF NOT EXISTS public.web_normativas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,       -- Multilingual: {es, en, fr}
    description JSONB NOT NULL, -- Multilingual: {es, en, fr}
    file_url TEXT NOT NULL,
    category TEXT DEFAULT 'Leyes',
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.web_normativas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select for web_normativas" ON public.web_normativas;
CREATE POLICY "Allow public select for web_normativas" ON public.web_normativas FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on web_normativas" ON public.web_normativas;
CREATE POLICY "Allow all for authenticated users on web_normativas" ON public.web_normativas FOR ALL TO authenticated USING (true);


-- 12. Web Guides Table
CREATE TABLE IF NOT EXISTS public.web_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,       -- Multilingual: {es, en, fr}
    description JSONB NOT NULL, -- Multilingual: {es, en, fr}
    file_url TEXT NOT NULL,
    category TEXT DEFAULT 'Guías de Usuario',
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.web_guides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select for web_guides" ON public.web_guides;
CREATE POLICY "Allow public select for web_guides" ON public.web_guides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on web_guides" ON public.web_guides;
CREATE POLICY "Allow all for authenticated users on web_guides" ON public.web_guides FOR ALL TO authenticated USING (true);


-- 13. Web Testimonials Table
CREATE TABLE IF NOT EXISTS public.web_testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    role JSONB NOT NULL,  -- Multilingual: {es, en, fr}
    quote JSONB NOT NULL, -- Multilingual: {es, en, fr}
    avatar_url TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.web_testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select for web_testimonials" ON public.web_testimonials;
CREATE POLICY "Allow public select for web_testimonials" ON public.web_testimonials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on web_testimonials" ON public.web_testimonials;
CREATE POLICY "Allow all for authenticated users on web_testimonials" ON public.web_testimonials FOR ALL TO authenticated USING (true);

-- 14. Web Priority Sectors Table
CREATE TABLE IF NOT EXISTS public.web_priority_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,       -- Multilingual: {es, en, fr}
    description JSONB NOT NULL, -- Multilingual: {es, en, fr}
    icon TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.web_priority_sectors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select for web_priority_sectors" ON public.web_priority_sectors;
CREATE POLICY "Allow public select for web_priority_sectors" ON public.web_priority_sectors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for authenticated users on web_priority_sectors" ON public.web_priority_sectors;
CREATE POLICY "Allow all for authenticated users on web_priority_sectors" ON public.web_priority_sectors FOR ALL TO authenticated USING (true);




