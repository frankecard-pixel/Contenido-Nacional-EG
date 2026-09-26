-- ========================================================================================
-- FASE 4.1: LICITACIONES, CONTRATACIÓN, SEGUIMIENTO Y CUMPLIMIENTO DE CONTENIDO NACIONAL
-- MINISTERIO DE MINAS E HIDROCARBUROS DE GUINEA ECUATORIAL
-- DIRECCIÓN GENERAL DE CONTENIDO NACIONAL (DGCN)
--
-- SCRIPT DE MIGRACIÓN INCREMENTAL, IDEMPOTENTE Y NO DESTRUCTIVO
-- ========================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------------------
-- 1. MATERIALIZACIÓN DE WORKFLOW_HISTORY EN POSTGRESQL (Trazabilidad Institucional)
-- ----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'opportunity', 'application', 'tender', 'contract', 'contract_milestone', 'compliance_report', 'company'
    from_state TEXT NOT NULL,
    to_state TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    comment TEXT,
    attached_documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía parcialmente
ALTER TABLE public.workflow_history
ADD COLUMN IF NOT EXISTS entity_id TEXT,
ADD COLUMN IF NOT EXISTS entity_type TEXT,
ADD COLUMN IF NOT EXISTS from_state TEXT,
ADD COLUMN IF NOT EXISTS to_state TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_role TEXT,
ADD COLUMN IF NOT EXISTS comment TEXT,
ADD COLUMN IF NOT EXISTS attached_documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- ----------------------------------------------------------------------------------------
-- 2. EXTENSIÓN INCREMENTAL DE public.opportunities (Ciclo Completo de Licitación)
-- ----------------------------------------------------------------------------------------
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS bidding_rules_url TEXT,
ADD COLUMN IF NOT EXISTS tender_opening_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tender_closing_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS evaluation_criteria JSONB DEFAULT '{"technical_weight": 40, "financial_weight": 30, "local_content_weight": 30}'::jsonb,
ADD COLUMN IF NOT EXISTS awarded_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS award_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS award_resolution_url TEXT,
ADD COLUMN IF NOT EXISTS award_justification TEXT;

-- ----------------------------------------------------------------------------------------
-- 3. EXTENSIÓN INCREMENTAL DE public.applications (Propuestas Técnicas y Económicas)
-- ----------------------------------------------------------------------------------------
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS technical_proposal_url TEXT,
ADD COLUMN IF NOT EXISTS technical_summary TEXT,
ADD COLUMN IF NOT EXISTS financial_proposal_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'XAF',
ADD COLUMN IF NOT EXISTS local_content_percentage NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS local_workforce_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS local_services_planned JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS local_subcontracting_planned JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS award_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS evaluation_score NUMERIC DEFAULT 0;

-- ----------------------------------------------------------------------------------------
-- 4. NUEVA TABLA ESTRUCTURADA: public.tender_evaluations (Matriz de Evaluación Reglada)
-- ----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tender_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    evaluator_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    evaluator_name TEXT,
    technical_score NUMERIC DEFAULT 0,
    financial_score NUMERIC DEFAULT 0,
    local_content_score NUMERIC DEFAULT 0,
    compliance_score NUMERIC DEFAULT 0,
    total_weighted_score NUMERIC DEFAULT 0,
    operator_verdict TEXT DEFAULT 'under_evaluation', -- 'recommended', 'acceptable', 'rejected', 'under_evaluation'
    operator_notes TEXT,
    ministry_oversight_notes TEXT,
    criteria_breakdown JSONB DEFAULT '{}'::jsonb,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_tender_application_evaluator UNIQUE (application_id, evaluator_user_id)
);

-- ----------------------------------------------------------------------------------------
-- 5. EXTENSIÓN INCREMENTAL DE public.contracts (Contratos y Compromisos de Contenido Nacional)
-- ----------------------------------------------------------------------------------------
ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS contracting_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'XAF',
ADD COLUMN IF NOT EXISTS scope_of_work TEXT,
ADD COLUMN IF NOT EXISTS target_local_workforce_pct NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS target_local_procurement_pct NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS technology_transfer_plan TEXT,
ADD COLUMN IF NOT EXISTS training_plan TEXT,
ADD COLUMN IF NOT EXISTS local_subcontractors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS signed_date DATE,
ADD COLUMN IF NOT EXISTS completion_date DATE;

