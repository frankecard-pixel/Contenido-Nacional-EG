-- ========================================================================================
-- FASE 3: MIGRACIÓN INCREMENTAL - EMPRESAS LOCALES, CATÁLOGO DE SERVICIOS,
-- CAPACIDADES TÉCNICAS, PRESELECCIÓN Y OPORTUNIDADES
-- DIRECCIÓN GENERAL DE CONTENIDO NACIONAL - MINISTERIO DE MINAS E HIDROCARBUROS
-- ========================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------------------
-- 1. EXTENSIÓN INCREMENTAL DE LA TABLA COMPANIES (Perfil Empresarial Completo)
-- ----------------------------------------------------------------------------------------
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS trade_name TEXT,
ADD COLUMN IF NOT EXISTS constitution_date DATE,
ADD COLUMN IF NOT EXISTS province TEXT DEFAULT 'Bioko Norte',
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Malabo',
ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'Insular',
ADD COLUMN IF NOT EXISTS operational_contact_name TEXT,
ADD COLUMN IF NOT EXISTS operational_contact_email TEXT,
ADD COLUMN IF NOT EXISTS operational_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS technical_staff_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS technical_capacity_summary TEXT,
ADD COLUMN IF NOT EXISTS facilities_equipment TEXT,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS is_local_content_certified BOOLEAN DEFAULT false;

-- ----------------------------------------------------------------------------------------
-- 2. REFERENCIAS DE PROYECTOS Y EXPERIENCIA EMPRESARIAL
-- ----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_project_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    project_title TEXT NOT NULL,
    sector TEXT,
    contract_value NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    description TEXT,
    is_hydrocarbon_sector BOOLEAN DEFAULT true,
    reference_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ----------------------------------------------------------------------------------------
-- 3. CATÁLOGO ESTRUCTURADO DE SERVICIOS Y CAPACIDADES DEL SECTOR (Administrable por Ministerio)
-- ----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    requires_certification BOOLEAN DEFAULT false,
    standard_requirements JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ----------------------------------------------------------------------------------------
-- 4. CAPACIDADES Y SERVICIOS REGISTRADOS POR EMPRESA
-- ----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.service_catalog(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    category TEXT NOT NULL,
    experience_years INTEGER DEFAULT 0,
    technical_description TEXT,
    certifications JSONB DEFAULT '[]'::jsonb,
    evidence_document_url TEXT,
    verification_status TEXT DEFAULT 'declarado', -- 'declarado', 'verificado', 'en_revision', 'rechazado'
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(company_id, service_name)
);

-- ----------------------------------------------------------------------------------------
-- 5. EXTENSIÓN INCREMENTAL DE OPPORTUNITIES (Licitaciones y Criterios)
-- ----------------------------------------------------------------------------------------
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS contracting_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS required_capabilities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS required_services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS minimum_local_content_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS minimum_experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shortlist_published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS workflow_stage TEXT DEFAULT 'PUBLICADA'; -- 'BORRADOR', 'PUBLICADA', 'PRESELECCION', 'LICITACION', 'ADJUDICADA', 'DESIERTA', 'CANCELADA'

-- ----------------------------------------------------------------------------------------
-- 6. PRESELECCIÓN / LISTA CORTA MINISTERIAL DE EMPRESAS LOCALES (Matchmaking Reglado)
-- ----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunity_shortlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    shortlisted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    match_score NUMERIC DEFAULT 0, -- Porcentaje 0-100%
    criteria_evaluated JSONB DEFAULT '{}'::jsonb,
    match_explanation TEXT,
    status TEXT DEFAULT 'preseleccionada', -- 'preseleccionada', 'remitida_a_operadora', 'invitada', 'descartada'
    ministry_recommendation_notes TEXT,
    remitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(opportunity_id, company_id)
);

-- ----------------------------------------------------------------------------------------
-- 7. EXTENSIÓN INCREMENTAL DE APPLICATIONS (Ofertas y Licitación)
-- ----------------------------------------------------------------------------------------
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS proposal_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS technical_proposal_url TEXT,
ADD COLUMN IF NOT EXISTS financial_proposal_url TEXT,
ADD COLUMN IF NOT EXISTS local_content_proposal_percentage NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS evaluation_notes TEXT,
ADD COLUMN IF NOT EXISTS award_reason TEXT;

