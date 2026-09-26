-- ========================================================================================
-- FASE 3: HARDENING FINAL DE POLÍTICAS ROW LEVEL SECURITY (RLS)
-- CORRECCIÓN EXCLUSIVA DE TABLAS HEREDADAS: public.companies Y public.applications
-- DIRECCIÓN GENERAL DE CONTENIDO NACIONAL - MINISTERIO DE MINAS E HIDROCARBUROS
-- ========================================================================================
-- Arquitectura de autorización respetada:
-- USER (auth.uid() = users.id)
--   → USER_ORGANIZATION (user_id = auth.uid(), organization_id = company_id, status = 'active', org_role)
--   → ORGANIZATION / COMPANY (id = organization_id)
--   → ORG_ROLE ('admin', 'hr', 'technical', 'viewer')
-- ========================================================================================

-- Asegurar activación obligatoria de RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------------------
-- 1. LIMPIEZA DE POLÍTICAS PREVIAS E INSEGURAS EN public.companies
-- ----------------------------------------------------------------------------------------
-- Se eliminan las políticas permisivas previas, en particular la que contenía USING (true)
DROP POLICY IF EXISTS "Companies can update own profile" ON public.companies;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Allow all for companies" ON public.companies;
DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;
DROP POLICY IF EXISTS "Users can create their company" ON public.companies;
DROP POLICY IF EXISTS "Authorized users can update company" ON public.companies;
DROP POLICY IF EXISTS "Admins can delete companies" ON public.companies;
DROP POLICY IF EXISTS "View companies" ON public.companies;
DROP POLICY IF EXISTS "Insert companies" ON public.companies;

-- ----------------------------------------------------------------------------------------
-- 2. NUEVAS POLÍTICAS AUDITADAS PARA public.companies
-- ----------------------------------------------------------------------------------------

-- 2.1 SELECT: Visualización de empresas (Directorio público / institucional)
CREATE POLICY "View companies" ON public.companies
FOR SELECT USING (true);

-- 2.2 INSERT: Registro de empresas (creación de empresa por usuario autenticado o ministerio)
CREATE POLICY "Insert companies" ON public.companies
FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
);

-- 2.3 UPDATE: Modificación estricta de empresa
-- Permitido ÚNICAMENTE si:
-- A) El usuario pertenece a la organización (user_organizations.organization_id = companies.id)
--    con estado activo y rol de 'admin'
-- O:
-- B) El usuario es personal ministerial autorizado (super_admin, admin, director)
CREATE POLICY "Authorized users can update company" ON public.companies
FOR UPDATE USING (
    -- Caso A: Admin de la propia empresa
    EXISTS (
        SELECT 1 FROM public.user_organizations uo
        WHERE uo.organization_id = public.companies.id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.org_role = 'admin'
    )
    -- Caso B: Autoridad ministerial
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
)
WITH CHECK (
    -- Caso A: Admin de la propia empresa
    EXISTS (
        SELECT 1 FROM public.user_organizations uo
        WHERE uo.organization_id = public.companies.id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.org_role = 'admin'
    )
    -- Caso B: Autoridad ministerial
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- 2.4 DELETE: Baja o eliminación de empresas reservada exclusivamente al Ministerio
CREATE POLICY "Admins can delete companies" ON public.companies
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin')
    )
);


-- ----------------------------------------------------------------------------------------
-- 3. LIMPIEZA DE POLÍTICAS PREVIAS E INSEGURAS EN public.applications
-- ----------------------------------------------------------------------------------------
-- Se eliminan las políticas que utilizaban company_id = auth.uid() y políticas 'Allow all'
DROP POLICY IF EXISTS "View applications" ON public.applications;
DROP POLICY IF EXISTS "Companies can apply" ON public.applications;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.applications;
DROP POLICY IF EXISTS "Allow all for applications" ON public.applications;
DROP POLICY IF EXISTS "View applications isolated" ON public.applications;
DROP POLICY IF EXISTS "Create applications isolated" ON public.applications;
DROP POLICY IF EXISTS "Update applications isolated" ON public.applications;
DROP POLICY IF EXISTS "Delete applications isolated" ON public.applications;

