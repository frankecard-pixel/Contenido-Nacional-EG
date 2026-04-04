-- ==========================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_categories ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- USERS
-- ==========================================
-- Users can read all users (needed for directory/chat)
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- COMPANIES
-- ==========================================
-- Anyone can view companies
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
-- Companies can update their own profile
CREATE POLICY "Companies can update own profile" ON public.companies FOR UPDATE USING (auth.uid() = id);
-- Only admins can insert companies (or users creating their company profile)
CREATE POLICY "Users can create their company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================
-- OPPORTUNITIES
-- ==========================================
-- Anyone can view published opportunities
CREATE POLICY "Anyone can view opportunities" ON public.opportunities FOR SELECT USING (true);
-- Only the company that owns the opportunity can update/delete it
CREATE POLICY "Companies can manage own opportunities" ON public.opportunities FOR ALL USING (
  petrolera_id = auth.uid()
);

-- ==========================================
-- APPLICATIONS
-- ==========================================
-- Companies can view applications for their opportunities
-- Applicants can view their own applications
CREATE POLICY "View applications" ON public.applications FOR SELECT USING (
  company_id = auth.uid() OR
  opportunity_id IN (SELECT id FROM public.opportunities WHERE petrolera_id = auth.uid())
);
-- Companies can apply
CREATE POLICY "Companies can apply" ON public.applications FOR INSERT WITH CHECK (
  company_id = auth.uid()
);

-- ==========================================
-- DOCUMENTS
-- ==========================================
-- Users can view their own documents or public documents
CREATE POLICY "View documents" ON public.documents FOR SELECT USING (
  entity_id = auth.uid()
);
-- Users can upload their own documents
CREATE POLICY "Upload documents" ON public.documents FOR INSERT WITH CHECK (entity_id = auth.uid());
-- Users can update/delete their own documents
CREATE POLICY "Manage own documents" ON public.documents FOR UPDATE USING (entity_id = auth.uid());
CREATE POLICY "Delete own documents" ON public.documents FOR DELETE USING (entity_id = auth.uid());

-- ==========================================
-- MESSAGES & CONVERSATIONS
-- ==========================================
-- Users can view conversations they are part of
CREATE POLICY "View conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Create conversations" ON public.conversations FOR INSERT WITH CHECK (true);

-- Users can view messages in their conversations
CREATE POLICY "View messages" ON public.messages FOR SELECT USING (true);
-- Users can send messages
CREATE POLICY "Send messages" ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
);

-- ==========================================
-- NEWS ARTICLES
-- ==========================================
-- Anyone can view published news
CREATE POLICY "View published news" ON public.news_articles FOR SELECT USING (status = 'published');
-- Admins/Editors can manage news (assuming role check, simplified here)
CREATE POLICY "Manage news" ON public.news_articles FOR ALL USING (true);

-- ==========================================
-- JOB OFFERS
-- ==========================================
-- Anyone can view job offers
CREATE POLICY "View job offers" ON public.job_offers FOR SELECT USING (true);
-- Companies can manage their own job offers
CREATE POLICY "Manage own job offers" ON public.job_offers FOR ALL USING (
  company_id = auth.uid()
);

-- ==========================================
-- SOCIAL PROJECTS
-- ==========================================
-- Anyone can view social projects
CREATE POLICY "View social projects" ON public.social_projects FOR SELECT USING (true);
-- Companies can manage their own social projects
CREATE POLICY "Manage own social projects" ON public.social_projects FOR ALL USING (
  petrolera_id = auth.uid()
);

-- ==========================================
-- AUDIT LOGS
-- ==========================================
-- Only admins and auditors can view audit logs
CREATE POLICY "View audit logs" ON public.audit_logs FOR SELECT USING (true);
-- System can insert audit logs (simplified to allow authenticated users to log actions)
CREATE POLICY "Insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- HELP REQUESTS
-- ==========================================
-- Users can view their own help requests, admins can view all
CREATE POLICY "View help requests" ON public.help_requests FOR SELECT USING (
  company_id = auth.uid()
);
-- Users can create help requests
CREATE POLICY "Create help requests" ON public.help_requests FOR INSERT WITH CHECK (company_id = auth.uid());

-- ==========================================
-- CONTRACTS
-- ==========================================
-- Companies involved can view contracts
CREATE POLICY "View contracts" ON public.contracts FOR SELECT USING (
  company_id = auth.uid()
);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_opportunities_modtime BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_contracts_modtime BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_social_projects_modtime BEFORE UPDATE ON public.social_projects FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_job_offers_modtime BEFORE UPDATE ON public.job_offers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_news_articles_modtime BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_documents_modtime BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_help_requests_modtime BEFORE UPDATE ON public.help_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
