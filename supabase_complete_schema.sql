-- ========================================================================================
-- COMPREHENSIVE SUPABASE SCHEMA FOR NATIONAL CONTENT PORTAL (FIXED & COMPLETE)
-- ========================================================================================

-- 0. Habilitar la extensión de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================================
-- 1. TABLAS INDEPENDIENTES (Sin claves foráneas)
-- ========================================================================================

-- COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    legal_name TEXT,
    tax_id TEXT UNIQUE,
    ruge_id TEXT UNIQUE,
    type TEXT, -- 'local', 'international'
    industry TEXT,
    sector JSONB DEFAULT '[]'::jsonb,
    size TEXT,
    website TEXT,
    description TEXT,
    logo TEXT,
    status TEXT DEFAULT 'pending', -- 'certified', 'pending', 'expired', 'rejected'
    verification_status TEXT DEFAULT 'pending',
    rating NUMERIC DEFAULT 0,
    certification_level TEXT DEFAULT 'basic', -- 'basic', 'standard', 'premium', 'elite'
    compliance_score NUMERIC DEFAULT 0,
    national_employee_count INTEGER DEFAULT 0,
    total_employee_count INTEGER DEFAULT 0,
    local_spend_percentage NUMERIC DEFAULT 0,
    address TEXT,
    phone TEXT,
    email TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- USER GROUPS
CREATE TABLE IF NOT EXISTS public.user_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- REGISTRATION REQUESTS
CREATE TABLE IF NOT EXISTS public.registration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    tax_id TEXT,
    sector TEXT,
    role TEXT,
    status TEXT DEFAULT 'pending'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONTRACT TEMPLATES
CREATE TABLE IF NOT EXISTS public.contract_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    content TEXT,
    file_url TEXT,
    status TEXT DEFAULT 'active'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'opportunity', 'job', 'news', 'company_sector'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_mode BOOLEAN DEFAULT false,
    registration_enabled BOOLEAN DEFAULT true,
    portal_version TEXT DEFAULT '1.0.0'::text,
    last_backup TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ADVERTISEMENTS
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

-- WEB CATEGORIES
CREATE TABLE IF NOT EXISTS public.web_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT,
    slug TEXT,
    description TEXT,
    status TEXT DEFAULT 'published'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- 2. TABLAS CON DEPENDENCIAS DE CLAVES FORÁNEAS (Orden Estricto)
-- ========================================================================================

-- USERS (Depende de Companies)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active'::text,
    department TEXT,
    position TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    avatar TEXT,
    avatar_url TEXT, -- Soporte para frontend
    is_online BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- OPPORTUNITIES (Depende de Users y Projects)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    category TEXT,
    budget NUMERIC,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'published'::text,
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    location TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    ref TEXT,
    tag TEXT,
    awarded_amount NUMERIC DEFAULT 0,
    scope_of_work TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- APPLICATIONS (Depende de Opportunities y Companies)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted'::text,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    documents JSONB DEFAULT '[]'::jsonb,
    feedback TEXT,
    ref TEXT,
    project_name TEXT,
    step INTEGER DEFAULT 1,
    minister_comment TEXT,
    action_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- JOB OFFERS (Depende de Companies)
CREATE TABLE IF NOT EXISTS public.job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    location TEXT,
    salary TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    category TEXT,
    status TEXT DEFAULT 'published'::text,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CANDIDATE PROFILES (Depende de Users)
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    skills JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    cv_url TEXT,
    saved_jobs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONTRACTS (Depende de Companies y Opportunities)
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref TEXT UNIQUE,
    title TEXT NOT NULL,
    awarded_to TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending'::text,
    value NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    location TEXT,
    progress INTEGER DEFAULT 0,
    national_compliance JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONTRACT MILESTONES (Depende de Contracts)
CREATE TABLE IF NOT EXISTS public.contract_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    deadline DATE,
    status TEXT DEFAULT 'pending'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- COMPANY DOCUMENTS (Depende de Companies)
CREATE TABLE IF NOT EXISTS public.company_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
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

-- GENERIC DOCUMENTS (Para adjuntos generales de la plataforma)
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

-- AUDIT LOGS (Depende de Users)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    entity_id TEXT,
    status TEXT DEFAULT 'success'::text,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- INSPECTIONS (Depende de Companies y Users)
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    date DATE,
    type TEXT,
    status TEXT DEFAULT 'scheduled'::text,
    officer UUID REFERENCES public.users(id) ON DELETE SET NULL,
    notes TEXT,
    site TEXT,
    priority TEXT DEFAULT 'medium'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- NEWS ARTICLES (Depende de Users)
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    summary JSONB NOT NULL,
    content JSONB NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'draft'::text,
    author UUID REFERENCES public.users(id) ON DELETE SET NULL,
    publish_date TIMESTAMP WITH TIME ZONE,
    featured_image TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SOCIAL PROJECTS (Depende de Users)
CREATE TABLE IF NOT EXISTS public.social_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    impact TEXT,
    location TEXT,
    image TEXT,
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'proposed'::text,
    budget NUMERIC,
    progress INTEGER DEFAULT 0,
    end_date DATE,
    investor TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONVERSATIONS (Depende de Users)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    type TEXT DEFAULT 'direct'::text,
    avatar_url TEXT,
    participant_1 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    participant_2 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT conversations_participant_1_fkey FOREIGN KEY (participant_1) REFERENCES public.users(id),
    CONSTRAINT conversations_participant_2_fkey FOREIGN KEY (participant_2) REFERENCES public.users(id)
);

