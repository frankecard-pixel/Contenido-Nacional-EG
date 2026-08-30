
-- Tabla para información extendida de talentos
CREATE TABLE IF NOT EXISTS public.talents (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    specialty TEXT,
    experience_years INTEGER DEFAULT 0,
    education_level TEXT,
    location_province TEXT,
    location_city TEXT,
    availability_status TEXT DEFAULT 'available', -- available, busy, looking
    verification_status TEXT DEFAULT 'pending', -- pending, verified, rejected
    skills TEXT[],
    bio TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Admins can manage all talents" ON public.talents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() 
            AND (users.role = 'super_admin' OR users.role = 'admin')
        )
    );

CREATE POLICY "Users can view and edit their own talent profile" ON public.talents
    FOR ALL USING (auth.uid() = id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_talents_updated_at
    BEFORE UPDATE ON public.talents
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
