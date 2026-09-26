
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DIRECTOR = 'director',
  RESPONSABLE_SECCION = 'responsable_seccion',
  FUNCIONARIO = 'funcionario',
  CUERPO_TECNICO = 'cuerpo_tecnico',
  TECNICO = 'tecnico',
  SECRETARIA = 'secretaria',
  PETROLERA = 'petrolera',
  COMPANY = 'company',
  EMPRESA = 'empresa',
  EMPRESA_LOCAL = 'empresa_local',
  PERSONA = 'persona',
  PROFESIONAL = 'profesional',
  COMUNICACION = 'comunicacion',
  COMUNIDAD = 'comunidad',
  USUARIO_EXTERNO = 'usuario_externo',
  ADVERTISER = 'advertiser'
}

export type WorkflowState = 
  | 'BORRADOR'
  | 'ENVIADO'
  | 'EN_REVISION'
  | 'PENDIENTE_DOCUMENTACION'
  | 'APROBADO'
  | 'RECHAZADO'
  | 'EN_PROCESO'
  | 'COMPLETADO'
  | 'CANCELADO';

export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'ASSIGN'
  | 'UPLOAD'
  | 'DOWNLOAD'
  | 'STATUS_CHANGE'
  | 'LOGIN'
  | 'LOGOUT';

export interface WorkflowTransition {
  id: string;
  entity_id: string;
  entity_type: string; // e.g. 'nationalization', 'company', 'application', 'social_project'
  from_state: WorkflowState | string;
  to_state: WorkflowState | string;
  user_id: string;
  user_name: string;
  user_role: string;
  comment?: string;
  attached_documents?: string[];
  created_at: string;
}

export type UserStatus = 'active' | 'pending' | 'inactive' | 'suspended';

export type CompanyUserRole = 'admin' | 'hr' | 'technical' | 'viewer' | 'editor';
export type OrgUserRole = 'admin' | 'hr' | 'technical' | 'viewer';

export interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  org_role: OrgUserRole;
  permissions: string[];
  status: 'active' | 'invited' | 'disabled';
  created_at: string;
}

export type Language = 'es' | 'en' | 'fr';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  avatar_url?: string;
  isOnline: boolean;
  is_online?: boolean; // Added for Supabase consistency
  permissions: string[];
  department?: string;
  status?: UserStatus;
  position?: string;
  companyId?: string;
  organization_id?: string;
  companyRole?: CompanyUserRole;
  org_role?: OrgUserRole;
  verification_status?: 'pending' | 'verified' | 'rejected';
  bio?: string;
  phone?: string;
  cv_url?: string;
  last_seen?: string; // Added for WhatsApp-like features
  allow_search?: boolean; // Toggle for whether user is searchable by other users
  linkedin_url?: string; // URL to LinkedIn profile
  linkedin_profile?: {
    headline?: string;
    summary?: string;
    skills?: string[];
    experience?: Array<{ company: string; position: string; period: string }>;
  }; // Imported LinkedIn profile data
}

export type ProfileVisibility = 'PRIVADO' | 'MINISTERIO' | 'EMPRESAS_AUTORIZADAS';

export type NationalizationWorkflowStatus = 
  | 'REGISTRADO'
  | 'EN_REVISION'
  | 'EVALUACION'
  | 'CANDIDATO_IDENTIFICADO'
  | 'PLAN_TRANSFERENCIA'
  | 'FORMACION'
  | 'SEGUIMIENTO'
  | 'PROPUESTA_NACIONALIZACION'
  | 'APROBADO'
  | 'NACIONALIZADO'
  | 'CERRADO';

