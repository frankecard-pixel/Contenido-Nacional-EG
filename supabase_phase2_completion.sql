-- ========================================================================================
-- FASE 2: MIGRACIÓN SQL COMPLETA Y AUTOCONTENIDA
-- MINISTERIO DE MINAS E HIDROCARBUROS DE GUINEA ECUATORIAL
-- ========================================================================================
-- Este script crea todas las tablas de la Fase 2 en orden estricto de dependencias,
-- incluyendo talent_profiles, pre-notificaciones, pasantías, rotaciones, evaluaciones,
-- y sus políticas RLS multiorganización.
-- Es 100% idempotente (se puede ejecutar de forma segura sin error).
-- ========================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================================
-- 0. FUNCIÓN DE ACTUALIZACIÓN DE TIMESTAMPS
-- ========================================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- ========================================================================================
-- 1. TABLA BASE: TALENTO NACIONAL (talent_profiles)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.talent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
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

-- ========================================================================================
-- 2. TABLA: PERSONAL EXPATRIADO EN OPERADORAS (expatriate_records)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.expatriate_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID,
    company_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    nationality TEXT NOT NULL,
    origin_country TEXT NOT NULL,
    position TEXT NOT NULL,
    specialty TEXT,
    department TEXT,
    arrival_date DATE,
    contract_duration_months INTEGER DEFAULT 36,
    nationalization_possibility TEXT DEFAULT 'Media',
    status TEXT DEFAULT 'Activo',
    assigned_shadow_id UUID REFERENCES public.talent_profiles(id) ON DELETE SET NULL,
    assigned_shadow_name TEXT,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- 3. TABLA: POSICIONES SUJETAS A NACIONALIZACIÓN (nationalization_positions)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.nationalization_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID,
    company_name TEXT NOT NULL,
    position_title TEXT NOT NULL,
    department TEXT,
    occupant_name TEXT,
    occupant_type TEXT DEFAULT 'EXPATRIADO',
    nationalization_possibility TEXT DEFAULT 'Alta',
    status TEXT DEFAULT 'REGISTRADO',
    priority TEXT DEFAULT 'Media',
    identified_candidate_id UUID REFERENCES public.talent_profiles(id) ON DELETE SET NULL,
    identified_candidate_name TEXT,
    target_date DATE,
    transfer_plan_id UUID,
    requirements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- 4. TABLA: PLANES DE TRANSFERENCIA DE CONOCIMIENTO (transfer_plans)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.transfer_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position_id UUID REFERENCES public.nationalization_positions(id) ON DELETE CASCADE,
    position_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    expatriate_name TEXT NOT NULL,
    local_candidate_name TEXT NOT NULL,
    local_candidate_id UUID REFERENCES public.talent_profiles(id) ON DELETE SET NULL,
    mentor_name TEXT,
    competencies JSONB DEFAULT '[]'::jsonb,
    start_date DATE,
    target_date DATE,
    progress_percentage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'EN_CURSO',
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- 5. TABLA: PRE-NOTIFICACIONES DE EXPATRIADOS (expatriate_prenotifications)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.expatriate_prenotifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID,
    company_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    nationality TEXT NOT NULL,
    origin_country TEXT NOT NULL,
    profession TEXT NOT NULL,
    specialty TEXT NOT NULL,
    proposed_position TEXT NOT NULL,
    department TEXT,
    proposed_entry_date DATE NOT NULL,
    proposed_duration_months INTEGER DEFAULT 36,
    is_key_position BOOLEAN DEFAULT false,
    justification TEXT NOT NULL,
    related_national_candidate_id UUID REFERENCES public.talent_profiles(id) ON DELETE SET NULL,
    related_national_candidate_name TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    observations TEXT,
    status TEXT NOT NULL DEFAULT 'BORRADOR', -- BORRADOR, ENVIADA, EN_REVISION, SOLICITUD_DE_INFORMACION, APROBADA, RECHAZADA, CANCELADA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- 6. TABLAS: PROGRAMA DE PASANTÍAS, ROTACIONES Y EVALUACIONES
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID,
    company_name TEXT NOT NULL,
    candidate_id UUID REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
    candidate_name TEXT NOT NULL,
    mentor_id UUID,
    mentor_name TEXT,
    program_name TEXT NOT NULL,
    call_title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    objectives TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'EN_CURSO', -- CONVOCATORIA, SELECCION, EN_CURSO, EN_EVALUACION, COMPLETADA, INCORPORADO, CANCELADA
    final_result TEXT, -- EXCELENTE, SATISFACTORIO, NECESITA_REFORZAMIENTO, NO_SATISFACTORIO
    final_recommendation TEXT, -- INCORPORACION_INMEDIATA, FORMACION_ADICIONAL, CONTRATACION_TEMPORAL, NO_RECOMENDADO
    final_report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.internship_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    area_supervisor TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    objectives TEXT NOT NULL,
    competencies_evaluated JSONB DEFAULT '[]'::jsonb,
    performance_score INTEGER DEFAULT 0,
    supervisor_comments TEXT,
    status TEXT NOT NULL DEFAULT 'PROGRAMADA', -- PROGRAMADA, EN_CURSO, EVALUADA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.internship_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    rotation_id UUID REFERENCES public.internship_rotations(id) ON DELETE SET NULL,
    evaluator_name TEXT NOT NULL,
    evaluator_role TEXT NOT NULL,
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    evaluation_type TEXT NOT NULL DEFAULT 'INTERMEDIA', -- INTERMEDIA, ROTACION, FINAL
    scores JSONB NOT NULL DEFAULT '{"technical_competence": 4, "punctuality_and_discipline": 5, "teamwork": 4, "adaptability": 4, "overall_score": 85}'::jsonb,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- 7. TABLA DE MULTIUSUARIO: USER_ORGANIZATIONS (SI NO EXISTE)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.user_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    organization_id UUID,
    org_role TEXT NOT NULL DEFAULT 'viewer', -- 'admin', 'hr', 'technical', 'viewer'
    permissions JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, organization_id)
);