-- ----------------------------------------------------------------------------------------
-- 4. NUEVAS POLÍTICAS AUDITADAS PARA public.applications (Multi-Tenant Estricto)
-- ----------------------------------------------------------------------------------------

-- 4.1 SELECT: Consulta de postulaciones / aplicaciones
-- Permitido para:
-- A) Miembros activos de la empresa postulante (applications.company_id -> companies.id)
-- B) Miembros activos de la empresa contratante / operadora propietaria de la oportunidad
--    (o legacy petrolera_id de la oportunidad)
-- C) Funcionarios autorizados del Ministerio de Minas e Hidrocarburos
CREATE POLICY "View applications isolated" ON public.applications
FOR SELECT USING (
    -- A) Empresa postulante (usuarios pertenecientes a la empresa)
    (
        applications.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
        )
    )
    -- B) Empresa operadora contratante de la oportunidad
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = applications.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
    )
    -- B.1) Compatibilidad legacy operadora (petrolera_id = auth.uid)
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = applications.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    -- C) Personal ministerial autorizado
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario', 'cuerpo_tecnico')
    )
);

-- 4.2 INSERT: Creación / Postulación a oportunidades
-- Permitido para:
-- A) Usuarios pertenecientes a la empresa postulante con roles técnicos, RRHH o administradores
-- B) Autoridades ministeriales autorizadas en nombre de la empresa
CREATE POLICY "Create applications isolated" ON public.applications
FOR INSERT WITH CHECK (
    -- A) Miembro con rol ejecutivo/técnico de la empresa postulante
    (
        applications.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'hr', 'technical')
        )
    )
    -- B) Ministerio
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- 4.3 UPDATE: Modificación de postulaciones
-- Permitido para:
-- A) Miembro de la empresa postulante para complementar propuestas técnicas/económicas
-- B) Miembro de la empresa contratante/operadora para evaluar propuestas
-- C) Funcionarios ministeriales para seguimiento, notas y cambios de fase
CREATE POLICY "Update applications isolated" ON public.applications
FOR UPDATE USING (
    -- A) Empresa postulante (admin, hr, technical)
    (
        applications.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'hr', 'technical')
        )
    )
    -- B) Empresa operadora contratante
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = applications.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'technical')
    )
    -- B.1) Compatibilidad legacy operadora
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = applications.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    -- C) Personal ministerial autorizado
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario')
    )
)
WITH CHECK (
    (
        applications.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role IN ('admin', 'hr', 'technical')
        )
    )
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        JOIN public.user_organizations uo ON uo.organization_id = o.contracting_company_id
        WHERE o.id = applications.opportunity_id
        AND uo.user_id = auth.uid()
        AND uo.status = 'active'
        AND uo.org_role IN ('admin', 'technical')
    )
    OR EXISTS (
        SELECT 1 FROM public.opportunities o
        WHERE o.id = applications.opportunity_id
        AND o.petrolera_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director', 'responsable_seccion', 'funcionario')
    )
);

-- 4.4 DELETE: Retirada de postulación
-- Permitido para:
-- A) Administrador de la empresa postulante
-- B) Administradores ministeriales
CREATE POLICY "Delete applications isolated" ON public.applications
FOR DELETE USING (
    (
        applications.company_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
            AND uo.status = 'active'
            AND uo.org_role = 'admin'
        )
    )
    OR EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'director')
    )
);

-- ----------------------------------------------------------------------------------------
-- 5. ÍNDICES DE ALTO RENDIMIENTO PARA EVALUACIÓN RLS EN TIEMPO REAL
-- ----------------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_org_auth_lookup 
ON public.user_organizations(user_id, organization_id, status, org_role);

CREATE INDEX IF NOT EXISTS idx_applications_tenant_lookup 
ON public.applications(company_id, opportunity_id);

CREATE INDEX IF NOT EXISTS idx_opportunities_contracting_lookup 
ON public.opportunities(contracting_company_id, petrolera_id);
