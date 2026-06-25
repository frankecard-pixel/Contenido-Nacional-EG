-- Add missing columns for advertisement validation
ALTER TABLE public.advertisements ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id);
ALTER TABLE public.advertisements ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'approved';
ALTER TABLE public.advertisements ADD COLUMN IF NOT EXISTS pending_budget NUMERIC;
