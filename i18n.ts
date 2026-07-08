
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      common: {
        welcome: "Dirección de Contenido Nacional de Guinea Ecuatorial o DCN-GE",
        tagline: "Soberanía energética y desarrollo industrial para Guinea Ecuatorial",
        home: "INICIO",
        opportunities: "LICITACIONES",
        jobs: "EMPLEO",
        community: "IMPACTO SOCIAL",
        resources: "RECURSOS",
        transparency: "TRANSPARENCIA",
        login: "ACCESO",
        register: "REGISTRO",
        apply: "POSTULAR",
        details: "DETALLES",
        save: "GUARDAR",
        cancel: "CANCELAR",
        contact: "CONTACTO",
        restricted: "Área Restringida",
        loginToSeeMore: "Debe iniciar sesión para ver los pliegos técnicos y requisitos de contenido nacional.",
        minister_name: "Excmo. Sr. Antonio Oburu Ondo",
        minister_role: "Ministro de Hidrocarburos, Minas y Electricidad",
        minister_title: "DISCURSO INSTITUCIONAL",
        logout: "Cerrar Sesión",
        stats: {
          companies: "Empresas Certificadas",
          contracts: "Contratos Adjudicados",
          active_opps: "Licitaciones Activas",
          value: "Valor Retenido"
        }
      },
      hero: {
        description: "Impulsando el crecimiento económico sostenible a través del fortalecimiento de las capacidades nacionales y la transparencia en el sector de hidrocarburos."
      },
      home: {
        minister_quote: "El Contenido Nacional no es solo una obligación legal, es el pilar sobre el cual construiremos la Guinea Ecuatorial del futuro, donde cada barril extraído se traduzca en conocimiento y bienestar para nuestro pueblo.",
        functions_title: "NUESTRAS CAPACIDADES",
        strategic_entities: "ENTIDADES ESTRATÉGICAS",
        operators_title: "OPERADORAS INTERNACIONALES",
        operators_desc: "SOCIOS EN EL DESARROLLO"
      },
      nav: {
        home: "Inicio",
        institution: "Institución",
        certification: "Certificación",
        opportunities: "Oportunidades",
        transparency: "Transparencia",
        about: "Sobre el Ministerio",
        vision: "Visión 2035",
        directory: "Directorio de Empresas",
        requirements: "Requisitos de Ley",
        tenders: "Licitaciones",
        job_board: "Bolsa de Empleo",
        legal: "Marco Legal",
        news: "Noticias/Gaceta",
        social_impact: "Impacto Social",
        audit: "Auditoría"
      },
      roles: {
        super_admin: "Admin Central",
        funcionario: "Personal MMH",
        cuerpo_tecnico: "Cuerpo Técnico",
        petrolera: "Operadora Petrolera",
        company: "Empresa de Servicios",
        empresa_local: "Empresa Local",
        persona: "Talento Nacional",
        comunicacion: "Prensa y Gaceta",
        comunidad: "Desarrollo Social",
        advertiser: "Anunciante"
      },
      dashboard: {
        overview: "Panel General",
        users: "Usuarios",
        companies: "Empresas",
        tenders: "Licitaciones",
        documents: "Documentos",
        social: "Impacto Social",
        legal: "Asuntos Legales",
        reports: "Reportes",
        settings: "Configuración",
        my_profile: "Mi Perfil",
        certification: "Certificación MMH",
        my_apps: "Mis Aplicaciones",
        job_offers: "Ofertas de Empleo",
        candidates: "Candidatos",
        messages: "Mensajería",
        training: "Formación",
        retention: "Retención de Valor",
        notifications: "Notificaciones",
        message_center: "Centro de Mensajes",
        news_management: "Gestión de Noticias",
        public_portal: "Portal Público",
        community_works: "Comunidad y Obras",
        local_companies: "Empresas Locales",
        contracts: "Contratos",
        lex_advisor: "LEX IA Advisor",
        company_files: "Expedientes Empresa",
        field_alerts: "Alertas Campo",
        inspections: "Inspecciones",
        technical_reports: "Reportes Técnicos",
        regulatory_support: "Soporte Normativo",
        news_editor: "Redactor de Noticias",
        web_portal: "Portal Web",
        press_messages: "Mensajería Prensa",
        social_impact: "Impacto Social",
        citizen_feedback: "Feedback Ciudadano",
        my_tenders: "Mis Licitaciones",
        csr_projects: "Proyectos RSC",
        lex_legal: "Legal LEX IA",
        portal_news: "Noticias del Portal",
        my_company_profile: "Mi Perfil Empresa",
        document_management: "Gestión Documental",
        my_applications: "Mis Aplicaciones",
        my_contracts: "Mis Contratos",
        my_sme_profile: "Mi Perfil PYME",
        local_support: "Soporte Local",
        my_digital_cv: "Mi CV Digital",
        job_board: "Bolsa de Empleo",
        certifications: "Certificaciones",
        institutional_management: "Gestión Institucional",
        campaigns: "Campañas Publicitarias",
        billing: "Facturación y Pagos",
        analytics: "Analíticas",
        stats: {
          total_users: "Usuarios Totales",
          validated_cos: "Empresas Validadas",
          pending_files: "Archivos Pendientes",
          active_tenders: "Licitaciones Activas"
        }
      },
      lex: {
        welcome: "Bienvenido a LEX Intelligence",
        placeholder: "Escriba su consulta jurídica...",
        disclaimer: "Información sujeta a revisión ministerial."
      },
      chat: {
        online: "En línea",
        offline: "Desconectado",
        typeMessage: "Escribe un mensaje..."
      },
      auth: {
        step1: "Datos de Empresa",
        step2: "Carga de Documentos",
        step3: "Sectores de Actividad",
        complete: "Finalizar Registro"
      }
    }
  },
  en: {
    translation: {
      common: {
        welcome: "Dirección de Contenido Nacional de Guinea Ecuatorial o DCN-GE",
        tagline: "Energy sovereignty and industrial development for Equatorial Guinea",
        home: "HOME",
        opportunities: "TENDERS",
        jobs: "JOBS",
        community: "SOCIAL IMPACT",
        resources: "RESOURCES",
        transparency: "TRANSPARENCY",
        login: "LOGIN",
        register: "REGISTER",
        apply: "APPLY",
        details: "DETAILS",
        save: "SAVE",
        cancel: "CANCEL",
        contact: "CONTACT",
        restricted: "Restricted Area",
        loginToSeeMore: "You must login to see technical specifications and national content requirements.",
        minister_name: "H.E. Antonio Oburu Ondo",
        minister_role: "Minister of Hydrocarbons, Mines and Electricity",
        minister_title: "INSTITUTIONAL SPEECH",
        logout: "Logout",
        stats: {
          companies: "Certified Companies",
          contracts: "Awarded Contracts",
          active_opps: "Active Tenders",
          value: "Retained Value"
        }
      },
      hero: {
        description: "Driving sustainable economic growth through the strengthening of national capacities and transparency in the hydrocarbon sector."
      },
      home: {
        minister_quote: "National Content is not just a legal obligation, it is the pillar upon which we will build the Equatorial Guinea of the future, where every barrel extracted translates into knowledge and well-being for our people.",
        functions_title: "OUR CAPABILITIES",
        strategic_entities: "STRATEGIC ENTITIES",
        operators_title: "INTERNATIONAL OPERATORS",
        operators_desc: "PARTNERS IN DEVELOPMENT"
      },
      nav: {
        home: "Home",
        institution: "Institution",
        certification: "Certification",
        opportunities: "Opportunities",
        transparency: "Transparency",
        about: "About the Ministry",
        vision: "Vision 2035",
        directory: "Company Directory",
        requirements: "Legal Requirements",
        tenders: "Tenders",
        job_board: "Job Board",
        legal: "Legal Framework",
        news: "News/Gazette",
        social_impact: "Social Impact",
        audit: "Audit"
      },
      roles: {
        super_admin: "Central Admin",
        funcionario: "MMH Staff",
        cuerpo_tecnico: "Technical Body",
        petrolera: "Oil Operator",
        company: "Service Company",
        empresa_local: "Local Company",
        persona: "National Talent",
        comunicacion: "Press & Gazette",
        comunidad: "Social Development",
        advertiser: "Advertiser"
      },
      dashboard: {
        overview: "Overview",
        users: "Users",
        companies: "Companies",
        tenders: "Tenders",
        documents: "Documents",
        social: "Social Impact",
        legal: "Legal Affairs",
        reports: "Reports",
        settings: "Settings",
        my_profile: "My Profile",
        certification: "MMH Certification",
        my_apps: "My Applications",
        job_offers: "Job Offers",
        candidates: "Candidates",
        messages: "Messages",
        training: "Training",
        retention: "Value Retention",
        notifications: "Notifications",
        message_center: "Message Center",
        news_management: "News Management",
        public_portal: "Public Portal",
        community_works: "Community & Works",
        local_companies: "Local Companies",
        contracts: "Contracts",
        lex_advisor: "LEX AI Advisor",
        company_files: "Company Files",
        field_alerts: "Field Alerts",
        inspections: "Inspections",
        technical_reports: "Technical Reports",
        regulatory_support: "Regulatory Support",
        news_editor: "News Editor",
        web_portal: "Web Portal",
        press_messages: "Press Messages",
        social_impact: "Social Impact",
        citizen_feedback: "Citizen Feedback",
        my_tenders: "My Tenders",
        csr_projects: "CSR Projects",
        lex_legal: "Legal LEX AI",
        portal_news: "Portal News",
        my_company_profile: "My Company Profile",
        document_management: "Document Management",
        my_applications: "My Applications",
        my_contracts: "My Contracts",
        my_sme_profile: "My SME Profile",
        local_support: "Local Support",
        my_digital_cv: "My Digital CV",
        job_board: "Job Board",
        certifications: "Certifications",
        institutional_management: "Institutional Management",
        campaigns: "Ad Campaigns",
        billing: "Billing & Payments",
        analytics: "Analytics",
        stats: {
          total_users: "Total Users",
          validated_cos: "Validated Companies",
          pending_files: "Pending Files",
          active_tenders: "Active Tenders"
        }
      },
      lex: {
        welcome: "Welcome to LEX Intelligence",
        placeholder: "Write your legal query...",
        disclaimer: "Information subject to ministerial review."
      },
      chat: {
        online: "Online",
        offline: "Offline",
        typeMessage: "Type a message..."
      },
      auth: {
        step1: "Company Details",
        step2: "Document Upload",
        step3: "Business Sectors",
        complete: "Complete Registration"
      }
    }
  },
  fr: {
    translation: {
      common: {
        welcome: "Dirección de Contenido Nacional de Guinea Ecuatorial o DCN-GE",
        tagline: "Souveraineté énergétique et développement industriel pour la Guinée Équatoriale",
        home: "ACCUEIL",
        opportunities: "APPELS D'OFFRES",
        jobs: "EMPLOI",
        community: "IMPACT SOCIAL",
        resources: "RESSOURCES",
        transparency: "TRANSPARENCE",
        login: "CONNEXION",
        register: "S'INSCRIRE",
        apply: "POSTULER",
        details: "DÉTAILS",
        save: "ENREGISTRER",
        cancel: "ANNULER",
        contact: "CONTACT",
        restricted: "Zone Restreinte",
        loginToSeeMore: "Vous devez vous connecter pour voir les spécifications techniques et les exigences de contenu national.",
        minister_name: "S.E. Antonio Oburu Ondo",
        minister_role: "Ministre des Hydrocarbures, des Mines et de l'Électricité",
        minister_title: "DISCOURS INSTITUTIONNEL",
        logout: "Déconnexion",
        stats: {
          companies: "Entreprises Certifiées",
          contracts: "Contrats Attribués",
          active_opps: "Appels d'Offres Actifs",
          value: "Valeur Retenue"
        }
      },
      hero: {
        description: "Stimuler la croissance économique durable en renforçant les capacités nationales et la transparence dans le secteur des hydrocarbures."
      },
      home: {
        minister_quote: "Le Contenu National n'est pas seulement une obligation légale, c'est le pilier sur lequel nous construirons la Guinée Équatoriale de demain, où chaque baril extrait se traduira par des connaissances et du bien-être pour notre peuple.",
        functions_title: "NOS CAPACITÉS",
        strategic_entities: "ENTITÉS STRATÉGIQUES",
        operators_title: "OPÉRATEURS INTERNATIONAUX",
        operators_desc: "PARTENAIRES DE DÉVELOPPEMENT"
      },
      nav: {
        home: "Accueil",
        institution: "Institution",
        certification: "Certification",
        opportunities: "Opportunités",
        transparency: "Transparence",
        about: "À propos du Ministère",
        vision: "Vision 2035",
        directory: "Annuaire des Entreprises",
        requirements: "Exigences Légales",
        tenders: "Appels d'Offres",
        job_board: "Offres d'Emploi",
        legal: "Cadre Légal",
        news: "Actualités/Journal",
        social_impact: "Impact Social",
        audit: "Audit"
      },
      roles: {
        super_admin: "Admin Central",
        funcionario: "Personnel MMH",
        cuerpo_tecnico: "Corps Technique",
        petrolera: "Opérateur Pétrolier",
        company: "Entreprise de Services",
        empresa_local: "Entreprise Locale",
        persona: "Talent National",
        comunicacion: "Presse et Journal",
        comunidad: "Développement Social",
        advertiser: "Annonceur"
      },
      dashboard: {
        overview: "Aperçu",
        users: "Utilisateurs",
        companies: "Entreprises",
        tenders: "Appels d'Offres",
        documents: "Documents",
        social: "Impact Social",
        legal: "Affaires Juridiques",
        reports: "Rapports",
        settings: "Paramètres",
        my_profile: "Mon Profil",
        certification: "Certification MMH",
        my_apps: "Mes Candidatures",
        job_offers: "Offres d'Emploi",
        candidates: "Candidats",
        messages: "Messages",
        training: "Formation",
        retention: "Rétention de Valeur",
        notifications: "Notifications",
        message_center: "Centre de Messages",
        news_management: "Gestion des Actualités",
        public_portal: "Portail Public",
        community_works: "Communauté et Travaux",
        local_companies: "Entreprises Locales",
        contracts: "Contrats",
        lex_advisor: "Conseiller LEX IA",
        company_files: "Dossiers d'Entreprise",
        field_alerts: "Alertes Terrain",
        inspections: "Inspections",
        technical_reports: "Rapports Techniques",
        regulatory_support: "Support Réglementaire",
        news_editor: "Éditeur d'Actualités",
        web_portal: "Portail Web",
        press_messages: "Messages Presse",
        social_impact: "Impact Social",
        citizen_feedback: "Commentaires Citoyens",
        my_tenders: "Mes Appels d'Offres",
        csr_projects: "Projets RSE",
        lex_legal: "Légal LEX IA",
        portal_news: "Actualités du Portail",
        my_company_profile: "Mon Profil d'Entreprise",
        document_management: "Gestion Documentaire",
        my_applications: "Mes Candidatures",
        my_contracts: "Mes Contrats",
        my_sme_profile: "Mon Profil PME",
        local_support: "Support Local",
        my_digital_cv: "Mon CV Numérique",
        job_board: "Offres d'Emploi",
        certifications: "Certifications",
        institutional_management: "Gestion Institutionnelle",
        campaigns: "Campagnes Publicitaires",
        billing: "Facturation et Paiements",
        analytics: "Analytique",
        stats: {
          total_users: "Utilisateurs Totaux",
          validated_cos: "Entreprises Validées",
          pending_files: "Dossiers en Attente",
          active_tenders: "Appels d'Offres Actifs"
        }
      },
      lex: {
        welcome: "Bienvenue sur LEX Intelligence",
        placeholder: "Rédigez votre requête juridique...",
        disclaimer: "Informations sujettes à révision ministérielle."
      },
      chat: {
        online: "En ligne",
        offline: "Hors ligne",
        typeMessage: "Tapez un message..."
      },
      auth: {
        step1: "Détails de l'Entreprise",
        step2: "Téléchargement de Documents",
        step3: "Secteurs d'Activité",
        complete: "Terminer l'Inscription"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false }
});

export default i18n;
