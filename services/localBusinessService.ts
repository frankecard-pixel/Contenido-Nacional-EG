import { supabase } from './supabaseClient';
import { 
  Company, 
  User, 
  ServiceCatalogItem, 
  CompanyService, 
  CompanyProjectReference, 
  OpportunityShortlist, 
  LocalCompanyMatchResult, 
  OpportunityExt,
  UserRole
} from '../types';
import { logAuditEvent } from './auditService';
import { recordWorkflowTransition } from './workflowService';
import { sendNotification } from './notificationService';

// Fallback in-memory state for initial seeding and offline testing
let MEMORY_SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    id: 'sc-1',
    code: 'SERV-ENG-01',
    category: 'Ingeniería',
    name: 'Ingeniería Civil y Estructural Offshore/Onshore',
    description: 'Cálculo de estructuras, cimentaciones y plataformas.',
    requires_certification: true,
    standard_requirements: ['Registro en Colegio Profesional', 'Software certificado', 'Experiencia mínima 3 años'],
    is_active: true
  },
  {
    id: 'sc-2',
    code: 'SERV-MANT-01',
    category: 'Mantenimiento',
    name: 'Mantenimiento Mecánico y Rotativo',
    description: 'Reparación y mantenimiento de bombas, compresores y turbinas.',
    requires_certification: true,
    standard_requirements: ['Técnicos certificados', 'Taller propio en GE', 'Procedimientos HSE'],
    is_active: true
  },
  {
    id: 'sc-3',
    code: 'SERV-MANT-02',
    category: 'Mantenimiento',
    name: 'Instrumentación y Control de Procesos',
    description: 'Calibración, PLC, sistemas SCADA y válvulas de control.',
    requires_certification: true,
    standard_requirements: ['Certificación de calibración', 'Laboratorio de pruebas'],
    is_active: true
  },
  {
    id: 'sc-4',
    code: 'SERV-LOG-01',
    category: 'Logística',
    name: 'Transporte Terrestre y Flota Pesada',
    description: 'Transporte de tuberías, maquinaria pesada y contenedores.',
    requires_certification: false,
    standard_requirements: ['Flota asegurada', 'ITV al día', 'Conductores profesionales'],
    is_active: true
  },
  {
    id: 'sc-5',
    code: 'SERV-LOG-02',
    category: 'Logística',
    name: 'Soporte Portuario y Gestión de Almacén',
    description: 'Carga, descarga, estiba y almacenamiento portuario.',
    requires_certification: true,
    standard_requirements: ['Licencia portuaria', 'Equipamiento de estiba homologado'],
    is_active: true
  },
  {
    id: 'sc-6',
    code: 'SERV-HSE-01',
    category: 'Seguridad y Medio Ambiente',
    name: 'Gestión y Tratamiento de Residuos Industriales',
    description: 'Recolección, tratamiento y disposición ecológica de lodos y aceites.',
    requires_certification: true,
    standard_requirements: ['Autorización ambiental MMH', 'Puntos de vertido autorizados'],
    is_active: true
  },
  {
    id: 'sc-7',
    code: 'SERV-CAT-01',
    category: 'Alimentación y Campamentos',
    name: 'Catering y Hospedaje en Plataformas y Campamentos',
    description: 'Alimentación diaria, avituallamiento y hotelería industrial.',
    requires_certification: true,
    standard_requirements: ['Manipulador de Alimentos', 'Inspección sanitaria vigente'],
    is_active: true
  },
  {
    id: 'sc-8',
    code: 'SERV-CONST-01',
    category: 'Construcción',
    name: 'Soldadura Homologada y Caldelería 6G',
    description: 'Unión de tuberías de alta presión y estructuras marítimas.',
    requires_certification: true,
    standard_requirements: ['Soldadores certificados 6G/AWS', 'Ensayos no destructivos (NDT)'],
    is_active: true
  }
];

let MEMORY_COMPANY_SERVICES: CompanyService[] = [
  {
    id: 'cs-1',
    company_id: 'comp-1',
    service_name: 'Transporte Terrestre y Flota Pesada',
    category: 'Logística',
    experience_years: 7,
    technical_description: 'Flota propia de 14 camiones trailer con rastreo satelital.',
    certifications: ['ITV Industrial', 'Seguro de Carga Marítima'],
    verification_status: 'verificado'
  },
  {
    id: 'cs-2',
    company_id: 'comp-1',
    service_name: 'Mantenimiento Mecánico y Rotativo',
    category: 'Mantenimiento',
    experience_years: 5,
    technical_description: 'Taller central en Malabo II para revisión de motores diésel e hidráulicos.',
    certifications: ['ISO 9001', 'HSE Nivel 2'],
    verification_status: 'verificado'
  },
  {
    id: 'cs-3',
    company_id: 'comp-noble',
    service_name: 'Ingeniería Civil y Estructural Offshore/Onshore',
    category: 'Ingeniería',
    experience_years: 12,
    technical_description: 'Diseño estructural y soporte para tuberías submarinas.',
    certifications: ['API Spec Q1', 'ISO 14001'],
    verification_status: 'verificado'
  }
];

