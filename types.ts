
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FUNCIONARIO = 'funcionario',
  CUERPO_TECNICO = 'cuerpo_tecnico',
  PETROLERA = 'petrolera',
  COMPANY = 'company',
  EMPRESA = 'empresa',
  EMPRESA_LOCAL = 'empresa_local',
  PERSONA = 'persona',
  COMUNICACION = 'comunicacion',
  COMUNIDAD = 'comunidad',
  ADVERTISER = 'advertiser'
}

export type UserStatus = 'active' | 'pending' | 'inactive' | 'suspended';

export type CompanyUserRole = 'admin' | 'editor' | 'viewer';

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
  companyRole?: CompanyUserRole;
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
  status: 'published' | 'closed' | 'awarded' | 'under_review';
  petroleraId: string;
  location: string;
  requirements: string[];
  image?: string;
  ref?: string;
  tag?: string;
  projectId?: string;
  awardedAmount?: number;
  scopeOfWork?: string;
}

export type OpportunityExt = Opportunity;

export interface Application {
  id: string;
  opportunityId: string;
  companyId: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'awarded' | 'rejected';
  submittedAt: string;
  submitted_at?: string;
  documents: string[];
  feedback?: string;
  ref: string;
  projectName: string;
  step: number;
  ministerComment?: string;
  actionRequired?: boolean;
  company?: { name: string };
  opportunity?: { title: Record<Language, string> };
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
  cvUrl?: string;
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
  status: 'pending' | 'scheduled' | 'completed' | 'overdue';
}

export interface Contract {
  id: string;
  ref: string;
  title: string | Record<Language, string>;
  awardedTo: string;
  companyId: string;
  status: 'execution' | 'pending' | 'completed' | 'canceled';
  value: number;
  startDate: string;
  endDate: string;
  location: string;
  progress: number;
  nationalCompliance: {
    localStaff: number;
    localStaffReq: number;
    localGoods: number;
    localGoodsReq: number;
  };
  milestones: Milestone[];
  company?: { name: string };
}

export interface Certification {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  date: string;
  expiry: string;
  status: 'valid' | 'expired' | 'pending';
  fileUrl?: string;
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
