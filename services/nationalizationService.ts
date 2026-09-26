import { supabase } from './supabaseClient';
import { 
  TalentProfile, 
  ExpatriateRecord, 
  NationalizationPosition, 
  TransferPlan, 
  TalentMatchingResult,
  JobOffer,
  User,
  ExpatriatePrenotification,
  ExpatriatePrenotificationStatus,
  Internship,
  InternshipRotation,
  InternshipEvaluation,
  InternshipStatus
} from '../types';
import { logAuditEvent } from './auditService';
import { sendNotification } from './notificationService';
import { recordWorkflowTransition } from './workflowService';

/**
 * Calculate profile completeness percentage (0 - 100%)
 */
export const calculateProfileCompleteness = (profile: Partial<TalentProfile>): number => {
  let score = 0;
  if (profile.first_name && profile.last_name) score += 15;
  if (profile.national_id) score += 10;
  if (profile.phone && profile.email) score += 10;
  if (profile.profession && profile.specialty) score += 15;
  if (profile.experience_years !== undefined) score += 10;
  if (profile.cv_url) score += 15;
  if (profile.education && profile.education.length > 0) score += 10;
  if (profile.experience && profile.experience.length > 0) score += 10;
  if (profile.certifications && profile.certifications.length > 0) score += 5;
  return Math.min(100, score);
};

/**
 * INITIAL SEED / MOCK DATA FOR DEMONSTRATION & DEV PERSISTENCE
 */
export const INITIAL_TALENT_PROFILES: TalentProfile[] = [
  {
    id: 'tp-101',
    user_id: 'u-tal-1',
    first_name: 'Santiago',
    last_name: 'Obama Mangue',
    national_id: 'DIP-2018-09843',
    birth_date: '1991-05-14',
    nationality: 'Equatoguineana',
    phone: '+240 222 123 456',
    email: 'santiago.obama@mmh.gob.gq',
    locality: 'Malabo',
    province: 'Bioko Norte',
    region: 'Insular',
    profession: 'Ingeniero de Petróleos',
    specialty: 'Reservorios y Producción Offshore',
    professional_level: 'Senior',
    experience_years: 9,
    sector: 'Hidrocarburos (Upstream)',
    availability: 'Inmediata',
    preferred_location: 'Malabo / Luba Offshore',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    cv_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    visibility: 'MINISTERIO',
    completeness_percentage: 95,
    education: [
      {
        institution: 'Universidad Nacional de Guinea Ecuatorial (UNGE)',
        degree: 'Grado en Ingeniería de Petróleos',
        level: 'Grado Universitario',
        graduation_year: '2015'
      },
      {
        institution: 'Heriot-Watt University (Escocia)',
        degree: 'Máster en Ingeniería de Yacimientos',
        level: 'Postgrado / Máster',
        graduation_year: '2017'
      }
    ],
    experience: [
      {
        company: 'Noble Energy / Chevron',
        position: 'Ingeniero de Producción Junior',
        sector: 'Upstream Gas & Oil',
        start_date: '2017-02',
        end_date: '2020-11',
        description: 'Monitoreo de pozos submarinos en el Campo Alen y optimización de flujo.'
      },
      {
        company: 'EG LNG',
        position: 'Ingeniero de Yacimientos Senior',
        sector: 'Gas Natural Licuado',
        start_date: '2020-12',
        end_date: '2025-08',
        description: 'Simulación numérica de reservorios y coordinación de operaciones de reinyección.'
      }
    ],
    certifications: [
      {
        title: 'BOSIET con EBS (Supervivencia Offshore)',
        institution: 'OPITO Certified Centre',
        issue_date: '2023-01-15',
        expiry_date: '2027-01-15',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        title: 'Well Control IWCF Level 4',
        institution: 'IWCF International',
        issue_date: '2024-03-10',
        expiry_date: '2026-03-10'
      }
    ],
    skills: ['Simulación ECLIPSE', 'Petrel', 'BOSIET', 'IWCF Well Control', 'Optimización de Pozos Submarinos'],
    documents: [
      {
        name: 'CV_Santiago_Obama_2026.pdf',
        category: 'CV',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        upload_date: '2026-01-10'
      },
      {
        name: 'Título_Ingeniería_UNGE.pdf',
        category: 'Título Universitario',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        upload_date: '2026-01-12'
      }
    ],
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-03-01T14:20:00Z'
  },
  {
    id: 'tp-102',
    user_id: 'u-tal-2',
    first_name: 'María Asunción',
    last_name: 'Nchama Esono',
    national_id: 'DIP-2019-11029',
    birth_date: '1994-08-22',
    nationality: 'Equatoguineana',
    phone: '+240 222 987 654',
    email: 'maria.nchama@mmh.gob.gq',
    locality: 'Bata',
    province: 'Litoral',
    region: 'Continental',
    profession: 'Especialista HSE y Medio Ambiente',
    specialty: 'Auditoría Ambiental Offshore y Seguridad Industrial',
    professional_level: 'Intermedio',
    experience_years: 6,
    sector: 'Hidrocarburos y Servicios Tecnológicos',
    availability: '1 mes',
    preferred_location: 'Bata / Campo Ceiba',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    cv_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    visibility: 'EMPRESAS_AUTORIZADAS',
    completeness_percentage: 90,
    education: [
      {
        institution: 'Universidad de Alcalá (España)',
        degree: 'Licenciatura en Ciencias Ambientales',
        level: 'Grado Universitario',
        graduation_year: '2018'
      }
    ],
    experience: [
      {
        company: 'Trident Energy Equatorial Guinea',
        position: 'Técnica HSE de Campo',
        sector: 'Upstream Oil',
        start_date: '2019-06',
        end_date: '2024-12',
        description: 'Supervisión de protocolos de seguridad ambiental en plataformas del Complejo Ceiba y Okume.'
      }
    ],
    certifications: [
      {
        title: 'Certificación NEBOSH IGC en Seguridad Ocupacional',
        institution: 'NEBOSH UK',
        issue_date: '2021-09-01'
      },
      {
        title: 'Auditor Líder ISO 14001:2015',
        institution: 'SGS Academy',
        issue_date: '2022-11-20'
      }
    ],
    skills: ['NEBOSH', 'ISO 14001', 'Auditoría HSE', 'Prevención de Riesgos Offshore', 'Gestión de Residuos Marinos'],
    documents: [
      {
        name: 'CV_Maria_Nchama.pdf',
        category: 'CV',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        upload_date: '2026-02-01'
      }
    ],
    created_at: '2026-02-01T11:30:00Z',
    updated_at: '2026-03-05T09:15:00Z'
  }
];

