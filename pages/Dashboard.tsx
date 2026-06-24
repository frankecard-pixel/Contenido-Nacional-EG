
import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import HelpRequestManagement from '../components/admin/HelpRequestManagement';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import LexAssistant from '../components/LexAssistant';
import Opportunities from './Opportunities';
import OpportunityManagement from './OpportunityManagement';
import CompanyDashboardOverview from '../components/CompanyDashboardOverview';
import AdminDashboardOverview from '../components/AdminDashboardOverview';
import PetroleraDashboardOverview from '../components/PetroleraDashboardOverview';
import TalentoDashboardOverview from '../components/TalentoDashboardOverview';
import ComunidadDashboardOverview from '../components/ComunidadDashboardOverview';
import ComunicacionDashboardOverview from '../components/ComunicacionDashboardOverview';
import CuerpoTecnicoDashboardOverview from '../components/CuerpoTecnicoDashboardOverview';
import AdvertiserDashboardOverview from '../components/AdvertiserDashboardOverview';
import Notifications from './Notifications';
import ApplicationsTracking from './ApplicationsTracking';
import DocumentManagement from './DocumentManagement';
import AuditReports from './AuditReports';
import Messages from './Messages';
import Settings from './Settings';
import CommunityManagement from './CommunityManagement';
import WebContentManagement from './WebContentManagement';
import NewsletterManagement from './NewsletterManagement';
import AdminCertificationManagement from './AdminCertificationManagement';
import AdminRegistrationManagement from './AdminRegistrationManagement';
import ContractTemplates from './ContractTemplates';
import ContractManagement from './ContractManagement';
import CompanyRegistry from './CompanyRegistry';
import NewsManagement from './NewsManagement';
import CompanyProfileManagement from './CompanyProfileManagement';
import AdminUserManagementPage from './AdminUserManagementPage';
import CompanyUserManagementPage from './CompanyUserManagementPage';
import SectorNetworkPage from './SectorNetworkPage';
import Jobs from './Jobs';
import InspectionsManagement from '../components/dashboard/InspectionsManagement';
import CitizenFeedbackManagement from '../components/dashboard/CitizenFeedbackManagement';
import CSRProjectManagement from '../components/dashboard/CSRProjectManagement';
import TechnicalSupportManagement from '../components/dashboard/TechnicalSupportManagement';
import TalentProfileManagement from '../components/dashboard/TalentProfileManagement';
import CertificationsManagement from '../components/dashboard/CertificationsManagement';
import CampaignManagement from '../components/dashboard/CampaignManagement';
import BillingManagement from '../components/dashboard/BillingManagement';
import AdAnalyticsManagement from '../components/dashboard/AdAnalyticsManagement';
import JobManagement from '../components/dashboard/jobs/JobManagement';
import JobPostingForm from '../components/dashboard/jobs/JobPostingForm';
import OpportunityPostingForm from '../components/dashboard/opportunities/OpportunityPostingForm';
import ContractCreationForm from '../components/public/contract-management/ContractCreationForm';
import { UserRole, User, Company } from '../types';
import { getUsers, getCompanies, getUserById } from '../services/supabaseApi';
import { MOCK_USERS } from '../services/mockService';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authUserId = authUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!authUserId) return;
      
      try {
        setLoading(true);
        const [usersData, companiesData] = await Promise.all([
          getUsers(),
          getCompanies()
        ]);
        setUsers(usersData as any);
        setCompanies(companiesData as any);

        const userData = await getUserById(authUserId);
        setDbUser(userData as any);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, authUserId]);

  // Use authenticated user or fallback to mock for demo
  const currentUser = useMemo(() => {
    if (dbUser) return dbUser;
    const foundUser = users.find(u => u.id === localStorage.getItem('user_id'));
    if (foundUser) return foundUser;
    if (users.length > 0) return users[0];
    // Fallback to mock users if database is empty (for demo purposes)
    return MOCK_USERS.find((u: any) => u.id === localStorage.getItem('user_id')) || MOCK_USERS[0];
  }, [dbUser, users]);

  const currentUserId = useMemo(() => currentUser?.id || 'u-1', [currentUser]);

  const currentCompany = useMemo(() => {
    if (!currentUser || !companies.length) return null;
    const cid = (currentUser as any).company_id || currentUser.companyId;
    return companies.find(c => c.id === cid) || companies[0];
  }, [currentUser, companies]);

  const getNormalizedRole = React.useCallback((role: string) => {
    if (role === 'admin') return 'super_admin';
    if (role === 'empresa') return 'empresa_local';
    return role;
  }, []);

  const handleRoleChange = React.useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      localStorage.setItem('user_id', userId);
      setIsSidebarOpen(false);
      navigate(`/dashboard/${getNormalizedRole(user.role)}/overview`);
    }
  }, [users, navigate, getNormalizedRole]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authUser && !localStorage.getItem('user_session')) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    return <div className="p-20 text-center">Usuario no encontrado.</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background-dark overflow-hidden relative md:border-4 md:border-white/10 md:m-2 md:rounded-[2.5rem] shadow-2xl">
      <DashboardSidebar 
        forcedUser={currentUser} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] xl:hidden transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
        {/* Pasamos el usuario dinámico aquí */}
        <DashboardHeader user={currentUser} onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
          <div key={location.pathname} className="w-full max-w-[var(--layout-max-width)] mx-auto flex-1 flex flex-col transition-all duration-300 animate-in fade-in duration-700">
            <Routes>
            {/* 1. SUPER ADMIN */}
            <Route path="super_admin/overview" element={<AdminDashboardOverview user={currentUser} />} />
            <Route path="admin/overview" element={<Navigate to="/dashboard/super_admin/overview" replace />} />
            <Route path="super_admin/users" element={<AdminUserManagementPage />} />
            <Route path="admin/users" element={<Navigate to="/dashboard/super_admin/users" replace />} />
            <Route path="super_admin/companies" element={<CompanyRegistry />} />
            <Route path="admin/companies" element={<Navigate to="/dashboard/super_admin/companies" replace />} />
            <Route path="super_admin/opportunities" element={<OpportunityManagement />} />
            <Route path="admin/opportunities" element={<Navigate to="/dashboard/super_admin/opportunities" replace />} />
            <Route path="super_admin/contracts" element={<ContractManagement />} />
            <Route path="admin/contracts" element={<Navigate to="/dashboard/super_admin/contracts" replace />} />
            <Route path="super_admin/contracts/new" element={<ContractCreationForm />} />
            <Route path="super_admin/reports" element={<AuditReports />} />
            <Route path="admin/reports" element={<Navigate to="/dashboard/super_admin/reports" replace />} />
            <Route path="super_admin/messages" element={<Messages user={currentUser} />} />
            <Route path="admin/messages" element={<Navigate to="/dashboard/super_admin/messages" replace />} />
            <Route path="super_admin/community" element={<CommunityManagement />} />
            <Route path="super_admin/web" element={<WebContentManagement user={currentUser} />} />
            <Route path="super_admin/newsletter" element={<NewsletterManagement />} />
            <Route path="super_admin/certifications" element={<AdminCertificationManagement />} />
            <Route path="super_admin/registrations" element={<AdminRegistrationManagement />} />
            <Route path="super_admin/contract-templates" element={<ContractTemplates />} />
            <Route path="super_admin/news" element={<NewsManagement user={currentUser} />} />
            <Route path="super_admin/help-requests" element={<HelpRequestManagement />} />
            <Route path="super_admin/campaigns" element={<CampaignManagement />} />
            <Route path="super_admin/billing" element={<BillingManagement />} />
            <Route path="super_admin/analytics" element={<AdAnalyticsManagement />} />
            <Route path="admin/news" element={<Navigate to="/dashboard/super_admin/news" replace />} />
            
            {/* 2. FUNCIONARIO ADMINISTRATIVO */}
            <Route path="funcionario/overview" element={<AdminDashboardOverview user={currentUser} />} />
            <Route path="funcionario/companies" element={<CompanyRegistry />} />
            <Route path="funcionario/opportunities" element={<OpportunityManagement />} />
            <Route path="funcionario/contracts" element={<ContractManagement />} />
            <Route path="funcionario/help-requests" element={<HelpRequestManagement />} />
            <Route path="funcionario/messages" element={<Messages user={currentUser} />} />

            {/* 3. CUERPO TÉCNICO / AUDITORÍA */}
            <Route path="cuerpo_tecnico/overview" element={<CuerpoTecnicoDashboardOverview />} />
            <Route path="cuerpo_tecnico/inspections" element={<InspectionsManagement />} />
            <Route path="cuerpo_tecnico/reports" element={<AuditReports />} />

            {/* 4. PRENSA Y GACETA */}
            <Route path="comunicacion/overview" element={<ComunicacionDashboardOverview user={currentUser} />} />
            <Route path="comunicacion/news" element={<NewsManagement user={currentUser} />} />
            <Route path="comunicacion/web" element={<WebContentManagement user={currentUser} />} />
            <Route path="comunicacion/messages" element={<Messages user={currentUser} />} />

            {/* 5. DESARROLLO SOCIAL / COMUNIDAD */}
            <Route path="comunidad/overview" element={<ComunidadDashboardOverview user={currentUser} />} />
            <Route path="comunidad/community" element={<CommunityManagement />} />
            <Route path="comunidad/feedback" element={<CitizenFeedbackManagement />} />

            {/* 6. OPERADORAS PETROLERAS IOCs */}
            <Route path="petrolera/overview" element={<PetroleraDashboardOverview user={currentUser} />} />
            <Route path="petrolera/network" element={<SectorNetworkPage />} />
            <Route path="petrolera/users" element={<CompanyUserManagementPage />} />
            <Route path="petrolera/opportunities" element={<OpportunityManagement />} />
            <Route path="petrolera/csr" element={<CSRProjectManagement />} />
            <Route path="petrolera/messages" element={<Messages user={currentUser} />} />

            {/* 7. EMPRESAS DE SERVICIOS (GRANDES) */}
            <Route path="company/overview" element={currentCompany ? <CompanyDashboardOverview company={currentCompany} /> : <div>Cargando empresa...</div>} />
            <Route path="empresa/overview" element={<Navigate to="/dashboard/company/overview" replace />} />
            <Route path="company/network" element={<SectorNetworkPage />} />
            <Route path="company/users" element={<CompanyUserManagementPage />} />
            <Route path="company/profile" element={<CompanyProfileManagement />} />
            <Route path="company/opportunities" element={<Opportunities isDashboard />} />
            <Route path="company/opportunities/new" element={<OpportunityPostingForm />} />
            <Route path="company/contracts" element={<ContractManagement />} />
            <Route path="company/applications" element={<ApplicationsTracking />} />
            <Route path="company/documents" element={<DocumentManagement />} />
            <Route path="company/jobs" element={currentCompany ? <JobManagement company={currentCompany} /> : <div>Cargando empresa...</div>} />
            <Route path="company/jobs/new" element={<JobPostingForm />} />
            <Route path="company/messages" element={<Messages user={currentUser} />} />
            
            {/* 8. PYMES NACIONALES / SOPORTE LOCAL */}
            <Route path="empresa_local/overview" element={currentCompany ? <CompanyDashboardOverview company={currentCompany} /> : <div>Cargando empresa...</div>} />
            <Route path="empresa/overview" element={<Navigate to="/dashboard/empresa_local/overview" replace />} />
            <Route path="empresa_local/network" element={<SectorNetworkPage />} />
            <Route path="empresa/network" element={<Navigate to="/dashboard/empresa_local/network" replace />} />
            <Route path="empresa_local/users" element={<CompanyUserManagementPage />} />
            <Route path="empresa/users" element={<Navigate to="/dashboard/empresa_local/users" replace />} />
            <Route path="empresa_local/profile" element={<CompanyProfileManagement />} />
            <Route path="empresa/profile" element={<Navigate to="/dashboard/empresa_local/profile" replace />} />
            <Route path="empresa_local/opportunities" element={<Opportunities isDashboard />} />
            <Route path="empresa/opportunities" element={<Navigate to="/dashboard/empresa_local/opportunities" replace />} />
            <Route path="empresa_local/opportunities/new" element={<OpportunityPostingForm />} />
            <Route path="empresa_local/applications" element={<ApplicationsTracking />} />
            <Route path="empresa/applications" element={<Navigate to="/dashboard/empresa_local/applications" replace />} />
            <Route path="empresa_local/documents" element={<DocumentManagement />} />
            <Route path="empresa/documents" element={<Navigate to="/dashboard/empresa_local/documents" replace />} />
            <Route path="empresa_local/jobs" element={currentCompany ? <JobManagement company={currentCompany} /> : <div>Cargando empresa...</div>} />
            <Route path="empresa/jobs" element={<Navigate to="/dashboard/empresa_local/jobs" replace />} />
            <Route path="empresa_local/jobs/new" element={<JobPostingForm />} />
            <Route path="empresa_local/messages" element={<Messages user={currentUser} />} />
            <Route path="empresa/messages" element={<Navigate to="/dashboard/empresa_local/messages" replace />} />
            <Route path="empresa_local/support" element={<TechnicalSupportManagement />} />
            <Route path="empresa/support" element={<Navigate to="/dashboard/empresa_local/support" replace />} />

            {/* 9. TALENTO NACIONAL / INDIVIDUOS */}
            <Route path="persona/overview" element={<TalentoDashboardOverview user={currentUser} />} />
            <Route path="persona/profile" element={<TalentProfileManagement user={currentUser} onUpdate={() => {
              if (authUserId) {
                getUserById(authUserId).then(userData => setDbUser(userData as any));
              }
            }} />} />
            <Route path="persona/jobs" element={<Jobs />} />
            <Route path="persona/messages" element={<Messages user={currentUser} />} />
            <Route path="persona/certificates" element={<CertificationsManagement user={currentUser} />} />
            
            {/* 10. ANUNCIANTES */}
            <Route path="advertiser/overview" element={<AdvertiserDashboardOverview user={currentUser} />} />
            <Route path="advertiser/campaigns" element={<CampaignManagement />} />
            <Route path="advertiser/billing" element={<BillingManagement />} />
            <Route path="advertiser/analytics" element={<AdAnalyticsManagement />} />

            {/* RUTAS GENÉRICAS COMPARTIDAS - FIXED ROUTING */}
            <Route path=":role/notifications" element={<Notifications user={currentUser} />} />
            <Route path=":role/messages" element={<Messages user={currentUser} />} />
            <Route path=":role/settings" element={<Settings user={currentUser} />} />
            <Route path=":role/lex" element={<div className="p-12 h-full max-w-5xl mx-auto"><LexAssistant /></div>} />
            
            {/* REDIRECCIÓN POR DEFECTO */}
            <Route index element={<Navigate to={`/dashboard/${getNormalizedRole(currentUser.role)}/overview`} replace />} />
            <Route path="*" element={<Navigate to={`/dashboard/${getNormalizedRole(currentUser.role)}/overview`} replace />} />
          </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
