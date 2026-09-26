# PORTAL DE CONTENIDO NACIONAL - MINISTERIO DE MINAS E HIDROCARBUROS (GUINEA ECUATORIAL)
## INFORME TÉCNICO DE ARQUITECTURA Y AUDITORÍA DEL SISTEMA (FASE 1)

---

### 1. ARQUITECTURA ACTUAL

El Portal de Contenido Nacional del Ministerio de Minas e Hidrocarburos (MMH) de Guinea Ecuatorial está construido sobre una arquitectura **Single Page Application (SPA)** moderna, altamente modular y responsiva en el frontend, integrada con servicios en la nube a través de **Supabase / PostgreSQL** para autenticación, almacenamiento persistente y lógica de negocio en el backend.

- **Frontend Framework**: React 18 / TypeScript, Vite para la compilación y empaquetado ultra rápido.
- **Estilos y UI**: Tailwind CSS v3/v4 con un diseño institucional adaptado a la identidad gráfica ministerial, soporte completo para Modo Oscuro y componentes interactivos reutilizables (Lucide React, Framer Motion).
- **Backend & Persistencia**: Supabase BaaS (PostgreSQL) con fallback inteligente a capa de persistencia local estructurada en memoria / LocalStorage para garantización de disponibilidad cero caídas durante desconexiones o pruebas de desarrollo.
- **Internacionalización (i18n)**: Soporte nativo para 3 idiomas oficiales y de trabajo en el sector petrolero (Español, Inglés, Francés).
- **Control de Estado y Autenticación**: React Context Pattern (`AuthContext`) conectado con JWT auth de Supabase y un gestor dinámico de permisos asignados a sesión.

---

### 2. ARQUITECTURA OBJETIVO

La arquitectura objetivo evoluciona la aplicación hacia un **Núcleo Institucional Modular Monolítico-Desacoplado**, estructurado en capas horizontales y verticales bien definidas:

```
+-------------------------------------------------------------------------------+
|                             CAPA DE PRESENTACIÓN                              |
|   Portal Público | Dashboard Institucional | Portal PYME | Portal Petrolera    |
+-------------------------------------------------------------------------------+
                                        |
+-------------------------------------------------------------------------------+
|                       GUARDS Y RBAC EN FRONTEND & API                         |
|   Permisos Granulares (users.view, companies.verify, nationalization.approve) |
+-------------------------------------------------------------------------------+
                                        |
+-------------------------------------------------------------------------------+
|                          NÚCLEO DEL SISTEMA (CORE)                            |
| +---------------------------------------------------------------------------+ |
| | Roles & Permisos | Workflows & Estados | Audit Trail | Gestión Documental | |
| | Notificaciones   | Búsqueda & AI Prep  | Perfiles ID | Organizaciones DB  | |
| +---------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------+
                                        |
+-------------------------------------------------------------------------------+
|                          MÓDULOS DE NEGOCIO (VERTICALES)                      |
| Nacionalización | Empresas & RUGE | Oportunidades & Licitaciones | Formación  |
| Becas & Pasantías | Proyectos Sociales | Empleo & Vacantes | Registro Legal |
+-------------------------------------------------------------------------------+
                                        |
+-------------------------------------------------------------------------------+
|                       CAPA DE PERSISTENCIA & SERVICIOS                        |
|  PostgreSQL (Supabase) | Row Level Security (RLS) | Storage S3 | Vector AI Prep|
+-------------------------------------------------------------------------------+
```

---

### 3. MÓDULOS EXISTENTES Y REUTILIZABLES

A continuación se detalla el mapa de módulos operativos en el portal actual que se conservan y reutilizan en su totalidad:

| Módulo | Funcionalidad | Estado Actual | Componentes / Servicios Relacionados |
| :--- | :--- | :--- | :--- |
| **Autenticación & Sesión** | Login, registro de usuarios, logout, recuperación de sesión | **100% Operativo** | `AuthContext.tsx`, `Login.tsx`, `Register.tsx` |
| **Directorio & RUGE** | Buscador de empresas, filtros por sector, nivel de certificación, mapa GPS | **100% Operativo** | `Directory.tsx`, `CompanyProfileView.tsx` |
| **Oportunidades & Bidding** | Publicación de licitaciones petroleras, solicitudes de licitación | **100% Operativo** | `Opportunities.tsx`, `OpportunityDetail.tsx`, `ApplicationsTracking.tsx` |
| **Ofertas de Empleo** | Bolsa de trabajo, filtros por categoría, postulaciones | **100% Operativo** | `Jobs.tsx`, `JobDetail.tsx`, `AdminJobManagement.tsx` |
| **Proyectos Sociales** | Registro de obras comunitarias financiada por IOCs, mapa de impacto | **100% Operativo** | `SocialProjectDetail.tsx`, `Community.tsx` |
| **Gestión Documental Base** | Expedientes de empresas, verificación de estado de documentos | **100% Operativo** | `DocumentManagement.tsx`, `CompanyProfileManagement.tsx` |
| **Mensajería Interna** | Chat directo entre empresas, técnicos y administración | **100% Operativo** | `Messages.tsx`, `Conversation` |
| **Anuncios & Banners** | Gestión publicitaria con validación de presupuestos y formatos | **100% Operativo** | `AdvertisementManagement.tsx` |
| **Publicación de Noticias** | Editor de noticias institucionales, blog del Ministerio | **100% Operativo** | `News.tsx`, `NewsManagement.tsx` |

---

### 4. MÓDULOS PENDIENTES Y PLANIFICADOS

Los siguientes módulos de negocio verticales se integrarán progresivamente utilizando el **CORE INSTITUCIONAL** preparado en la Fase 1:

1. **Nacionalización y Talento Nacional (Módulo Prioritario Fase 2)**:
   - Seguimiento del plan de reemplazo de personal expatriado por cuadro nacional.
   - Puestos clave, asignación de sombras locales (*shadowing*), plan de carrera.
   - Certificación de técnicos e ingenieros equatoguineanos.
2. **Registro Ampliado de Empresas & Capacidades**:
   - Clasificación Tier 1 (Operadoras), Tier 2 (Proveedores Principales) y Tier 3 (PYMES Locales).
   - Verificación de capital social local, gasto local (*Local Spend %*).
3. **Programas de Formación y Becas del Sector**:
   - Planes de capacitación financiados por cláusulas contractuales petroleras.
   - Postulaciones a becas universitarias y certificaciones internacionales (OPITO, NEBOSH, ASME).
4. **Programa Institucional de Pasantías**:
   - Vinculación de egresados universitarios con operadoras y empresas de servicio.
5. **Auditoría Avanzada de Obras e Impacto Social**:
   - Verificación en terreno con geolocalización, control presupuestario y entregables.

---

### 5. MODELO DE USUARIOS

El modelo de usuario centralizado `User` contempla todas las variantes requeridas por el Ministerio:

```typescript
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  isOnline: boolean;
  permissions: string[]; // Permisos granulares asignados
  department?: string;
  status?: 'active' | 'pending' | 'inactive' | 'suspended';
  position?: string;
  companyId?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  phone?: string;
}
```

---

### 6. MODELO DE ROLES (RBAC)

El sistema soporta una jerarquía flexible de roles administrada por código y base de datos:

1. **ADMINISTRADOR / SUPER_ADMIN**: Control total de la plataforma, configuración global y usuarios.
2. **DIRECTOR**: Aprobador final de planes de nacionalización, certificaciones de empresas y contratos sociales.
3. **RESPONSABLE_SECCION**: Jefe de sección encargada de revisar expedientes y gestionar workflows de su área.
4. **TÉCNICO / CUERPO_TECNICO**: Evaluador técnico de campo, realiza inspecciones y audita documentación.
5. **SECRETARÍA**: Registro de entrada de solicitudes, recepción de documentación física/digital.
6. **EMPRESA (PETROLERA / COMPANY / EMPRESA_LOCAL)**: Declaración de plantilla, subida de licitaciones, solicitudes RUGE.
7. **PROFESIONAL / PERSONA**: Talento nacional, consulta de vacantes, CV digital, solicitudes de becas y pasantías.
8. **USUARIO_EXTERNO / COMUNIDAD**: Consulta pública de noticias, proyectos comunitarios y licitaciones abiertas.