export const INITIAL_EXPATRIATES: ExpatriateRecord[] = [
  {
    id: 'exp-501',
    company_id: 'comp-noble',
    company_name: 'Chevron / Noble Energy EG Ltd',
    full_name: 'Jean-Pierre Dubois',
    nationality: 'Francesa',
    origin_country: 'Francia',
    position: 'Superintendente de Operaciones de Subsuperficie',
    specialty: 'Completación de Pozos Submarinos',
    department: 'Operaciones Marítimas',
    arrival_date: '2021-04-10',
    contract_duration_months: 60,
    nationalization_possibility: 'Alta',
    status: 'En proceso de reemplazo',
    assigned_shadow_id: 'u-tal-1',
    assigned_shadow_name: 'Santiago Obama Mangue',
    observations: 'Personal en fase final de transferencia de competencias. Aprobación de nacionalización prevista para Q4 2026.',
    created_at: '2021-04-10T00:00:00Z'
  },
  {
    id: 'exp-502',
    company_id: 'comp-trident',
    company_name: 'Trident Energy Equatorial Guinea',
    full_name: 'Robert Vance Jr.',
    nationality: 'Estadounidense',
    origin_country: 'Estados Unidos',
    position: 'Gerente General de Inspección de Integridad Estructural',
    specialty: 'Mantenimiento de Plataformas y Ensayos No Destructivos',
    department: 'Mantenimiento e Integridad',
    arrival_date: '2022-09-01',
    contract_duration_months: 48,
    nationalization_possibility: 'Media',
    status: 'Activo',
    assigned_shadow_id: 'u-tal-2',
    assigned_shadow_name: 'María Asunción Nchama Esono',
    observations: 'Plan de transferencia en ejecución (65% completado).',
    created_at: '2022-09-01T00:00:00Z'
  }
];