-- ========================================================================================
-- 8. ÍNDICES DE RENDIMIENTO
-- ========================================================================================
CREATE INDEX IF NOT EXISTS idx_talent_profession ON public.talent_profiles(profession);
CREATE INDEX IF NOT EXISTS idx_talent_province ON public.talent_profiles(province);
CREATE INDEX IF NOT EXISTS idx_talent_visibility ON public.talent_profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_prenotif_company ON public.expatriate_prenotifications(company_id);
CREATE INDEX IF NOT EXISTS idx_prenotif_status ON public.expatriate_prenotifications(status);
CREATE INDEX IF NOT EXISTS idx_internship_company ON public.internships(company_id);
CREATE INDEX IF NOT EXISTS idx_internship_candidate ON public.internships(candidate_id);
CREATE INDEX IF NOT EXISTS idx_internship_status ON public.internships(status);
CREATE INDEX IF NOT EXISTS idx_rotation_internship ON public.internship_rotations(internship_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_internship ON public.internship_evaluations(internship_id);

-- ========================================================================================
-- 9. HABILITACIÓN DE RLS EN TODAS LAS TABLAS DE FASE 2
-- ========================================================================================
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expatriate_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nationalization_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expatriate_prenotifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_evaluations ENABLE ROW LEVEL SECURITY;

-- ========================================================================================
-- 10. POLÍTICAS RLS ROBUSTAS
-- ========================================================================================

-- A) TALENTO NACIONAL
DROP POLICY IF EXISTS "Talent Profiles Access Policy" ON public.talent_profiles;
CREATE POLICY "Talent Profiles Access Policy" ON public.talent_profiles
FOR ALL USING (
    user_id = auth.uid()
    OR visibility = 'EMPRESAS_AUTORIZADAS'
    OR (
        visibility = 'MINISTERIO' AND EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
        )
    )
);

-- B) PRE-NOTIFICACIONES DE EXPATRIADOS
DROP POLICY IF EXISTS "Expatriate Prenotifications Org Isolation" ON public.expatriate_prenotifications;
CREATE POLICY "Expatriate Prenotifications Org Isolation" ON public.expatriate_prenotifications
FOR ALL USING (
    company_id IN (
        SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- C) PASANTÍAS
DROP POLICY IF EXISTS "Internships Org Isolation Policy" ON public.internships;
CREATE POLICY "Internships Org Isolation Policy" ON public.internships
FOR ALL USING (
    company_id IN (
        SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid()
    )
    OR candidate_id IN (
        SELECT id FROM public.talent_profiles WHERE user_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- D) ROTACIONES DE PASANTÍAS
DROP POLICY IF EXISTS "Rotations Isolation Policy" ON public.internship_rotations;
CREATE POLICY "Rotations Isolation Policy" ON public.internship_rotations
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.internships i 
        WHERE i.id = internship_rotations.internship_id AND (
            i.company_id IN (SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid())
            OR i.candidate_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario'))
        )
    )
);

-- E) EVALUACIONES DE PASANTÍAS
DROP POLICY IF EXISTS "Evaluations Isolation Policy" ON public.internship_evaluations;
CREATE POLICY "Evaluations Isolation Policy" ON public.internship_evaluations
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.internships i 
        WHERE i.id = internship_evaluations.internship_id AND (
            i.company_id IN (SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid())
            OR i.candidate_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario'))
        )
    )
);

-- F) PERSONAL EXPATRIADO ACTIVO
DROP POLICY IF EXISTS "Expatriate Records Isolation" ON public.expatriate_records;
CREATE POLICY "Expatriate Records Isolation" ON public.expatriate_records
FOR ALL USING (
    company_id IN (
        SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- G) POSICIONES SUJETAS A NACIONALIZACIÓN
DROP POLICY IF EXISTS "Nationalization Positions Isolation" ON public.nationalization_positions;
CREATE POLICY "Nationalization Positions Isolation" ON public.nationalization_positions
FOR ALL USING (
    company_id IN (
        SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- H) PLANES DE TRANSFERENCIA
DROP POLICY IF EXISTS "Transfer Plans Isolation" ON public.transfer_plans;
CREATE POLICY "Transfer Plans Isolation" ON public.transfer_plans
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.nationalization_positions np 
        WHERE np.id = transfer_plans.position_id AND (
            np.company_id IN (SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario'))
        )
    )
    OR local_candidate_id IN (
        SELECT id FROM public.talent_profiles WHERE user_id = auth.uid()
    )
);

-- ========================================================================================
-- 11. TRIGGERS DE MODIFICACIÓN AUTOMÁTICA
-- ========================================================================================
DROP TRIGGER IF EXISTS trg_talent_modtime ON public.talent_profiles;
CREATE TRIGGER trg_talent_modtime BEFORE UPDATE ON public.talent_profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_prenotif_modtime ON public.expatriate_prenotifications;
CREATE TRIGGER trg_prenotif_modtime BEFORE UPDATE ON public.expatriate_prenotifications FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS trg_internship_modtime ON public.internships;
CREATE TRIGGER trg_internship_modtime BEFORE UPDATE ON public.internships FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
