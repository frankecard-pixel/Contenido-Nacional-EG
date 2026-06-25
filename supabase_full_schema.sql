-- ========================================================================================
-- COMPREHENSIVE SUPABASE SCHEMA FOR NATIONAL CONTENT PORTAL
-- ========================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CORE ENTITIES
-- ==========================================

-- USERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    department TEXT,
    position TEXT,
    company_id UUID,
    avatar TEXT,
    is_online BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    legal_name TEXT,
    tax_id TEXT,
    ruge_id TEXT,
    type TEXT, -- 'local', 'international'
    industry TEXT,
    sector JSONB DEFAULT '[]'::jsonb,
    size TEXT,
    website TEXT,
    description TEXT,
    logo TEXT,
    status TEXT DEFAULT 'pending', -- 'certified', 'pending', 'expired', 'rejected', 'suspended'
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

-- Add foreign key to users now that companies exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_company') THEN
        ALTER TABLE public.users ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
    END IF;
END
$$;

-- ==========================================
-- 2. REGISTRATION & AUTHENTICATION
-- ==========================================

-- REGISTRATION REQUESTS
CREATE TABLE IF NOT EXISTS public.registration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    tax_id TEXT,
    sector TEXT,
    sectors JSONB DEFAULT '[]'::jsonb,
    role TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    documents JSONB DEFAULT '[]'::jsonb,
    dip_base64 TEXT,
    categories JSONB DEFAULT '[]'::jsonb,
    tracking_number TEXT,
    expediente_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- USER GROUPS / ROLES
CREATE TABLE IF NOT EXISTS public.user_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 3. OPPORTUNITIES & APPLICATIONS
-- ==========================================

-- OPPORTUNITIES (Tenders)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL, -- {es: '', en: '', fr: ''}
    description JSONB NOT NULL,
    category TEXT,
    budget NUMERIC,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'published', -- 'published', 'closed', 'awarded', 'under_review'
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    location TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    ref TEXT,
    tag TEXT,
    project_id UUID,
    awarded_amount NUMERIC,
    scope_of_work TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted', -- 'submitted', 'under_review', 'shortlisted', 'awarded', 'rejected'
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

-- ==========================================
-- 4. JOBS & TALENT
-- ==========================================

-- JOB OFFERS
CREATE TABLE IF NOT EXISTS public.job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    location TEXT,
    salary TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    category TEXT,
    status TEXT DEFAULT 'published',
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.job_offers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted', -- 'submitted', 'under_review', 'shortlisted', 'rejected', 'hired'
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    institution TEXT,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    file_url TEXT,
    verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    progress INTEGER DEFAULT 0, -- 0-100 for ongoing training
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CANDIDATE PROFILES
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    skills JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    cv_url TEXT,
    saved_jobs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 5. CONTRACTS & COMPLIANCE
-- ==========================================

-- CONTRACTS
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- CONTRACT MILESTONES
CREATE TABLE IF NOT EXISTS public.contract_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    deadline DATE,
    status TEXT DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'overdue'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONTRACT TEMPLATES
CREATE TABLE IF NOT EXISTS public.contract_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    content TEXT,
    file_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- COMPANY DOCUMENTS
CREATE TABLE IF NOT EXISTS public.company_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT, -- 'Legal', 'Financiero', 'Técnico', 'Seguros'
    status TEXT DEFAULT 'pending', -- 'approved', 'pending', 'rejected', 'expired'
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expiry_date DATE,
    size TEXT,
    format TEXT,
    feedback TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    entity_id TEXT,
    status TEXT DEFAULT 'success', -- 'success', 'failed', 'pending'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- INSPECTIONS
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    date DATE,
    type TEXT,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'canceled'
    officer UUID REFERENCES public.users(id) ON DELETE SET NULL,
    notes TEXT,
    site TEXT,
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 6. COMMUNICATION & SOCIAL
-- ==========================================

-- NEWS ARTICLES
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    summary JSONB NOT NULL,
    content JSONB NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'pending', 'published'
    author UUID REFERENCES public.users(id) ON DELETE SET NULL,
    publish_date TIMESTAMP WITH TIME ZONE,
    featured_image TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SOCIAL PROJECTS
CREATE TABLE IF NOT EXISTS public.social_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    impact TEXT,
    location TEXT,
    image TEXT,
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'proposed', -- 'proposed', 'active', 'completed'
    budget NUMERIC,
    progress INTEGER DEFAULT 0,
    end_date DATE,
    investor TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    participant_2 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    attachment JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- HELP REQUESTS
CREATE TABLE IF NOT EXISTS public.help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT,
    type TEXT, -- 'legal', 'technical', 'financial'
    urgency TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'
    status TEXT DEFAULT 'pending', -- 'pending', 'reviewed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 7. SYSTEM
-- ==========================================

-- CATEGORIES (General)
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
    portal_version TEXT DEFAULT '1.0.0',
    last_backup TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- RLS POLICIES (Row Level Security)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create basic permissive policies for development (Replace with strict policies in production)
CREATE POLICY "Allow all for authenticated users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.companies FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.registration_requests FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.user_groups FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.opportunities FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.applications FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.job_offers FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.job_applications FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.certifications FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.candidate_profiles FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.contracts FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.contract_milestones FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.contract_templates FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.company_documents FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.inspections FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.news_articles FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.social_projects FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.conversations FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.messages FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.help_requests FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.system_settings FOR ALL USING (true);

-- ==========================================
-- INITIAL DATA SEEDING
-- ==========================================

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

INSERT INTO public.contract_templates (title, description, category, status) VALUES
('Contrato de Prestación de Servicios Estándar', 'Plantilla base para servicios generales con cláusulas de contenido nacional.', 'Servicios', 'active'),
('Contrato de Suministro de Bienes', 'Acuerdo para la provisión de materiales y equipos.', 'Suministros', 'active'),
('Acuerdo de Confidencialidad (NDA)', 'Plantilla estándar para protección de información sensible.', 'Legal', 'active'),
('Contrato de Subcontratación (Tier 2)', 'Para empresas principales que subcontratan a PYMES locales.', 'Subcontratación', 'active')
ON CONFLICT DO NOTHING;