export const INITIAL_NATIONALIZATION_POSITIONS: NationalizationPosition[] = [
  {
    id: 'nat-pos-1',
    company_id: 'comp-noble',
    company_name: 'Chevron / Noble Energy EG Ltd',
    position_title: 'Superintendente de Operaciones de Subsuperficie',
    department: 'Operaciones Marítimas',
    occupant_name: 'Jean-Pierre Dubois',
    occupant_type: 'EXPATRIADO',
    nationalization_possibility: 'Alta',
    status: 'PLAN_TRANSFERENCIA',
    priority: 'Alta',
    identified_candidate_id: 'u-tal-1',
    identified_candidate_name: 'Santiago Obama Mangue',
    target_date: '2026-11-30',
    transfer_plan_id: 'tp-plan-01',
    requirements: ['Ingeniería de Petróleos', 'Mínimo 8 años experiencia', 'IWCF Level 4', 'Certificado BOSIET'],
    created_at: '2025-06-15T00:00:00Z',
    updated_at: '2026-03-10T00:00:00Z'
  },
  {
    id: 'nat-pos-2',
    company_id: 'comp-trident',
    company_name: 'Trident Energy Equatorial Guinea',
    position_title: 'Gerente General de Inspección HSE Offshore',
    department: 'HSE',
    occupant_name: 'Robert Vance Jr.',
    occupant_type: 'EXPATRIADO',
    nationalization_possibility: 'Media',
    status: 'FORMACION',
    priority: 'Media',
    identified_candidate_id: 'u-tal-2',
    identified_candidate_name: 'María Asunción Nchama Esono',
    target_date: '2027-04-30',
    transfer_plan_id: 'tp-plan-02',
    requirements: ['Ciencias Ambientales / Ingeniería', 'NEBOSH IGC', 'Mínimo 5 años en plataformas offshore'],
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2026-02-18T00:00:00Z'
  }
];

export const INITIAL_TRANSFER_PLANS: TransferPlan[] = [
  {
    id: 'tp-plan-01',
    position_id: 'nat-pos-1',
    position_title: 'Superintendente de Operaciones de Subsuperficie',
    company_name: 'Chevron / Noble Energy EG Ltd',
    expatriate_name: 'Jean-Pierre Dubois',
    local_candidate_name: 'Santiago Obama Mangue',
    local_candidate_id: 'u-tal-1',
    mentor_name: 'Jean-Pierre Dubois',
    competencies: [
      {
        competency: 'Gestión de operaciones de completación de pozos submarinos',
        required_level: 5,
        current_level: 3,
        gap: 2,
        action_plan: 'Formación especializada + Práctica guiada en plataforma Aseng.',
        recommended_course: 'Programa Avanzado de Completación Submarina',
        recommended_centre: 'Instituto Tecnológico Nacional de Hidrocarburos (ITGE)'
      },
      {
        competency: 'Liderazgo y gestión de emergencias offshore',
        required_level: 5,
        current_level: 5,
        gap: 0,
        action_plan: 'Completado con éxito en simulador IWCF.',
        recommended_course: 'Certificación IWCF Level 4',
        recommended_centre: 'OPITO Certified Centre Malabo'
      }
    ],
    start_date: '2025-07-01',
    target_date: '2026-11-30',
    progress_percentage: 85,
    status: 'EN_CURSO',
    observations: 'El candidato demuestra alta preparación técnica. Pendiente de evaluación ministerial final.',
    updated_at: '2026-03-10T00:00:00Z'
  }
];

// In-memory fallback state arrays
const memoryTalents = [...INITIAL_TALENT_PROFILES];
const memoryExpatriates = [...INITIAL_EXPATRIATES];
const memoryPositions = [...INITIAL_NATIONALIZATION_POSITIONS];
const memoryTransferPlans = [...INITIAL_TRANSFER_PLANS];

/**
 * FETCH ALL TALENT PROFILES WITH FILTERS
 */
