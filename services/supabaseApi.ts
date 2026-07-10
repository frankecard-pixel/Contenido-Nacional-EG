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
  MOCK_CONVERSATIONS,
  MOCK_LEGAL_DOCS,
  MOCK_FAQS,
  MOCK_GUIDES,
  MOCK_TESTIMONIALS,
  MOCK_GALLERY_IMAGES
} from './mockService';

// Load mock data from localStorage if present to ensure persistence across refreshes
if (typeof window !== 'undefined') {
  const localCompanies = localStorage.getItem('MOCK_COMPANIES');
  if (localCompanies) {
    try {
      const parsed = JSON.parse(localCompanies);
      MOCK_COMPANIES.length = 0;
      MOCK_COMPANIES.push(...parsed);
    } catch (e) {
      console.warn('Error parsing MOCK_COMPANIES from localStorage:', e);
    }
  }

  const localUsers = localStorage.getItem('MOCK_USERS');
  if (localUsers) {
    try {
      const parsed = JSON.parse(localUsers);
      MOCK_USERS.length = 0;
      MOCK_USERS.push(...parsed);
    } catch (e) {
      console.warn('Error parsing MOCK_USERS from localStorage:', e);
    }
  }
}

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

export const getStoragePublicUrl = (bucket: string, path: string) => {
  try {
    if (!isSupabaseActive()) {
      return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop`;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || '';
  } catch (error) {
    console.warn(`getStoragePublicUrl failed for '${bucket}/${path}':`, error);
    return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop`;
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
    console.error('getAdvertisements failed:', error);
    return [];
  }
};

export const createAdvertisement = async (advertisementData: any, userId?: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    // Normalise link properties
    const payload = {
      ...advertisementData,
      link_url: advertisementData.link_url || advertisementData.link || '',
      created_by: userId,
      validation_status: 'approved' // Default to approved for now, or use logic based on role
    };
    
    const { data, error } = await supabase.from('advertisements').insert([payload]).select().single();
    if (error) {
      if (error.message && error.message.includes('column "format" of relation "advertisements" does not exist')) {
        // Fallback: strip format and serialize inside description
        const { format, ...rest } = payload;
        const fallbackDesc = `[FORMAT:${format || 'top_banner'}] ${rest.description || ''}`;
        const { data: retryData, error: retryError } = await supabase
          .from('advertisements')
          .insert([{ ...rest, description: fallbackDesc }])
          .select()
          .single();
        if (retryError) throw retryError;
        return { 
          ...retryData, 
          format: format || 'top_banner', 
          description: rest.description || '',
          link_url: retryData.link_url || retryData.link || ''
        };
      }
      throw error;
    }
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

export const updateAdvertisement = async (id: string, adData: any, userRole?: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    // Budget validation logic
    let payload = { ...adData };
    
    if (adData.budget !== undefined) {
      // Get current ad to check budget
      const { data: currentAd } = await supabase.from('advertisements').select('budget').eq('id', id).single();
      
      if (currentAd && adData.budget > currentAd.budget && userRole !== 'super_admin') {
        // If budget increases and not super_admin, set to pending validation
        payload = {
          ...adData,
          budget: currentAd.budget, // Keep current budget
          pending_budget: adData.budget, // Store new budget in pending
          validation_status: 'pending_validation'
        };
      } else if (userRole === 'super_admin') {
        // Super admin can update budget directly
        payload.validation_status = 'approved';
        payload.pending_budget = null;
      }
    }

    if (adData.link_url !== undefined) {
      payload.link_url = adData.link_url;
      payload.link = adData.link_url;
    } else if (adData.link !== undefined) {
      payload.link_url = adData.link;
      payload.link = adData.link;
    }
    
    const { data, error } = await supabase.from('advertisements').update(payload).eq('id', id).select().single();
    if (error) {
      if (error.message && error.message.includes('column "format" of relation "advertisements" does not exist')) {
        const { format, ...rest } = payload;
        if (format) {
          let currentDesc = rest.description;
          if (currentDesc === undefined) {
            const { data: existingAd } = await supabase.from('advertisements').select('description').eq('id', id).single();
            currentDesc = existingAd?.description || '';
          }
          const strippedDesc = currentDesc.replace(/^\[FORMAT:[^\]]+\]\s*/, '');
          rest.description = `[FORMAT:${format}] ${strippedDesc}`;
        }
        const { data: retryData, error: retryError } = await supabase
          .from('advertisements')
          .update(rest)
          .eq('id', id)
          .select()
          .single();
        if (retryError) throw retryError;
        return { 
          ...retryData, 
          format: format || 'top_banner', 
          description: rest.description || '',
          link_url: retryData.link_url || retryData.link || ''
        };
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.warn(`updateAdvertisement for id '${id}' failed. Falling back to mock response:`, error);
    return { id, ...adData };
  }
};

export const incrementAdImpressions = async (id: string, currentImpressions: number = 0) => {
  try {
    if (!isSupabaseActive()) return null;
    const { data, error } = await supabase
      .from('advertisements')
      .update({ impressions: (currentImpressions || 0) + 1 })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`incrementAdImpressions failed for id '${id}':`, error);
    return null;
  }
};

export const incrementAdClicks = async (id: string, currentClicks: number = 0) => {
  try {
    if (!isSupabaseActive()) return null;
    const { data, error } = await supabase
      .from('advertisements')
      .update({ clicks: (currentClicks || 0) + 1 })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`incrementAdClicks failed for id '${id}':`, error);
    return null;
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
export const mapDboToUser = (dbo: any) => {
  if (!dbo) return null;
  return {
    ...dbo,
    companyId: dbo.company_id || dbo.companyId,
    companyRole: dbo.company_role || dbo.companyRole || (dbo.role === 'company' || dbo.role === 'petrolera' ? 'admin' : 'viewer'),
    isOnline: dbo.is_online !== undefined ? dbo.is_online : (dbo.isOnline || false),
    permissions: Array.isArray(dbo.permissions) ? dbo.permissions : [],
    allow_search: dbo.allow_search !== undefined ? dbo.allow_search : true,
    linkedin_url: dbo.linkedin_url || '',
    linkedin_profile: dbo.linkedin_profile || null
  };
};

export const mapUserToDbo = (user: Partial<User>) => {
  const dbo: any = {};
  if (user.id !== undefined) dbo.id = user.id;
  if (user.email !== undefined) dbo.email = user.email;
  if (user.name !== undefined) dbo.name = user.name;
  if (user.role !== undefined) dbo.role = user.role;
  if (user.status !== undefined) dbo.status = user.status;
  if (user.department !== undefined) dbo.department = user.department;
  if (user.position !== undefined) dbo.position = user.position;
  if (user.avatar !== undefined) dbo.avatar = user.avatar;
  if (user.avatar_url !== undefined) dbo.avatar_url = user.avatar_url;
  
  if (user.companyId !== undefined) dbo.company_id = user.companyId;
  else if ((user as any).company_id !== undefined) dbo.company_id = (user as any).company_id;

  if (user.isOnline !== undefined) dbo.is_online = user.isOnline;
  
  if (user.permissions !== undefined) {
    dbo.permissions = Array.isArray(user.permissions) ? user.permissions : [];
  }
  
  if (user.allow_search !== undefined) dbo.allow_search = user.allow_search;
  if (user.linkedin_url !== undefined) dbo.linkedin_url = user.linkedin_url;
  if (user.linkedin_profile !== undefined) dbo.linkedin_profile = user.linkedin_profile;
  
  return dbo;
};

export const getUsers = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return (data || []).map(mapDboToUser);
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
    return mapDboToUser(data);
  } catch (error) {
    console.warn(`getUserById for '${id}' failed. Falling back to MOCK_USERS search:`, error);
    return MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];
  }
};