-- MESSAGES (Depende de Conversations y Users)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    attachment JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- HELP REQUESTS (Depende de Companies)
CREATE TABLE IF NOT EXISTS public.help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT,
    type TEXT,
    urgency TEXT DEFAULT 'medium'::text,
    status TEXT DEFAULT 'pending'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CERTIFICATIONS (Depende de Users)
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active'::text,
    date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- NOTIFICATIONS (Depende de Users)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================================================
-- 3. HABILITACIÓN DE POLÍTICAS DE ACCESO (ROW LEVEL SECURITY)
-- ========================================================================================
-- Habilitamos RLS en todas las tablas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Crear políticas permisivas para desarrollo
DROP POLICY IF EXISTS "Allow all for advertisements" ON public.advertisements;
CREATE POLICY "Allow all for advertisements" ON public.advertisements FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for web_categories" ON public.web_categories;
CREATE POLICY "Allow all for web_categories" ON public.web_categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for companies" ON public.companies;
CREATE POLICY "Allow all for companies" ON public.companies FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for user_groups" ON public.user_groups;
CREATE POLICY "Allow all for user_groups" ON public.user_groups FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for projects" ON public.projects;
CREATE POLICY "Allow all for projects" ON public.projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for registration_requests" ON public.registration_requests;
CREATE POLICY "Allow all for registration_requests" ON public.registration_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for contract_templates" ON public.contract_templates;
CREATE POLICY "Allow all for contract_templates" ON public.contract_templates FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for categories" ON public.categories;
CREATE POLICY "Allow all for categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for system_settings" ON public.system_settings;
CREATE POLICY "Allow all for system_settings" ON public.system_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for users" ON public.users;
CREATE POLICY "Allow all for users" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for opportunities" ON public.opportunities;
CREATE POLICY "Allow all for opportunities" ON public.opportunities FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for applications" ON public.applications;
CREATE POLICY "Allow all for applications" ON public.applications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for job_offers" ON public.job_offers;
CREATE POLICY "Allow all for job_offers" ON public.job_offers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for candidate_profiles" ON public.candidate_profiles;
CREATE POLICY "Allow all for candidate_profiles" ON public.candidate_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for contracts" ON public.contracts;
CREATE POLICY "Allow all for contracts" ON public.contracts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for contract_milestones" ON public.contract_milestones;
CREATE POLICY "Allow all for contract_milestones" ON public.contract_milestones FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for company_documents" ON public.company_documents;
CREATE POLICY "Allow all for company_documents" ON public.company_documents FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for documents" ON public.documents;
CREATE POLICY "Allow all for documents" ON public.documents FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for audit_logs" ON public.audit_logs;
CREATE POLICY "Allow all for audit_logs" ON public.audit_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for inspections" ON public.inspections;
CREATE POLICY "Allow all for inspections" ON public.inspections FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for news_articles" ON public.news_articles;
CREATE POLICY "Allow all for news_articles" ON public.news_articles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for social_projects" ON public.social_projects;
CREATE POLICY "Allow all for social_projects" ON public.social_projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for conversations" ON public.conversations;
CREATE POLICY "Allow all for conversations" ON public.conversations FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for messages" ON public.messages;
CREATE POLICY "Allow all for messages" ON public.messages FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for help_requests" ON public.help_requests;
CREATE POLICY "Allow all for help_requests" ON public.help_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for certifications" ON public.certifications;
CREATE POLICY "Allow all for certifications" ON public.certifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for notifications" ON public.notifications;
CREATE POLICY "Allow all for notifications" ON public.notifications FOR ALL USING (true);

-- Seeding inicial de roles
INSERT INTO public.user_groups (name, description) VALUES
('super_admin', 'Administrador General MMH'),
('funcionario', 'Funcionario del Ministerio'),
('cuerpo_tecnico', 'Cuerpo Técnico / Inspector'),
('petrolera', 'Operadora Petrolera (IOC)'),
('company', 'Empresa de Servicios Internacional'),
('empresa_local', 'Empresa Local (PYME)'),
('persona', 'Talento Nacional / Ciudadano'),
('comunicacion', 'Prensa y Comunicación'),
('comunidad', 'Representante de Comunidad / ONG')
ON CONFLICT (name) DO NOTHING;

-- Seeding de plantillas de contratos
INSERT INTO public.contract_templates (title, description, category, status) VALUES
('Contrato de Prestación de Servicios Estándar', 'Plantilla base para servicios generales con cláusulas de contenido nacional.', 'Servicios', 'active'),
('Contrato de Suministro de Bienes', 'Acuerdo para la provisión de materiales y equipos.', 'Suministros', 'active'),
('Acuerdo de Confidencialidad (NDA)', 'Plantilla estándar para protección de información sensible.', 'Legal', 'active'),
('Contrato de Subcontratación (Tier 2)', 'Para empresas principales que subcontratan a PYMES locales.', 'Subcontratación', 'active')
ON CONFLICT DO NOTHING;