export interface TalentProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  national_id?: string; // DIP / Pasaporte
  birth_date?: string;
  nationality: string;
  phone?: string;
  email: string;
  locality?: string;
  province?: string; // Bioko Norte, Litoral, Kie-Ntem, etc.
  region?: 'Insular' | 'Continental';
  
  // Professional details
  profession: string;
  specialty: string;
  professional_level: 'Junior' | 'Intermedio' | 'Senior' | 'Especialista' | 'Directivo';
  experience_years: number;
  sector: string;
  availability: 'Inmediata' | '1 mes' | '3 meses' | 'No disponible';
  preferred_location?: string;
  avatar_url?: string;
  cv_url?: string;

  // Visibility and completeness
  visibility: ProfileVisibility;
  completeness_percentage: number;

  // Embedded nested details
  education: Array<{
    institution: string;
    degree: string;
    level: string;
    graduation_year: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    sector: string;
    start_date: string;
    end_date?: string;
    description: string;
  }>;
  certifications: Array<{
    title: string;
    institution: string;
    issue_date: string;
    expiry_date?: string;
    file_url?: string;
  }>;
  skills: string[];
  documents: Array<{
    name: string;
    category: string;
    file_url: string;
    upload_date: string;
  }>;

  created_at: string;
  updated_at: string;
}

export interface ExpatriateRecord {
  id: string;
  company_id: string;
  company_name: string;
  full_name: string;
  nationality: string;
  origin_country: string;
  position: string;
  specialty: string;
  department: string;
  arrival_date: string;
  contract_duration_months: number;
  nationalization_possibility: 'Alta' | 'Media' | 'Baja' | 'No reemplazable';
  status: 'Activo' | 'En proceso de reemplazo' | 'Sustituido' | 'Finalizado';
  assigned_shadow_id?: string;
  assigned_shadow_name?: string;
  observations?: string;
  created_at: string;
}

