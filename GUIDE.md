# MANUAL DE RECONSTRUCCIÓN: PORTAL DE CONTENIDO NACIONAL (DCN-GE)
## Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial

Este documento contiene la especificación técnica completa, arquitectura, estructura de archivos, base de datos Supabase, flujos de autenticación e instrucciones de prompting necesarias para recrear la plataforma completa desde cero en cualquier otra Inteligencia Artificial o entorno de desarrollo.

---

## 1. Arquitectura de Software y Tecnologías

La plataforma está diseñada con una arquitectura moderna de tipo **Single Page Application (SPA)** desacoplada, con el frontend en React y persistencia serverless integrada de Supabase.

*   **Frontend**: React 19 + TypeScript + Vite.
*   **Servicio Web / Router**: React Router DOM v7 (Maneja las rutas administrativas, públicas y de dashboard).
*   **Base de Datos y Auth**: Supabase (PostgreSQL) con Políticas de Seguridad a Nivel de Fila (RLS).
*   **Estilos y Componentes**: Tailwind CSS (Utility classes) + Lucide-React para iconos universales.
*   **Animaciones**: Framer Motion (importada como `motion` desde la librería `motion/react`) para transiciones de página, feedbacks visuales y micro-interacciones suaves.
*   **Internacionalización (i18n)**: i18next + react-i18next con soporte para **Español (es)**, **Inglés (en)** y **Francés (fr)**.
*   **Visualizaciones de Datos**: Recharts (para métricas de retención de valor local, inspecciones e informes) y Leaflet (`react-leaflet` o mapas puros) para geolocalización interactiva de proyectos energéticos y obras sociales.
*   **Inteligencia Artificial Integrada**: `@google/genai` (SDK de desarrollo oficial de Google) conectando directamente a Gemini 1.5/2.0 para el asesor jurídico automático ("LEX IA Advisor").

---

## 2. Estructura de Directorios del Código Fuente

```text
/
├── .env.example              # Declaración de variables de entorno (Supabase URL, Anon Key).
├── .gitignore                # Reglas de exclusión para control de versiones Git.
├── App.tsx                   # Enrutamiento principal (React Router, AuthProvider, i18n).
├── index.html                # Entrada principal HTML, optimizada para SEO y buscadores de IA.
├── index.tsx                 # Renderizador raíz de React.
├── i18n.ts                   # Centralización de diccionarios multilingües (ES, EN, FR).
├── tsconfig.json             # Configuración del compilador de TypeScript.
├── vite.config.ts            # Configurador del empaquetador Vite con soporte de React.
├── package.json              # Gestión de dependencias y scripts de empaquetado.
├── robots.txt                # Archivo para guiar crawlers públicos y ocultar el área administrativa.
│
├── services/
│   ├── supabaseClient.ts     # Cliente singleton para interactuar con la base de datos Supabase.
│   ├── supabaseApi.ts        # Capa de funciones CRUD reactivas para todo el portal.
│   └── mockService.ts        # Respuestas mockeadas para contingencia fuera de red.
│
├── types/
│   └── index.ts              # Declaración centralizada de Tipos TypeScript y Roles de usuario.
│
├── components/               # Componentes reutilizables agrupados lógicamente
│   ├── AdBanner.tsx          # Gestor de banners publicitarios.
│   ├── ChatWindow.tsx        # Interfaz de chat en directo para el Centro de Mensajería.
│   ├── InteractiveMap.tsx    # Visualizador de mapas cartográficos de Leaflet.
│   ├── LanguageSelector.tsx  # Selector global de idioma (ES, EN, FR) persistente en localStorage.
│   ├── Layout.tsx            # Marco estructural de páginas públicas.
│   ├── LexAssistant.tsx      # Terminal interactiva de comandos del Asesor de Inteligencia Artificial (Gemini).
│   ├── Navbar.tsx            # Navegación responsiva e institucional.
│   ├── PublicFooter.tsx      # Pie de página gubernamental unificado.
│   ├── StatCard.tsx          # Plantilla para tarjetas métricas del Dashboard.
│   ├── DashboardHeader.tsx   # Control de perfil de usuario e idioma del panel privado.
│   ├── DashboardSidebar.tsx  # Menú correspondiente a cada rol de usuario.
│   │
│   ├── admin/                # Componentes exclusivos del Rol Administrador General
│   ├── company/              # Componentes de perfiles de empresas locales e internacionales
│   ├── dashboard/            # Sub-paneles interactivos (Inspecciones, Empleo, RSC)
│   ├── opportunities/        # Formularios de carga de pliegos y licitaciones
│   ├── public/               # Secciones de la Landing Page
│   └── settings/             # Interfaz de configuraciones institucionales
│
└── pages/                    # Vistas completas del portal (rutas)
    ├── Home.tsx              # Landing Page institucional y discurso del Ministro.
    ├── About.tsx             # Historia, objetivos y estructura de la Dirección.
    ├── Vision.tsx            # Hoja de ruta estratégica hasta el año 2035.
    ├── Requirements.tsx      # Detalles técnicos obligatorios de Contenido Nacional por Ley.
    ├── Directory.tsx         # Directorio público interactivo de empresas certificadas.
    ├── CompanyRegistry.tsx   # Panel y directorio interno detallado.
    ├── Opportunities.tsx     # Listado público de licitaciones públicas.
    ├── OpportunityDetail.tsx # Requisitos de licitación con descarga de pliego técnico (autenticado).
    ├── Jobs.tsx              # Bolsa de empleo para el talento nacional.
    ├── JobDetail.tsx         # Detalles, salarios y requisitos de las ofertas de empleo.
    ├── Community.tsx         # Proyectos de Responsabilidad Social Corporativa (RSC) en campo.
    ├── Resources.tsx         # Biblioteca para descarga de decretos y leyes.
    ├── Login.tsx / Register. # Formularios de alta con proceso modular de validación.
    ├── Dashboard.tsx         # Gestor dinámico que canaliza al usuario según su Rol asignado.
    ├── Messages.tsx          # Centro de mensajería (Inbox, chat abierto, estados en línea).
    └── ... (páginas de reportes, gacetas, auditorías, redes de sector)
```