---

### 7. MODELO DE PERMISOS GRANULARES

Los permisos son cadenas de texto estructuradas en `modulo.accion` administradas por el servicio `rbacService.ts`:

- `users.view`, `users.create`, `users.edit`, `users.delete`
- `companies.view`, `companies.create`, `companies.edit`, `companies.verify`
- `documents.view`, `documents.upload`, `documents.approve`
- `nationalization.view`, `nationalization.create`, `nationalization.edit`, `nationalization.approve`
- `training.view`, `training.create`, `training.approve`
- `social_projects.view`, `social_projects.create`, `social_projects.approve`
- `jobs.view`, `jobs.create`, `jobs.apply`
- `audit.view`, `settings.edit`

---

### 8. MODELO DE DATOS CENTRAL Y EXTENSIBLE

El esquema de base de datos en PostgreSQL incluye las tablas principales y sus relaciones:

- **Empresas & Entidades**: `companies`, `registration_requests`
- **Usuarios & Seguridad**: `users`, `user_groups`, `permissions`, `role_permissions`
- **Expedientes & Flujos**: `workflow_history`, `documents`, `company_documents`
- **Oportunidades & Contratos**: `opportunities`, `applications`, `contracts`, `contract_milestones`, `contract_templates`
- **Talento & Empleo**: `candidate_profiles`, `job_offers`, `certifications`, `persons` (preparado)
- **Nacionalización & Capacitación**: `nationalization_positions` (preparado), `trainings` (preparado)
- **Proyectos Comunitarios**: `social_projects`
- **Trazabilidad**: `audit_logs`, `notifications`, `inspections`

---

### 9. WORKFLOW GENERAL Y ESTADOS REUTILIZABLES

Todos los módulos que requieran ciclo de vida de tramitación hacen uso del enum estandarizado `WorkflowState` administrado mediante `workflowService.ts`:

1. `BORRADOR`: Guardado preliminar por la empresa o usuario.
2. `ENVIADO`: Transmitido formalmente al Ministerio.
3. `EN_REVISION`: Asignado a un Técnico o Responsable de Sección.
4. `PENDIENTE_DOCUMENTACION`: Notificación automática solicitando subsanación de archivos.
5. `APROBADO`: Aprobación formal firmada por el Director / Ministerio.
6. `RECHAZADO`: Solicitud denegada con motivo justificado.
7. `EN_PROCESO`: Ejecución en marcha (p.ej. plan de nacionalización anual).
8. `COMPLETADO`: Meta cumplida satisfactoriamente.
9. `CANCELADO`: Proceso anulado.

Toda transición registra automáticamente en `workflow_history`: usuario, rol, estado origen, estado destino, comentario, fecha y documentos adjuntos.

---

### 10. SEGURIDAD

- **Verificación de Permisos en dos Capas**:
  1. *Frontend*: Protección de rutas y componentes mediante el helper `hasPermission(user, requiredPermission)`.
  2. *Backend & DB*: Políticas **Row Level Security (RLS)** en Supabase/PostgreSQL y validación de tokens JWT.
- **Validación de Archivos**: Filtro estricto por tipo MIME y sanitización en la carga a Storage.
- **Audit Logging Imborrable**: Registro de acciones críticas (`CREATE`, `UPDATE`, `DELETE`, `APPROVE`, `REJECT`, `STATUS_CHANGE`) mediante `auditService.ts`.

---

### 11. PLAN DE EVOLUCIÓN

- **Fase 1 (Completada)**: Auditoría completa, creación del Core Institucional (RBAC, Workflow Engine, Audit Logger, Document & Notification services, DB delta script `supabase_phase1_core.sql`).
- **Fase 2 (Siguiente paso)**: Implementación del módulo prioritario **"NACIONALIZACIÓN Y TALENTO NACIONAL"**.
- **Fase 3**: Ampliación del Registro de Empresas, Proveedores y Pasantías.
- **Fase 4**: Asistente de Inteligencia Artificial (Búsqueda semántica y matching de talento nacional).
