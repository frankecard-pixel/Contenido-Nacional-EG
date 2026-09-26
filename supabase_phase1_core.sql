-- ========================================================================================
-- FASE 1: NÚCLEO INSTITUCIONAL Y SISTEMA DE WORKFLOWS / RBAC / AUDITORÍA
-- MINISTERIO DE MINAS E HIDROCARBUROS DE GUINEA ECUATORIAL - PORTAL DE CONTENIDO NACIONAL
-- MIGRACIÓN SEGURA Y NO DESTRUCTIVA
-- ========================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HISTORIAL DE WORKFLOWS (Transiciones de estado con auditoría y adjuntos)
CREATE TABLE IF NOT EXISTS public.workflow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'nationalization', 'company', 'application', 'social_project', 'job', etc.
    from_state TEXT NOT NULL,
    to_state TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    comment TEXT,
    attached_documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. TABLA DE PERMISOS GRANULARES Y ROLES RBAC
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g. 'users.view', 'companies.verify', 'nationalization.approve'
    name TEXT NOT NULL,
    module TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_name TEXT NOT NULL,
    permission_code TEXT NOT NULL REFERENCES public.permissions(code) ON DELETE CASCADE,
    PRIMARY KEY (role_name, permission_code)
);

-- 3. EXTENSIÓN Y VERIFICACIÓN DE ESTRUCTURAS EXISTENTES

-- Ampliación de audit_logs con campos de módulo y estados si no existen
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS module TEXT DEFAULT 'core',
ADD COLUMN IF NOT EXISTS previous_state TEXT,
ADD COLUMN IF NOT EXISTS new_state TEXT,
ADD COLUMN IF NOT EXISTS details TEXT;

-- Ampliación de documents con versión y cargador
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Ampliación de notifications con canales
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'portal',
ADD COLUMN IF NOT EXISTS action_url TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 4. PREPARACIÓN DE ENTIDADES PARA FUTUROS MÓDULOS (Compatibilidad DDL)

-- PERSONAS Y PERFILES DE TALENTO (Base para Nacionalización y Empleo)
CREATE TABLE IF NOT EXISTS public.persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    national_id TEXT UNIQUE, -- DIP / Pasaporte
    nationality TEXT DEFAULT 'Equatoguineana',
    birth_date DATE,
    phone TEXT,
    address TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- POSICIONES Y METAS DE NACIONALIZACIÓN DE EMPRESAS
CREATE TABLE IF NOT EXISTS public.nationalization_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    position_title TEXT NOT NULL,
    department TEXT,
    is_expatriate_occupied BOOLEAN DEFAULT true,
    current_occupant_name TEXT,
    target_nationalization_date DATE,
    assigned_local_shadow_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'EN_PROCESO', -- 'BORRADOR', 'EN_REVISION', 'APROBADO', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PROGRAMAS DE FORMACIÓN Y BECAS
CREATE TABLE IF NOT EXISTS public.trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    provider_name TEXT,
    category TEXT,
    capacity INTEGER DEFAULT 0,
    enrolled_count INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'BORRADOR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. HABILITACIÓN DE RLS Y POLÍTICAS
ALTER TABLE public.workflow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nationalization_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for workflow_history" ON public.workflow_history;
CREATE POLICY "Allow all for workflow_history" ON public.workflow_history FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for permissions" ON public.permissions;
CREATE POLICY "Allow all for permissions" ON public.permissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for role_permissions" ON public.role_permissions;
CREATE POLICY "Allow all for role_permissions" ON public.role_permissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for persons" ON public.persons;
CREATE POLICY "Allow all for persons" ON public.persons FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for nationalization_positions" ON public.nationalization_positions;
CREATE POLICY "Allow all for nationalization_positions" ON public.nationalization_positions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for trainings" ON public.trainings;
CREATE POLICY "Allow all for trainings" ON public.trainings FOR ALL USING (true);

-- Seeding inicial de permisos esenciales
INSERT INTO public.permissions (code, name, module, description) VALUES
('users.view', 'Ver Usuarios', 'users', 'Permite visualizar la lista de usuarios'),
('users.create', 'Crear Usuarios', 'users', 'Permite registrar nuevos usuarios'),
('users.edit', 'Editar Usuarios', 'users', 'Permite modificar datos de usuarios'),
('companies.view', 'Ver Empresas', 'companies', 'Permite consultar el registro de empresas'),
('companies.verify', 'Verificar Empresas', 'companies', 'Permite aprobar o rechazar certificación empresarial'),
('documents.upload', 'Subir Documentos', 'documents', 'Permite adjuntar expedientes y archivos'),
('documents.approve', 'Aprobar Documentos', 'documents', 'Permite validar o rechazar documentación'),
('nationalization.view', 'Ver Nacionalización', 'nationalization', 'Permite consultar planes de nacionalización'),
('nationalization.approve', 'Aprobar Nacionalización', 'nationalization', 'Permite validar planes de reemplazo de expatriados'),
('training.approve', 'Aprobar Formación', 'training', 'Permite aprobar solicitudes de becas y cursos')
ON CONFLICT (code) DO NOTHING;
