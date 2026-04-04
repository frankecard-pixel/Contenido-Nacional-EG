
import { User, UserRole, Opportunity, JobOffer, SocialProject, Company, Message, BadgeType, Application, Language, CompanyDocument, AuditActivity, Conversation, PublicWork, HelpRequest, WebCategory, Contract, Milestone, CompanyExt, OpportunityExt, ApplicationExt, SocialProjectExt, NewsArticle } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u-1', email: 'carlos.mba@mmh.gob.gq', role: UserRole.SUPER_ADMIN, name: 'Carlos Mba', isOnline: true, permissions: ['*'], department: 'Dirección General', status: 'active', position: 'Super Admin' },
  { id: 'u-2', email: 'manuel.nguema@mmh.gob.gq', role: UserRole.FUNCIONARIO, name: 'Manuel Nguema', isOnline: true, permissions: ['verify_companies', 'view_reports'], department: 'Hidrocarburos', status: 'active', position: 'Revisor Técnico' },
  { id: 'u-3', email: 'sofia.obono@mmh.gob.gq', role: UserRole.CUERPO_TECNICO, name: 'Sofia Obono', isOnline: true, permissions: ['field_audit', 'safety_verify'], department: 'TI / Sistemas', status: 'active', position: 'Admin Sistema' },
  { id: 'u-4', email: 'j.pierre@mmh.gob.gq', role: UserRole.COMUNICACION, name: 'Jean Pierre', isOnline: false, permissions: ['manage_news'], department: 'Comunicaciones', status: 'pending', position: 'Editor Contenido' },
  { id: 'u-5', email: 'elena.mbasogo@mmh.gob.gq', role: UserRole.CUERPO_TECNICO, name: 'Elena Mbasogo', isOnline: false, permissions: ['audit'], department: 'Legal / Cumplimiento', status: 'inactive', position: 'Auditor' },
  { id: 'u-6', email: 'ceo@atlantic.com', role: UserRole.COMPANY, name: 'Atlantic Service (Empresa)', isOnline: true, permissions: ['apply_opps', 'manage_profile'], status: 'active' },
  { id: 'u-7', email: 'gerente@guinea-supply.gq', role: UserRole.EMPRESA_LOCAL, name: 'Suministros Guinea (PYME)', isOnline: true, permissions: ['apply_opps', 'local_support'], status: 'active' },
  { id: 'u-8', email: 'marketing@global-ads.com', role: UserRole.ADVERTISER, name: 'Global Ads (Anunciante)', isOnline: true, permissions: ['manage_campaigns', 'view_analytics'], status: 'active' },
];

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: { es: 'Nueva Resolución sobre Cuotas de Catering Offshore', en: 'New Resolution on Offshore Catering Quotas', fr: 'Nouvelle résolution sur les quotas de restauration offshore' },
    summary: { es: 'El Ministerio anuncia la obligatoriedad del 100% de suministro local para plataformas.', en: 'The Ministry announces mandatory 100% local supply for platforms.', fr: 'Le ministère annonce l\'approvisionnement local obligatoire à 100 % para les plateformes.' },
    content: { es: '<p>Contenido detallado en español...</p>', en: '<p>Detailed content in English...</p>', fr: '<p>Contenu détaillé en français...</p>' },
    category: 'Resolución',
    status: 'published',
    author: 'María Nchama',
    publishDate: '15 NOV 2024',
    featuredImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop',
    attachments: [{ id: 'att-1', name: 'Decreto_2023_Hidrocarburos.pdf', size: '2.4 MB', format: 'PDF' }]
  }
];