export interface NationalizationPosition {
  id: string;
  company_id: string;
  company_name: string;
  position_title: string;
  department: string;
  occupant_name: string;
  occupant_type: 'NACIONAL' | 'EXPATRIADO';
  nationalization_possibility: 'Alta' | 'Media' | 'Baja' | 'No reemplazable';
  status: NationalizationWorkflowStatus;
  priority: 'Alta' | 'Media' | 'Baja';
  identified_candidate_id?: string;
  identified_candidate_name?: string;
  target_date?: string;
  transfer_plan_id?: string;
  requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface CompetencyGap {
  competency: string;
  required_level: number; // 1-5 (1: Básico, 2: Inicial, 3: Intermedio, 4: Avanzado, 5: Experto)
  current_level: number; // 1-5
  gap: number;
  action_plan: string;
  recommended_course?: string;
  recommended_centre?: string;
}

export interface TransferPlan {
  id: string;
  position_id: string;
  position_title: string;
  company_name: string;
  expatriate_name: string;
  local_candidate_name: string;
  local_candidate_id: string;
  mentor_name: string;
  competencies: CompetencyGap[];
  start_date: string;
  target_date: string;
  progress_percentage: number;
  status: 'EN_CURSO' | 'PENDIENTE_EVALUACION' | 'COMPLETADO';
  observations?: string;
  updated_at: string;
}

// ==========================================
// PRE-NOTIFICACIÓN DE EXPATRIADOS
// ==========================================
export type ExpatriatePrenotificationStatus = 
  | 'BORRADOR'
  | 'ENVIADA'
  | 'EN_REVISION'
  | 'SOLICITUD_DE_INFORMACION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'CANCELADA';

export interface ExpatriatePrenotification {
  id: string;
  company_id: string;
  company_name: string;
  full_name: string;
  nationality: string;
  origin_country: string;
  profession: string;
  specialty: string;
  proposed_position: string;
  department?: string;
  proposed_entry_date: string;
  proposed_duration_months: number;
  is_key_position: boolean;
  justification: string;
  related_national_candidate_id?: string;
  related_national_candidate_name?: string;
  documents?: Array<{ name: string; url: string; category?: string }>;
  observations?: string;
  status: ExpatriatePrenotificationStatus;
  created_at: string;
  updated_at: string;
}

// ==========================================
// PASANTÍAS / ROTACIONES / EVALUACIONES
// ==========================================
export type InternshipStatus = 
  | 'CONVOCATORIA'
  | 'SELECCION'
  | 'EN_CURSO'
  | 'EN_EVALUACION'
  | 'COMPLETADA'
  | 'INCORPORADO'
  | 'CANCELADA';

export interface InternshipRotation {
  id: string;
  internship_id: string;
  department: string;
  area_supervisor: string;
  start_date: string;
  end_date: string;
  objectives: string;
  competencies_evaluated?: string[];
  performance_score?: number; // 1 - 100
  supervisor_comments?: string;
  status: 'PROGRAMADA' | 'EN_CURSO' | 'EVALUADA';
  created_at: string;
}

export interface InternshipEvaluation {
  id: string;
  internship_id: string;
  rotation_id?: string;
  evaluator_name: string;
  evaluator_role: string;
  evaluation_date: string;
  evaluation_type: 'INTERMEDIA' | 'ROTACION' | 'FINAL';
  scores: {
    technical_competence: number; // 1-5
    punctuality_and_discipline: number; // 1-5
    teamwork: number; // 1-5
    adaptability: number; // 1-5
    overall_score: number; // 1-100
  };
  comments: string;
  created_at: string;
}

export interface Internship {
  id: string;
  company_id: string;
  company_name: string;
  candidate_id: string;
  candidate_name: string;
  mentor_id?: string;
  mentor_name?: string;
  program_name: string;
  call_title: string;
  start_date: string;
  end_date: string;
  objectives: string;
  status: InternshipStatus;
  final_result?: 'EXCELENTE' | 'SATISFACTORIO' | 'NECESITA_REFORZAMIENTO' | 'NO_SATISFACTORIO';
  final_recommendation?: 'INCORPORACION_INMEDIATA' | 'FORMACION_ADICIONAL' | 'CONTRATACION_TEMPORAL' | 'NO_RECOMENDADO';
  final_report_url?: string;
  rotations?: InternshipRotation[];
  evaluations?: InternshipEvaluation[];
  created_at: string;
  updated_at: string;
}

export interface TalentMatchingResult {
  candidate_id: string;
  candidate_name: string;
  profession: string;
  specialty: string;
  experience_years: number;
  compatibility_score: number; // 0 - 100%
  breakdown: {
    professionMatch: boolean;
    specialtyMatch: boolean;
    experienceScore: number;
    educationScore: number;
    certificationScore: number;
  };
  explanation: string;
  ai_insights?: string;
}

export interface AuditActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  avatar?: string;
  action: string;
  entityId: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

export interface PublicWork {
  id: string;
  title: string;
  responsibleCompany: string;
  status: 'execution' | 'delayed' | 'final_phase';
  progress: number;
  deliveryDate: string;
  location: string;
}

export interface HelpRequest {
  id: string;
  companyName: string;
  type: 'legal' | 'technical' | 'financial';
  date: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'reviewed' | 'resolved' | 'completed' | 'open' | 'in-progress';
  title?: string;
  description?: string;
  user_email?: string;
  category?: string;
  created_at?: string;
  company?: { name: string };
}

export interface WebCategory {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  status: 'published' | 'draft';
  availableLanguages: Language[];
  available_languages?: Language[];
}

export interface Notification {
  id: string;
  type: 'critical' | 'opportunity' | 'application' | 'message' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  category?: string;
  metadata?: any;
}

export interface CompanyDocument {
  id: string;
  name: string;
  category: 'Legal' | 'Financiero' | 'Técnico' | 'Seguros';
  status: 'approved' | 'pending' | 'rejected' | 'expired';
  uploadDate: string;
  expiryDate?: string;
  size: string;
  format: string;
  feedback?: string;
}

export interface Company {
  id: string;
  name: string;
  taxId: string;
  rugeId: string;
  type: 'local' | 'international';
  sector: string[];
  status: 'certified' | 'pending' | 'expired' | 'rejected' | 'suspended';
  rating: number;
  badges: BadgeType[];
  certificationLevel: 'basic' | 'standard' | 'premium' | 'elite';
  complianceScore: number;
  nationalEmployeeCount: number;
  totalEmployeeCount: number;
  localSpendPercentage: number;
  auditHistory: AuditLog[];
  address: string;
  phone: string;
  email: string;
  legalRepresentative: {
    name: string;
    avatar?: string;
  };
  registrationDate: string;
  lat?: number;
  lng?: number;
  // Phase 3 Extended fields
  tradeName?: string;
  trade_name?: string;
  constitutionDate?: string;
  constitution_date?: string;
  province?: string;
  city?: string;
  region?: string;
  operationalContactName?: string;
  operational_contact_name?: string;
  operationalContactEmail?: string;
  operational_contact_email?: string;
  operationalContactPhone?: string;
  operational_contact_phone?: string;
  technicalStaffCount?: number;
  technical_staff_count?: number;
  technicalCapacitySummary?: string;
  technical_capacity_summary?: string;
  facilitiesEquipment?: string;
  facilities_equipment?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'suspended' | 'information_requested';
  verification_status?: 'pending' | 'verified' | 'rejected' | 'suspended' | 'information_requested';
  verifiedBy?: string;
  verified_by?: string;
  verifiedAt?: string;
  verified_at?: string;
  verificationNotes?: string;
  verification_notes?: string;
  isLocalContentCertified?: boolean;
  is_local_content_certified?: boolean;
}

export interface ServiceCatalogItem {
  id: string;
  code: string;
  category: string;
  name: string;
  description?: string;
  requires_certification: boolean;
  standard_requirements: string[];
  is_active: boolean;
  created_at?: string;
}

export interface CompanyService {
  id: string;
  company_id: string;
  service_id?: string;
  service_name: string;
  category: string;
  experience_years: number;
  technical_description?: string;
  certifications: string[];
  evidence_document_url?: string;
  verification_status: 'declarado' | 'verificado' | 'en_revision' | 'rechazado';
  verified_by?: string;
  verified_at?: string;
  created_at?: string;
}

export interface CompanyProjectReference {
  id: string;
  company_id: string;
  client_name: string;
  project_title: string;
  sector?: string;
  contract_value?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
  is_hydrocarbon_sector: boolean;
  reference_contact?: string;
  created_at?: string;
}

export type OpportunityWorkflowStage = 
  | 'BORRADOR'
  | 'PUBLICADA'
  | 'PRESELECCION'
  | 'LICITACION'
  | 'ADJUDICADA'
  | 'DESIERTA'
  | 'CANCELADA';

export interface OpportunityShortlist {
  id: string;
  opportunity_id: string;
  company_id: string;
  company_name?: string;
  shortlisted_by?: string;
  match_score: number;
  criteria_evaluated: Record<string, boolean | number | string>;
  match_explanation?: string;
  status: 'preseleccionada' | 'remitida_a_operadora' | 'invitada' | 'descartada';
  ministry_recommendation_notes?: string;
  remitted_at?: string;
  created_at: string;
  company?: Company;
}

export interface LocalCompanyMatchResult {
  company: Company;
  matchScore: number;
  meetsServiceRequirement: boolean;
  meetsExperienceRequirement: boolean;
  meetsCertificationRequirement: boolean;
  meetsLocalContentRequirement: boolean;
  explanation: string;
  reasons: string[];
  matchingServices: CompanyService[];
}

export type CompanyExt = Company;
export type InspectionExt = Inspection & {
  company?: Company;
  site?: string;
  priority?: 'high' | 'medium' | 'low';
};
export type ConversationExt = Conversation;
export type MessageExt = Message;

export interface AuditLog {
  id: string;
  date: string;
  officer: string;
  result: 'passed' | 'failed' | 'conditional';
  notes: string;
  action?: string;
  entity_id?: string;
  timestamp?: string;
}

export enum BadgeType {
  NATIONAL_CONTENT = 'national_content',
  COMPLIANT = 'compliant',
  TOP_EMPLOYER = 'top_employer',
  ESG_COMMITTED = 'esg_committed'
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  company_id?: string;
  status?: string;
  created_at?: string;
}

export interface Opportunity {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: string;
  budget: number;
  deadline: string;
  status: 'published' | 'closed' | 'awarded' | 'under_review' | string;
  petroleraId: string;
  petrolera_id?: string;
  location: string;
  requirements: string[];
  image?: string;
  ref?: string;
  tag?: string;
  projectId?: string;
  project_id?: string;
  awardedAmount?: number;
  awarded_amount?: number;
  scopeOfWork?: string;
  scope_of_work?: string;
  // Phase 3 Extended fields
  contractingCompanyId?: string;
  contracting_company_id?: string;
  requiredCapabilities?: string[];
  required_capabilities?: string[];
  requiredServices?: string[];
  required_services?: string[];
  minimumLocalContentScore?: number;
  minimum_local_content_score?: number;
  minimumExperienceYears?: number;
  minimum_experience_years?: number;
  workflowStage?: OpportunityWorkflowStage;
  workflow_stage?: OpportunityWorkflowStage;
  shortlistPublishedAt?: string;
  shortlist_published_at?: string;
  // Phase 4 Extended fields
  biddingRulesUrl?: string;
  bidding_rules_url?: string;
  tenderOpeningDate?: string;
  tender_opening_date?: string;
  tenderClosingDate?: string;
  tender_closing_date?: string;
  evaluationCriteria?: Record<string, any>;
  evaluation_criteria?: Record<string, any>;
  awardedCompanyId?: string;
  awarded_company_id?: string;
  awardDate?: string;
  award_date?: string;
  awardResolutionUrl?: string;
  award_resolution_url?: string;
  awardJustification?: string;
  award_justification?: string;
}

export type OpportunityExt = Opportunity;

export interface Application {
  id: string;
  opportunityId: string;
  opportunity_id?: string;
  companyId: string;
  company_id?: string;
  status: 'submitted' | 'under_review' | 'technically_accepted' | 'technically_rejected' | 'financially_evaluated' | 'shortlisted' | 'awarded' | 'rejected' | 'withdrawn' | string;
  submittedAt: string;
  submitted_at?: string;
  documents: string[];
  feedback?: string;
  ref: string;
  projectName: string;
  project_name?: string;
  step: number;
  ministerComment?: string;
  minister_comment?: string;
  actionRequired?: boolean;
  action_required?: boolean;
  company?: { name: string };
  opportunity?: { title: Record<Language, string> };
  // Phase 3 Extended fields
  proposalAmount?: number;
  proposal_amount?: number;
  technicalProposalUrl?: string;
  technical_proposal_url?: string;
  financialProposalUrl?: string;
  financial_proposal_url?: string;
  localContentProposalPercentage?: number;
  local_content_proposal_percentage?: number;
  evaluationNotes?: string;
  evaluation_notes?: string;
  awardReason?: string;
  award_reason?: string;
  // Phase 4 Extended fields
  technicalSummary?: string;
  technical_summary?: string;
  financialProposalAmount?: number;
  financial_proposal_amount?: number;
  currency?: string;
  localContentPercentage?: number;
  local_content_percentage?: number;
  localWorkforceCount?: number;
  local_workforce_count?: number;
  localServicesPlanned?: any[];
  local_services_planned?: any[];
  localSubcontractingPlanned?: any[];
  local_subcontracting_planned?: any[];
  awardDate?: string;
  award_date?: string;
  evaluationScore?: number;
  evaluation_score?: number;
}

export type ApplicationExt = Application;

export interface JobOffer {
  id: string;
  title: Record<Language, string>;
  companyId: string;
  location: string;
  salary?: string;
  tags: string[];
  postedAt: string;
  posted_at?: string;
  description: Record<Language, string>;
  category: string;
  status?: 'published' | 'draft' | 'closed' | 'active';
}

export interface CandidateProfile {
  userId: string;
  skills: string[];
  experience: WorkExperience[];
  education?: any[];
  cvUrl?: string;
  cv_url?: string;
  bio?: string;
  phone?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  admin_comment?: string;
  certification_number?: string;
  verified_at?: string;
  verified_by?: string;
  savedJobs: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface SocialProject {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  impact: string;
  location: string;
  image: string;
  petroleraId: string;
  status: 'proposed' | 'active' | 'completed' | 'in-progress' | 'delayed';
  budget: number;
  progress: number;
  endDate: string;
  investor: string;
  lat: number;
  lng: number;
  beneficiaries?: number;
  category?: string;
  petrolera?: { name: string };
  delivery_date?: string;
  deliveryDate?: string;
}

export type SocialProjectExt = SocialProject;

export interface NewsArticle {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  content: Record<Language, string>;
  category: string;
  status: 'draft' | 'pending' | 'published';
  author: string;
  publish_date: string;
  featuredImage?: string;
  attachments: NewsAttachment[];
  url?: string;
}

export interface NewsAttachment {
  id: string;
  name: string;
  size: string;
  format: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  avatar: string;
  lastMessage: string;
  last_message?: string;
  timestamp: string;
  unreadCount: number;
  unread_count?: number;
  isOnline: boolean;
  is_online?: boolean;
  type?: 'direct' | 'group';
  name?: string;
  avatar_url?: string;
  participant_1?: string;
  participant_2?: string;
  last_message_at?: string;
  participant?: {
    name: string;
    avatar_url: string;
    role: string;
    is_online?: boolean;
  };
  participant2?: {
    name: string;
    avatar_url: string;
    role: string;
    is_online?: boolean;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  conversation_id?: string;
  senderId: string;
  sender_id?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  is_read?: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
  sender?: {
    name: string;
    avatar_url: string;
    role: string;
  };
}

export interface UserStatusUpdate {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content_url: string;
  type: 'image' | 'video' | 'text';
  text_content?: string;
  timestamp: string;
  expires_at: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  portalVersion: string;
  lastBackup: string;
}

export interface Milestone {
  id: string;
  description: string;
  deadline: string;
  status: 'pending' | 'scheduled' | 'in_review' | 'completed' | 'overdue' | string;
  contract_id?: string;
  contractId?: string;
  title?: string;
  completionDate?: string;
  completion_date?: string;
  amount?: number;
  currency?: string;
  progressPercentage?: number;
  progress_percentage?: number;
  deliverables?: Array<{
    id?: string;
    name: string;
    url: string;
    uploadDate?: string;
    format?: string;
    size?: string;
    [key: string]: any;
  }>;
  nationalContentVerified?: boolean;
  national_content_verified?: boolean;
  verificationNotes?: string;
  verification_notes?: string;
  verifiedBy?: string;
  verified_by?: string;
  verifiedAt?: string;
  verified_at?: string;
  created_at?: string;
}

export type ContractMilestone = Milestone;

export interface Contract {
  id: string;
  ref: string;
  title: string | Record<Language, string>;
  awardedTo: string;
  awarded_to?: string;
  companyId: string;
  company_id?: string;
  opportunityId?: string;
  opportunity_id?: string;
  status: 'execution' | 'pending' | 'completed' | 'canceled' | 'draft' | 'signed' | 'suspended' | 'rescinded' | string;
  value: number;
  startDate: string;
  start_date?: string;
  endDate: string;
  end_date?: string;
  location: string;
  progress: number;
  nationalCompliance: {
    localStaff: number;
    localStaffReq: number;
    localGoods: number;
    localGoodsReq: number;
  };
  national_compliance?: {
    localStaff?: number;
    localStaffReq?: number;
    localGoods?: number;
    localGoodsReq?: number;
    [key: string]: any;
  };
  milestones: Milestone[];
  company?: { name: string };
  // Phase 4 Extended fields
  applicationId?: string;
  application_id?: string;
  contractingCompanyId?: string;
  contracting_company_id?: string;
  contractingCompany?: { id: string; name: string };
  currency?: string;
  scopeOfWork?: string;
  scope_of_work?: string;
  targetLocalWorkforcePct?: number;
  target_local_workforce_pct?: number;
  targetLocalProcurementPct?: number;
  target_local_procurement_pct?: number;
  technologyTransferPlan?: string;
  technology_transfer_plan?: string;
  trainingPlan?: string;
  training_plan?: string;
  localSubcontractors?: any[];
  local_subcontractors?: any[];
  signedDate?: string;
  signed_date?: string;
  completionDate?: string;
  completion_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenderEvaluation {
  id: string;
  application_id: string;
  applicationId?: string;
  opportunity_id: string;
  opportunityId?: string;
  evaluator_user_id?: string;
  evaluatorUserId?: string;
  evaluator_name?: string;
  evaluatorName?: string;
  technical_score: number;
  technicalScore?: number;
  financial_score: number;
  financialScore?: number;
  local_content_score: number;
  localContentScore?: number;
  compliance_score: number;
  complianceScore?: number;
  total_weighted_score: number;
  totalWeightedScore?: number;
  operator_verdict: 'recommended' | 'acceptable' | 'rejected' | 'under_evaluation' | string;
  operatorVerdict?: string;
  operator_notes?: string;
  operatorNotes?: string;
  ministry_oversight_notes?: string;
  ministryOversightNotes?: string;
  criteria_breakdown?: Record<string, any>;
  criteriaBreakdown?: Record<string, any>;
  evaluated_at?: string;
  evaluatedAt?: string;
  created_at?: string;
  updated_at?: string;
  application?: Application;
  evaluator?: User;
}

export interface ContractComplianceReport {
  id: string;
  contract_id: string;
  contractId?: string;
  company_id: string;
  companyId?: string;
  contracting_company_id?: string;
  contractingCompanyId?: string;
  reporting_period: string;
  reportingPeriod?: string;
  submission_date?: string;
  submissionDate?: string;
  local_workforce_direct: number;
  localWorkforceDirect?: number;
  local_workforce_indirect: number;
  localWorkforceIndirect?: number;
  expatriate_workforce: number;
  expatriateWorkforce?: number;
  local_workforce_actual_pct: number;
  localWorkforceActualPct?: number;
  local_expenditure_amount: number;
  localExpenditureAmount?: number;
  total_expenditure_period: number;
  totalExpenditurePeriod?: number;
  currency: string;
  local_expenditure_actual_pct: number;
  localExpenditureActualPct?: number;
  trainings_conducted?: any[];
  trainingsConducted?: any[];
  tech_transfer_milestones?: any[];
  techTransferMilestones?: any[];
  local_subcontractors_utilized?: any[];
  localSubcontractorsUtilized?: any[];
  discrepancies_detected?: string;
  discrepanciesDetected?: string;
  compliance_evaluation: 'CONFORME' | 'ALERTA' | 'REQUIERE_REVISION' | string;
  complianceEvaluation?: string;
  evidence_documents?: any[];
  evidenceDocuments?: any[];
  ministry_review_status: 'PRESENTADO' | 'EN_REVISION' | 'APROBADO' | 'OBSERVADO' | 'RECHAZADO' | string;
  ministryReviewStatus?: string;
  ministry_reviewer_id?: string;
  ministryReviewerId?: string;
  ministry_opinion_notes?: string;
  ministryOpinionNotes?: string;
  reviewed_at?: string;
  reviewedAt?: string;
  created_at?: string;
  updated_at?: string;
  contract?: Contract;
  company?: Company;
}

export interface Certification {
  id: string;
  user_id: string;
  title: string;
  institution: string;
  issue_date: string;
  expiry_date?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  file_url?: string;
  category?: string;
  progress?: number;
}

export interface Inspection {
  id: string;
  companyId: string;
  date: string;
  type: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'pending';
  officer: string;
  notes?: string;
}
