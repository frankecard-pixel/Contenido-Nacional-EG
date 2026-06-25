-- ========================================================================================
-- SCRIPT DE ACTUALIZACIÓN (DELTA) PARA SUPABASE
-- Ejecuta este script en el editor SQL de Supabase para añadir los campos y tablas
-- requeridos por las nuevas características de subida de archivos (Base64/URL) y vistas previas.
-- ========================================================================================

-- 0.5 Soporte para status en la tabla de categorías web (web_categories)
ALTER TABLE public.web_categories 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published'::text;

-- 1. Soporte para avatar_url en la tabla de usuarios (usado en el frontend)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 1.1 Soporte para campos adicionales en la tabla de solicitudes de registro (registration_requests)
-- Esto resuelve el error PGRST204 de "Could not find the 'documents' column..."
ALTER TABLE public.registration_requests 
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS dip_base64 TEXT,
ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS expediente_number TEXT;

-- Crear un índice único para tracking_number si se requiere buscar de forma única
CREATE UNIQUE INDEX IF NOT EXISTS registration_requests_tracking_number_idx ON public.registration_requests (tracking_number);


-- 2. Creación de la tabla de Anuncios / Banners Publicitarios (si no existe)
CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    status TEXT DEFAULT 'active'::text, -- 'active', 'paused', 'pending'
    budget NUMERIC DEFAULT 0,
    spend NUMERIC DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    format TEXT DEFAULT 'top_banner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Asegurar que la columna format exista si la tabla ya había sido creada anteriormente
ALTER TABLE public.advertisements ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'top_banner';

-- Habilitar Row Level Security para la tabla de anuncios
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Crear política de acceso total temporal para anuncios
DROP POLICY IF EXISTS "Allow all for advertisements" ON public.advertisements;
CREATE POLICY "Allow all for advertisements" ON public.advertisements FOR ALL USING (true);


-- 3. Creación de la tabla genérica de Documentos (para adjuntos generales de la plataforma si es necesario)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'pending'::text,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expiry_date DATE,
    size TEXT,
    format TEXT,
    feedback TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security para la tabla genérica de documentos
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Crear política de acceso total temporal para documentos
DROP POLICY IF EXISTS "Allow all for documents" ON public.documents;
CREATE POLICY "Allow all for documents" ON public.documents FOR ALL USING (true);


-- 4. Creación de la tabla de Certificaciones (si no existe)
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active'::text,
    date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security para certificaciones
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Crear política de acceso total temporal para certificaciones
DROP POLICY IF EXISTS "Allow all for certifications" ON public.certifications;
CREATE POLICY "Allow all for certifications" ON public.certifications FOR ALL USING (true);


-- 5. Creación de la tabla de Notificaciones (si no existe)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security para notificaciones
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Crear política de acceso total temporal para notificaciones
DROP POLICY IF EXISTS "Allow all for notifications" ON public.notifications;
CREATE POLICY "Allow all for notifications" ON public.notifications FOR ALL USING (true);


-- 6. CONFIGURACIÓN DE LOS BUCKETS DE STORAGE EN SUPABASE
-- Nota: En Supabase, para poder subir archivos a un bucket, debes crearlo primero.
-- Puedes hacerlo desde la interfaz web (Storage > New Bucket) o ejecutando este SQL
-- si tienes habilitado el acceso a la extensión de storage:

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('cvs', 'cvs', true),
  ('advertisements', 'advertisements', true),
  ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Crear políticas permisivas de almacenamiento para que cualquier usuario pueda subir/ver archivos en desarrollo:
DROP POLICY IF EXISTS "Permitir todo en el bucket de avatars" ON storage.objects;
CREATE POLICY "Permitir todo en el bucket de avatars" ON storage.objects 
  FOR ALL USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Permitir todo en el bucket de cvs" ON storage.objects;
CREATE POLICY "Permitir todo en el bucket de cvs" ON storage.objects 
  FOR ALL USING (bucket_id = 'cvs') WITH CHECK (bucket_id = 'cvs');

DROP POLICY IF EXISTS "Permitir todo en el bucket de advertisements" ON storage.objects;
CREATE POLICY "Permitir todo en el bucket de advertisements" ON storage.objects 
  FOR ALL USING (bucket_id = 'advertisements') WITH CHECK (bucket_id = 'advertisements');

DROP POLICY IF EXISTS "Permitir todo en el bucket de news-images" ON storage.objects;
CREATE POLICY "Permitir todo en el bucket de news-images" ON storage.objects 
  FOR ALL USING (bucket_id = 'news-images') WITH CHECK (bucket_id = 'news-images');
