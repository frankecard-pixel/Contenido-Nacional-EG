import { supabase } from './supabaseClient';
import { 
  Company, 
  Opportunity, 
  Application, 
  User, 
  SocialProject, 
  JobOffer, 
  NewsArticle, 
  Contract, 
  HelpRequest, 
  WebCategory,
  Message,
  Conversation
} from '../types';

// ==========================================
// USERS
// ==========================================
export const getUsers = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createUser = async (userData: Partial<User>) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('users').insert([userData]).select().single();
  if (error) throw error;
  return data;
};

// ==========================================
// COMPANIES
// ==========================================
export const getCompanies = async () => {
  const { data, error } = await supabase.from('companies').select('*');
  if (error) throw error;
  return data;
};

export const getCompanyById = async (id: string) => {
  const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createCompany = async (companyData: Partial<Company>) => {
  const { data, error } = await supabase.from('companies').insert([companyData]).select().single();
  if (error) throw error;
  return data;
};

export const updateCompany = async (id: string, companyData: Partial<Company>) => {
  const { data, error } = await supabase.from('companies').update(companyData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// ==========================================
// OPPORTUNITIES
// ==========================================
export const getOpportunities = async () => {
  const { data, error } = await supabase.from('opportunities').select('*, petrolera:users(name, email)');
  if (error) throw error;
  return data;
};

export const getOpportunityById = async (id: string) => {
  const { data, error } = await supabase.from('opportunities').select('*, petrolera:users(name, email)').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createOpportunity = async (opportunityData: Partial<Opportunity>) => {
  const { data, error } = await supabase.from('opportunities').insert([opportunityData]).select().single();
  if (error) throw error;
  return data;
};

// ==========================================
// APPLICATIONS
// ==========================================
export const getApplications = async (userId?: string) => {
  let query = supabase
    .from('applications')
    .select('*, opportunity:opportunities(*), company:companies(*)');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getApplicationsByCompany = async (companyId: string) => {
  const { data, error } = await supabase.from('applications').select('*, opportunity:opportunities(*), company:companies(*)').eq('company_id', companyId);
  if (error) throw error;
  return data;
};

export const createApplication = async (applicationData: Partial<Application>) => {
  const { data, error } = await supabase.from('applications').insert([applicationData]).select().single();
  if (error) throw error;
  return data;
};

// ==========================================
// CONTRACTS & MILESTONES
// ==========================================
export const getContracts = async () => {
  const { data, error } = await supabase.from('contracts').select('*, company:companies(*)');
  if (error) throw error;
  return data;
};

export const getContractMilestones = async (contractId: string) => {
  const { data, error } = await supabase.from('contract_milestones').select('*').eq('contract_id', contractId);
  if (error) throw error;
  return data;
};

// ==========================================
// SOCIAL PROJECTS
// ==========================================
export const getSocialProjects = async () => {
  const { data, error } = await supabase.from('social_projects').select('*, petrolera:users(name)');
  if (error) throw error;
  return data;
};

export const getSocialProjectById = async (id: string) => {
  const { data, error } = await supabase.from('social_projects').select('*, petrolera:users(name)').eq('id', id).single();
  if (error) throw error;
  return data;
};

// ==========================================
// JOB OFFERS
// ==========================================
export const getJobOffers = async () => {
  const { data, error } = await supabase.from('job_offers').select('*, company:companies(name)');
  if (error) throw error;
  return data;
};

// ==========================================
// NEWS ARTICLES
// ==========================================
export const getNewsArticles = async () => {
  const { data, error } = await supabase.from('news_articles').select('*').order('publish_date', { ascending: false });
  if (error) throw error;
  return data;
};

// ==========================================
// DOCUMENTS
// ==========================================
export const getDocuments = async () => {
  const { data, error } = await supabase.from('documents').select('*');
  if (error) throw error;
  return data;
};

export const getDocumentsByEntity = async (entityId: string, entityType: string) => {
  const { data, error } = await supabase.from('documents').select('*').eq('entity_id', entityId).eq('entity_type', entityType);
  if (error) throw error;
  return data;
};

// ==========================================
// MESSAGES & CONVERSATIONS
// ==========================================
export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, participant:users!conversations_participant_id_fkey(name, avatar_url, role)')
    .or(`user_id.eq.${userId},participant_id.eq.${userId}`)
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
};

export const getMessagesByConversation = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users(name, role)')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
};

// ==========================================
// AUDIT LOGS
// ==========================================
export const getAuditLogs = async () => {
  const { data, error } = await supabase.from('audit_logs').select('*, user:users(name, role)').order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
};

// ==========================================
// HELP REQUESTS
// ==========================================
export const getHelpRequests = async () => {
  const { data, error } = await supabase.from('help_requests').select('*, company:companies(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// ==========================================
// INSPECTIONS
// ==========================================
export const getInspections = async () => {
  const { data, error } = await supabase
    .from('inspections')
    .select('*, company:companies(name)')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
};
export const getCertifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
};
export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const getWebCategories = async () => {
  const { data, error } = await supabase.from('web_categories').select('*');
  if (error) throw error;
  return data;
};

// ==========================================
// REGISTRATION REQUESTS
// ==========================================
export const getRegistrationRequests = async () => {
  const { data, error } = await supabase.from('registration_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getRegistrationRequestByEmail = async (email: string) => {
  const { data, error } = await supabase.from('registration_requests').select('*').eq('email', email).single();
  if (error) throw error;
  return data;
};

export const createRegistrationRequest = async (requestData: any) => {
  const { data, error } = await supabase.from('registration_requests').insert([requestData]).select().single();
  if (error) throw error;
  return data;
};

export const updateRegistrationRequest = async (id: string, requestData: any) => {
  const { data, error } = await supabase.from('registration_requests').update(requestData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};
