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
import {
  MOCK_USERS,
  MOCK_NEWS_ARTICLES,
  MOCK_CONTRACTS,
  MOCK_WEB_CATEGORIES,
  MOCK_HELP_REQUESTS,
  MOCK_COMPANIES,
  MOCK_OPPORTUNITIES,
  MOCK_JOBS,
  MOCK_SOCIAL_PROJECTS,
  MOCK_MESSAGES,
  MOCK_APPLICATIONS,
  MOCK_COMPANY_DOCUMENTS,
  MOCK_AUDIT_LOGS,
  MOCK_CONVERSATIONS
} from './mockService';

// Helper to check if supabase client is available and active
const isSupabaseActive = () => {
  return !!supabase;
};

// ==========================================
// STORAGE
// ==========================================
export const uploadFile = async (bucket: string, path: string, base64Data: string, contentType: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
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
  } catch (error) {
    console.warn(`uploadFile to bucket '${bucket}' failed. Falling back to mock response:`, error);
    return { path, fullPath: `${bucket}/${path}` };
  }
};

// ==========================================
// ADVERTISEMENTS
// ==========================================
export const getAdvertisements = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getAdvertisements failed. Falling back to mock data:', error);
    return [
      { 
        id: 'ad-1', 
        title: 'Portal RUGE', 
        description: 'Regístrese en el Registro Único de Empresas de Guinea Ecuatorial', 
        image_url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=400&auto=format&fit=crop', 
        link: '/register', 
        status: 'active', 
        start_date: '2024-01-01', 
        end_date: '2025-12-31' 
      }
    ];
  }
};

export const createAdvertisement = async (advertisementData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('advertisements').insert([advertisementData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createAdvertisement failed. Falling back to mock response:', error);
    return { id: `ad-${Date.now()}`, ...advertisementData, created_at: new Date().toISOString() };
  }
};

export const deleteAdvertisement = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('advertisements').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.warn(`deleteAdvertisement for id '${id}' failed. Mock deletion successful:`, error);
  }
};

export const updateAdvertisement = async (id: string, adData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('advertisements').update(adData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateAdvertisement for id '${id}' failed. Falling back to mock response:`, error);
    return { id, ...adData };
  }
};

// ==========================================
// DOCUMENTS
// ==========================================
export const getDocuments = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('documents').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getDocuments failed. Falling back to mock documents:', error);
    return MOCK_COMPANY_DOCUMENTS;
  }
};

// ==========================================
// USERS
// ==========================================
export const getUsers = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getUsers failed. Falling back to MOCK_USERS:', error);
    return MOCK_USERS;
  }
};

export const getUserById = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`getUserById for '${id}' failed. Falling back to MOCK_USERS search:`, error);
    return MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];
  }
};

export const createUser = async (userData: Partial<User>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('users').insert([userData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createUser failed. Falling back to mock user creation:', error);
    return { id: userData.id || `u-${Date.now()}`, ...userData };
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('users').update(userData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateUser for '${id}' failed. Falling back to mock response:`, error);
    return { id, ...userData };
  }
};

export const updateOpportunity = async (id: string, opportunityData: Partial<Opportunity>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('opportunities').update(opportunityData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateOpportunity for '${id}' failed. Falling back to mock response:`, error);
    return { id, ...opportunityData };
  }
};

// ==========================================
// COMPANIES
// ==========================================
export const getCompanies = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('companies').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getCompanies failed. Falling back to MOCK_COMPANIES:', error);
    return MOCK_COMPANIES;
  }
};

export const getCompanyById = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`getCompanyById for '${id}' failed. Falling back to MOCK_COMPANIES search:`, error);
    return MOCK_COMPANIES.find(c => c.id === id) || MOCK_COMPANIES[0];
  }
};

export const createCompany = async (companyData: Partial<Company>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('companies').insert([companyData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createCompany failed. Falling back to mock creation:', error);
    return { id: `c-${Date.now()}`, ...companyData };
  }
};

export const updateCompany = async (id: string, companyData: Partial<Company>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('companies').update(companyData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateCompany for '${id}' failed. Falling back to mock response:`, error);
    return { id, ...companyData };
  }
};

