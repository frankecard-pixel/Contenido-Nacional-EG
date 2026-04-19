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
// STORAGE
// ==========================================
export const uploadFile = async (bucket: string, path: string, base64Data: string, contentType: string) => {
  // Convert base64 to Uint8Array for browser compatibility
  const base64String = base64Data.split(',')[1];
  const binaryString = window.atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const { data, error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType,
    upsert: true
  });
  if (error) throw error;
  return data;
};

// ==========================================
// ADVERTISEMENTS
// ==========================================
export const getAdvertisements = async () => {
  const { data, error } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createAdvertisement = async (advertisementData: any) => {
  const { data, error } = await supabase.from('advertisements').insert([advertisementData]).select().single();
  if (error) throw error;
  return data;
};

export const deleteAdvertisement = async (id: string) => {
  const { error } = await supabase.from('advertisements').delete().eq('id', id);
  if (error) throw error;
};

export const updateAdvertisement = async (id: string, adData: any) => {
  const { data, error } = await supabase.from('advertisements').update(adData).eq('id', id).select().single();
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

export const updateUser = async (id: string, userData: Partial<User>) => {
  const { data, error } = await supabase.from('users').update(userData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const updateOpportunity = async (id: string, opportunityData: Partial<Opportunity>) => {
  const { data, error } = await supabase.from('opportunities').update(opportunityData).eq('id', id).select().single();
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
  const { data, error } = await supabase.from('opportunities').select('*, petrolera:users(name, email), project:projects(name)');
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
  const { data, error } = await supabase.from('contracts').select('*, company:companies(*), opportunity:opportunities(title, project:projects(name))');
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

export const createNewsArticle = async (articleData: Partial<NewsArticle>) => {
  const { data, error } = await supabase.from('news_articles').insert([articleData]).select().single();
  if (error) throw error;
  return data;
};

export const updateNewsArticle = async (id: string, articleData: Partial<NewsArticle>) => {
  const { data, error } = await supabase.from('news_articles').update(articleData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteNewsArticle = async (id: string) => {
  const { error } = await supabase.from('news_articles').delete().eq('id', id);
  if (error) throw error;
};

// ==========================================
// PROJECTS
// ==========================================
export const getProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createProject = async (projectData: any) => {
  const { data, error } = await supabase.from('projects').insert([projectData]).select().single();
  if (error) throw error;
  return data;
};

export const updateProject = async (id: string, projectData: any) => {
  const { data, error } = await supabase.from('projects').update(projectData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
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
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('conversations')
    .select('*, participant:users!conversations_participant_1_fkey(name, avatar_url, role, is_online), participant2:users!conversations_participant_2_fkey(name, avatar_url, role, is_online)')
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('last_message_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getMessagesByConversation = async (conversationId: string) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users(name, role, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
};

export const sendMessage = async (messageData: any) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();
  
  if (error) throw error;

  // Update conversation last message
  await supabase
    .from('conversations')
    .update({ 
      last_message: messageData.text,
      last_message_at: new Date().toISOString()
    })
    .eq('id', messageData.conversation_id);

  return data;
};

export const createConversation = async (participant1: string, participant2: string) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ participant_1: participant1, participant_2: participant2 }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ==========================================
// GROUPS (Simulated using conversations for now if schema not updated)
// ==========================================
export const createGroup = async (name: string, members: string[], createdBy: string) => {
  if (!supabase) return null;
  // This would normally go to a 'groups' table
  // For now, let's assume we can use conversations with a type='group'
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ 
      name, 
      type: 'group', 
      participant_1: createdBy,
      // In a real app, we'd have a junction table for members
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ==========================================
// STATUS UPDATES
// ==========================================
export const getStatusUpdates = async () => {
  if (!supabase) return [];
  // Mocking status updates for now as it's a new feature
  return [
    {
      id: '1',
      user_id: 'u1',
      user_name: 'Juan Pérez',
      user_avatar: 'https://picsum.photos/seed/user1/200',
      content_url: 'https://picsum.photos/seed/status1/400/600',
      type: 'image',
      timestamp: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString()
    },
    {
      id: '2',
      user_id: 'u2',
      user_name: 'María García',
      user_avatar: 'https://picsum.photos/seed/user2/200',
      content_url: 'https://picsum.photos/seed/status2/400/600',
      type: 'image',
      timestamp: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString()
    }
  ];
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

export const updateHelpRequest = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('help_requests').update(updates).eq('id', id).select().single();
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