export const MOCK_NEWS_DRAFTS: Partial<NewsArticle>[] = [
  { id: 'd-1', title: { es: 'Reunión bilateral con delegación de Nigeria sobre gasoductos', en: '', fr: '' }, status: 'draft', publishDate: 'Hace 2 horas' },
  { id: 'd-2', title: { es: 'Informe trimestral de producción 2023', en: '', fr: '' }, status: 'pending', publishDate: 'Ayer' },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'cnt-1',
    ref: 'MMH-EG-2024-001',
    title: 'Mantenimiento Plataforma Offshore B',
    awardedTo: 'Energy Solutions GE S.A.',
    companyId: 'c-1',
    status: 'execution',
    value: 1250000,
    startDate: '15 Ene, 2024',
    endDate: '30 Dic, 2024',
    location: 'Campo Zafiro, Bloque B',
    progress: 45,
    nationalCompliance: {
      localStaff: 92,
      localStaffReq: 85,
      localGoods: 45,
      localGoodsReq: 50
    },
    milestones: [
      { id: 'm-1', description: 'Entrega de Informe Técnico Fase 1', deadline: '20 Feb, 2024', status: 'pending' },
      { id: 'm-2', description: 'Pago 2do Plazo (30%)', deadline: '01 Mar, 2024', status: 'scheduled' },
      { id: 'm-3', description: 'Certificación de Seguridad ISO', deadline: '15 Ene, 2024', status: 'completed' }
    ]
  }
];

export const MOCK_WEB_CATEGORIES: WebCategory[] = [
  { 
    id: 'CAT-001', 
    name: { es: 'Ingeniería y Construcción', en: 'Engineering & Construction', fr: 'Ingénierie et Construction' },
    description: { es: 'Servicios relacionados con el diseño y construcción de infraestructuras.', en: 'Services related to infrastructure design and construction.', fr: 'Services liés à la conception et à la construction d\'infrastructures.' },
    icon: 'engineering',
    status: 'published',
    availableLanguages: ['es', 'en', 'fr']
  }
];

export const MOCK_PUBLIC_WORKS: PublicWork[] = [
  { id: 'pw-1', title: 'Renovación Escuela Malabo II', responsibleCompany: 'ExxonMobil (Tier 1)', status: 'execution', progress: 65, deliveryDate: 'Oct 2024', location: 'Malabo, Bioko Norte' },
];

export const MOCK_HELP_REQUESTS: HelpRequest[] = [
  { id: 'REQ-2024-001', companyName: 'Guinea Logistics S.L.', type: 'legal', date: '12 Ago 2024', urgency: 'high', status: 'pending' },
];

export const MOCK_COMPANIES: CompanyExt[] = [
  {
    id: 'c-1',
    name: 'EG LNG Operations',
    taxId: '8990-1203-GQ',
    rugeId: 'RG-2023-0891',
    type: 'international',
    sector: ['Gas & Energía'],
    status: 'certified',
    rating: 4.8,
    badges: [BadgeType.NATIONAL_CONTENT, BadgeType.COMPLIANT],
    certificationLevel: 'elite',
    complianceScore: 94,
    nationalEmployeeCount: 850,
    totalEmployeeCount: 1000,
    localSpendPercentage: 78,
    auditHistory: [{ id: 'a-1', date: '2024-05-10', officer: 'Juan Manuel', result: 'passed', notes: 'Cumplimiento excepcional.' }],
    address: 'Malabo, Bioko Norte',
    phone: '+240 333 444 555',
    email: 'ops@eglng.com',
    legalRepresentative: {
      name: 'Bernardo Nguema',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop'
    },
    registrationDate: '12 Oct 2023',
    lat: 3.75,
    lng: 8.75
  }
];