let MEMORY_SHORTLISTS: OpportunityShortlist[] = [];
let MEMORY_PROJECT_REFERENCES: CompanyProjectReference[] = [];

// ========================================================================================
// 1. CATÁLOGO ESTRUCTURADO DE SERVICIOS (Ministerio)
// ========================================================================================

export const getServiceCatalog = async (): Promise<ServiceCatalogItem[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('service_catalog')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as ServiceCatalogItem[];
      }
    } catch (e) {
      console.warn('Error reading service_catalog from Supabase, using memory fallback:', e);
    }
  }
  return MEMORY_SERVICE_CATALOG;
};

export const createServiceCatalogItem = async (
  item: Omit<ServiceCatalogItem, 'id' | 'created_at'>,
  user: User
): Promise<ServiceCatalogItem> => {
  const newItem: ServiceCatalogItem = {
    id: `sc-${Date.now()}`,
    ...item,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('service_catalog')
        .insert([newItem])
        .select()
        .single();

      if (!error && data) {
        await logAuditEvent({
          user,
          action: 'CREATE',
          module: 'CatalogoServicios',
          entityId: data.id,
          details: `Creación de servicio en catálogo: ${data.name} (${data.code})`
        });
        return data as ServiceCatalogItem;
      }
    } catch (e) {
      console.warn('Could not insert in service_catalog, saving to memory fallback:', e);
    }
  }

  MEMORY_SERVICE_CATALOG.push(newItem);
  await logAuditEvent({
    user,
    action: 'CREATE',
    module: 'CatalogoServicios',
    entityId: newItem.id,
    details: `Creación en memoria de servicio: ${newItem.name}`
  });
  return newItem;
};

// ========================================================================================
// 2. CAPACIDADES Y SERVICIOS DE LA EMPRESA (Company Services)
// ========================================================================================

export const getCompanyServices = async (companyId: string): Promise<CompanyService[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('company_services')
        .select('*')
        .eq('company_id', companyId);

      if (!error && data && data.length > 0) {
        return data as CompanyService[];
      }
    } catch (e) {
      console.warn('Error fetching company_services from DB:', e);
    }
  }
  return MEMORY_COMPANY_SERVICES.filter(cs => cs.company_id === companyId);
};

