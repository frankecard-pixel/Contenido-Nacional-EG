-- ========================================================================================
-- SCRIPT DE ACTUALIZACIÓN SQL PARA LAS MEJORAS DEL MAPA (OPENSTREETMAP)
-- Ejecute este script en el Editor SQL de Supabase para habilitar las nuevas tablas,
-- columnas y datos de geolocalización para Empresas, Obras Sociales, Centros de Formación y Cursos.
-- ========================================================================================

-- 1. ASEGURAR COLUMNAS DE GEOLOCALIZACIÓN EN LAS TABLAS EXISTENTES

-- Tabla de Empresas (companies)
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS lat NUMERIC,
ADD COLUMN IF NOT EXISTS lng NUMERIC;

-- Tabla de Obras Sociales (social_projects)
ALTER TABLE public.social_projects 
ADD COLUMN IF NOT EXISTS lat NUMERIC,
ADD COLUMN IF NOT EXISTS lng NUMERIC;


-- 2. CREACIÓN DE LA TABLA DE CENTROS DE FORMACIÓN (training_centers)
CREATE TABLE IF NOT EXISTS public.training_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image TEXT,
    location TEXT NOT NULL,
    capacity TEXT NOT NULL,
    specialties JSONB DEFAULT '[]'::jsonb,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para seguridad
ALTER TABLE public.training_centers ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso RLS
DROP POLICY IF EXISTS "Permitir lectura pública de centros" ON public.training_centers;
CREATE POLICY "Permitir lectura pública de centros" ON public.training_centers 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados" ON public.training_centers;
CREATE POLICY "Permitir todo a usuarios autenticados" ON public.training_centers 
    FOR ALL USING (auth.role() = 'authenticated');


-- 3. CREACIÓN DE LA TABLA DE CURSOS DISPONIBLES (courses)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    center_id UUID REFERENCES public.training_centers(id) ON DELETE CASCADE,
    center_name TEXT NOT NULL,
    duration TEXT NOT NULL,
    level TEXT NOT NULL, -- 'Básico', 'Intermedio', 'Avanzado', 'Profesional'
    vacancies INTEGER DEFAULT 10,
    location TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para seguridad
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso RLS
DROP POLICY IF EXISTS "Permitir lectura pública de cursos" ON public.courses;
CREATE POLICY "Permitir lectura pública de cursos" ON public.courses 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados en cursos" ON public.courses;
CREATE POLICY "Permitir todo a usuarios autenticados en cursos" ON public.courses 
    FOR ALL USING (auth.role() = 'authenticated');


-- ========================================================================================
-- 4. INSERCIÓN DE DATOS DE PRUEBA (SEED DATA)
-- ========================================================================================

-- Actualizar coordenadas de empresas existentes de ejemplo (como EG LNG Operations)
UPDATE public.companies 
SET lat = 3.75, lng = 8.75, address = 'Malabo, Bioko Norte'
WHERE name ILIKE '%EG LNG%';

UPDATE public.companies 
SET lat = 1.86, lng = 9.75, address = 'Bata, Litoral'
WHERE name ILIKE '%Bata%' OR name ILIKE '%Litoral%';

-- Actualizar coordenadas de obras sociales existentes
UPDATE public.social_projects 
SET lat = -1.43, lng = 5.63, location = 'Annobón'
WHERE id = 'c0a80164-0000-0000-0000-000000000001'::uuid OR title->>'es' ILIKE '%Annobón%' OR location ILIKE '%Annobón%';

-- Insertar Centros de Formación
INSERT INTO public.training_centers (id, name, image, location, capacity, specialties, lat, lng)
VALUES 
(
    'c0a80164-1111-1111-1111-000000000001'::uuid,
    'Centro de Formación Técnica Luba',
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop',
    'Luba, Bioko Sur',
    '100 técnicos',
    '["Soldadura", "HSE", "Mecánica"]'::jsonb,
    3.45,
    8.57
),
(
    'c0a80164-1111-1111-1111-000000000002'::uuid,
    'Instituto de Hidrocarburos Bata',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2000&auto=format&fit=crop',
    'Bata, Litoral',
    '250 estudiantes',
    '["Geología", "Drilling", "Administración"]'::jsonb,
    1.86,
    9.76
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng;

-- Insertar Cursos Disponibles vinculados a los Centros
INSERT INTO public.courses (id, title, center_id, center_name, duration, level, vacancies, location, lat, lng)
VALUES
(
    'c0a80164-2222-2222-2222-000000000001'::uuid,
    'Curso Avanzado de Soldadura Subacuática',
    'c0a80164-1111-1111-1111-000000000001'::uuid,
    'Centro de Formación Técnica Luba',
    '120 horas',
    'Avanzado',
    15,
    'Luba, Puerto de Luba',
    3.45,
    8.57
),
(
    'c0a80164-2222-2222-2222-000000000002'::uuid,
    'HSE & Control de Riesgos Críticos',
    'c0a80164-1111-1111-1111-000000000001'::uuid,
    'Centro de Formación Técnica Luba',
    '60 horas',
    'Intermedio',
    20,
    'Malabo, Campo Alba',
    3.74,
    8.77
),
(
    'c0a80164-2222-2222-2222-000000000003'::uuid,
    'Operaciones de Perforación Offshore',
    'c0a80164-1111-1111-1111-000000000002'::uuid,
    'Instituto de Hidrocarburos Bata',
    '150 horas',
    'Profesional',
    12,
    'Bata, Sector Litoral',
    1.86,
    9.76
),
(
    'c0a80164-2222-2222-2222-000000000004'::uuid,
    'Tecnologías de Refino y Procesamiento de Gas',
    'c0a80164-1111-1111-1111-000000000002'::uuid,
    'Instituto de Hidrocarburos Bata',
    '90 horas',
    'Avanzado',
    8,
    'Bata, Terminal de Gas',
    1.85,
    9.77
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng;

-- ========================================================================================
-- 5. CREACIÓN DE LA TABLA DE RESEÑAS Y COMENTARIOS DE EMPRESAS (company_reviews)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.company_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para seguridad
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso RLS
DROP POLICY IF EXISTS "Permitir lectura pública de reseñas" ON public.company_reviews;
CREATE POLICY "Permitir lectura pública de reseñas" ON public.company_reviews 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserción a usuarios autenticados" ON public.company_reviews;
CREATE POLICY "Permitir inserción a usuarios autenticados" ON public.company_reviews 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insertar algunas reseñas de prueba asociadas a empresas existentes
INSERT INTO public.company_reviews (id, company_id, user_name, rating, text, created_at)
SELECT 
    'c0a80164-3333-3333-3333-000000000001'::uuid,
    id,
    'Juan Pérez',
    5,
    'Excelente servicio y profesionalismo en todos los proyectos conjuntos.',
    now() - INTERVAL '30 days'
FROM public.companies
WHERE name ILIKE '%EG LNG%'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.company_reviews (id, company_id, user_name, rating, text, created_at)
SELECT 
    'c0a80164-3333-3333-3333-000000000002'::uuid,
    id,
    'María García',
    4,
    'Muy buena experiencia trabajando con ellos, excelente cumplimiento del contenido nacional.',
    now() - INTERVAL '15 days'
FROM public.companies
WHERE name ILIKE '%EG LNG%'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- ========================================================================================
-- 6. COLUMNAS DE PRIVACIDAD DE BÚSQUEDA Y LINKEDIN EN USUARIOS (public.users)
-- ========================================================================================
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS allow_search BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile JSONB;