export const createUser = async (userData: Partial<User>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const dbPayload = mapUserToDbo(userData);
    const { data, error } = await supabase.from('users').insert([dbPayload]).select().single();
    if (error) throw error;
    return mapDboToUser(data);
  } catch (error) {
    console.warn('createUser failed. Falling back to mock user creation:', error);
    const newUser = { id: userData.id || `u-${Date.now()}`, ...userData } as User;
    MOCK_USERS.push(newUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
      } catch (e) {
        console.warn('Error saving MOCK_USERS to localStorage:', e);
      }
    }
    return newUser;
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const dbPayload = mapUserToDbo(userData);
    const { data, error } = await supabase.from('users').update(dbPayload).eq('id', id).select().single();
    if (error) throw error;
    return mapDboToUser(data);
  } catch (error) {
    console.warn(`updateUser for '${id}' failed. Falling back to mock response:`, error);
    const idx = MOCK_USERS.findIndex(u => u.id === id);
    if (idx !== -1) {
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...userData };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
        } catch (e) {
          console.warn('Error saving MOCK_USERS to localStorage:', e);
        }
      }
      return MOCK_USERS[idx];
    }
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
export const mapDboToCompany = (dbo: any) => {
  if (!dbo) return null;
  return {
    ...dbo,
    taxId: dbo.tax_id || dbo.taxId || 'N/A',
    rugeId: dbo.ruge_id || dbo.rugeId || `RG-${Math.floor(1000 + Math.random() * 9000)}`,
    certificationLevel: dbo.certification_level || dbo.certificationLevel || 'basic',
    complianceScore: dbo.compliance_score !== undefined ? dbo.compliance_score : (dbo.complianceScore || 0),
    nationalEmployeeCount: dbo.national_employee_count !== undefined ? dbo.national_employee_count : (dbo.nationalEmployeeCount || 0),
    totalEmployeeCount: dbo.total_employee_count !== undefined ? dbo.total_employee_count : (dbo.totalEmployeeCount || 0),
    localSpendPercentage: dbo.local_spend_percentage !== undefined ? dbo.local_spend_percentage : (dbo.localSpendPercentage || 0),
    registrationDate: dbo.created_at ? new Date(dbo.created_at).toLocaleDateString() : (dbo.registrationDate || new Date().toLocaleDateString()),
    legalRepresentative: dbo.legalRepresentative || { name: 'Representante General', avatar: '' },
    auditHistory: dbo.auditHistory || [],
    sector: dbo.sector || ['Varios'],
    badges: dbo.badges || []
  };
};

export const getCompanies = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('companies').select('*');
    if (error) throw error;
    return (data || []).map(mapDboToCompany);
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
    return mapDboToCompany(data);
  } catch (error) {
    console.warn(`getCompanyById for '${id}' failed. Falling back to MOCK_COMPANIES search:`, error);
    return MOCK_COMPANIES.find(c => c.id === id) || MOCK_COMPANIES[0];
  }
};

export const createCompany = async (companyData: Partial<Company>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    const dbPayload = {
      name: companyData.name,
      tax_id: companyData.taxId || null,
      ruge_id: companyData.rugeId || null,
      type: companyData.type || 'local',
      sector: companyData.sector || [],
      status: companyData.status || 'pending',
      certification_level: companyData.certificationLevel || 'basic',
      compliance_score: companyData.complianceScore || 0,
      national_employee_count: companyData.nationalEmployeeCount || 0,
      total_employee_count: companyData.totalEmployeeCount || 0,
      local_spend_percentage: companyData.localSpendPercentage || 0,
      address: companyData.address || '',
      phone: companyData.phone || '',
      email: companyData.email || '',
      lat: companyData.lat || null,
      lng: companyData.lng || null
    };

    const { data, error } = await supabase.from('companies').insert([dbPayload]).select().single();
    if (error) throw error;
    return mapDboToCompany(data);
  } catch (error) {
    console.warn('createCompany failed. Falling back to mock creation:', error);
    const newCompany = { 
      id: `c-${Date.now()}`, 
      ...companyData,
      taxId: companyData.taxId || 'N/A',
      rugeId: companyData.rugeId || `RG-${Math.floor(1000 + Math.random() * 9000)}`,
      certificationLevel: companyData.certificationLevel || 'basic',
      complianceScore: companyData.complianceScore || 0,
      nationalEmployeeCount: companyData.nationalEmployeeCount || 0,
      totalEmployeeCount: companyData.totalEmployeeCount || 0,
      localSpendPercentage: companyData.localSpendPercentage || 0,
      registrationDate: new Date().toLocaleDateString(),
      legalRepresentative: companyData.legalRepresentative || { name: 'Representante General', avatar: '' },
      auditHistory: companyData.auditHistory || [],
      sector: companyData.sector || ['Varios'],
      badges: companyData.badges || []
    } as unknown as Company;
     MOCK_COMPANIES.push(newCompany as any);
     if (typeof window !== 'undefined') {
       try {
         localStorage.setItem('MOCK_COMPANIES', JSON.stringify(MOCK_COMPANIES));
       } catch (e) {
         console.warn('Error saving MOCK_COMPANIES to localStorage:', e);
       }
     }
     return newCompany;
   }
 };
 
 export const updateCompany = async (id: string, companyData: Partial<Company>) => {
   try {
     if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
     
     const dbPayload: any = {};
     if (companyData.name !== undefined) dbPayload.name = companyData.name;
     if (companyData.taxId !== undefined) dbPayload.tax_id = companyData.taxId;
     if (companyData.rugeId !== undefined) dbPayload.ruge_id = companyData.rugeId;
     if (companyData.type !== undefined) dbPayload.type = companyData.type;
     if (companyData.sector !== undefined) dbPayload.sector = companyData.sector;
     if (companyData.status !== undefined) dbPayload.status = companyData.status;
     if (companyData.certificationLevel !== undefined) dbPayload.certification_level = companyData.certificationLevel;
     if (companyData.complianceScore !== undefined) dbPayload.compliance_score = companyData.complianceScore;
     if (companyData.nationalEmployeeCount !== undefined) dbPayload.national_employee_count = companyData.nationalEmployeeCount;
     if (companyData.totalEmployeeCount !== undefined) dbPayload.total_employee_count = companyData.totalEmployeeCount;
     if (companyData.localSpendPercentage !== undefined) dbPayload.local_spend_percentage = companyData.localSpendPercentage;
     if (companyData.address !== undefined) dbPayload.address = companyData.address;
     if (companyData.phone !== undefined) dbPayload.phone = companyData.phone;
     if (companyData.email !== undefined) dbPayload.email = companyData.email;
 
     const { data, error } = await supabase.from('companies').update(dbPayload).eq('id', id).select().single();
     if (error) throw error;
     return mapDboToCompany(data);
   } catch (error) {
     console.warn(`updateCompany for '${id}' failed. Falling back to mock response:`, error);
     const idx = MOCK_COMPANIES.findIndex(c => c.id === id);
     if (idx !== -1) {
       MOCK_COMPANIES[idx] = { ...MOCK_COMPANIES[idx], ...companyData };
       if (typeof window !== 'undefined') {
         try {
           localStorage.setItem('MOCK_COMPANIES', JSON.stringify(MOCK_COMPANIES));
         } catch (e) {
           console.warn('Error saving MOCK_COMPANIES to localStorage:', e);
         }
       }
       return MOCK_COMPANIES[idx];
     }
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
    return (data || []).map(item => ({
      ...item,
      projectId: item.project_id,
      awardedAmount: item.awarded_amount,
      scopeOfWork: item.scope_of_work,
      petroleraId: item.petrolera_id
    }));
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
    return {
      ...data,
      projectId: data.project_id,
      awardedAmount: data.awarded_amount,
      scopeOfWork: data.scope_of_work,
      petroleraId: data.petrolera_id
    };
  } catch (error) {
    console.warn(`getOpportunityById for '${id}' failed. Falling back to MOCK_OPPORTUNITIES search:`, error);
    const opp = MOCK_OPPORTUNITIES.find(o => o.id === id) || MOCK_OPPORTUNITIES[0];
    return {
      ...opp,
      petrolera: { name: 'Operadora Petrolera EG', email: 'ops@petrolera.gq' }
    };
  }
};