export const registerCompanyService = async (
  serviceData: Omit<CompanyService, 'id' | 'created_at' | 'verification_status'>,
  user: User
): Promise<CompanyService> => {
  const newService: CompanyService = {
    id: `cs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...serviceData,
    verification_status: 'declarado',
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('company_services')
        .insert([newService])
        .select()
        .single();

      if (!error && data) {
        await logAuditEvent({
          user,
          action: 'CREATE',
          module: 'EmpresasLocales',
          entityId: data.id,
          details: `Registro de capacidad/servicio '${data.service_name}' para empresa ${data.company_id}`
        });
        return data as CompanyService;
      }
    } catch (e) {
      console.warn('Error registering company_service in DB, fallback to memory:', e);
    }
  }

  MEMORY_COMPANY_SERVICES.push(newService);
  await logAuditEvent({
    user,
    action: 'CREATE',
    module: 'EmpresasLocales',
    entityId: newService.id,
    details: `Registro de servicio: ${newService.service_name}`
  });
  return newService;
};

export const verifyCompanyService = async (
  serviceId: string,
  verificationStatus: 'verificado' | 'rechazado' | 'en_revision',
  user: User
): Promise<boolean> => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('company_services')
        .update({
          verification_status: verificationStatus,
          verified_by: user.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (!error) {
        await logAuditEvent({
          user,
          action: 'STATUS_CHANGE',
          module: 'EmpresasLocales',
          entityId: serviceId,
          details: `Validación de servicio a estado: ${verificationStatus}`
        });
        return true;
      }
    } catch (e) {
      console.warn('Error updating company service verification:', e);
    }
  }

  const idx = MEMORY_COMPANY_SERVICES.findIndex(s => s.id === serviceId);
  if (idx !== -1) {
    MEMORY_COMPANY_SERVICES[idx].verification_status = verificationStatus;
    MEMORY_COMPANY_SERVICES[idx].verified_by = user.id;
    MEMORY_COMPANY_SERVICES[idx].verified_at = new Date().toISOString();
    return true;
  }
  return false;
};

// ========================================================================================
// 3. REFERENCIAS DE PROYECTOS Y EXPERIENCIA EMPRESARIAL
// ========================================================================================

export const getCompanyProjectReferences = async (companyId: string): Promise<CompanyProjectReference[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('company_project_references')
        .select('*')
        .eq('company_id', companyId)
        .order('start_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as CompanyProjectReference[];
      }
    } catch (e) {
      console.warn('Error getting company project references from DB:', e);
    }
  }
  return MEMORY_PROJECT_REFERENCES.filter(pr => pr.company_id === companyId);
};

export const addCompanyProjectReference = async (
  refData: Omit<CompanyProjectReference, 'id' | 'created_at'>,
  user: User
): Promise<CompanyProjectReference> => {
  const newRef: CompanyProjectReference = {
    id: `cpr-${Date.now()}`,
    ...refData,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('company_project_references')
        .insert([newRef])
        .select()
        .single();

      if (!error && data) {
        await logAuditEvent({
          user,
          action: 'CREATE',
          module: 'EmpresasLocales',
          entityId: data.id,
          details: `Nueva referencia de proyecto: ${data.project_title} con cliente ${data.client_name}`
        });
        return data as CompanyProjectReference;
      }
    } catch (e) {
      console.warn('Error inserting project reference in DB:', e);
    }
  }

  MEMORY_PROJECT_REFERENCES.push(newRef);
  return newRef;
};

// ========================================================================================
// 4. VERIFICACIÓN Y DICTAMEN MINISTERIAL DE EMPRESAS LOCALES
// ========================================================================================

export const verifyCompanyWorkflow = async (params: {
  companyId: string;
  fromState: string;
  toState: 'VERIFICADA' | 'ACTIVA' | 'SOLICITUD_INFORMACION' | 'SUSPENDIDA' | 'RECHAZADA';
  user: User;
  notes: string;
  isLocalContentCertified?: boolean;
}): Promise<boolean> => {
  const { companyId, fromState, toState, user, notes, isLocalContentCertified } = params;

  // Map to companies table status
  let dbStatus: Company['status'] = 'pending';
  let dbVerifStatus = 'pending';

  if (toState === 'ACTIVA' || toState === 'VERIFICADA') {
    dbStatus = 'certified';
    dbVerifStatus = 'verified';
  } else if (toState === 'SUSPENDIDA') {
    dbStatus = 'suspended';
    dbVerifStatus = 'suspended';
  } else if (toState === 'RECHAZADA') {
    dbStatus = 'rejected';
    dbVerifStatus = 'rejected';
  } else if (toState === 'SOLICITUD_INFORMACION') {
    dbStatus = 'pending';
    dbVerifStatus = 'information_requested';
  }

  // 1. Record workflow transition in workflow_history table
  await recordWorkflowTransition({
    entityId: companyId,
    entityType: 'company',
    fromState,
    toState,
    user,
    comment: notes
  });

  // 2. Update company in database
  if (supabase) {
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          status: dbStatus,
          verification_status: dbVerifStatus,
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          verification_notes: notes,
          is_local_content_certified: isLocalContentCertified ?? (toState === 'ACTIVA' || toState === 'VERIFICADA')
        })
        .eq('id', companyId);

      if (error) {
        console.warn('Error updating company verification in Supabase:', error);
      }
    } catch (e) {
      console.warn('Exception updating company status in Supabase:', e);
    }
  }

  // 3. Notify the company organization users
  await sendNotification({
    userId: companyId,
    title: `Actualización de Estado Ministerial: ${toState}`,
    description: `El Ministerio de Minas e Hidrocarburos ha dictaminado el estado '${toState}' para su expediente. Nota: ${notes}`,
    category: 'system'
  });

  return true;
};

// ========================================================================================
// 5. MOTOR DE MATCHING REGLADO (Transparente y Explicable)
// ========================================================================================

/**
 * Motor de preselección reglado para identificar empresas locales compatibles con una oportunidad
 * Criterios evaluados:
 * 1. Servicio requerido o categoría de servicio
 * 2. Años de experiencia técnica mínima
 * 3. Certificación técnica exigida
 * 4. Nivel de Contenido Nacional / Estado de certificación RUGE
 * 5. Ubicación geográfica
 */
export const matchLocalCompaniesForOpportunity = (
  opportunity: OpportunityExt,
  companies: Company[],
  allCompanyServices: CompanyService[]
): LocalCompanyMatchResult[] => {
  const reqCategory = (opportunity.category || '').toLowerCase();
  const reqServices = (opportunity.requiredServices || []).map(s => s.toLowerCase());
  const reqCapabilities = (opportunity.requiredCapabilities || []).map(c => c.toLowerCase());
  const minExp = opportunity.minimumExperienceYears || 0;
  const minLocalContent = opportunity.minimumLocalContentScore || 0;

  const results: LocalCompanyMatchResult[] = [];

  // Filter only local companies
  const localCompanies = companies.filter(c => c.type === 'local' || !c.type);

  for (const comp of localCompanies) {
    const compServices = allCompanyServices.filter(cs => cs.company_id === comp.id);
    const reasons: string[] = [];
    let score = 0;

    // 1. Compatibilidad de Servicios / Sector (40 puntos máx)
    let meetsService = false;
    const matchingServices: CompanyService[] = [];

    // Coincidencia por servicios específicos declarados
    for (const cs of compServices) {
      const sName = cs.service_name.toLowerCase();
      const sCat = cs.category.toLowerCase();

      const matchesSpecificService = reqServices.some(rs => sName.includes(rs) || rs.includes(sName));
      const matchesCategory = reqCategory && (sCat.includes(reqCategory) || reqCategory.includes(sCat));

      if (matchesSpecificService || matchesCategory) {
        meetsService = true;
        matchingServices.push(cs);
      }
    }

    // Coincidencia por sector general de la empresa
    const compSectors = (comp.sector || []).map(s => s.toLowerCase());
    const matchesSector = compSectors.some(s => reqCategory.includes(s) || s.includes(reqCategory));

    if (matchingServices.length > 0) {
      meetsService = true;
      score += 40;
      reasons.push(`Registra ${matchingServices.length} servicio(s) específico(s) en la categoría requerida.`);
    } else if (matchesSector) {
      meetsService = true;
      score += 25;
      reasons.push(`Acreditada en el sector general de la oportunidad (${comp.sector?.join(', ')}).`);
    } else {
      reasons.push('No tiene registrado un servicio directamente catalogado en este sector.');
    }

    // 2. Experiencia Mínima (20 puntos máx)
    let meetsExp = false;
    const maxExpDeclared = compServices.reduce((max, s) => Math.max(max, s.experience_years || 0), 0);
    
    if (minExp === 0 || maxExpDeclared >= minExp) {
      meetsExp = true;
      score += 20;
      reasons.push(`Cumple con el requisito de experiencia técnica (${maxExpDeclared} años registrados vs ${minExp} requeridos).`);
    } else {
      score += Math.round((maxExpDeclared / Math.max(minExp, 1)) * 10);
      reasons.push(`Experiencia por debajo del umbral recomendado (${maxExpDeclared} años vs ${minExp} requeridos).`);
    }

    // 3. Certificación RUGE y Estado (20 puntos máx)
    let meetsCert = false;
    const isVerified = comp.status === 'certified' || comp.verification_status === 'verified';
    if (isVerified) {
      meetsCert = true;
      score += 20;
      reasons.push('Empresa formalmente certificada y homologada en el Registro RUGE.');
    } else {
      score += 5;
      reasons.push('Empresa en proceso de certificación o con expediente pendiente de validación.');
    }

    // 4. Cumplimiento de Contenido Nacional y Personal Local (20 puntos máx)
    let meetsCN = false;
    const compCN = comp.complianceScore || comp.localSpendPercentage || 0;
    if (compCN >= minLocalContent) {
      meetsCN = true;
      score += 20;
      reasons.push(`Puntuación de Contenido Nacional (${compCN}%) satisface el mínimo exigido (${minLocalContent}%).`);
    } else {
      score += Math.round((compCN / Math.max(minLocalContent, 1)) * 15);
      reasons.push(`Puntuación de Contenido Nacional (${compCN}%) inferior a la meta fijada.`);
    }

    // Generar explicación consolidada
    const explanation = `Compatibilidad evaluada al ${score}%. ${reasons.join(' ')}`;

    results.push({
      company: comp,
      matchScore: Math.min(score, 100),
      meetsServiceRequirement: meetsService,
      meetsExperienceRequirement: meetsExp,
      meetsCertificationRequirement: meetsCert,
      meetsLocalContentRequirement: meetsCN,
      explanation,
      reasons,
      matchingServices
    });
  }

  // Ordenar de mayor compatibilidad a menor
  return results.sort((a, b) => b.matchScore - a.matchScore);
};

// ========================================================================================
// 6. GESTIÓN DE PRESELECCIONES (Opportunity Shortlists)
// ========================================================================================

export const getOpportunityShortlists = async (opportunityId: string, currentUser?: User): Promise<OpportunityShortlist[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('opportunity_shortlists')
        .select('*, company:companies(*)')
        .eq('opportunity_id', opportunityId);

      if (!error && data && data.length > 0) {
        return data as OpportunityShortlist[];
      }
    } catch (e) {
      console.warn('Error fetching opportunity_shortlists from DB:', e);
    }
  }
  return MEMORY_SHORTLISTS.filter(sl => sl.opportunity_id === opportunityId);
};

export const createOpportunityShortlistEntry = async (params: {
  opportunityId: string;
  companyId: string;
  companyName: string;
  matchScore: number;
  criteriaEvaluated: Record<string, boolean | number | string>;
  matchExplanation: string;
  recommendationNotes: string;
  user: User;
}): Promise<OpportunityShortlist> => {
  const { opportunityId, companyId, companyName, matchScore, criteriaEvaluated, matchExplanation, recommendationNotes, user } = params;

  const newEntry: OpportunityShortlist = {
    id: `sl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    opportunity_id: opportunityId,
    company_id: companyId,
    company_name: companyName,
    shortlisted_by: user.id,
    match_score: matchScore,
    criteria_evaluated: criteriaEvaluated,
    match_explanation: matchExplanation,
    status: 'preseleccionada',
    ministry_recommendation_notes: recommendationNotes,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('opportunity_shortlists')
        .insert([{
          id: newEntry.id,
          opportunity_id: opportunityId,
          company_id: companyId,
          shortlisted_by: user.id,
          match_score: matchScore,
          criteria_evaluated: criteriaEvaluated,
          match_explanation: matchExplanation,
          status: 'preseleccionada',
          ministry_recommendation_notes: recommendationNotes,
          created_at: newEntry.created_at
        }])
        .select('*, company:companies(*)')
        .single();

      if (!error && data) {
        await logAuditEvent({
          user,
          action: 'CREATE',
          module: 'Licitaciones',
          entityId: data.id,
          details: `Preselección ministerial de empresa local '${companyName}' para oportunidad ${opportunityId}`
        });
        return data as OpportunityShortlist;
      }
    } catch (e) {
      console.warn('Error creating shortlist in Supabase, saving in memory:', e);
    }
  }

  // Remove duplicate if already present in memory
  MEMORY_SHORTLISTS = MEMORY_SHORTLISTS.filter(s => !(s.opportunity_id === opportunityId && s.company_id === companyId));
  MEMORY_SHORTLISTS.push(newEntry);

  await logAuditEvent({
    user,
    action: 'CREATE',
    module: 'Licitaciones',
    entityId: newEntry.id,
    details: `Preselección de empresa local '${companyName}' para licitación ${opportunityId}`
  });

  return newEntry;
};