// ==========================================
// OPPORTUNITIES
// ==========================================
export const getOpportunities = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('opportunities').select('*, petrolera:users(name, email), project:projects(name)');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getOpportunities failed. Falling back to MOCK_OPPORTUNITIES:', error);
    return MOCK_OPPORTUNITIES;
  }
};

export const getOpportunityById = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('opportunities').select('*, petrolera:users(name, email)').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`getOpportunityById for '${id}' failed. Falling back to MOCK_OPPORTUNITIES search:`, error);
    const opp = MOCK_OPPORTUNITIES.find(o => o.id === id) || MOCK_OPPORTUNITIES[0];
    return {
      ...opp,
      petrolera: { name: 'Operadora Petrolera EG', email: 'ops@petrolera.gq' }
    };
  }
};

export const createOpportunity = async (opportunityData: Partial<Opportunity>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('opportunities').insert([opportunityData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createOpportunity failed. Falling back to mock response:', error);
    return { id: `opp-${Date.now()}`, ...opportunityData };
  }
};

// ==========================================
// APPLICATIONS
// ==========================================
export const getApplications = async (userId?: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    let query = supabase
      .from('applications')
      .select('*, opportunity:opportunities(*), company:companies(*)');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('submitted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getApplications failed. Falling back to MOCK_APPLICATIONS:', error);
    return MOCK_APPLICATIONS;
  }
};

export const getApplicationsByCompany = async (companyId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('applications').select('*, opportunity:opportunities(*), company:companies(*)').eq('company_id', companyId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getApplicationsByCompany for '${companyId}' failed. Falling back to MOCK_APPLICATIONS filter:`, error);
    return MOCK_APPLICATIONS.filter(app => app.companyId === companyId);
  }
};

export const createApplication = async (applicationData: Partial<Application>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('applications').insert([applicationData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createApplication failed. Falling back to mock response:', error);
    return { 
      id: `app-${Date.now()}`, 
      ...applicationData, 
      submittedAt: new Date().toLocaleDateString(),
      ref: `APP-${Math.floor(100 + Math.random() * 900)}`,
      projectName: 'Mantenimiento Plataforma Alba',
      step: 1
    };
  }
};

// ==========================================
// CONTRACTS & MILESTONES
// ==========================================
export const getContracts = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('contracts').select('*, company:companies(*), opportunity:opportunities(title, project:projects(name))');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getContracts failed. Falling back to MOCK_CONTRACTS:', error);
    return MOCK_CONTRACTS;
  }
};

export const getContractMilestones = async (contractId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('contract_milestones').select('*').eq('contract_id', contractId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getContractMilestones for '${contractId}' failed. Falling back to contract sub-milestones:`, error);
    const contract = MOCK_CONTRACTS.find(c => c.id === contractId);
    return contract?.milestones || [];
  }
};

// ==========================================
// SOCIAL PROJECTS
// ==========================================
export const getSocialProjects = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('social_projects').select('*, petrolera:users(name)');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getSocialProjects failed. Falling back to MOCK_SOCIAL_PROJECTS:', error);
    return MOCK_SOCIAL_PROJECTS;
  }
};

export const getSocialProjectById = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('social_projects').select('*, petrolera:users(name)').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`getSocialProjectById for '${id}' failed. Falling back to MOCK_SOCIAL_PROJECTS search:`, error);
    return MOCK_SOCIAL_PROJECTS.find(sp => sp.id === id) || MOCK_SOCIAL_PROJECTS[0];
  }
};

