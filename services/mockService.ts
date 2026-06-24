
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
    title: { es: 'GEPetrol asume oficialmente la operación del Bloque B (Zafiro) en Guinea Ecuatorial', en: 'GEPetrol officially assumes operations of Block B (Zafiro) in Equatorial Guinea', fr: 'GEPetrol prend officiellement en charge l\'exploitation du Bloc B (Zafiro) en Guinée Équatoriale' },
    summary: { es: 'La empresa nacional de petróleo toma el control operativo del yacimiento Zafiro tras el vencimiento de la concesión previa, marcando un hito en la soberanía hidrocarburífera.', en: 'The national oil company takes operational control of the Zafiro field following the expiration of the previous concession, marking a milestone in hydrocarbon sovereignty.', fr: 'La compagnie pétrolière nationale prend le contrôle opérationnel du gisement Zafiro après l\'expiration de la concession précédente, marquant un jalon dans la souveraineté sur les hydrocarbures.' },
    content: { 
      es: '<p>El Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial ha anunciado que la Compañía Nacional de Petróleos (GEPetrol) ha asumido oficialmente el control operativo del Bloque B (Zafiro) tras el vencimiento de la anterior licencia de explotación.</p><p>Este histórico traspaso de operaciones representa un gran paso adelante para la soberanía energética del país, permitiendo que ingenieros y técnicos ecuatoguineanos lideren la producción en uno de los yacimientos más importantes del golfo de Guinea. El Gobierno ha garantizado una transición ordenada para asegurar la continuidad de la producción y mantener los más altos estándares de seguridad.</p>', 
      en: '<p>The Ministry of Hydrocarbons, Mines and Electricity of Equatorial Guinea has announced that the National Oil Company (GEPetrol) has officially assumed operational control of Block B (Zafiro) after the expiration of the previous operating license.</p><p>This historic handover of operations represents a great step forward for the country\'s energy sovereignty, allowing Equatoguinean engineers and technicians to lead production in one of the most important fields in the Gulf of Guinea. The Government has guaranteed an orderly transition to ensure the continuity of production and maintain the highest safety standards.</p>', 
      fr: '<p>Le ministère des Hydrocarbures, des Mines et de l\'Électricité de Guinée équatoriale a annoncé que la Société nationale des pétroles (GEPetrol) a officiellement pris le contrôle opérationnel du bloc B (Zafiro) après l\'expiration de la précédente licence d\'exploitation.</p><p>Ce transfert historique d\'opérations représente un grand pas en avant pour la souveraineté énergétique du pays, permettant aux ingénieurs et techniciens équatoguinéens de diriger la production dans l\'un des gisements les plus importants du golfe de Guinée. Le gouvernement a garanti une transition ordonnée pour assurer la continuité de la production et maintenir les normes de sécurité les plus élevées.</p>' 
    },
    category: 'Operaciones',
    status: 'published',
    author: 'María Nchama',
    publish_date: '2024-11-20T12:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop',
    attachments: [{ id: 'att-1', name: 'Traspaso_Operaciones_Zafiro.pdf', size: '1.8 MB', format: 'PDF' }]
  },
  {
    id: 'art-2',
    title: { es: 'Guinea Ecuatorial y Camerún firman histórico acuerdo para el desarrollo del gas transfronterizo', en: 'Equatorial Guinea and Cameroon sign historic treaty for cross-border gas development', fr: 'La Guinée Équatoriale et le Cameroun signent un traité historique pour le développement du gaz transfrontalier' },
    summary: { es: 'El acuerdo habilita el procesamiento conjunto de recursos de gas natural de los yacimientos Yoyo (Camerún) y Yolanda (Guinea Ecuatorial), impulsando la industrialización de la subregión.', en: 'The agreement enables joint processing of natural gas resources from the Yoyo (Cameroon) and Yolanda (Equatorial Guinea) fields, boosting industrialization in the sub-region.', fr: 'L\'accord permet le traitement conjoint des ressources en gaz naturel des gisements de Yoyo (Cameroun) et Yolanda (Guinée équatoriale), stimulant l\'industrialisation dans la sous-région.' },
    content: {
      es: '<p>Los gobiernos de Guinea Ecuatorial y Camerún han firmado un tratado de unificación transfronterizo que permitirá desarrollar conjuntamente los yacimientos de gas natural de Yoyo y Yolanda, situados en la frontera marítima común.</p><p>Este acuerdo estratégico establece el marco para procesar el gas camerunés en el Complejo de Gas de Punta Europa en Malabo, optimizando la infraestructura existente y creando nuevas oportunidades de empleo y desarrollo industrial para ambas naciones centroafricanas. El Ministro de Hidrocarburos destacó la firma como un ejemplo supremo de cooperación energética regional en África Central.</p>',
      en: '<p>The governments of Equatorial Guinea and Cameroon have signed a cross-border unification treaty that will allow the joint development of the Yoyo and Yolanda natural gas fields, located on the common maritime border.</p><p>This strategic agreement establishes the framework for processing Cameroonian gas at the Punta Europa Gas Complex in Malabo, optimizing existing infrastructure and creating new jobs and industrial development opportunities for both Central African nations. The Minister of Hydrocarbons highlighted the signing as a supreme example of regional energy cooperation in Central Africa.</p>',
      fr: '<p>Les gouvernements de la Guinée équatoriale et du Cameroun ont signé un traité d\'unification transfrontalier qui permettra le développement conjoint des gisements de gaz naturel de Yoyo et Yolanda, situés sur la frontière maritime commune.</p><p>Cet accord stratégique établit le cadre de traitement du gaz camerounais au complexe gazier de Punta Europa à Malabo, optimisant les infrastructures existantes et créant de nouveaux emplois et opportunités de développement industriel pour les deux nations d\'Afrique centrale. Le ministre des Hydrocarbures a souligné la signature comme un exemple suprême de coopération énergétique régionale en Afrique centrale.</p>'
    },
    category: 'Regulación',
    status: 'published',
    author: 'Juan Ndong',
    publish_date: '2024-11-18T09:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
    attachments: [{ id: 'att-2', name: 'Tratado_Gas_EG_Camerun.pdf', size: '3.1 MB', format: 'PDF' }]
  },
  {
    id: 'art-3',
    title: { es: 'Africa Oil Corp firma contratos de participación en producción para los bloques EG-18 y EG-31', en: 'Africa Oil Corp signs production sharing contracts for blocks EG-18 and EG-31', fr: 'Africa Oil Corp signe des contrats de partage de production pour les blocs EG-18 et EG-31' },
    summary: { es: 'La compañía canadiense se une formalmente al sector exploratorio de Guinea Ecuatorial para perforar nuevas estructuras geológicas altamente prospectivas en la cuenca de Río Muni.', en: 'The Canadian company formally joins Equatorial Guinea\'s exploratory sector to drill new highly prospective geological structures in the Rio Muni basin.', fr: 'La compagnie canadienne rejoint formellement le secteur d\'exploration de la Guinée équatoriale pour forer de nouvelles structures géologiques très prometteuses dans le bassin de Rio Muni.' },
    content: {
      es: '<p>La firma canadiense Africa Oil Corp ha formalizado la firma de Contratos de Participación en la Producción (PSC) con el Ministerio de Hidrocarburos para los bloques de exploración offshore EG-18 y EG-31.</p><p>La fase inicial de exploración incluirá la adquisición de datos sísmicos tridimensionales avanzados y estudios ambientales exhaustivos para definir los objetivos de perforación. El acuerdo incluye compromisos de transferencia de tecnología y capacitación obligatoria para profesionales nacionales, alineado con las directrices de Contenido Nacional de la plataforma RUGE.</p>',
      en: '<p>The Canadian firm Africa Oil Corp has formalized the signing of Production Sharing Contracts (PSCs) with the Ministry of Hydrocarbons for offshore exploration blocks EG-18 and EG-31.</p><p>The initial exploration phase will include the acquisition of advanced three-dimensional seismic data and comprehensive environmental studies to define drilling targets. The agreement includes commitments for technology transfer and mandatory training for national professionals, aligned with the National Content guidelines of the RUGE platform.</p>',
      fr: '<p>La firme canadienne Africa Oil Corp a formalisé la signature de contrats de partage de production (PSC) avec le ministère des Hydrocarbures pour les blocs d\'exploration offshore EG-18 et EG-31.</p><p>La phase initiale d\'exploration comprendra l\'acquisition de données sismiques tridimensionnelles avancées et des études environnementales complètes pour définir les cibles de forage. L\'accord comprend des engagements de transfert de technologie et de formation obligatoire pour les professionnels nationaux, conformément aux directives de contenu national de la plateforme RUGE.</p>'
    },
    category: 'Inversiones',
    status: 'published',
    author: 'Elena Mbasogo',
    publish_date: '2024-11-10T14:30:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1535730143503-a26507397bb6?q=80&w=2070&auto=format&fit=crop',
    attachments: []
  },
  {
    id: 'art-4',
    title: { es: 'El Ministerio lanza el Portal Digital RUGE para agilizar trámites de Contenido Nacional', en: 'Ministry launches RUGE Digital Portal to streamline National Content procedures', fr: 'Le Ministère lance le portail numérique RUGE pour simplifier les démarches de contenu national' },
    summary: { es: 'La nueva plataforma automatiza los registros, auditorías e inspecciones, permitiendo a las empresas locales certificar su cumplimiento MMH de manera 100% digital.', en: 'The new platform automates registrations, audits and inspections, allowing local companies to certify their MMH compliance 100% digitally.', fr: 'La nouvelle plateforme automatise les enregistrements, les audits et les inspections, permettant aux entreprises locales de certifier leur conformité MMH de manière 100% numérique.' },
    content: {
      es: '<p>El Ministerio de Hidrocarburos, Minas y Electricidad ha presentado oficialmente el nuevo Portal Digital RUGE, una herramienta clave para la modernización administrativa y la retención del valor local.</p><p>A través de esta plataforma digital, las empresas nacionales y extranjeras del sector de hidrocarburos podrán gestionar de manera ágil sus registros de proveedores, auditorías de cumplimiento laboral y solicitudes de certificación. Esto eliminará la burocracia en papel y promoverá una mayor transparencia en los procesos de licitación en toda la República de Guinea Ecuatorial.</p>',
      en: '<p>The Ministry of Hydrocarbons, Mines and Electricity has officially presented the new RUGE Digital Portal, a key tool for administrative modernization and local value retention.</p><p>Through this digital platform, national and foreign companies in the hydrocarbon sector will be able to efficiently manage their supplier registries, labor compliance audits and certification requests. This will eliminate paper bureaucracy and promote greater transparency in bidding processes throughout the Republic of Equatorial Guinea.</p>',
      fr: '<p>Le ministère des Hydrocarbures, des Mines et de l\'Électricité a officiellement présenté le nouveau portail numérique RUGE, un outil clé pour la modernisation administrative et la rétention de la valeur locale.</p><p>Grâce à cette plateforme numérique, les entreprises nationales et étrangères des secteurs des hydrocarbures pourront gérer efficacement leurs registres de fournisseurs, audits de conformité du travail et demandes de certification. Cela éliminera la bureaucratie papier et favorisera une plus grande transparence dans les processus d\'appel d\'offres dans toute la République de Guinée équatoriale.</p>'
    },
    category: 'Contenido Nacional',
    status: 'published',
    author: 'Administrador',
    publish_date: '2024-11-08T08:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1513828583815-c4550fa574bf?q=80&w=2070&auto=format&fit=crop',
    attachments: [{ id: 'att-4', name: 'Manual_Usuario_Portal_RUGE.pdf', size: '4.5 MB', format: 'PDF' }]
  }
];