export const getTalentProfiles = async (filters?: {
  profession?: string;
  specialty?: string;
  province?: string;
  availability?: string;
  visibility?: string;
  searchQuery?: string;
}): Promise<TalentProfile[]> => {
  let list = memoryTalents;

  if (filters) {
    if (filters.profession) {
      list = list.filter(t => t.profession.toLowerCase().includes(filters.profession!.toLowerCase()));
    }
    if (filters.specialty) {
      list = list.filter(t => t.specialty.toLowerCase().includes(filters.specialty!.toLowerCase()));
    }
    if (filters.province) {
      list = list.filter(t => t.province === filters.province);
    }
    if (filters.availability) {
      list = list.filter(t => t.availability === filters.availability);
    }
    if (filters.visibility) {
      list = list.filter(t => t.visibility === filters.visibility);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(t => 
        t.first_name.toLowerCase().includes(q) ||
        t.last_name.toLowerCase().includes(q) ||
        t.profession.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        t.skills.some(s => s.toLowerCase().includes(q))
      );
    }
  }

  return list;
};

/**
 * SAVE OR UPDATE TALENT PROFILE
 */
export const saveTalentProfile = async (profileData: Partial<TalentProfile>, currentUser: User): Promise<TalentProfile> => {
  const existingIndex = memoryTalents.findIndex(t => t.id === profileData.id || t.user_id === currentUser.id);

  const completeness = calculateProfileCompleteness(profileData);

  const fullProfile: TalentProfile = {
    id: profileData.id || `tp-${Date.now()}`,
    user_id: currentUser.id,
    first_name: profileData.first_name || currentUser.name.split(' ')[0] || 'Profesional',
    last_name: profileData.last_name || currentUser.name.split(' ').slice(1).join(' ') || 'Nacional',
    national_id: profileData.national_id || '',
    birth_date: profileData.birth_date || '',
    nationality: profileData.nationality || 'Equatoguineana',
    phone: profileData.phone || '',
    email: profileData.email || currentUser.email,
    locality: profileData.locality || 'Malabo',
    province: profileData.province || 'Bioko Norte',
    region: profileData.region || 'Insular',
    profession: profileData.profession || 'Ingeniero / Técnico',
    specialty: profileData.specialty || 'General',
    professional_level: profileData.professional_level || 'Senior',
    experience_years: profileData.experience_years ?? 5,
    sector: profileData.sector || 'Hidrocarburos',
    availability: profileData.availability || 'Inmediata',
    preferred_location: profileData.preferred_location || 'Malabo',
    avatar_url: profileData.avatar_url || currentUser.avatar,
    cv_url: profileData.cv_url || '',
    visibility: profileData.visibility || 'MINISTERIO',
    completeness_percentage: completeness,
    education: profileData.education || [],
    experience: profileData.experience || [],
    certifications: profileData.certifications || [],
    skills: profileData.skills || [],
    documents: profileData.documents || [],
    created_at: profileData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    memoryTalents[existingIndex] = fullProfile;
  } else {
    memoryTalents.unshift(fullProfile);
  }

  await logAuditEvent({
    user: currentUser,
    action: existingIndex >= 0 ? 'UPDATE' : 'CREATE',
    module: 'talent_profiles',
    entityId: fullProfile.id,
    details: `Perfil de talento nacional actualizado/creado (${fullProfile.first_name} ${fullProfile.last_name})`
  });

  return fullProfile;
};

/**
 * FETCH EXPATRIATE RECORDS
 */
export const getExpatriateRecords = async (): Promise<ExpatriateRecord[]> => {
  return memoryExpatriates;
};

/**
 * FETCH NATIONALIZATION POSITIONS
 */
export const getNationalizationPositions = async (): Promise<NationalizationPosition[]> => {
  return memoryPositions;
};

/**
 * FETCH TRANSFER PLANS
 */
export const getTransferPlans = async (): Promise<TransferPlan[]> => {
  return memoryTransferPlans;
};

/**
 * RULE-BASED MATCHING ALGORITHM BETWEEN CANDIDATES AND REQUIREMENTS
 */