export const MOCK_OPPORTUNITIES: OpportunityExt[] = [
  { id: 'opp-1', title: { es: 'Mantenimiento Plataforma Alba', en: 'Alba Platform Maintenance', fr: '' }, description: { es: 'Servicios integrales de mantenimiento preventivo y correctivo en la plataforma Alba. Se requiere certificación MMH nivel Elite.', en: '', fr: '' }, category: 'Mantenimiento', budget: 500000, deadline: '2024-12-20', status: 'published', petroleraId: 'u-4', location: 'Offshore Bioko', requirements: ['Certificación Elite', 'Personal 80% Nacional'], image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop', ref: '2023-MMH-045', tag: 'urgente' },
];

export const MOCK_JOBS: JobOffer[] = [
  { id: '1', title: { es: 'Ingeniero de Perforación', en: 'Drilling Engineer', fr: '' }, companyId: 'c-1', location: 'Malabo', tags: ['Offshore', 'Full-time'], postedAt: '2024-11-01', description: { es: 'Buscamos ingeniero con experiencia en operaciones offshore.', en: '', fr: '' }, category: 'Ingeniería' }
];

export const MOCK_SOCIAL_PROJECTS: SocialProjectExt[] = [
  { id: '1', title: { es: 'Electrificación Escolar Annobón', en: 'Annobon School Electrification', fr: '' }, description: { es: 'Instalación de paneles solares en 5 escuelas.', en: '', fr: '' }, impact: '500 Estudiantes', location: 'Annobón', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop', petroleraId: 'u-4', status: 'active', budget: 450000, progress: 65, endDate: '2025-04-15', investor: 'Noble Energy', lat: -1.43, lng: 5.63 },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'm-1', conversationId: 'conv-1', senderId: 'u-1', text: 'Bienvenido al centro de mensajes de MMH.', timestamp: new Date().toISOString(), isRead: true },
  { id: 'm-2', conversationId: 'conv-1', senderId: 'u-5', text: 'Gracias, necesito información sobre mi RUGE ID.', timestamp: new Date().toISOString(), isRead: true },
];

export const MOCK_APPLICATIONS: ApplicationExt[] = [
  { id: 'app-1', opportunityId: 'opp-1', companyId: 'c-1', status: 'under_review', submittedAt: '12 Nov 2024', documents: [], ref: 'APP-2024-001', projectName: 'Mantenimiento Plataforma Alba', step: 2, ministerComment: 'Revisión técnica inicial completada.', actionRequired: false },
  { id: 'app-2', opportunityId: 'opp-1', companyId: 'c-1', status: 'shortlisted', submittedAt: '10 Nov 2024', documents: [], ref: 'APP-2024-002', projectName: 'Gestión Ambiental Bioko', step: 3, actionRequired: true, ministerComment: 'Falta certificado de solvencia actualizado.' }
];

export const MOCK_LEGAL_DOCS = [
  { id: 'ld-1', title: 'Reglamento Contenido Nacional 2014', description: 'Marco jurídico vigente para empresas locales.', year: '2014', languages: ['es', 'en', 'fr'], isPack: false },
  { id: 'ld-2', title: 'Ley de Hidrocarburos de Guinea Ecuatorial', description: 'Ley fundamental que rige el sector de petróleo y gas.', year: '2006', languages: ['es', 'en'], isPack: false },
  { id: 'ld-3', title: 'Manual de Registro Proveedores', description: 'Guía paso a paso para el registro en el portal RUGE.', version: 'v1.2', languages: ['es'], isPack: true }
];

export const MOCK_VIDEOS = [
  { id: 'v-1', thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop', title: 'Tutorial Registro Portal RUGE', duration: '05:30', label: 'Guía', language: 'Español' },
  { id: 'v-2', thumbnail: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1000&auto=format&fit=crop', title: 'Beneficios del Contenido Nacional', duration: '12:15', label: 'Conferencia', language: 'Español' }
];

export const MOCK_EVENTS = [
  { id: 'e-1', month: 'DIC', day: '05', color: 'primary', type: 'Presencial', location: 'Malabo', title: 'Foro Energético 2024', description: 'Encuentro con operadores internacionales.', time: '09:00 AM', venue: 'Sipopo Hotel' },
  { id: 'e-2', month: 'ENE', day: '20', color: 'purple', type: 'Webinar', location: 'Online', title: 'Taller de Compliance MMH', description: 'Sesión sobre normativas de transparencia.', time: '11:00 AM', venue: 'Microsoft Teams' }
];

export const MOCK_NEWS = [
  { id: 'n-1', category: 'RESOLUCIÓN', date: '15 NOV 2024', title: 'Actualización en Cuotas de Suministro Local', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop', excerpt: 'Nuevos requisitos de participación nacional para contratos offshore.' },
  { id: 'n-2', category: 'EVENTO', date: '10 NOV 2024', title: 'Firma de Acuerdo con PetroGuinee', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1200&auto=format&fit=crop', excerpt: 'Fortalecimiento de la capacidad técnica nacional en Luba.' },
  { id: 'n-3', category: 'AVISO', date: '08 NOV 2024', title: 'Lanzamiento del Portal Digital RUGE', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop', excerpt: 'Digitalización completa de los trámites de Contenido Nacional.' }
];

export const MOCK_TRAINING_CENTERS = [
  { id: 'tc-1', lat: 3.75, lng: 8.78, name: 'Centro de Formación Técnica Luba', image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop', location: 'Luba, Bioko Sur', capacity: '100 técnicos', specialties: ['Soldadura', 'HSE', 'Mecánica'] },
  { id: 'tc-2', lat: 1.86, lng: 9.76, name: 'Instituto de Hidrocarburos Bata', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2000&auto=format&fit=crop', location: 'Bata, Litoral', capacity: '250 estudiantes', specialties: ['Geología', 'Drilling', 'Administración'] }
];

export const MOCK_COMPANY_DOCUMENTS: CompanyDocument[] = [
  { id: 'doc-1', name: 'Registro_Mercantil.pdf', category: 'Legal', status: 'approved', uploadDate: '12 Ago 2024', size: '1.2 MB', format: 'PDF' },
  { id: 'doc-2', name: 'Solvencia_Fiscal.pdf', category: 'Financiero', status: 'pending', uploadDate: '10 Nov 2024', size: '0.9 MB', format: 'PDF' },
  { id: 'doc-3', name: 'Certificado_Seguridad_HSE.pdf', category: 'Técnico', status: 'rejected', uploadDate: '05 Oct 2024', size: '2.5 MB', format: 'PDF', feedback: 'Documento no legible.' },
  { id: 'doc-4', name: 'Poliza_Seguro_Civil.pdf', category: 'Seguros', status: 'expired', uploadDate: '01 Ene 2024', size: '3.1 MB', format: 'PDF', expiryDate: '15 Nov 2024' }
];

export const MOCK_AUDIT_LOGS: AuditActivity[] = [
  { id: 'l-1', userId: 'u-1', userName: 'Carlos Mba', userRole: 'Super Admin', action: 'Aprobación de Registro', entityId: 'c-1', timestamp: '15 Nov 2024, 10:30', status: 'success' },
  { id: 'l-2', userId: 'u-2', userName: 'Manuel Nguema', userRole: 'Funcionario', action: 'Validación de Documento', entityId: 'doc-2', timestamp: '15 Nov 2024, 11:15', status: 'pending' },
  { id: 'l-3', userId: 'u-3', userName: 'Sofia Obono', userRole: 'Cuerpo Técnico', action: 'Rechazo de Aplicación', entityId: 'app-2', timestamp: '14 Nov 2024, 09:45', status: 'success' }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'conv-1', participantName: 'Ministerio de Hidrocarburos y Desarrollo Minero', participantRole: 'Departamento Legal', avatar: 'https://flagcdn.com/w80/gq.png', lastMessage: 'Su documentación ha sido verificada.', timestamp: '10:30 AM', unreadCount: 1, isOnline: true },
  { id: 'conv-2', participantName: 'Sofia Obono (Técnico)', participantRole: 'Auditor MMH', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop', lastMessage: 'Revisaremos la planta el próximo lunes.', timestamp: 'Ayer', unreadCount: 0, isOnline: false }
];

export const MOCK_WEB_CATEGORIES_MANAGEMENT = MOCK_WEB_CATEGORIES;
