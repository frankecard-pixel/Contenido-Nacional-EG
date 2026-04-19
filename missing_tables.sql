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

-- Enable RLS for advertisements
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Create policies for advertisements (Allow all for now, or restrict by role)
CREATE POLICY "Allow all for advertisements" ON public.advertisements FOR ALL USING (true);