-- ----------------------------------------------------------------------------------------
-- 8. ÍNDICES DE RENDIMIENTO Y CONSULTA
-- ----------------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_company_services_company ON public.company_services(company_id);
CREATE INDEX IF NOT EXISTS idx_company_services_category ON public.company_services(category);
CREATE INDEX IF NOT EXISTS idx_company_services_status ON public.company_services(verification_status);
CREATE INDEX IF NOT EXISTS idx_service_catalog_code ON public.service_catalog(code);
CREATE INDEX IF NOT EXISTS idx_service_catalog_category ON public.service_catalog(category);
CREATE INDEX IF NOT EXISTS idx_project_ref_company ON public.company_project_references(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shortlists_opp ON public.opportunity_shortlists(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shortlists_comp ON public.opportunity_shortlists(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shortlists_status ON public.opportunity_shortlists(status);

-- ----------------------------------------------------------------------------------------
-- 9. SEGURIDAD Y POLÍTICAS RLS (Aislamiento Real por Organización)
-- ----------------------------------------------------------------------------------------

-- 9.1 Catálogo de Servicios
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read service_catalog" ON public.service_catalog;
CREATE POLICY "Public read service_catalog" ON public.service_catalog
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Ministry manage service_catalog" ON public.service_catalog;
CREATE POLICY "Ministry manage service_catalog" ON public.service_catalog
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario')
    )
);

-- 9.2 Servicios de Empresa (company_services)
ALTER TABLE public.company_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View company_services" ON public.company_services;
CREATE POLICY "View company_services" ON public.company_services
FOR SELECT USING (
    verification_status = 'verificado'
    OR company_id IN (
        SELECT uo.organization_id FROM public.user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.status = 'active'
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

DROP POLICY IF EXISTS "Company manage own company_services" ON public.company_services;
CREATE POLICY "Company manage own company_services" ON public.company_services
FOR INSERT WITH CHECK (
    company_id IN (
        SELECT uo.organization_id FROM public.user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'hr', 'technical')
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director', 'funcionario')
    )
);

DROP POLICY IF EXISTS "Company update own company_services" ON public.company_services;
CREATE POLICY "Company update own company_services" ON public.company_services
FOR UPDATE USING (
    company_id IN (
        SELECT uo.organization_id FROM public.user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'hr', 'technical')
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director', 'funcionario')
    )
);

DROP POLICY IF EXISTS "Company delete own company_services" ON public.company_services;
CREATE POLICY "Company delete own company_services" ON public.company_services
FOR DELETE USING (
    company_id IN (
        SELECT uo.organization_id FROM public.user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.status = 'active'
        AND uo.org_role IN ('admin')
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- 9.3 Referencias de Proyectos
ALTER TABLE public.company_project_references ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View company_project_references" ON public.company_project_references;
CREATE POLICY "View company_project_references" ON public.company_project_references
FOR SELECT USING (
    company_id IN (
        SELECT uo.organization_id FROM public.user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.status = 'active'
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
    OR EXISTS (
        SELECT 1 FROM public.companies c WHERE c.id = company_project_references.company_id AND c.status = 'certified'
    )
);

DROP POLICY IF EXISTS "Company manage project references" ON public.company_project_references;
CREATE POLICY "Company manage project references" ON public.company_project_references
FOR ALL USING (
    company_id IN (
        SELECT uo.organization_id FROM public.user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'hr', 'technical')
    )
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- 9.4 Preselección / Shortlists (Aislamiento Estricto)
ALTER TABLE public.opportunity_shortlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View opportunity_shortlists" ON public.opportunity_shortlists;
CREATE POLICY "View opportunity_shortlists" ON public.opportunity_shortlists
FOR SELECT USING (
    -- La empresa local preseleccionada ve únicamente su propio registro si ha sido preseleccionada/remitida
    (
        company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid() AND uo.status = 'active'
        )
    )
    -- La empresa contratante (operadora) SOLO ve las empresas que el ministerio ya ha remitido formalmente
    OR (
        status = 'remitida_a_operadora' AND EXISTS (
            SELECT 1 FROM public.opportunities o
            JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
            WHERE o.id = opportunity_shortlists.opportunity_id 
            AND uo.user_id = auth.uid() 
            AND uo.status = 'active'
        )
    )
    -- El Ministerio ve el expediente completo
    OR EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario')
    )
);

DROP POLICY IF EXISTS "Ministry manage opportunity_shortlists" ON public.opportunity_shortlists;
CREATE POLICY "Ministry manage opportunity_shortlists" ON public.opportunity_shortlists
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.id = auth.uid() 
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario')
    )
);

-- ----------------------------------------------------------------------------------------
-- 10. SEEDING INICIAL DE SERVICIOS ESTÁNDAR DEL SECTOR DE HIDROCARBUROS
-- ----------------------------------------------------------------------------------------
INSERT INTO public.service_catalog (code, category, name, description, requires_certification, standard_requirements) VALUES
('SERV-ENG-01', 'Ingeniería', 'Ingeniería Civil y Estructural Offshore/Onshore', 'Cálculo de estructuras, cimentaciones y plataformas.', true, '["Registro en Colegio Profesional", "Software certificado", "Experiencia mínima 3 años"]'::jsonb),
('SERV-MANT-01', 'Mantenimiento', 'Mantenimiento Mecánico y Rotativo', 'Reparación y mantenimiento de bombas, compresores y turbinas.', true, '["Técnicos certificados", "Taller propio en GE", "Procedimientos de seguridad HSE"]'::jsonb),
('SERV-MANT-02', 'Mantenimiento', 'Instrumentación y Control de Procesos', 'Calibración, PLC, sistemas SCADA y válvulas de control.', true, '["Certificación de calibración", "Laboratorio de pruebas"]'::jsonb),
('SERV-LOG-01', 'Logística', 'Transporte Terrestre y Flota Pesada', 'Transporte de tuberías, maquinaria y contenedores.', false, '["Flota asegurada", "ITV al día", "Conductores con carnet profesional"]'::jsonb),
('SERV-LOG-02', 'Logística', 'Soporte Portuario y Gestión de Almacén', 'Carga, descarga, estiba y almacenamiento en recintos portuarios.', true, '["Licencia portuaria", "Equipamiento de estiba homologado"]'::jsonb),
('SERV-HSE-01', 'Seguridad y Medio Ambiente', 'Gestión y Tratamiento de Residuos Industriales', 'Recolección, tratamiento y disposición ecológica de lodos y aceites.', true, '["Autorización medioambiental MMH", "Puntos de vertido autorizados"]'::jsonb),
('SERV-CAT-01', 'Alimentación y Campamentos', 'Catering y Hospedaje en Plataformas y Campamentos', 'Alimentación diaria, avituallamiento y hotelería industrial.', true, '["Certificado de Manipulador de Alimentos", "Inspección sanitaria vigente"]'::jsonb),
('SERV-CONST-01', 'Construcción', 'Soldadura Homologada y Caldelería 6G', 'Unión de tuberías de alta presión y estructuras marítimas.', true, '["Soldadores certificados 6G/AWS", "Ensayos no destructivos (NDT)"]'::jsonb)
ON CONFLICT (code) DO NOTHING;