export const createOpportunity = async (opportunityData: Partial<Opportunity> & { projectId?: string, awardedAmount?: number, scopeOfWork?: string, petroleraId?: string }) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    // Attempt to get active auth user if not provided
    let petId = opportunityData.petroleraId || null;
    if (!petId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        petId = user.id;
      }
    }

    const dbPayload = {
      title: opportunityData.title,
      description: opportunityData.description || opportunityData.title || { es: opportunityData.scopeOfWork || '', en: '', fr: '' },
      category: opportunityData.category,
      budget: opportunityData.budget || 0,
      deadline: opportunityData.deadline || null,
      project_id: opportunityData.projectId || null,
      awarded_amount: opportunityData.awardedAmount || 0,
      scope_of_work: opportunityData.scopeOfWork || '',
      location: opportunityData.location,
      ref: opportunityData.ref,
      tag: opportunityData.tag,
      requirements: opportunityData.requirements || [],
      petrolera_id: petId
    };

    const { data, error } = await supabase.from('opportunities').insert([dbPayload]).select().single();
    if (error) throw error;
    return {
      ...data,
      projectId: data.project_id,
      awardedAmount: data.awarded_amount,
      scopeOfWork: data.scope_of_work,
      petroleraId: data.petrolera_id
    };
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
    
    // Note: applications table is for companies. Use getJobApplications for talents.
    if (userId) {
      console.warn('getApplications called with userId, this is likely an error as applications table does not have user_id.');
    }
    
    const { data, error } = await query.order('submitted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getApplications failed. Falling back to MOCK_APPLICATIONS:', error);
    return MOCK_APPLICATIONS;
  }
};

