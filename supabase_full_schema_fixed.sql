-- ========================================================================================
-- COMPREHENSIVE SUPABASE SCHEMA FOR NATIONAL CONTENT PORTAL (FIXED ORDER)
-- ========================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- 1. TABLES WITHOUT FOREIGN KEYS FIRST
-- =========================================

-- COMPANIES (Must exist first for FKs)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    legal_name TEXT,
    tax_id TEXT,
    ruge_id TEXT,
    type TEXT,
    industry TEXT,
    sector JSONB DEFAULT '[]'::jsonb,
    size TEXT,
    website TEXT,
    description TEXT,
    logo TEXT,
    status TEXT DEFAULT 'pending',
    verification_status TEXT DEFAULT 'pending',
    rating NUMERIC DEFAULT 0,
    certification_level TEXT DEFAULT 'basic',
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

-- PROJECTS (Independent)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
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
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =========================================
-- 2. TABLES WITH FOREIGN KEYS
-- =========================================

-- USERS (Depends on Companies)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    department TEXT,
    position TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    avatar TEXT,
    is_online BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- OPPORTUNITIES (Depends on Users, Projects)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    category TEXT,
    budget NUMERIC,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'published',
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    location TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    ref TEXT,
    tag TEXT,
    awarded_amount NUMERIC,
    scope_of_work TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- APPLICATIONS (Depends on Opportunities, Companies)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted',
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

-- JOB OFFERS (Depends on Companies)
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

-- CANDIDATE PROFILES (Depends on Users)
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    skills JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    cv_url TEXT,
    saved_jobs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONTRACTS (Depends on Companies, Opportunities)
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref TEXT UNIQUE,
    title TEXT NOT NULL,
    awarded_to TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    value NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    location TEXT,
    progress INTEGER DEFAULT 0,
    national_compliance JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONTRACT MILESTONES (Depends on Contracts)
CREATE TABLE IF NOT EXISTS public.contract_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    deadline DATE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- COMPANY DOCUMENTS (Depends on Companies)
CREATE TABLE IF NOT EXISTS public.company_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'pending',
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expiry_date DATE,
    size TEXT,
    format TEXT,
    feedback TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AUDIT LOGS (Depends on Users)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    entity_id TEXT,
    status TEXT DEFAULT 'success',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- INSPECTIONS (Depends on Companies, Users)
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    date DATE,
    type TEXT,
    status TEXT DEFAULT 'scheduled',
    officer UUID REFERENCES public.users(id) ON DELETE SET NULL,
    notes TEXT,
    site TEXT,
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- NEWS ARTICLES (Depends on Users)
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    summary JSONB NOT NULL,
    content JSONB NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'draft',
    author UUID REFERENCES public.users(id) ON DELETE SET NULL,
    publish_date TIMESTAMP WITH TIME ZONE,
    featured_image TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SOCIAL PROJECTS (Depends on Users)
CREATE TABLE IF NOT EXISTS public.social_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    impact TEXT,
    location TEXT,
    image TEXT,
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'proposed',
    budget NUMERIC,
    progress INTEGER DEFAULT 0,
    end_date DATE,
    investor TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CONVERSATIONS (Depends on Users)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    participant_2 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- MESSAGES (Depends on Conversations, Users)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    attachment JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- HELP REQUESTS (Depends on Companies)
CREATE TABLE IF NOT EXISTS public.help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT,
    type TEXT,
    urgency TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =========================================
-- 3. OTHER HELPER TABLES
-- =========================================

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

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
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