---

## 3. Esquema de Base de Datos Supabase (PostgreSQL Plano)

Este script SQL contiene la inicialización perfecta en el orden exacto de dependencias de Foreign Key para evitar errores de restricción, incluyendo la restauración de privilegios web y políticas globales de visualización seguros.

```sql
-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. TABLAS PRIMARIAS (Sin dependencias Foráneas directas)
-- =========================================================

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
    status TEXT DEFAULT 'pending', -- 'certified', 'pending', 'expired'
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

CREATE TABLE IF NOT EXISTS public.user_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

-- =========================================================
-- 2. TABLAS SECUNDARIAS (Con dependencias de Clave Foránea)
-- =========================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'super_admin', 'funcionario', 'empresa_local', etc.
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

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL, -- {es: "", en: ""}
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

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted', -- 'submitted', 'under_review', 'awarded'
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

CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    skills JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    cv_url TEXT,
    saved_jobs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref TEXT UNIQUE,
    title TEXT NOT NULL,
    awarded_to TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- 'execution', 'completed'
    value NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    location TEXT,
    progress INTEGER DEFAULT 0,
    national_compliance JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    participant_2 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    attachment JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =========================================================
-- 3. PERMISOS DE RED Y CONECTIVIDAD (Supabase API Gateway)
-- =========================================================

-- Conceder accesos de lectura/escritura a roles Anon y Authenticated de Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- Garantizar que nuevas tablas hereden los accesos automáticamente
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;

-- =========================================================
-- 4. SEGURIDAD DE FILA (RLS) & POLÍTICAS UNIVERSALES DE DESARROLLO
-- =========================================================

-- Habilitar RLS en tablas críticas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Crear políticas permisivas de desarrollo (Permite ver y escribir de forma fluida)
CREATE POLICY "Allow read/write all users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write all companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write all opportunities" ON public.opportunities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write all applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write all messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write all conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
```

---

## 4. Matriz de Roles y Funciones de la Plataforma

El portal cuenta con un **sistema de enrutamiento dinámico basado en Roles**. Al iniciar sesión, la directiva `fetchUserRole(userId)` interroga a la base de datos pública y renderiza el menú contextual en la barra lateral (`DashboardSidebar.tsx`):

| Rol en Base de Datos | Perfil Objetivo | Módulos Visibles en la Plataforma |
| :--- | :--- | :--- |
| **`super_admin`** | Administrador del Ministerio | Acceso completo: Gestión de usuarios globales, aprobaciones, auditorías y métricas generales del Portal. |
| **`funcionario`** | Operativo del Ministerio | Revisión de expedientes de empresas, aprobación de licitaciones y carga del marco legal. |
| **`cuerpo_tecnico`**| Inspector / Auditor Técnico | Inspección presencial y virtual en pozos/minas, emisión de alertas del sector y reportes de cumplimiento. |
| **`petrolera`** | Compañía Operadora (IOC) | Publicación de licitaciones, análisis de postulaciones de empresas locales y descargas de reportes. |
| **`company`** | Proveedor de Servicios Int. | Cuentas corporativas, carga de documentación anual obligatoria de compliance de Contenido Nacional. |
| **`empresa_local`**| Pyme de Guinea Ecuatorial | Postulación a licitaciones reservadas, bolsa de empleo local, obtención de certificados de prioridad local. |
| **`persona`** | Talento / Trabajador Nacional| Subida de CV digital, buscador y postulación directa a vacantes del sector de energía y minas. |
| **`comunicacion`** | Departamento de Prensa Ext. | Editor de noticias y gacetas ministeriales, comunicados públicos. |
| **`comunidad`** | Líder Social / Vecinal | Visualizador de Proyectos RSC, módulo de Feedback Ciudadano directo. |
| **`advertiser`** | Gestor Publicitario | Contratación de Banners de anuncios promocionales en el portal público. |