export const getJobApplications = async (userId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job:job_offers(*, company:companies(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getJobApplications failed:', error);
    return [];
  }
};

export const createJobApplication = async (applicationData: any) => {
  try {
    if (!isSupabaseActive()) return null;
    const { data, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('createJobApplication failed:', error);
    throw error;
  }
};

export const getCandidateProfile = async (userId: string) => {
  try {
    if (!isSupabaseActive()) return null;
    const { data, error } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('getCandidateProfile failed:', error);
    return null;
  }
};

export const updateCandidateProfile = async (userId: string, profileData: any) => {
  try {
    if (!isSupabaseActive()) return null;
    const { data, error } = await supabase
      .from('candidate_profiles')
      .upsert({ user_id: userId, ...profileData, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('updateCandidateProfile failed:', error);
    throw error;
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
    
    if (data) {
      return data.map((c: any) => ({
        id: c.id,
        ref: c.ref || `CTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: typeof c.title === 'string' ? c.title : (c.title?.es || c.title?.en || 'Contrato de Registro'),
        awardedTo: c.awarded_to || (c.company ? c.company.name : ''),
        companyId: c.company_id,
        status: c.status || 'pending',
        value: c.value ? Number(c.value) : 0,
        startDate: c.start_date || new Date().toISOString().split('T')[0],
        endDate: c.end_date || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
        location: c.location || 'Malabo, Guinea Ecuatorial',
        progress: c.progress || 0,
        nationalCompliance: c.national_compliance || {
          localStaff: 80,
          localStaffReq: 80,
          localGoods: 50,
          localGoodsReq: 50
        },
        company: c.company ? { name: c.company.name } : undefined,
        milestones: []
      }));
    }
    return [];
  } catch (error) {
    console.error('getContracts failed:', error);
    return [];
  }
};

export const createContract = async (contractData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    const dbPayload = {
      ref: contractData.ref || `CTR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      title: typeof contractData.title === 'string' ? contractData.title : (contractData.title?.es || 'Contrato de Registro'),
      awarded_to: contractData.awardedTo || contractData.awarded_to || '',
      company_id: contractData.companyId || contractData.company_id || null,
      opportunity_id: contractData.opportunityId || contractData.opportunity_id || null,
      status: contractData.status || 'pending',
      value: contractData.value || 0,
      start_date: contractData.startDate || contractData.start_date || new Date().toISOString().split('T')[0],
      end_date: contractData.endDate || contractData.end_date || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      location: contractData.location || 'Malabo, Guinea Ecuatorial',
      progress: contractData.progress || 0,
      national_compliance: contractData.nationalCompliance || contractData.national_compliance || {
        localStaff: 80,
        localStaffReq: 80,
        localGoods: 50,
        localGoodsReq: 50
      }
    };

    const { data, error } = await supabase.from('contracts').insert([dbPayload]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('createContract failed:', error);
    return null;
  }
};

export const getContractMilestones = async (contractId: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('contract_milestones').select('*').eq('contract_id', contractId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`getContractMilestones for '${contractId}' failed:`, error);
    return [];
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
    console.error('getSocialProjects failed:', error);
    return [];
  }
};

export const getSocialProjectById = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('social_projects').select('*, petrolera:users(name)').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`getSocialProjectById for '${id}' failed:`, error);
    return null;
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
    
    // Normalize properties for frontend consistency
    return (data || []).map((job: any) => ({
      ...job,
      companyId: job.company_id || job.companyId,
      postedAt: job.posted_at || job.postedAt
    }));
  } catch (error) {
    console.error('getJobOffers failed:', error);
    return [];
  }
};

export const createJobOffer = async (jobData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    const dbPayload = {
      title: typeof jobData.title === 'string' ? { es: jobData.title, en: jobData.title } : jobData.title,
      description: typeof jobData.description === 'string' ? { es: jobData.description, en: jobData.description } : jobData.description,
      company_id: jobData.companyId || jobData.company_id,
      location: jobData.location,
      salary: jobData.salary || '',
      tags: Array.isArray(jobData.tags) ? jobData.tags : [],
      category: jobData.category || 'General',
      status: jobData.status || 'published'
    };

    const { data, error } = await supabase.from('job_offers').insert([dbPayload]).select('*, company:companies(name)').single();
    if (error) throw error;
    
    return {
      ...data,
      companyId: data.company_id || data.companyId,
      postedAt: data.posted_at || data.postedAt
    };
  } catch (error) {
    console.warn('createJobOffer failed. Falling back to mock creation:', error);
    const mockNewJob = {
      id: `job-${Math.random().toString(36).substr(2, 9)}`,
      title: typeof jobData.title === 'string' ? { es: jobData.title, en: jobData.title } : jobData.title,
      description: typeof jobData.description === 'string' ? { es: jobData.description, en: jobData.description } : jobData.description,
      companyId: jobData.companyId || 'company-1',
      location: jobData.location,
      salary: jobData.salary || 'A convenir',
      tags: Array.isArray(jobData.tags) ? jobData.tags : ['Full-time'],
      category: jobData.category || 'General',
      status: jobData.status || 'published',
      postedAt: new Date().toISOString()
    };
    return mockNewJob;
  }
};

export const updateJobOffer = async (id: string, jobData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    const dbPayload: any = {};
    if (jobData.title !== undefined) dbPayload.title = typeof jobData.title === 'string' ? { es: jobData.title, en: jobData.title } : jobData.title;
    if (jobData.description !== undefined) dbPayload.description = typeof jobData.description === 'string' ? { es: jobData.description, en: jobData.description } : jobData.description;
    if (jobData.companyId !== undefined) dbPayload.company_id = jobData.companyId;
    if (jobData.company_id !== undefined) dbPayload.company_id = jobData.company_id;
    if (jobData.location !== undefined) dbPayload.location = jobData.location;
    if (jobData.salary !== undefined) dbPayload.salary = jobData.salary;
    if (jobData.tags !== undefined) dbPayload.tags = Array.isArray(jobData.tags) ? jobData.tags : [];
    if (jobData.category !== undefined) dbPayload.category = jobData.category;
    if (jobData.status !== undefined) dbPayload.status = jobData.status;

    const { data, error } = await supabase.from('job_offers').update(dbPayload).eq('id', id).select('*, company:companies(name)').single();
    if (error) throw error;
    
    return {
      ...data,
      companyId: data.company_id || data.companyId,
      postedAt: data.posted_at || data.postedAt
    };
  } catch (error) {
    console.warn(`updateJobOffer failed for id ${id}. Falling back to mock update:`, error);
    return {
      id,
      ...jobData,
      updated_at: new Date().toISOString()
    };
  }
};

export const deleteJobOffer = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('job_offers').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn(`deleteJobOffer failed for id ${id}:`, error);
    return true;
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
    
    // Map database featured_image (snake_case) to frontend featuredImage (camelCase)
    return (data || []).map(item => ({
      ...item,
      featuredImage: item.featured_image || item.featuredImage || ''
    }));
  } catch (error) {
    console.warn('getNewsArticles failed. Falling back to MOCK_NEWS_ARTICLES:', error);
    return MOCK_NEWS_ARTICLES;
  }
};

export const getNewsArticleById = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('news_articles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      ...data,
      featuredImage: data.featured_image || data.featuredImage || ''
    };
  } catch (error) {
    console.warn(`getNewsArticleById for '${id}' failed:`, error);
    return null;
  }
};

export const createNewsArticle = async (articleData: Partial<NewsArticle>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    // Map featuredImage camelCase to featured_image snake_case for DB
    const dbData: any = { ...articleData };
    if ('featuredImage' in dbData) {
      dbData.featured_image = dbData.featuredImage;
      delete dbData.featuredImage;
    }
    
    const { data, error } = await supabase.from('news_articles').insert([dbData]).select().single();
    if (error) throw error;
    
    return {
      ...data,
      featuredImage: data.featured_image || data.featuredImage || ''
    };
  } catch (error) {
    console.warn('createNewsArticle failed. Falling back to mock news article:', error);
    return { id: `art-${Date.now()}`, ...articleData, publish_date: new Date().toISOString() };
  }
};

export const updateNewsArticle = async (id: string, articleData: Partial<NewsArticle>) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    // Map featuredImage camelCase to featured_image snake_case for DB
    const dbData: any = { ...articleData };
    if ('featuredImage' in dbData) {
      dbData.featured_image = dbData.featuredImage;
      delete dbData.featuredImage;
    }
    // Avoid updating primary key
    delete dbData.id;

    const { data, error } = await supabase.from('news_articles').update(dbData).eq('id', id).select().single();
    if (error) throw error;
    
    return {
      ...data,
      featuredImage: data.featured_image || data.featuredImage || ''
    };
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
    
    return (data || []).map((req: any) => {
      let title = req.title || '';
      let description = req.description || '';
      let companyName = req.company_name || req.company?.name || 'Empresa';
      
      if (!title && companyName && companyName.startsWith('[TITLE:')) {
        const titleMatch = companyName.match(/^\[TITLE:([^\]]*)\]/);
        const descMatch = companyName.match(/\[DESC:([^\]]*)\]/);
        if (titleMatch) {
          title = titleMatch[1];
          companyName = companyName.replace(/^\[TITLE:[^\]]*\]\s*/, '');
        }
        if (descMatch) {
          description = descMatch[1];
          companyName = companyName.replace(/\[DESC:[^\]]*\]\s*/, '');
        }
      }
      
      if (!title) {
        title = `Consulta sobre ${req.type || 'Soporte'}`;
      }
      if (!description) {
        description = `Consulta enviada el ${new Date(req.created_at || req.date).toLocaleDateString()}`;
      }

      return {
        ...req,
        companyName,
        title,
        description,
        date: new Date(req.created_at || req.date).toLocaleDateString()
      };
    });
  } catch (error) {
    console.warn('getHelpRequests failed. Falling back to MOCK_HELP_REQUESTS:', error);
    return MOCK_HELP_REQUESTS.map(req => ({
      ...req,
      title: req.title || `Consulta sobre ${req.type}`,
      description: req.description || `Solicitud en estado ${req.status}`,
      created_at: req.date || new Date().toISOString()
    }));
  }
};