export const calculateRuleBasedMatching = (
  candidate: TalentProfile,
  requirements: {
    profession?: string;
    specialty?: string;
    minExperienceYears?: number;
    requiredDegree?: string;
    requiredCertifications?: string[];
  }
): TalentMatchingResult => {
  let score = 0;
  const explanationParts: string[] = [];

  // 1. Profession Match (30 pts)
  let professionMatch = false;
  if (requirements.profession && candidate.profession.toLowerCase().includes(requirements.profession.toLowerCase())) {
    professionMatch = true;
    score += 30;
    explanationParts.push(`✓ Profesión coincidente: ${candidate.profession}`);
  } else {
    explanationParts.push(`✗ Profesión no exactamente idéntica (${candidate.profession})`);
  }

  // 2. Specialty Match (25 pts)
  let specialtyMatch = false;
  if (requirements.specialty && candidate.specialty.toLowerCase().includes(requirements.specialty.toLowerCase())) {
    specialtyMatch = true;
    score += 25;
    explanationParts.push(`✓ Especialidad coincidente: ${candidate.specialty}`);
  }

  // 3. Experience Match (25 pts)
  let experienceScore = 0;
  const minYears = requirements.minExperienceYears || 5;
  if (candidate.experience_years >= minYears) {
    experienceScore = 25;
    explanationParts.push(`✓ Experiencia suficiente: ${candidate.experience_years} años (requerido: ${minYears} años)`);
  } else {
    const ratio = candidate.experience_years / minYears;
    experienceScore = Math.round(ratio * 20);
    explanationParts.push(`! Experiencia parcial: ${candidate.experience_years}/${minYears} años`);
  }
  score += experienceScore;

  // 4. Education Match (10 pts)
  let educationScore = 10;
  if (candidate.education && candidate.education.length > 0) {
    explanationParts.push(`✓ Titulación acreditada (${candidate.education[0].degree})`);
  } else {
    educationScore = 0;
  }
  score += educationScore;

  // 5. Certification Match (10 pts)
  let certScore = 0;
  if (candidate.certifications && candidate.certifications.length > 0) {
    certScore = 10;
    explanationParts.push(`✓ Certificaciones sectoriales vigentes (${candidate.certifications.map(c => c.title).join(', ')})`);
  }
  score += certScore;

  const totalScore = Math.min(100, score);

  return {
    candidate_id: candidate.id,
    candidate_name: `${candidate.first_name} ${candidate.last_name}`,
    profession: candidate.profession,
    specialty: candidate.specialty,
    experience_years: candidate.experience_years,
    compatibility_score: totalScore,
    breakdown: {
      professionMatch,
      specialtyMatch,
      experienceScore,
      educationScore,
      certificationScore: certScore
    },
    explanation: explanationParts.join(' | '),
    ai_insights: `Análisis Estimado del Portal: El candidato posee un ${totalScore}% de compatibilidad técnica. Se recomienda programar entrevista de validación por el Cuerpo Técnico del MMH.`
  };
};

/**
 * UPDATE NATIONALIZATION POSITION WORKFLOW STATUS
 */
export const updateNationalizationStatus = async (
  positionId: string,
  newStatus: any,
  user: User,
  comment?: string
): Promise<NationalizationPosition | null> => {
  const index = memoryPositions.findIndex(p => p.id === positionId);
  if (index === -1) return null;

  const oldStatus = memoryPositions[index].status;
  memoryPositions[index].status = newStatus;
  memoryPositions[index].updated_at = new Date().toISOString();

  // Record workflow transition
  await recordWorkflowTransition({
    entityId: positionId,
    entityType: 'nationalization_position',
    fromState: oldStatus,
    toState: newStatus,
    user,
    comment: comment || `Cambio de estado del proceso de nacionalización a ${newStatus}`
  });

  // Notify relevant users
  await sendNotification({
    userId: user.id,
    title: 'Actualización de Proceso de Nacionalización',
    description: `La posición '${memoryPositions[index].position_title}' ha cambiado al estado: ${newStatus}`,
    type: 'system',
    category: 'Nacionalización'
  });

  return memoryPositions[index];
};