export const remitShortlistToOperator = async (params: {
  opportunityId: string;
  contractingCompanyId?: string;
  notes: string;
  user: User;
}): Promise<boolean> => {
  const { opportunityId, contractingCompanyId, notes, user } = params;

  // 1. Update status of shortlists to 'remitida_a_operadora'
  if (supabase) {
    try {
      await supabase
        .from('opportunity_shortlists')
        .update({
          status: 'remitida_a_operadora',
          remitted_at: new Date().toISOString()
        })
        .eq('opportunity_id', opportunityId);

      // Update opportunity workflow stage
      await supabase
        .from('opportunities')
        .update({
          workflow_stage: 'PRESELECCION',
          shortlist_published_at: new Date().toISOString()
        })
        .eq('id', opportunityId);
    } catch (e) {
      console.warn('Error remitting shortlist in Supabase:', e);
    }
  }

  // In memory
  MEMORY_SHORTLISTS.forEach(sl => {
    if (sl.opportunity_id === opportunityId) {
      sl.status = 'remitida_a_operadora';
      sl.remitted_at = new Date().toISOString();
    }
  });

  // 2. Audit Trail & Workflow Transition
  await recordWorkflowTransition({
    entityId: opportunityId,
    entityType: 'opportunity',
    fromState: 'PUBLICADA',
    toState: 'PRESELECCION',
    user,
    comment: `Remisión formal de lista corta de empresas locales a la operadora contratante. Notas: ${notes}`
  });

  // 3. Notify Contracting Operator
  if (contractingCompanyId) {
    await sendNotification({
      userId: contractingCompanyId,
      title: 'Lista Corta Ministerial Recibida',
      description: `La Dirección General de Contenido Nacional ha remitido la preselección oficial de empresas locales para la licitación.`,
      category: 'opportunity'
    });
  }

  return true;
};