-- ----------------------------------------------------------------------------------------
-- 6. EXTENSIÓN INCREMENTAL DE public.contract_milestones (Hitos Operativos y Evidencias)
-- ----------------------------------------------------------------------------------------
ALTER TABLE public.contract_milestones
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS completion_date DATE,
ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'XAF',
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS national_content_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- ----------------------------------------------------------------------------------------
-- 7. NUEVA TABLA: public.contract_compliance_reports (Reportes Periódicos de Cumplimiento)
-- ----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contract_compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE, -- Contratista
    contracting_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL, -- Operadora fiscalizadora
    reporting_period TEXT NOT NULL, -- ej: '2026-Q1', '2026-Q2', 'HITO-1'
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    local_workforce_direct INTEGER DEFAULT 0,
    local_workforce_indirect INTEGER DEFAULT 0,
    expatriate_workforce INTEGER DEFAULT 0,
    local_workforce_actual_pct NUMERIC DEFAULT 0,
    local_expenditure_amount NUMERIC DEFAULT 0,
    total_expenditure_period NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'XAF',
    local_expenditure_actual_pct NUMERIC DEFAULT 0,
    trainings_conducted JSONB DEFAULT '[]'::jsonb,
    tech_transfer_milestones JSONB DEFAULT '[]'::jsonb,
    local_subcontractors_utilized JSONB DEFAULT '[]'::jsonb,
    discrepancies_detected TEXT,
    compliance_evaluation TEXT DEFAULT 'REQUIERE_REVISION', -- 'CONFORME', 'ALERTA', 'REQUIERE_REVISION'
    evidence_documents JSONB DEFAULT '[]'::jsonb,
    ministry_review_status TEXT DEFAULT 'PRESENTADO', -- 'PRESENTADO', 'EN_REVISION', 'APROBADO', 'OBSERVADO', 'RECHAZADO'
    ministry_reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ministry_opinion_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ----------------------------------------------------------------------------------------
-- 8. ÍNDICES DE RENDIMIENTO Y EVALUACIÓN RLS EN TIEMPO REAL
-- ----------------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_workflow_history_lookup 
ON public.workflow_history(entity_id, entity_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tender_evaluations_app 
ON public.tender_evaluations(application_id, opportunity_id);

CREATE INDEX IF NOT EXISTS idx_contracts_contracting_company 
ON public.contracts(contracting_company_id);

CREATE INDEX IF NOT EXISTS idx_contracts_company_id 
ON public.contracts(company_id);

CREATE INDEX IF NOT EXISTS idx_contracts_opportunity 
ON public.contracts(opportunity_id);

CREATE INDEX IF NOT EXISTS idx_contract_milestones_contract 
ON public.contract_milestones(contract_id);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_contract 
ON public.contract_compliance_reports(contract_id, reporting_period);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_company 
ON public.contract_compliance_reports(company_id, contracting_company_id);

-- ----------------------------------------------------------------------------------------
-- 9. ACTIVACIÓN Y SANEAMIENTO DE ROW LEVEL SECURITY (RLS MULTI-TENANT)
-- ----------------------------------------------------------------------------------------

ALTER TABLE public.workflow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_compliance_reports ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas heredadas inseguras o globales
DROP POLICY IF EXISTS "Allow all for contracts" ON public.contracts;
DROP POLICY IF EXISTS "View contracts" ON public.contracts;
DROP POLICY IF EXISTS "Allow all for milestones" ON public.contract_milestones;
DROP POLICY IF EXISTS "View milestones" ON public.contract_milestones;
DROP POLICY IF EXISTS "Allow all for workflow_history" ON public.workflow_history;
DROP POLICY IF EXISTS "Allow all for tender_evaluations" ON public.tender_evaluations;
DROP POLICY IF EXISTS "Allow all for compliance_reports" ON public.contract_compliance_reports;

-- Drop de políticas idempotentes de Fase 4 si ya existieran
DROP POLICY IF EXISTS "Select contracts isolated" ON public.contracts;
DROP POLICY IF EXISTS "Insert contracts isolated" ON public.contracts;
DROP POLICY IF EXISTS "Update contracts isolated" ON public.contracts;
DROP POLICY IF EXISTS "Delete contracts isolated" ON public.contracts;

DROP POLICY IF EXISTS "Select contract milestones isolated" ON public.contract_milestones;
DROP POLICY IF EXISTS "Insert contract milestones isolated" ON public.contract_milestones;
DROP POLICY IF EXISTS "Update contract milestones isolated" ON public.contract_milestones;
DROP POLICY IF EXISTS "Delete contract milestones isolated" ON public.contract_milestones;

DROP POLICY IF EXISTS "Select tender evaluations isolated" ON public.tender_evaluations;
DROP POLICY IF EXISTS "Insert tender evaluations isolated" ON public.tender_evaluations;
DROP POLICY IF EXISTS "Update tender evaluations isolated" ON public.tender_evaluations;
DROP POLICY IF EXISTS "Delete tender evaluations isolated" ON public.tender_evaluations;

DROP POLICY IF EXISTS "Select compliance reports isolated" ON public.contract_compliance_reports;
DROP POLICY IF EXISTS "Insert compliance reports isolated" ON public.contract_compliance_reports;
DROP POLICY IF EXISTS "Update compliance reports isolated" ON public.contract_compliance_reports;
DROP POLICY IF EXISTS "Delete compliance reports isolated" ON public.contract_compliance_reports;

DROP POLICY IF EXISTS "Select workflow history isolated" ON public.workflow_history;
DROP POLICY IF EXISTS "Insert workflow history isolated" ON public.workflow_history;

-- ========================================================================================
-- 10. POLÍTICAS RLS AISLADAS: public.contracts
-- ========================================================================================

-- 10.1 SELECT: Visibilidad de contratos
CREATE POLICY "Select contracts isolated" ON public.contracts
FOR SELECT USING (
    -- A) La empresa contratista adjudicataria
    (
        contracts.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
        )
    )
    -- B) La empresa operadora contratante directa
    OR (
        contracts.contracting_company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
        )
    )
    -- B.1) Compatibilidad legacy operadora vía oportunidad
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = contracts.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
    )
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = contracts.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    -- C) Personal ministerial autorizado
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- 10.2 INSERT: Creación de contratos
CREATE POLICY "Insert contracts isolated" ON public.contracts
FOR INSERT WITH CHECK (
    -- A) Empresa operadora contratante (admin o technical)
    (
        contracts.contracting_company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical')
        )
    )
    -- B) Personal ministerial
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- 10.3 UPDATE: Modificación de contratos
CREATE POLICY "Update contracts isolated" ON public.contracts
FOR UPDATE USING (
    -- A) Empresa operadora contratante
    (
        contracts.contracting_company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical')
        )
    )
    -- B) Personal ministerial
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
)
WITH CHECK (
    (
        contracts.contracting_company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical')
        )
    )
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- 10.4 DELETE: Solo ministerio autorizado
CREATE POLICY "Delete contracts isolated" ON public.contracts
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- ========================================================================================
-- 11. POLÍTICAS RLS AISLADAS: public.contract_milestones
-- ========================================================================================