// ==========================================
// JOB OFFERS
// ==========================================
export const getJobOffers = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('job_offers').select('*, company:companies(name)');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getJobOffers failed. Falling back to MOCK_JOBS:', error);
    return MOCK_JOBS;
  }
};

// ==========================================
// NEWS ARTICLES
// ==========================================
export const getNewsArticles = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('news_articles').select('*').order('publish_date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getNewsArticles failed. Falling back to MOCK_NEWS_ARTICLES:', error);
    return MOCK_NEWS_ARTICLES;
  }
};

export const createNewsArticle = async (articleData: Partial<NewsArticle>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('news_articles').insert([articleData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createNewsArticle failed. Falling back to mock news article:', error);
    return { id: `art-${Date.now()}`, ...articleData, publish_date: new Date().toISOString() };
  }
};

export const updateNewsArticle = async (id: string, articleData: Partial<NewsArticle>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('news_articles').update(articleData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateNewsArticle for '${id}' failed. Falling back to mock response:`, error);
    return { id, ...articleData };
  }
};

export const deleteNewsArticle = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('news_articles').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.warn(`deleteNewsArticle for '${id}' failed. Mock deletion successful:`, error);
  }
};

// ==========================================
// PROJECTS
// ==========================================
export const getProjects = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getProjects failed. Falling back to mock projects:', error);
    return [
      { id: 'p-1', name: 'Bloque B Desarrollo', description: 'Proyecto de expansión petrolera en el Bloque B', status: 'active', created_at: new Date().toISOString() }
    ];
  }
};

export const createProject = async (projectData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('projects').insert([projectData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createProject failed. Falling back to mock response:', error);
    return { id: `p-${Date.now()}`, ...projectData, created_at: new Date().toISOString() };
  }
};

export const updateProject = async (id: string, projectData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('projects').update(projectData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateProject for '${id}' failed. Falling back to mock response:`, error);
    return { id, ...projectData };
  }
};

export const deleteProject = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.warn(`deleteProject for '${id}' failed. Mock deletion successful:`, error);
  }
};

export const getDocumentsByEntity = async (entityId: string, entityType: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('documents').select('*').eq('entity_id', entityId).eq('entity_type', entityType);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getDocumentsByEntity failed for '${entityId}'. Falling back to mock documents:`, error);
    return MOCK_COMPANY_DOCUMENTS;
  }
};

// ==========================================
// MESSAGES & CONVERSATIONS
// ==========================================
export const getConversations = async (userId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('conversations')
      .select('*, participant:users!conversations_participant_1_fkey(name, avatar_url, role, is_online), participant2:users!conversations_participant_2_fkey(name, avatar_url, role, is_online)')
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getConversations failed for '${userId}'. Falling back to MOCK_CONVERSATIONS:`, error);
    return MOCK_CONVERSATIONS;
  }
};

export const getMessagesByConversation = async (conversationId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users(name, role, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getMessagesByConversation failed for '${conversationId}'. Falling back to MOCK_MESSAGES:`, error);
    return MOCK_MESSAGES.filter(msg => msg.conversationId === conversationId);
  }
};

export const sendMessage = async (messageData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
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
  } catch (error) {
    console.warn('sendMessage failed. Falling back to mock message sending:', error);
    return { id: `m-${Date.now()}`, ...messageData, timestamp: new Date().toISOString() };
  }
};

export const createConversation = async (participant1: string, participant2: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ participant_1: participant1, participant_2: participant2 }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createConversation failed. Falling back to mock response:', error);
    return { id: `conv-${Date.now()}`, participant_1: participant1, participant_2: participant2 };
  }
};

// ==========================================
// GROUPS (Simulated using conversations for now if schema not updated)
// ==========================================
export const createGroup = async (name: string, members: string[], createdBy: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ 
        name, 
        type: 'group', 
        participant_1: createdBy,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createGroup failed. Falling back to mock response:', error);
    return { id: `group-${Date.now()}`, name, type: 'group', participant_1: createdBy };
  }
};

// ==========================================
// STATUS UPDATES
// ==========================================
export const getStatusUpdates = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    // Using simple mock since it's a transient view feature
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
  } catch (error) {
    console.warn('getStatusUpdates failed. Falling back to default list:', error);
    return [];
  }
};

// ==========================================
// AUDIT LOGS
// ==========================================
export const getAuditLogs = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('audit_logs').select('*, user:users(name, role)').order('timestamp', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getAuditLogs failed. Falling back to MOCK_AUDIT_LOGS:', error);
    return MOCK_AUDIT_LOGS;
  }
};

// ==========================================
// HELP REQUESTS
// ==========================================
export const getHelpRequests = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('help_requests').select('*, company:companies(name)').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getHelpRequests failed. Falling back to MOCK_HELP_REQUESTS:', error);
    return MOCK_HELP_REQUESTS;
  }
};

export const updateHelpRequest = async (id: string, updates: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('help_requests').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateHelpRequest for '${id}' failed. Falling back to mock response:`, error);
    return { id, ...updates };
  }
};