export const createHelpRequest = async (requestData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    
    const payload = {
      company_id: requestData.company_id || requestData.companyId || null,
      company_name: requestData.company_name || requestData.companyName || 'Empresa',
      type: requestData.type || 'technical',
      urgency: requestData.urgency || 'medium',
      status: requestData.status || 'pending',
    };
    
    // Attempt with title and description columns
    const fullPayload = {
      ...payload,
      title: requestData.title,
      description: requestData.description
    };

    const { data, error } = await supabase.from('help_requests').insert([fullPayload]).select().single();
    if (error) {
      if (error.message && (error.message.includes('column "title"') || error.message.includes('column "description"'))) {
        // Fallback: serialize fields inside company_name
        const serializedCompanyName = `[TITLE:${requestData.title || ''}] [DESC:${requestData.description || ''}] ${payload.company_name}`;
        const fallbackPayload = {
          ...payload,
          company_name: serializedCompanyName
        };
        const { data: retryData, error: retryError } = await supabase.from('help_requests').insert([fallbackPayload]).select().single();
        if (retryError) throw retryError;
        return retryData;
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.warn("createHelpRequest failed. Falling back to simulation:", error);
    return { id: `req-${Date.now()}`, ...requestData, created_at: new Date().toISOString() };
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
      .order('issue_date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`getCertifications failed for '${userId}':`, error);
    return [];
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
    
    if (data) {
      return data.map((n: any) => ({
        id: n.id,
        type: n.type || (n.title.toLowerCase().includes('licitaci') ? 'opportunity' : n.title.toLowerCase().includes('mensaje') ? 'message' : 'system'),
        title: n.title,
        description: n.content || n.description || '',
        timestamp: new Date(n.created_at).toLocaleDateString(),
        isRead: n.read !== undefined ? n.read : (n.is_read || false),
        actionLabel: n.action_label || (n.title.toLowerCase().includes('licitaci') ? 'Ver Licitación' : undefined),
        category: n.category || (n.title.toLowerCase().includes('licitaci') ? 'Oportunidades' : 'Sistema')
      }));
    }
  } catch (error) {
    console.warn(`getNotifications failed for '${userId}'. Using local/mock fallback:`, error);
  }

  const storageKey = `notifications_${userId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultNotifications = [
    {
      id: 'notif-1',
      type: 'system',
      title: 'Bienvenido al Portal de Contenido Nacional',
      description: 'Su registro se ha completado con éxito. Ahora tiene acceso completo a la plataforma.',
      isRead: false,
      timestamp: new Date().toLocaleDateString(),
      category: 'Sistema'
    },
    {
      id: 'notif-2',
      type: 'opportunity',
      title: 'Nueva Licitación de Marathon Oil',
      description: 'Marathon Oil ha publicado una nueva oportunidad para suministro de válvulas y mantenimiento preventivo.',
      isRead: false,
      timestamp: new Date().toLocaleDateString(),
      category: 'Oportunidades',
      actionLabel: 'Ver Licitación'
    },
    {
      id: 'notif-3',
      type: 'application',
      title: 'Certificado de Contenido Nacional Emitido',
      description: 'El Ministerio ha aprobado y firmado digitalmente su Certificado de Contenido Nacional.',
      isRead: true,
      timestamp: new Date(Date.now() - 86400000).toLocaleDateString(),
      category: 'Documentos',
      actionLabel: 'Descargar Certificado'
    },
    {
      id: 'notif-4',
      type: 'message',
      title: 'Nuevo Mensaje de Soporte Técnico',
      description: 'Un asesor técnico ha respondido a su consulta sobre requisitos de subcontratación local.',
      isRead: false,
      timestamp: new Date(Date.now() - 172800000).toLocaleDateString(),
      category: 'Mensajes',
      actionLabel: 'Responder Chat'
    }
  ];

  localStorage.setItem(storageKey, JSON.stringify(defaultNotifications));
  return defaultNotifications;
};

export const createNotification = async (userId: string, title: string, content: string, type: string = 'system', actionLabel?: string, category?: string) => {
  const dispatchLocalEvent = (notif: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('local-notification-created', { detail: { userId, notification: notif } }));
    }
  };

  try {
    const dbPayload = {
      user_id: userId,
      title: title,
      content: content,
      read: false,
      created_at: new Date().toISOString()
    };
    
    if (isSupabaseActive()) {
      const { data, error } = await supabase.from('notifications').insert([dbPayload]).select().single();
      if (!error && data) {
        // Also update local storage so local UI is immediately updated
        const storageKey = `notifications_${userId}`;
        const stored = localStorage.getItem(storageKey);
        const list = stored ? JSON.parse(stored) : [];
        const newNotif = {
          id: data.id,
          type: type,
          title: title,
          description: content,
          timestamp: new Date().toLocaleDateString(),
          isRead: false,
          actionLabel,
          category: category || 'Sistema'
        };
        localStorage.setItem(storageKey, JSON.stringify([newNotif, ...list]));
        dispatchLocalEvent(newNotif);
        return data;
      }
    }
  } catch (error) {
    console.error('createNotification failed:', error);
  }

  // Fallback to localStorage
  const storageKey = `notifications_${userId}`;
  const stored = localStorage.getItem(storageKey);
  const list = stored ? JSON.parse(stored) : [];
  const newNotif = {
    id: `notif-${Date.now()}`,
    type: type,
    title: title,
    description: content,
    timestamp: new Date().toLocaleDateString(),
    isRead: false,
    actionLabel,
    category: category || 'Sistema'
  };
  localStorage.setItem(storageKey, JSON.stringify([newNotif, ...list]));
  dispatchLocalEvent(newNotif);
  return newNotif;
};

export const updateNotificationReadState = async (userId: string, notificationId: string, isRead: boolean) => {
  try {
    if (isSupabaseActive() && notificationId.length === 36) {
      await supabase
        .from('notifications')
        .update({ read: isRead })
        .eq('id', notificationId);
    }
  } catch (error) {
    console.error("Failed to update notification read state:", error);
  }

  const storageKey = `notifications_${userId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const list = JSON.parse(stored);
    const updated = list.map((n: any) => n.id === notificationId ? { ...n, isRead } : n);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    if (isSupabaseActive()) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }

  const storageKey = `notifications_${userId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const list = JSON.parse(stored);
    const updated = list.map((n: any) => ({ ...n, isRead: true }));
    localStorage.setItem(storageKey, JSON.stringify(updated));
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

export const createWebCategory = async (categoryData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_categories').insert([categoryData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createWebCategory failed. Returning simulated data:', error);
    return { id: `CAT-${Date.now()}`, ...categoryData };
  }
};

export const updateWebCategory = async (id: string, categoryData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_categories').update(categoryData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('updateWebCategory failed. Returning simulated data:', error);
    return { id, ...categoryData };
  }
};

export const deleteWebCategory = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('web_categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('deleteWebCategory failed:', error);
    return true;
  }
};


// ==========================================
// REGISTRATION REQUESTS
// ==========================================
export let MOCK_REGISTRATION_REQUESTS: any[] = [
  {
    id: "req-1",
    email: "contacto@pyme-guinea.gq",
    name: "Teodoro Nguema",
    company_name: "Guinea Logistics & Supply S.L.",
    tax_id: "GQ-887766-A",
    role: "EMPRESA_LOCAL",
    sectors: ["Logística", "Transporte"],
    documents: [],
    status: "pending",
    phone: "+240 222-3333",
    dip_base64: "",
    categories: ["CAT_B"],
    tracking_number: "REG-GE-2024-88912",
    expediente_number: "REG-GE-2024-88912",
    created_at: "2024-06-28T12:00:00Z"
  }
];

if (typeof window !== 'undefined') {
  const localRequests = localStorage.getItem('MOCK_REGISTRATION_REQUESTS');
  if (localRequests) {
    try {
      const parsed = JSON.parse(localRequests);
      MOCK_REGISTRATION_REQUESTS.length = 0;
      MOCK_REGISTRATION_REQUESTS.push(...parsed);
    } catch (e) {
      console.warn('Error parsing MOCK_REGISTRATION_REQUESTS from localStorage:', e);
    }
  }
}

export const getRegistrationRequests = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('registration_requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getRegistrationRequests failed. Returning mock list:', error);
    return MOCK_REGISTRATION_REQUESTS;
  }
};

export const getRegistrationRequestByEmail = async (email: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('registration_requests').select('*').eq('email', email).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`getRegistrationRequestByEmail failed for '${email}'. Returning from mock:`, error);
    return MOCK_REGISTRATION_REQUESTS.find(r => r.email === email) || null;
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
    const newRequest = { id: `req-${Date.now()}`, ...requestData, created_at: new Date().toISOString() };
    MOCK_REGISTRATION_REQUESTS.push(newRequest);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('MOCK_REGISTRATION_REQUESTS', JSON.stringify(MOCK_REGISTRATION_REQUESTS));
      } catch (e) {
        console.warn('Error saving MOCK_REGISTRATION_REQUESTS to localStorage:', e);
      }
    }
    return newRequest;
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
    const idx = MOCK_REGISTRATION_REQUESTS.findIndex(r => r.id === id);
    if (idx !== -1) {
      MOCK_REGISTRATION_REQUESTS[idx] = { ...MOCK_REGISTRATION_REQUESTS[idx], ...requestData };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('MOCK_REGISTRATION_REQUESTS', JSON.stringify(MOCK_REGISTRATION_REQUESTS));
        } catch (e) {
          console.warn('Error saving MOCK_REGISTRATION_REQUESTS to localStorage:', e);
        }
      }
      return MOCK_REGISTRATION_REQUESTS[idx];
    }
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
    let localBannersStr = localStorage.getItem('local_web_banners');
    let localBanners = localBannersStr ? JSON.parse(localBannersStr) : [];

    if (!isSupabaseActive()) {
      const bannersMap = new Map(DEFAULT_BANNERS.map(b => [b.id, b]));
      localBanners.forEach((b: any) => {
        bannersMap.set(b.id, b);
      });
      return Array.from(bannersMap.values());
    }
    const { data, error } = await supabase.from('web_banners').select('*');
    if (error) {
      console.warn('web_banners table might not exist yet. Returning defaults merged with local storage.');
      const bannersMap = new Map(DEFAULT_BANNERS.map(b => [b.id, b]));
      localBanners.forEach((b: any) => {
        bannersMap.set(b.id, b);
      });
      return Array.from(bannersMap.values());
    }
    
    const bannersMap = new Map(DEFAULT_BANNERS.map(b => [b.id, b]));
    localBanners.forEach((b: any) => {
      bannersMap.set(b.id, b);
    });
    if (data && data.length > 0) {
      data.forEach((b: any) => {
        bannersMap.set(b.id, {
          id: b.id,
          page_key: b.page_key,
          banner_key: b.banner_key,
          image_url: b.image_url,
          title: b.title || ''
        });
      });
    }
    return Array.from(bannersMap.values());
  } catch (error) {
    console.warn("getWebBanners failed, returning defaults:", error);
    return DEFAULT_BANNERS;
  }
};

export const updateWebBanner = async (id: string, pageKey: string, bannerKey: string, imageUrl: string, title?: string) => {
  const bannerData = {
    id,
    page_key: pageKey,
    banner_key: bannerKey,
    image_url: imageUrl,
    title: title || '',
    updated_at: new Date().toISOString()
  };

  try {
    let localBannersStr = localStorage.getItem('local_web_banners');
    let localBanners = localBannersStr ? JSON.parse(localBannersStr) : [];
    localBanners = localBanners.filter((b: any) => b.id !== id);
    localBanners.push(bannerData);
    localStorage.setItem('local_web_banners', JSON.stringify(localBanners));
  } catch (e) {
    console.error("Failed to write web banner to local storage", e);
  }

  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_banners').upsert([bannerData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`updateWebBanner failed for ${id}. Simulating success in state:`, error);
    return bannerData;
  }
};

export const uploadBannerImage = async (pageKey: string, bannerKey: string, base64Data: string, fileExtension: string = 'jpg') => {
  try {
    if (!isSupabaseActive()) {
      console.warn("Supabase not active, returning base64");
      return base64Data;
    }
    // Using 'web-assets' as it's more likely to exist or be created by standard migrations
    const bucket = 'web-assets';
    const path = `banners/${pageKey}/${bannerKey}_${Date.now()}.${fileExtension}`;
    const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
    
    await uploadFile(bucket, path, base64Data, contentType);
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error("uploadBannerImage failed:", error);
    return base64Data;
  }
};


// ==========================================
// ALL CERTIFICATIONS (ADMIN & USER)
// ==========================================
export const getAllCertifications = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('certifications')
      .select('*, user:users(name, email, role, avatar_url)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("getAllCertifications failed, returning mock:", error);
    return [
      { id: 'cert-1', user_id: 'u-1', title: 'Técnico en Perforación Offshore', issuer: 'GEPetrol Academy', date: '2024-03-20', status: 'pending', user: { name: 'Juan Pérez' } },
      { id: 'cert-2', user_id: 'u-2', title: 'Certificación ISO 14001', issuer: 'SGS', date: '2024-03-25', status: 'pending', user: { name: 'Empresa Minera X' } },
      { id: 'cert-3', user_id: 'u-3', title: 'Seguridad Industrial Nivel 3', issuer: 'OSHA', date: '2024-04-01', status: 'pending', user: { name: 'María Nchama' } },
    ];
  }
};

export const updateCertificationStatus = async (id: string, status: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('certifications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("updateCertificationStatus failed:", error);
    return { id, status };
  }
};

export const addCertification = async (certData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('certifications')
      .insert([certData])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("addCertification failed, returning simulation:", error);
    return { id: `cert-${Date.now()}`, ...certData };
  }
};


// ==========================================
// NEWSLETTER SUBSCRIBERS & CAMPAIGNS
// ==========================================
export const getNewsletterSubscribers = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("getNewsletterSubscribers failed, returning mock:", error);
    return [
      { id: 'sub-1', email: 'empresa1@example.com', name: 'Empresa Petrolera A', type: 'Empresa', subscribed_at: '2024-01-10T00:00:00.000Z' },
      { id: 'sub-2', email: 'juan.perez@gmail.com', name: 'Juan Pérez', type: 'Persona', subscribed_at: '2024-02-15T00:00:00.000Z' },
      { id: 'sub-3', email: 'mining_co@eg.com', name: 'Mining Co. EG', type: 'Empresa', subscribed_at: '2024-03-01T00:00:00.000Z' },
    ];
  }
};

export const getNewsletterCampaigns = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("getNewsletterCampaigns failed, returning mock:", error);
    return [
      { id: 'cam-1', title: 'Boletín Mensual - Marzo 2024', status: 'sent', recipients: 1240, open_rate: '68%', created_at: '2024-03-15T00:00:00.000Z' },
      { id: 'cam-2', title: 'Nuevas Normativas de Minería', status: 'draft', recipients: 0, open_rate: '-', created_at: '2024-03-20T00:00:00.000Z' },
      { id: 'cam-3', title: 'Convocatoria Licitación Offshore', status: 'scheduled', recipients: 850, open_rate: '-', created_at: '2024-04-10T00:00:00.000Z' },
    ];
  }
};

export const createNewsletterCampaign = async (campaignData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .insert([campaignData])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("createNewsletterCampaign failed, returning simulation:", error);
    return { id: `cam-${Date.now()}`, ...campaignData, created_at: new Date().toISOString() };
  }
};

export const deleteNewsletterSubscriber = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn("deleteNewsletterSubscriber failed:", error);
    return true;
  }
};


// ==========================================
// WEB CONFIG & CUSTOM MODULES
// ==========================================

// 1. FAQs API
export const getWebFAQs = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_faqs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getWebFAQs failed. Falling back to MOCK_FAQS:', error);
    return MOCK_FAQS;
  }
};

export const createWebFAQ = async (faqData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_faqs').insert([faqData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createWebFAQ failed. Returning simulated data:', error);
    return { id: `faq-${Date.now()}`, ...faqData, created_at: new Date().toISOString() };
  }
};

export const updateWebFAQ = async (id: string, faqData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_faqs').update(faqData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('updateWebFAQ failed. Returning simulated data:', error);
    return { id, ...faqData };
  }
};

export const deleteWebFAQ = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('web_faqs').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('deleteWebFAQ failed:', error);
    return true;
  }
};

// 2. Images / Gallery API
export const getWebImages = async () => {
  try {
    let localImagesStr = localStorage.getItem('local_web_images');
    let localImages = localImagesStr ? JSON.parse(localImagesStr) : [];

    if (!isSupabaseActive()) {
      return [...localImages, ...MOCK_GALLERY_IMAGES];
    }
    const { data, error } = await supabase.from('web_images').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('getWebImages from DB failed, returning local storage + mock:', error);
      return [...localImages, ...MOCK_GALLERY_IMAGES];
    }
    const dbImages = data || [];
    const combined = [...dbImages, ...localImages];
    const seen = new Set();
    const unique = combined.filter(el => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });
    return unique.length > 0 ? unique : MOCK_GALLERY_IMAGES;
  } catch (error) {
    console.warn('getWebImages failed. Falling back to MOCK_GALLERY_IMAGES:', error);
    return MOCK_GALLERY_IMAGES;
  }
};

export const createWebImage = async (imageData: any) => {
  const newImage = { 
    id: imageData.id || `img-${Date.now()}`, 
    ...imageData, 
    created_at: imageData.created_at || new Date().toISOString() 
  };

  try {
    let localImagesStr = localStorage.getItem('local_web_images');
    let localImages = localImagesStr ? JSON.parse(localImagesStr) : [];
    localImages.unshift(newImage);
    localStorage.setItem('local_web_images', JSON.stringify(localImages));
  } catch (e) {
    console.error("Failed to save web image to local storage:", e);
  }

  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_images').insert([newImage]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createWebImage failed. Returning simulated/local data:', error);
    return newImage;
  }
};

export const deleteWebImage = async (id: string) => {
  try {
    let localImagesStr = localStorage.getItem('local_web_images');
    if (localImagesStr) {
      let localImages = JSON.parse(localImagesStr);
      localImages = localImages.filter((img: any) => img.id !== id);
      localStorage.setItem('local_web_images', JSON.stringify(localImages));
    }
  } catch (e) {
    console.error("Failed to delete web image from local storage:", e);
  }

  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('web_images').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('deleteWebImage failed:', error);
    return true;
  }
};

// 3. Normativas API
export const getWebNormativas = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_normativas').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getWebNormativas failed. Falling back to MOCK_LEGAL_DOCS:', error);
    // Wrap to match structure
    return MOCK_LEGAL_DOCS.map(doc => ({
      id: doc.id,
      title: { es: doc.title, en: doc.title, fr: doc.title },
      description: { es: doc.description, en: doc.description, fr: doc.description },
      file_url: 'https://vsp-supabase.co/storage/v1/object/public/documents/' + doc.id + '.pdf',
      category: doc.isPack ? 'Manuales' : 'Leyes',
      status: 'published',
      created_at: new Date().toISOString()
    }));
  }
};

export const createWebNormative = async (normativeData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_normativas').insert([normativeData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createWebNormative failed. Returning simulated data:', error);
    return { id: `norm-${Date.now()}`, ...normativeData, created_at: new Date().toISOString() };
  }
};

export const updateWebNormative = async (id: string, normativeData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_normativas').update(normativeData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('updateWebNormative failed. Returning simulated data:', error);
    return { id, ...normativeData };
  }
};

export const deleteWebNormative = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('web_normativas').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('deleteWebNormative failed:', error);
    return true;
  }
};

// 4. Guides API
export const getWebGuides = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_guides').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getWebGuides failed. Falling back to MOCK_GUIDES:', error);
    return MOCK_GUIDES;
  }
};

export const createWebGuide = async (guideData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_guides').insert([guideData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createWebGuide failed. Returning simulated data:', error);
    return { id: `guide-${Date.now()}`, ...guideData, created_at: new Date().toISOString() };
  }
};

export const updateWebGuide = async (id: string, guideData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_guides').update(guideData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('updateWebGuide failed. Returning simulated data:', error);
    return { id, ...guideData };
  }
};

export const deleteWebGuide = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('web_guides').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('deleteWebGuide failed:', error);
    return true;
  }
};

// 5. Testimonials API
export const getWebTestimonials = async () => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_testimonials').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getWebTestimonials failed. Falling back to MOCK_TESTIMONIALS:', error);
    return MOCK_TESTIMONIALS;
  }
};

export const createWebTestimonial = async (testimonialData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_testimonials').insert([testimonialData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createWebTestimonial failed. Returning simulated data:', error);
    return { id: `test-${Date.now()}`, ...testimonialData, created_at: new Date().toISOString() };
  }
};

export const updateWebTestimonial = async (id: string, testimonialData: any) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('web_testimonials').update(testimonialData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('updateWebTestimonial failed. Returning simulated data:', error);
    return { id, ...testimonialData };
  }
};

export const deleteWebTestimonial = async (id: string) => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { error } = await supabase.from('web_testimonials').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('deleteWebTestimonial failed:', error);
    return true;
  }
};

// ==========================================
// DENUNCIAS / REPORTS
// ==========================================
export interface Denuncia {
  id: string;
  commentId: string;
  commentText: string;
  commentAuthorName: string;
  commentAuthorRole: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  newsTitle?: string;
  newsId?: string;
}

export let MOCK_DENUNCIAS: Denuncia[] = [];

if (typeof window !== 'undefined') {
  const localDenuncias = localStorage.getItem('MOCK_DENUNCIAS');
  if (localDenuncias) {
    try {
      MOCK_DENUNCIAS = JSON.parse(localDenuncias);
    } catch (e) {
      console.warn('Error parsing MOCK_DENUNCIAS:', e);
    }
  } else {
    MOCK_DENUNCIAS = [
      {
        id: 'den-1',
        commentId: 'comment-def-1',
        commentText: 'Este servicio es una estafa total, no pierdan su dinero aquí. Son unos ladrones corruptos del ministerio.',
        commentAuthorName: 'Juan Nguema',
        commentAuthorRole: 'persona',
        reportedBy: 'Admin de Prensa',
        reason: 'Insultos graves y difamación sin fundamento contra la institución.',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        newsTitle: 'Nuevas Regulaciones para el Sector Hidrocarburos 2026',
        newsId: '1'
      },
      {
        id: 'den-2',
        commentId: 'comment-def-2',
        commentText: '¡¡¡VENDAN TODO YA!!! ¡EL SECTOR SE CAE! Spammeen este link para ganar dinero fácil: bit.ly/fake-link',
        commentAuthorName: 'AnonymousUser',
        commentAuthorRole: 'persona',
        reportedBy: 'Sistema Automático',
        reason: 'Spam comercial, enlaces sospechosos e intentos de phishing.',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        newsTitle: 'Licitaciones Públicas de Contenido Nacional',
        newsId: '2'
      }
    ];
    localStorage.setItem('MOCK_DENUNCIAS', JSON.stringify(MOCK_DENUNCIAS));
  }
}

export const getDenuncias = async (): Promise<Denuncia[]> => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('comment_reports').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('getDenuncias failed. Falling back to MOCK_DENUNCIAS:', error);
    return MOCK_DENUNCIAS;
  }
};

export const createDenuncia = async (denunciaData: Partial<Denuncia>): Promise<Denuncia> => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('comment_reports').insert([denunciaData]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('createDenuncia failed. Falling back to MOCK_DENUNCIAS:', error);
    const newDenuncia: Denuncia = {
      id: `den-${Date.now()}`,
      commentId: denunciaData.commentId || `c-${Date.now()}`,
      commentText: denunciaData.commentText || '',
      commentAuthorName: denunciaData.commentAuthorName || 'Anónimo',
      commentAuthorRole: denunciaData.commentAuthorRole || 'persona',
      reportedBy: denunciaData.reportedBy || 'Anónimo',
      reason: denunciaData.reason || 'Reportado por abuso',
      status: 'pending',
      created_at: new Date().toISOString(),
      newsTitle: denunciaData.newsTitle,
      newsId: denunciaData.newsId
    };
    MOCK_DENUNCIAS.unshift(newDenuncia);
    if (typeof window !== 'undefined') {
      localStorage.setItem('MOCK_DENUNCIAS', JSON.stringify(MOCK_DENUNCIAS));
    }
    return newDenuncia;
  }
};

export const updateDenunciaStatus = async (id: string, status: 'resolved' | 'dismissed'): Promise<any> => {
  try {
    if (!isSupabaseActive()) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.from('comment_reports').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('updateDenunciaStatus failed. Falling back to MOCK_DENUNCIAS:', error);
    const idx = MOCK_DENUNCIAS.findIndex(d => d.id === id);
    if (idx !== -1) {
      MOCK_DENUNCIAS[idx].status = status;
      if (typeof window !== 'undefined') {
        localStorage.setItem('MOCK_DENUNCIAS', JSON.stringify(MOCK_DENUNCIAS));
      }
      return MOCK_DENUNCIAS[idx];
    }
    return null;
  }
};

export const deleteCommentGlobal = async (commentId: string, newsId?: string): Promise<boolean> => {
  if (typeof window !== 'undefined' && newsId) {
    const key = `news_comments_${newsId}`;
    const localComments = localStorage.getItem(key);
    if (localComments) {
      try {
        const parsed = JSON.parse(localComments);
        const filtered = parsed.filter((c: any) => c.id !== commentId);
        localStorage.setItem(key, JSON.stringify(filtered));
      } catch (e) {
        console.warn('Error deleting comment in localStorage:', e);
      }
    }
  }
  return true;
};




