-- ========================================================================================
-- FASE 2: MÓDULO DE NACIONALIZACIÓN Y TALENTO NACIONAL
-- MINISTERIO DE MINAS E HIDROCARBUROS DE GUINEA ECUATORIAL
-- ========================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. REGISTRO DE PERFILES DE TALENTO NACIONAL
CREATE TABLE IF NOT EXISTS public.talent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    national_id TEXT UNIQUE, -- DIP / Pasaporte
    birth_date DATE,
    nationality TEXT DEFAULT 'Equatoguineana',
    phone TEXT,
    email TEXT NOT NULL,
    locality TEXT,
    province TEXT,
    region TEXT,
    profession TEXT NOT NULL,
    specialty TEXT NOT NULL,
    professional_level TEXT DEFAULT 'Junior',
    experience_years INTEGER DEFAULT 0,
    sector TEXT,
    availability TEXT DEFAULT 'Inmediata',
    preferred_location TEXT,
    avatar_url TEXT,
    cv_url TEXT,
    visibility TEXT DEFAULT 'MINISTERIO', -- 'PRIVADO', 'MINISTERIO', 'EMPRESAS_AUTORIZADAS'
    completeness_percentage INTEGER DEFAULT 0,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. REGISTRO DE PERSONAL EXPATRIADO EN EMPRESAS Y OPERADORAS
CREATE TABLE IF NOT EXISTS public.expatriate_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    nationality TEXT NOT NULL,
    origin_country TEXT NOT NULL,
    position TEXT NOT NULL,
    specialty TEXT,
    department TEXT,
    arrival_date DATE,
    contract_duration_months INTEGER DEFAULT 36,
    nationalization_possibility TEXT DEFAULT 'Media', -- 'Alta', 'Media', 'Baja', 'No reemplazable'
    status TEXT DEFAULT 'Activo', -- 'Activo', 'En proceso de reemplazo', 'Sustituido', 'Finalizado'
    assigned_shadow_id UUID REFERENCES public.talent_profiles(id) ON DELETE SET NULL,
    assigned_shadow_name TEXT,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. POSICIONES SUJETAS A NACIONALIZACIÓN
CREATE TABLE IF NOT EXISTS public.nationalization_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    position_title TEXT NOT NULL,
    department TEXT,
    occupant_name TEXT,
    occupant_type TEXT DEFAULT 'EXPATRIADO', -- 'NACIONAL', 'EXPATRIADO'
    nationalization_possibility TEXT DEFAULT 'Alta',
    status TEXT DEFAULT 'REGISTRADO', -- 'REGISTRADO', 'EN_REVISION', 'EVALUACION', 'CANDIDATO_IDENTIFICADO', 'PLAN_TRANSFERENCIA', 'FORMACION', 'SEGUIMIENTO', 'PROPUESTA_NACIONALIZACION', 'APROBADO', 'NACIONALIZADO', 'CERRADO'
    priority TEXT DEFAULT 'Media',
    identified_candidate_id UUID REFERENCES public.talent_profiles(id) ON DELETE SET NULL,
    identified_candidate_name TEXT,
    target_date DATE,
    transfer_plan_id UUID,
    requirements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. PLANES DE TRANSFERENCIA DE CONOCIMIENTO (TRANSFER PLANS)
CREATE TABLE IF NOT EXISTS public.transfer_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position_id UUID REFERENCES public.nationalization_positions(id) ON DELETE CASCADE,
    position_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    expatriate_name TEXT NOT NULL,
    local_candidate_name TEXT NOT NULL,
    local_candidate_id UUID REFERENCES public.talent_profiles(id) ON DELETE SET NULL,
    mentor_name TEXT,
    competencies JSONB DEFAULT '[]'::jsonb, -- Array de CompetencyGap
    start_date DATE,
    target_date DATE,
    progress_percentage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'EN_CURSO',
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. ÍNDICES DE BÚSQUEDA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_talent_profession ON public.talent_profiles(profession);
CREATE INDEX IF NOT EXISTS idx_talent_province ON public.talent_profiles(province);
CREATE INDEX IF NOT EXISTS idx_talent_visibility ON public.talent_profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_expatriate_company ON public.expatriate_records(company_id);
CREATE INDEX IF NOT EXISTS idx_nat_pos_status ON public.nationalization_positions(status);

-- 6. POLÍTICAS RLS
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expatriate_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nationalization_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for talent_profiles" ON public.talent_profiles;
CREATE POLICY "Allow all for talent_profiles" ON public.talent_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for expatriate_records" ON public.expatriate_records;
CREATE POLICY "Allow all for expatriate_records" ON public.expatriate_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for nationalization_positions" ON public.nationalization_positions;
CREATE POLICY "Allow all for nationalization_positions" ON public.nationalization_positions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for transfer_plans" ON public.transfer_plans;
CREATE POLICY "Allow all for transfer_plans" ON public.transfer_plans FOR ALL USING (true);
