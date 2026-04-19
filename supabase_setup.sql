-- ========================================================================================
-- COMPREHENSIVE SUPABASE SCHEMA FOR NATIONAL CONTENT PORTAL
-- ========================================================================================

-- 0. USERS (If not managed exclusively by auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    department TEXT,
    position TEXT,
    company_id UUID,
    avatar TEXT,
    is_online BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 0.1 COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    legal_name TEXT,
    tax_id TEXT,
    industry TEXT,
    size TEXT,
    website TEXT,
    description TEXT,
    logo TEXT,
    status TEXT DEFAULT 'active',
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1. REGISTRATION REQUESTS (Fixes the registration error)
CREATE TABLE IF NOT EXISTS public.registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    tax_id TEXT,
    sector TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. CONTRACT TEMPLATES
CREATE TABLE IF NOT EXISTS public.contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    content TEXT, -- HTML or Markdown content of the template
    file_url TEXT, -- Optional URL if it's a downloadable file (PDF/Word)
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. CATEGORIES (For Opportunities, Jobs, News, etc.)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'opportunity', 'job', 'news', 'company_sector'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. USER GROUPS / ROLES (If you want to manage roles dynamically instead of enums)
CREATE TABLE IF NOT EXISTS public.user_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. CONTRACTS (Ensure it exists for the Contract Module)
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref TEXT UNIQUE,
    title TEXT NOT NULL,
    awarded_to TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- 'execution', 'pending', 'completed', 'canceled'
    value NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    location TEXT,
    progress INTEGER DEFAULT 0,
    national_compliance JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. CONTRACT MILESTONES
CREATE TABLE IF NOT EXISTS public.contract_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    deadline DATE,
    status TEXT DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'overdue'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- RLS POLICIES (Row Level Security)
-- ========================================================================================
-- Enable RLS
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Adjust according to your security needs)
CREATE POLICY "Allow public insert for registration" ON public.registration_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read for all" ON public.registration_requests FOR SELECT USING (true);
CREATE POLICY "Allow update for all" ON public.registration_requests FOR UPDATE USING (true);

CREATE POLICY "Allow read for all templates" ON public.contract_templates FOR SELECT USING (true);
CREATE POLICY "Allow all for templates" ON public.contract_templates FOR ALL USING (true);

CREATE POLICY "Allow read for all categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow all for categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Allow read for all groups" ON public.user_groups FOR SELECT USING (true);
CREATE POLICY "Allow all for groups" ON public.user_groups FOR ALL USING (true);

CREATE POLICY "Allow all for contracts" ON public.contracts FOR ALL USING (true);
CREATE POLICY "Allow all for milestones" ON public.contract_milestones FOR ALL USING (true);

-- ========================================================================================
-- INSERT DEFAULT USER GROUPS
-- ========================================================================================
INSERT INTO public.user_groups (name, description) VALUES
('super_admin', 'Super Administrador con acceso total al sistema'),
('admin', 'Administrador del sistema con permisos elevados'),
('funcionario', 'Funcionario del Ministerio o entidad gubernamental'),
('cuerpo_tecnico', 'Miembro del cuerpo técnico para evaluaciones'),
('petrolera', 'Operadora Petrolera principal'),
('company', 'Empresa contratista o de servicios'),
('empresa_local', 'Empresa local o PyME'),
('persona', 'Ciudadano o profesional independiente'),
('comunidad', 'Representante de la comunidad o sociedad civil')
ON CONFLICT (name) DO NOTHING;
INSERT INTO public.contract_templates (title, description, category, status) VALUES
('Contrato de Prestación de Servicios Estándar', 'Plantilla base para servicios generales con cláusulas de contenido nacional.', 'Servicios', 'active'),
('Contrato de Suministro de Bienes', 'Acuerdo para la provisión de materiales y equipos.', 'Suministros', 'active'),
('Acuerdo de Confidencialidad (NDA)', 'Plantilla estándar para protección de información sensible.', 'Legal', 'active'),
('Contrato de Subcontratación (Tier 2)', 'Para empresas principales que subcontratan a PYMES locales.', 'Subcontratación', 'active')
ON CONFLICT DO NOTHING;