// ==========================================
// INSPECTIONS
// ==========================================
export const getInspections = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('inspections')
      .select('*, company:companies(name)')
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getInspections failed. Returning mock inspections:', error);
    return [
      { id: 'insp-1', company: { name: 'EG LNG Operations' }, date: '2024-11-10', status: 'approved', report_url: '#' }
    ];
  }
};

// ==========================================
// CERTIFICATIONS
// ==========================================
export const getCertifications = async (userId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getCertifications failed for '${userId}'. Returning mock certifications:`, error);
    return [
      { id: 'cert-1', user_id: userId, name: 'Certificación de Contenido Nacional MMH', status: 'active', date: '2024-01-15', expiry_date: '2026-01-15' }
    ];
  }
};

// ==========================================
// NOTIFICATIONS
// ==========================================
export const getNotifications = async (userId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getNotifications failed for '${userId}'. Returning mock notifications:`, error);
    return [
      { id: 'notif-1', user_id: userId, title: 'Bienvenido al Portal', content: 'Su registro se ha completado con éxito.', read: false, created_at: new Date().toISOString() }
    ];
  }
};

// ==========================================
// WEB CATEGORIES
// ==========================================
export const getWebCategories = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_categories').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getWebCategories failed. Falling back to MOCK_WEB_CATEGORIES:', error);
    return MOCK_WEB_CATEGORIES;
  }
};

// ==========================================
// REGISTRATION REQUESTS
// ==========================================
export const getRegistrationRequests = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('registration_requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getRegistrationRequests failed. Returning empty list:', error);
    return [];
  }
};

export const getRegistrationRequestByEmail = async (email: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('registration_requests').select('*').eq('email', email).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`getRegistrationRequestByEmail failed for '${email}'. Returning null:`, error);
    return null;
  }
};