// ==========================================
// PRE-NOTIFICACIONES DE EXPATRIADOS (MOCK & SUPABASE DATA)
// ==========================================
export const INITIAL_PRENOTIFICATIONS: ExpatriatePrenotification[] = [
  {
    id: 'prenot-1',
    company_id: 'comp-101',
    company_name: 'Noble Energy EG',
    full_name: 'Jean-Pierre Dubois',
    nationality: 'Francesa',
    origin_country: 'Francia',
    profession: 'Ingeniero Químico Subsea',
    specialty: 'Tratamiento de Gas en Plataforma',
    proposed_position: 'Superintendente Operativo Alen',
    department: 'Operaciones Offshore',
    proposed_entry_date: '2026-11-15',
    proposed_duration_months: 36,
    is_key_position: true,
    justification: 'Requiere certificación internacional de manejo de presiones en cabezales submarinos de alta temperatura.',
    related_national_candidate_id: 'tp-101',
    related_national_candidate_name: 'Santiago Obama Mangue',
    documents: [
      { name: 'Carta de Justificación Técnica.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', category: 'Justificación' }
    ],
    observations: 'Se propone a Santiago Obama como candidato a sombra nacional.',
    status: 'EN_REVISION',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-12T14:30:00Z'
  },
  {
    id: 'prenot-2',
    company_id: 'comp-102',
    company_name: 'EG LNG',
    full_name: 'Marcus Vance',
    nationality: 'Estadounidense',
    origin_country: 'Estados Unidos',
    profession: 'Técnico de Criogenia',
    specialty: 'Mantenimiento de Turbocompresores',
    proposed_position: 'Especialista en Trenes de Licuación',
    department: 'Mantenimiento',
    proposed_entry_date: '2026-12-01',
    proposed_duration_months: 24,
    is_key_position: false,
    justification: 'Mantenimiento programado de turbinas de gas en la planta de Punta Europa.',
    status: 'BORRADOR',
    created_at: '2026-09-20T08:15:00Z',
    updated_at: '2026-09-20T08:15:00Z'
  }
];

let memoryPrenotifications: ExpatriatePrenotification[] = [...INITIAL_PRENOTIFICATIONS];

export const getExpatriatePrenotifications = async (companyId?: string): Promise<ExpatriatePrenotification[]> => {
  try {
    let query = supabase.from('expatriate_prenotifications').select('*');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as ExpatriatePrenotification[];
    }
  } catch (err) {
    console.warn('Using in-memory fallback for expatriate_prenotifications:', err);
  }
  if (companyId) {
    return memoryPrenotifications.filter(p => p.company_id === companyId);
  }
  return memoryPrenotifications;
};