-- 11.1 SELECT: Quienes tengan acceso al contrato pueden ver los hitos
CREATE POLICY "Select contract milestones isolated" ON public.contract_milestones
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.contracts c
        WHERE c.id = contract_milestones.contract_id
        AND (
            -- Contratista
            c.company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active'
            )
            -- Operadora
            OR c.contracting_company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active'
            )
            -- Ministerio
            OR EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = auth.uid()
                AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
            )
        )
    )
);

-- 11.2 INSERT: Operadora contratante o Ministerio
CREATE POLICY "Insert contract milestones isolated" ON public.contract_milestones
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.contracts c
        WHERE c.id = contract_milestones.contract_id
        AND (
            c.contracting_company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active' AND uo.org_role IN ('admin', 'technical')
            )
            OR EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = auth.uid()
                AND u.role IN ('super_admin', 'admin', 'director')
            )
        )
    )
);

-- 11.3 UPDATE: Operadora (revisar/aprobar), Contratista (cargar entregables), Ministerio
CREATE POLICY "Update contract milestones isolated" ON public.contract_milestones
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.contracts c
        WHERE c.id = contract_milestones.contract_id
        AND (
            -- Contratista
            c.company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active' AND uo.org_role IN ('admin', 'technical')
            )
            -- Operadora
            OR c.contracting_company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active' AND uo.org_role IN ('admin', 'technical')
            )
            -- Ministerio
            OR EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = auth.uid()
                AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
            )
        )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.contracts c
        WHERE c.id = contract_milestones.contract_id
        AND (
            c.company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active' AND uo.org_role IN ('admin', 'technical')
            )
            OR c.contracting_company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active' AND uo.org_role IN ('admin', 'technical')
            )
            OR EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = auth.uid()
                AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
            )
        )
    )
);

-- 11.4 DELETE: Operadora contratante o Ministerio
CREATE POLICY "Delete contract milestones isolated" ON public.contract_milestones
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.contracts c
        WHERE c.id = contract_milestones.contract_id
        AND (
            c.contracting_company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active' AND uo.org_role = 'admin'
            )
            OR EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = auth.uid()
                AND u.role IN ('super_admin', 'admin', 'director')
            )
        )
    )
);