---

## 5. Módulo Clave: Inteligencia Artificial (LEX IA Advisor)

El asesor interactivo de Contenido Nacional utiliza el SDK `@google/genai` directamente en el cliente o mediante endpoints para ofrecer asesoramiento normativo en tiempo real basado en la Legislación Vigente de Contenido Nacional de Guinea Ecuatorial.

### Código de Implementación del Servicio Gemini (`services/gemini.ts`):
```typescript
import { GoogleGenAI } from "@google/genai";

// Inicialización perezosa de la IA de Google para evitar caídas del build.
let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Falta VITE_GEMINI_API_KEY en las variables del entorno.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiInstance;
}

export async function askLexAdvisor(query: string, contextHistory: { role: string; text: string }[] = []) {
  const ai = getGeminiClient();
  
  // Prompt de Sistema que moldea la personalidad de LEX
  const systemInstruction = `
    Eres "LEX AI Advisor", el Asesor Virtual Inteligente de la Dirección de Contenido Nacional del Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial.
    Tu objetivo es responder y guiar a empresas internacionales, pymes locales y ciudadanos sobre las Leyes, Decretos y Regulaciones vigentes sobre Contenido Nacional (retención de valor, cuotas de empleo del 80%-90% de nativos, transferencia tecnológica y entrenamiento local obligatorio).
    Debes ser extremadamente formal, profesional y servicial.
    Al final de cada respuesta recuerda incluir el descargo de responsabilidad indicando que sus consultas están sujetas a revisión ministerial presencial.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "system", parts: [{ text: systemInstruction }] },
        ...contextHistory.map(h => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.text }] })),
        { role: "user", parts: [{ text: query }] }
      ]
    });
    
    return response.text;
  } catch (error) {
    console.error("Error en LEX Advisor:", error);
    return "Disculpe las molestias, en este momento el servicio del Asesor Normativo LEX IA no está disponible. Intente nuevamente en unos minutos.";
  }
}
```

---

## 6. Instrucciones de Prompting para la Reconstrucción en una Nueva IA

Si necesitas llevarte este proyecto a otra herramienta o modelo de Inteligencia Artificial para que lo codifique completo, copia y pega el siguiente prompt:

> **PROMPT DE INSTRUCCIÓN UNIVERSAL**
> 
> "Por favor, actúa como un Desarrollador Principal Full-Stack experto en React y e instala la estructura del portal gubernamental 'Dirección de Contenido Nacional' (para el Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial).
> 
> Trabajarás usando React 19, TypeScript, el bundler Vite, Tailwind CSS para el diseño visual, y Supabase como motor de autenticación y base de datos relacional. El portal debe ser elegantemente bilingüe (Español, Francés, Inglés) utilizando react-i18next. 
> 
> Requisitos clave que debes estructurar e implementar:
> 1. Crea la interfaz responsiva con transiciones de rutas animadas con Framer Motion (o 'motion').
> 2. Implementa un sistema de control de accesos y dashboards adaptativos mediante roles (super_admin, funcionario, cuerpo_tecnico, petrolera, company, empresa_local, persona, comunicacion, comunidad, advertiser) tal como se especifica en la matriz de roles y funciones.
> 3. Integra un mapa interactivo (usando Leaflet o renderizador interactivo) para geolocalizar instalaciones industriales energéticas y obras de desarrollo social.
> 4. Construye un chat interactivo para consultas sobre normativas legales que aproveche el SDK @google/genai apuntando a Gemini (para el LEX IA Advisor).
> 5. Incorpora un Centro de Mensajería bidireccional en tiempo real haciendo lecturas directas integradas a Supabase.
> 6. Adhiérete estrictamente a las mejores prácticas de código limpio y mantén los componentes desacoplados modularmente."

---
*Manual redactado y persistido con éxito en el espacio de trabajo local para garantizar la portabilidad absoluta del Portal Nacional DCN-GE.*
