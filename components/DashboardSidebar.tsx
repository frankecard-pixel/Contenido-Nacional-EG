
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, User } from '../types';
import AdBanner from './AdBanner';

interface SidebarProps {
  forcedUser?: User;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ forcedUser, isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const currentUser = forcedUser; 

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!currentUser) return null;

  const menuGroups = {
    [UserRole.SUPER_ADMIN]: [
      { path: '/dashboard/super_admin/overview', label: 'dashboard.overview', icon: '📊' },
      { path: '/dashboard/super_admin/notifications', label: 'dashboard.notifications', icon: '🔔' },
      { path: '/dashboard/super_admin/messages', label: 'dashboard.message_center', icon: '💬' },
      { path: '/dashboard/super_admin/news', label: 'dashboard.news_management', icon: '📰' },
      { path: '/dashboard/super_admin/web', label: 'dashboard.public_portal', icon: '🌐' },
      { path: '/dashboard/super_admin/newsletter', label: 'Newsletter', icon: '📧' },
      { path: '/dashboard/super_admin/certifications', label: 'Verificaciones', icon: '✅' },
      { path: '/dashboard/super_admin/registrations', label: 'Registros', icon: '🏢' },
      { path: '/dashboard/super_admin/contract-templates', label: 'Templates', icon: '📄' },
      { path: '/dashboard/super_admin/community', label: 'dashboard.community_works', icon: '🏗️' },
      { path: '/dashboard/super_admin/users', label: 'dashboard.users', icon: '👥' },
      { path: '/dashboard/super_admin/companies', label: 'dashboard.local_companies', icon: '🏢' },
      { path: '/dashboard/super_admin/opportunities', label: 'dashboard.tenders', icon: '📜' },
      { path: '/dashboard/super_admin/contracts', label: 'dashboard.contracts', icon: '📑' },
      { path: '/dashboard/super_admin/lex', label: 'dashboard.lex_advisor', icon: '⚖️' },
      { path: '/dashboard/super_admin/reports', label: 'dashboard.reports', icon: '📈' },
    ],
    [UserRole.FUNCIONARIO]: [
      { path: '/dashboard/funcionario/overview', label: 'dashboard.overview', icon: '📊' },
      { path: '/dashboard/funcionario/notifications', label: 'dashboard.notifications', icon: '🔔' },
      { path: '/dashboard/funcionario/messages', label: 'dashboard.messages', icon: '💬' },
      { path: '/dashboard/funcionario/companies', label: 'dashboard.company_files', icon: '🏢' },
      { path: '/dashboard/funcionario/opportunities', label: 'dashboard.tenders', icon: '📜' },
      { path: '/dashboard/funcionario/contracts', label: 'dashboard.contracts', icon: '📑' },
      { path: '/dashboard/funcionario/lex', label: 'dashboard.lex_advisor', icon: '⚖️' },
    ],
    [UserRole.CUERPO_TECNICO]: [
      { path: '/dashboard/cuerpo_tecnico/overview', label: 'dashboard.overview', icon: '⚓' },
      { path: '/dashboard/cuerpo_tecnico/notifications', label: 'dashboard.field_alerts', icon: '🔔' },
      { path: '/dashboard/cuerpo_tecnico/inspections', label: 'dashboard.inspections', icon: '🔎' },
      { path: '/dashboard/cuerpo_tecnico/reports', label: 'dashboard.technical_reports', icon: '📋' },
      { path: '/dashboard/cuerpo_tecnico/lex', label: 'dashboard.regulatory_support', icon: '⚖️' },
    ],
    [UserRole.COMUNICACION]: [
      { path: '/dashboard/comunicacion/overview', label: 'dashboard.overview', icon: '📰' },
      { path: '/dashboard/comunicacion/news', label: 'dashboard.news_editor', icon: '✍️' },
      { path: '/dashboard/comunicacion/web', label: 'dashboard.web_portal', icon: '🌐' },
      { path: '/dashboard/comunicacion/notifications', label: 'dashboard.notifications', icon: '🔔' },
      { path: '/dashboard/comunicacion/messages', label: 'dashboard.press_messages', icon: '💬' },
    ],
    [UserRole.COMUNIDAD]: [
      { path: '/dashboard/comunidad/overview', label: 'dashboard.overview', icon: '🏗️' },
      { path: '/dashboard/comunidad/community', label: 'dashboard.social_impact', icon: '🌳' },
      { path: '/dashboard/comunidad/feedback', label: 'dashboard.citizen_feedback', icon: '📢' },
      { path: '/dashboard/comunidad/notifications', label: 'dashboard.notifications', icon: '🔔' },
    ],
    [UserRole.PETROLERA]: [
      { path: '/dashboard/petrolera/overview', label: 'dashboard.overview', icon: '⛽' },
      { path: '/dashboard/petrolera/network', label: 'Red Social Sector', icon: '🌐' },
      { path: '/dashboard/petrolera/users', label: 'Usuarios y Accesos', icon: '👥' },
      { path: '/dashboard/petrolera/opportunities', label: 'dashboard.my_tenders', icon: '📜' },
      { path: '/dashboard/petrolera/csr', label: 'dashboard.csr_projects', icon: '🌱' },
      { path: '/dashboard/petrolera/notifications', label: 'dashboard.notifications', icon: '🔔' },
      { path: '/dashboard/petrolera/lex', label: 'dashboard.lex_legal', icon: '⚖️' },
    ],
    [UserRole.COMPANY]: [
      { path: '/dashboard/company/overview', label: 'dashboard.overview', icon: '🏭' },
      { path: '/dashboard/company/network', label: 'Red Social Sector', icon: '🌐' },
      { path: '/dashboard/company/users', label: 'Usuarios y Accesos', icon: '👥' },
      { path: '/dashboard/company/profile', label: 'dashboard.my_company_profile', icon: '🏢' },
      { path: '/dashboard/company/documents', label: 'dashboard.document_management', icon: '📁' },
      { path: '/dashboard/company/applications', label: 'dashboard.my_applications', icon: '📄' },
      { path: '/dashboard/company/opportunities', label: 'dashboard.tenders', icon: '🔍' },
      { path: '/dashboard/company/jobs', label: 'Gestión de Vacantes', icon: '💼' },
      { path: '/dashboard/company/contracts', label: 'dashboard.my_contracts', icon: '📑' },
      { path: '/dashboard/company/notifications', label: 'dashboard.notifications', icon: '🔔' },
    ],
    [UserRole.EMPRESA_LOCAL]: [
      { path: '/dashboard/empresa_local/overview', label: 'dashboard.overview', icon: '💡' },
      { path: '/dashboard/empresa_local/network', label: 'Red Social Sector', icon: '🌐' },
      { path: '/dashboard/empresa_local/users', label: 'Usuarios y Accesos', icon: '👥' },
      { path: '/dashboard/empresa_local/profile', label: 'dashboard.my_sme_profile', icon: '🏢' },
      { path: '/dashboard/empresa_local/documents', label: 'dashboard.document_management', icon: '📁' },
      { path: '/dashboard/empresa_local/applications', label: 'dashboard.my_applications', icon: '📄' },
      { path: '/dashboard/empresa_local/jobs', label: 'Gestión de Vacantes', icon: '💼' },
      { path: '/dashboard/empresa_local/support', label: 'dashboard.local_support', icon: '🤝' },
    ],
    [UserRole.PERSONA]: [
      { path: '/dashboard/persona/overview', label: 'dashboard.overview', icon: '👷' },
      { path: '/dashboard/persona/profile', label: 'dashboard.my_digital_cv', icon: '👤' },
      { path: '/dashboard/persona/jobs', label: 'dashboard.job_board', icon: '🔍' },
      { path: '/dashboard/persona/certificates', label: 'dashboard.certifications', icon: '🎓' },
      { path: '/dashboard/persona/notifications', label: 'dashboard.notifications', icon: '🔔' },
    ],
    [UserRole.ADVERTISER]: [
      { path: '/dashboard/advertiser/overview', label: 'dashboard.overview', icon: '📊' },
      { path: '/dashboard/advertiser/campaigns', label: 'dashboard.campaigns', icon: '📢' },
      { path: '/dashboard/advertiser/billing', label: 'dashboard.billing', icon: '💳' },
      { path: '/dashboard/advertiser/analytics', label: 'dashboard.analytics', icon: '📈' },
      { path: '/dashboard/advertiser/notifications', label: 'dashboard.notifications', icon: '🔔' },
    ],
  };

  const currentMenu = (menuGroups as any)[currentUser.role] || menuGroups[UserRole.SUPER_ADMIN];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[990] xl:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed xl:static inset-y-0 left-0 z-[1000] bg-white dark:bg-slate-900 flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        }`}
        style={{ width: 'var(--sidebar-width, 18rem)' }}
      >
        {/* Botón de cierre integrado dentro del sidebar para Mobile */}
        <div className="flex xl:hidden justify-end p-4">
          <button 
            onClick={onClose}
            className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Coat_of_arms_of_Equatorial_Guinea.svg" className="w-8 h-5 object-contain" alt="GE Coat of Arms" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">Contenido Nacional</h1>
              <h1 className="text-sm font-black text-blue-600 dark:text-blue-400 leading-none tracking-tighter uppercase mt-0.5">Guinea Ecuatorial</h1>
            </div>
          </Link>
        </div>

        <nav className="p-4 flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-2 px-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Menú Principal</p>
          </div>
          {currentMenu.map((item: any) => {
            const active = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 1280) onClose(); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  active 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-4 border-blue-600' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border-l-4 border-transparent'
                }`}
              >
                <span className="text-lg opacity-80">{item.icon}</span>
                <span>{t(item.label)}</span>
              </Link>
            );
          })}
          
          {/* Ad Banner in Sidebar */}
          <div className="px-2 mt-8">
            <AdBanner 
              type="sidebar" 
              title="Soluciones Logísticas Offshore" 
              description="Transporte seguro y eficiente para sus operaciones marítimas."
              sponsor="Guinea Logistics S.L."
              imageUrl="https://images.unsplash.com/photo-1580828369019-1813202851f1?q=80&w=400&auto=format&fit=crop"
            />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="mb-4 flex items-center gap-3 p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="size-9 rounded-md bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white font-black text-sm">{currentUser.name?.charAt(0) || '?'}</div>
             <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</span>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{t(`roles.${currentUser.role}`)}</span>
             </div>
          </div>
          
          <div className="space-y-1">
            <Link 
              to={`/dashboard/${currentUser.role}/settings`} 
              onClick={() => { if(window.innerWidth < 1280) onClose(); }}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-bold transition-colors ${
                location.pathname.includes('/settings')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
               <span className="material-symbols-outlined text-base">settings</span>
               <span>Configuración</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 font-bold text-xs transition-colors"
            >
               <span className="material-symbols-outlined text-base">logout</span>
               <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
