
-- Actualización para gestión de CV y Verificación de Talento
ALTER TABLE public.candidate_profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS admin_comment TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS certification_number TEXT,
ADD COLUMN IF NOT EXISTS verification_score INTEGER;

-- Sincronizar con la tabla users si es necesario
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Asegurar que los talentos también tengan estos campos para compatibilidad
ALTER TABLE public.talents
ADD COLUMN IF NOT EXISTS admin_comment TEXT,
ADD COLUMN IF NOT EXISTS certification_number TEXT;