export const MOCK_NEWS_DRAFTS: Partial<NewsArticle>[] = [
  { id: 'd-1', title: { es: 'Reunión bilateral con delegación de Nigeria sobre gasoductos', en: '', fr: '' }, status: 'draft', publish_date: new Date().toISOString() },
  { id: 'd-2', title: { es: 'Informe trimestral de producción 2023', en: '', fr: '' }, status: 'pending', publish_date: new Date().toISOString() },
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
  { id: 'art-1', category: 'OPERACIONES', date: '20 NOV 2024', title: 'GEPetrol asume la operación de Zafiro', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1200&auto=format&fit=crop', excerpt: 'La compañía nacional asume oficialmente el control operacional del Bloque B tras finalizar la concesión previa.' },
  { id: 'art-2', category: 'REGULACIÓN', date: '18 NOV 2024', title: 'Histórico acuerdo de gas con Camerún', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop', excerpt: 'Firma de tratado transfronterizo para unificar los yacimientos de gas natural de Yoyo y Yolanda.' },
  { id: 'art-4', category: 'AVISO', date: '08 NOV 2024', title: 'Lanzamiento del Portal Digital RUGE', image: 'https://images.unsplash.com/photo-1513828583815-c4550fa574bf?q=80&w=1200&auto=format&fit=crop', excerpt: 'El Ministerio presenta la nueva plataforma web para simplificar los trámites de Contenido Nacional.' }
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
  { id: 'conv-1', participantName: 'Ministerio de Hidrocarburos, Minas y Electricidad', participantRole: 'Departamento Legal', avatar: 'https://flagcdn.com/w80/gq.png', lastMessage: 'Su documentación ha sido verificada.', timestamp: '10:30 AM', unreadCount: 1, isOnline: true },
  { id: 'conv-2', participantName: 'Sofia Obono (Técnico)', participantRole: 'Auditor MMH', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop', lastMessage: 'Revisaremos la planta el próximo lunes.', timestamp: 'Ayer', unreadCount: 0, isOnline: false }
];

export const MOCK_WEB_CATEGORIES_MANAGEMENT = MOCK_WEB_CATEGORIES;