export const createExpatriatePrenotification = async (
  prenot: Omit<ExpatriatePrenotification, 'id' | 'created_at' | 'updated_at'>,
  user: User
): Promise<ExpatriatePrenotification> => {
  const newRecord: ExpatriatePrenotification = {
    ...prenot,
    id: `prenot-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase.from('expatriate_prenotifications').insert([newRecord]).select().single();
    if (!error && data) {
      logAuditEvent({ user, action: 'CREATE_PRENOTIFICATION', module: 'Nacionalización', entityId: data.id, details: JSON.stringify({ company: data.company_name, position: data.proposed_position }) });
      return data as ExpatriatePrenotification;
    }
  } catch (err) {
    console.warn('Failed inserting prenotification to Supabase, using memory:', err);
  }

  memoryPrenotifications.unshift(newRecord);
  await logAuditEvent({ user, action: 'CREATE_PRENOTIFICATION', module: 'Nacionalización', entityId: newRecord.id, details: JSON.stringify({ company: newRecord.company_name, position: newRecord.proposed_position }) });
  return newRecord;
};

export const updateExpatriatePrenotificationStatus = async (
  prenotId: string,
  status: ExpatriatePrenotificationStatus,
  user: User,
  comment?: string
): Promise<ExpatriatePrenotification | null> => {
  const index = memoryPrenotifications.findIndex(p => p.id === prenotId);
  if (index !== -1) {
    const oldStatus = memoryPrenotifications[index].status;
    memoryPrenotifications[index].status = status;
    memoryPrenotifications[index].updated_at = new Date().toISOString();
    if (comment) memoryPrenotifications[index].observations = comment;

    await recordWorkflowTransition({
      entityId: prenotId,
      entityType: 'expatriate_prenotification',
      fromState: oldStatus,
      toState: status,
      user,
      comment: comment || `Estado de pre-notificación actualizado a ${status}`
    });

    await logAuditEvent({ user, action: 'UPDATE_PRENOTIFICATION_STATUS', module: 'Nacionalización', entityId: prenotId, previousState: oldStatus, newState: status, details: comment });
    return memoryPrenotifications[index];
  }

  try {
    const { data } = await supabase
      .from('expatriate_prenotifications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', prenotId)
      .select()
      .single();
    if (data) return data as ExpatriatePrenotification;
  } catch (err) {
    console.warn('Error updating prenotification status:', err);
  }
  return null;
};

// ==========================================
// PASANTÍAS, ROTACIONES Y EVALUACIONES (MOCK & SUPABASE DATA)
// ==========================================
export const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'intern-1',
    company_id: 'comp-101',
    company_name: 'Noble Energy EG',
    candidate_id: 'tp-101',
    candidate_name: 'Santiago Obama Mangue',
    mentor_id: 'u-men-1',
    mentor_name: 'Ing. Carlos Nsue (Noble Energy)',
    program_name: 'Programa de Excelencia para Jóvenes Ingenieros 2026',
    call_title: 'Prácticas Profesionales en Yacimientos y Reservorios Offshore',
    start_date: '2026-03-01',
    end_date: '2026-09-01',
    objectives: 'Capacitación avanzada en simulación de presiones y rotación por áreas operativas en Punta Europa.',
    status: 'EN_CURSO',
    rotations: [
      {
        id: 'rot-1',
        internship_id: 'intern-1',
        department: 'Ingeniería de Reservorios',
        area_supervisor: 'Ing. Elena Ondo',
        start_date: '2026-03-01',
        end_date: '2026-05-01',
        objectives: 'Simulación de flujo en pozos submarinos',
        competencies_evaluated: ['Simulación numérica', 'Análisis de datos de presión'],
        performance_score: 92,
        supervisor_comments: 'Excelente desempeño técnico y rápido aprendizaje.',
        status: 'EVALUADA',
        created_at: '2026-03-01T00:00:00Z'
      },
      {
        id: 'rot-2',
        internship_id: 'intern-1',
        department: 'Seguridad y Medio Ambiente (HSE)',
        area_supervisor: 'Ing. Francisco Mabale',
        start_date: '2026-05-02',
        end_date: '2026-07-01',
        objectives: 'Normativa de prevención offshore y protocolos de emergencia',
        competencies_evaluated: ['Seguridad industrial', 'Normativa ISO 14001'],
        performance_score: 88,
        supervisor_comments: 'Aprobó todos los exámenes de seguridad con nota sobresaliente.',
        status: 'EVALUADA',
        created_at: '2026-05-02T00:00:00Z'
      },
      {
        id: 'rot-3',
        internship_id: 'intern-1',
        department: 'Operaciones de Planta Cryogénica',
        area_supervisor: 'Ing. Manuel Bakale',
        start_date: '2026-07-02',
        end_date: '2026-09-01',
        objectives: 'Supervisión en sala de control y monitoreo de turbocompresores',
        competencies_evaluated: ['Control de procesos', 'Respuesta a alarmas'],
        status: 'EN_CURSO',
        created_at: '2026-07-02T00:00:00Z'
      }
    ],
    evaluations: [
      {
        id: 'eval-1',
        internship_id: 'intern-1',
        rotation_id: 'rot-1',
        evaluator_name: 'Ing. Elena Ondo',
        evaluator_role: 'Supervisora de Reservorios',
        evaluation_date: '2026-05-01',
        evaluation_type: 'ROTACION',
        scores: {
          technical_competence: 5,
          punctuality_and_discipline: 5,
          teamwork: 4,
          adaptability: 5,
          overall_score: 92
        },
        comments: 'Candidato con gran capacidad de liderazgo y sólidos conocimientos teóricos.',
        created_at: '2026-05-01T10:00:00Z'
      }
    ],
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-07-02T00:00:00Z'
  }
];

let memoryInternships: Internship[] = [...INITIAL_INTERNSHIPS];

export const getInternships = async (companyId?: string, candidateId?: string): Promise<Internship[]> => {
  try {
    let query = supabase.from('internships').select('*, internship_rotations(*), internship_evaluations(*)');
    if (companyId) query = query.eq('company_id', companyId);
    if (candidateId) query = query.eq('candidate_id', candidateId);
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map(item => ({
        ...item,
        rotations: item.internship_rotations || [],
        evaluations: item.internship_evaluations || []
      })) as Internship[];
    }
  } catch (err) {
    console.warn('Error fetching internships from Supabase, using memory fallback:', err);
  }

  let list = memoryInternships;
  if (companyId) list = list.filter(i => i.company_id === companyId);
  if (candidateId) list = list.filter(i => i.candidate_id === candidateId);
  return list;
};

export const createInternship = async (
  internshipData: Omit<Internship, 'id' | 'created_at' | 'updated_at'>,
  user: User
): Promise<Internship> => {
  const newRecord: Internship = {
    ...internshipData,
    id: `intern-${Date.now()}`,
    rotations: internshipData.rotations || [],
    evaluations: internshipData.evaluations || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase.from('internships').insert([{
      company_id: newRecord.company_id,
      company_name: newRecord.company_name,
      candidate_id: newRecord.candidate_id,
      candidate_name: newRecord.candidate_name,
      mentor_id: newRecord.mentor_id,
      mentor_name: newRecord.mentor_name,
      program_name: newRecord.program_name,
      call_title: newRecord.call_title,
      start_date: newRecord.start_date,
      end_date: newRecord.end_date,
      objectives: newRecord.objectives,
      status: newRecord.status
    }]).select().single();

    if (!error && data) {
      await logAuditEvent({ user, action: 'CREATE_INTERNSHIP', module: 'Nacionalización', entityId: data.id, details: JSON.stringify({ program: data.program_name, candidate: data.candidate_name }) });
      return { ...data, rotations: [], evaluations: [] } as Internship;
    }
  } catch (err) {
    console.warn('Error saving internship to Supabase, saving to memory:', err);
  }

  memoryInternships.unshift(newRecord);
  await logAuditEvent({ user, action: 'CREATE_INTERNSHIP', module: 'Nacionalización', entityId: newRecord.id, details: JSON.stringify({ program: newRecord.program_name, candidate: newRecord.candidate_name }) });
  return newRecord;
};

export const addInternshipRotation = async (
  internshipId: string,
  rotation: Omit<InternshipRotation, 'id' | 'internship_id' | 'created_at'>,
  user: User
): Promise<InternshipRotation> => {
  const newRot: InternshipRotation = {
    ...rotation,
    id: `rot-${Date.now()}`,
    internship_id: internshipId,
    created_at: new Date().toISOString()
  };

  const internship = memoryInternships.find(i => i.id === internshipId);
  if (internship) {
    if (!internship.rotations) internship.rotations = [];
    internship.rotations.push(newRot);
  }

  try {
    await supabase.from('internship_rotations').insert([newRot]);
  } catch (err) {
    console.warn('Error inserting rotation:', err);
  }

  await logAuditEvent({ user, action: 'ADD_INTERNSHIP_ROTATION', module: 'Nacionalización', entityId: internshipId, details: JSON.stringify({ department: rotation.department, supervisor: rotation.area_supervisor }) });
  return newRot;
};

export const addInternshipEvaluation = async (
  internshipId: string,
  evaluation: Omit<InternshipEvaluation, 'id' | 'internship_id' | 'created_at'>,
  user: User
): Promise<InternshipEvaluation> => {
  const newEval: InternshipEvaluation = {
    ...evaluation,
    id: `eval-${Date.now()}`,
    internship_id: internshipId,
    created_at: new Date().toISOString()
  };

  const internship = memoryInternships.find(i => i.id === internshipId);
  if (internship) {
    if (!internship.evaluations) internship.evaluations = [];
    internship.evaluations.push(newEval);
  }

  try {
    await supabase.from('internship_evaluations').insert([newEval]);
  } catch (err) {
    console.warn('Error inserting evaluation:', err);
  }

  await logAuditEvent({ user, action: 'ADD_INTERNSHIP_EVALUATION', module: 'Nacionalización', entityId: internshipId, details: JSON.stringify({ type: evaluation.evaluation_type, score: evaluation.scores.overall_score }) });
  return newEval;
};

export const updateInternshipStatus = async (
  internshipId: string,
  status: InternshipStatus,
  finalResult?: Internship['final_result'],
  finalRecommendation?: Internship['final_recommendation'],
  user?: User
): Promise<Internship | null> => {
  const index = memoryInternships.findIndex(i => i.id === internshipId);
  if (index !== -1) {
    memoryInternships[index].status = status;
    if (finalResult) memoryInternships[index].final_result = finalResult;
    if (finalRecommendation) memoryInternships[index].final_recommendation = finalRecommendation;
    memoryInternships[index].updated_at = new Date().toISOString();

    if (user) {
      await logAuditEvent({ user, action: 'UPDATE_INTERNSHIP_STATUS', module: 'Nacionalización', entityId: internshipId, newState: status, details: JSON.stringify({ finalResult, finalRecommendation }) });
    }
    return memoryInternships[index];
  }
  return null;
};