-- ========================================================================================
-- 12. POLÍTICAS RLS AISLADAS: public.tender_evaluations
-- ========================================================================================

-- 12.1 SELECT: Solo la operadora convocante y el Ministerio de supervisión
CREATE POLICY "Select tender evaluations isolated" ON public.tender_evaluations
FOR SELECT USING (
    -- A) Empresa operadora contratante
    EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = tender_evaluations.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
    )
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = tender_evaluations.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    -- B) Personal ministerial autorizado
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- 12.2 INSERT: Operadora contratante autorizada
CREATE POLICY "Insert tender evaluations isolated" ON public.tender_evaluations
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = tender_evaluations.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'technical')
    )
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = tender_evaluations.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- 12.3 UPDATE: Evaluador de la operadora o nota de supervisión ministerial
CREATE POLICY "Update tender evaluations isolated" ON public.tender_evaluations
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = tender_evaluations.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'technical')
    )
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = tender_evaluations.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = tender_evaluations.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'technical')
    )
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = tender_evaluations.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- 12.4 DELETE: Ministerio o Admin de la operadora
CREATE POLICY "Delete tender evaluations isolated" ON public.tender_evaluations
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- ========================================================================================
-- 13. POLÍTICAS RLS AISLADAS: public.contract_compliance_reports
-- ========================================================================================

-- 13.1 SELECT: Contratista, Operadora y Ministerio
CREATE POLICY "Select compliance reports isolated" ON public.contract_compliance_reports
FOR SELECT USING (
    -- A) Empresa contratista que reporta
    (
        contract_compliance_reports.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
        )
    )
    -- B) Empresa operadora contratante
    OR (
        contract_compliance_reports.contracting_company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
        )
    )
    -- B.1) A través del contrato vinculado
    OR EXISTS (
        SELECT 1 FROM public.contracts c
        WHERE c.id = contract_compliance_reports.contract_id
        AND (
            c.contracting_company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active'
            )
            OR c.company_id IN (
                SELECT uo.organization_id FROM public.user_organizations uo
                WHERE uo.user_id = auth.uid() AND uo.status = 'active'
            )
        )
    )
    -- C) Personal ministerial autorizado
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- 13.2 INSERT: Contratista que rinde cuentas o Ministerio
CREATE POLICY "Insert compliance reports isolated" ON public.contract_compliance_reports
FOR INSERT WITH CHECK (
    -- A) Empresa contratista (admin, technical, hr)
    (
        contract_compliance_reports.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical', 'hr')
        )
    )
    -- B) Personal ministerial
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- 13.3 UPDATE: Contratista (mientras edita), Operadora y Ministerio (evaluación y dictamen)
CREATE POLICY "Update compliance reports isolated" ON public.contract_compliance_reports
FOR UPDATE USING (
    -- A) Empresa contratista mientras está en revisión interna o presentado
    (
        contract_compliance_reports.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical')
        )
    )
    -- B) Empresa operadora contratante
    OR (
        contract_compliance_reports.contracting_company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical')
        )
    )
    -- C) Personal ministerial (revisión y emisión de dictamen)
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
)
WITH CHECK (
    (
        contract_compliance_reports.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical')
        )
    )
    OR (
        contract_compliance_reports.contracting_company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'technical')
        )
    )
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- 13.4 DELETE: Solo ministerio
CREATE POLICY "Delete compliance reports isolated" ON public.contract_compliance_reports
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- ========================================================================================
-- 14. POLÍTICAS RLS AISLADAS: public.workflow_history
-- ========================================================================================

-- 14.1 SELECT: Consulta de transiciones históricas según visibilidad
CREATE POLICY "Select workflow history isolated" ON public.workflow_history
FOR SELECT USING (
    -- A) Funcionario ministerial: visibilidad total de auditoría de workflows
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
    -- B) El propio autor del cambio
    OR workflow_history.user_id = auth.uid()
    -- C) Usuario de la organización vinculada a la entidad si coincide
    OR EXISTS (
        SELECT 1 FROM public.user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.organization_id::text = workflow_history.entity_id
    )
);

-- 14.2 INSERT: Registro de transiciones por usuarios autenticados
CREATE POLICY "Insert workflow history isolated" ON public.workflow_history
FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
);

-- ========================================================================================
-- FIN DE SCRIPT MIGRACIÓN FASE 4.1
-- ========================================================================================