export const createRegistrationRequest = async (requestData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('registration_requests').insert([requestData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createRegistrationRequest failed. Falling back to mock creation:', error);
    return { id: `req-${Date.now()}`, ...requestData, created_at: new Date().toISOString() };
  }
};

export const updateRegistrationRequest = async (id: string, requestData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('registration_requests').update(requestData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateRegistrationRequest for '${id}' failed. Falling back to mock update:`, error);
    return { id, ...requestData };
  }
};

// ==========================================
// WEB BANNERS (SUPER ADMIN BANNERS MANAGEMENT)
// ==========================================

export const DEFAULT_BANNERS = [
  // Home Hero banners
  { id: 'home_hero_0', page_key: 'home', banner_key: 'hero_0', image_url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop', title: 'Plataforma Oficial' },
  { id: 'home_hero_1', page_key: 'home', banner_key: 'hero_1', image_url: 'https://images.unsplash.com/photo-1544333346-645472894670?q=80&w=2070&auto=format&fit=crop', title: 'Soberanía y Desarrollo' },
  { id: 'home_hero_2', page_key: 'home', banner_key: 'hero_2', image_url: 'https://images.unsplash.com/photo-1567789391039-05677397c559?q=80&w=2070&auto=format&fit=crop', title: 'Talento Local' },
  // Landing Hero banners
  { id: 'landing_hero_0', page_key: 'landing', banner_key: 'hero_0', image_url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop', title: 'Guinea Ecuatorial Offshore' },
  { id: 'landing_hero_1', page_key: 'landing', banner_key: 'hero_1', image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop', title: 'Plantas Industriales' },
  { id: 'landing_hero_2', page_key: 'landing', banner_key: 'hero_2', image_url: 'https://images.unsplash.com/photo-1535730143503-a26507397bb6?q=80&w=2070&auto=format&fit=crop', title: 'Refinerías de Punta Europa' },
  { id: 'landing_hero_3', page_key: 'landing', banner_key: 'hero_3', image_url: 'https://images.unsplash.com/photo-1513828583815-c4550fa574bf?q=80&w=2070&auto=format&fit=crop', title: 'Desarrollo Energético' },
  // Other page banners
  { id: 'opportunities_banner', page_key: 'opportunities', banner_key: 'main_banner', image_url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop', title: 'Oportunidades de Licitación' },
  { id: 'news_banner', page_key: 'news', banner_key: 'main_banner', image_url: 'https://images.unsplash.com/photo-1513828583815-c4550fa574bf?q=80&w=2070&auto=format&fit=crop', title: 'Noticias y Comunicados' },
  { id: 'laws_banner', page_key: 'laws', banner_key: 'main_banner', image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop', title: 'Leyes y Normativas' },
  { id: 'about_banner', page_key: 'about', banner_key: 'main_banner', image_url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop', title: 'Sobre Nosotros' },
];

export const getWebBanners = async () => {
  try {
    if (!isSupabaseActive()) return DEFAULT_BANNERS;
    const { data, error } = await supabase.from('web_banners').select('*');
    if (error) {
      // Si la tabla no existe, Supabase dará un error. Capturamos esto con gracia.
      console.warn('web_banners table might not exist yet. Returning defaults.');
      return DEFAULT_BANNERS;
    }
    
    if (!data || data.length === 0) {
      return DEFAULT_BANNERS;
    }
    
    // Fusionar por ID para sobrescribir los valores por defecto con los configurados en BD
    const bannersMap = new Map(DEFAULT_BANNERS.map(b => [b.id, b]));
    data.forEach((b: any) => {
      bannersMap.set(b.id, {
        id: b.id,
        page_key: b.page_key,
        banner_key: b.banner_key,
        image_url: b.image_url,
        title: b.title || ''
      });
    });
    return Array.from(bannersMap.values());
  } catch (error) {
    console.warn("getWebBanners failed, returning defaults:", error);
    return DEFAULT_BANNERS;
  }
};

export const updateWebBanner = async (id: string, pageKey: string, bannerKey: string, imageUrl: string, title?: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const bannerData = {
      id,
      page_key: pageKey,
      banner_key: bannerKey,
      image_url: imageUrl,
      title: title || '',
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('web_banners').upsert([bannerData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateWebBanner failed for ${id}. Simulating success in state:`, error);
    return { id, page_key: pageKey, banner_key: bannerKey, image_url: imageUrl, title: title || '' };
  }
};

export const uploadBannerImage = async (pageKey: string, bannerKey: string, base64Data: string, fileExtension: string = 'jpg') => {
  try {
    if (!isSupabaseActive()) {
      return base64Data;
    }
    const bucket = 'banners';
    const path = `${pageKey}/${bannerKey}.${fileExtension}`;
    const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
    
    await uploadFile(bucket, path, base64Data, contentType);
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.warn("uploadBannerImage failed, returning base64/placeholder:", error);
    return base64Data;
  }
};


