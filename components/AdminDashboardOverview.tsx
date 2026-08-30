
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCompanies, getOpportunities, getHelpRequests, getTalents } from '../services/supabaseApi';
import { Company, OpportunityExt, User, HelpRequest } from '../types';
import CommodityWidget from './dashboard/CommodityWidget';

interface AdminDashboardOverviewProps {
  user: User;
}

const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityExt[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch each service independently to avoid one failure blocking everything
        const [compsResult, oppsResult, helpResult, talentsResult] = await Promise.allSettled([
          getCompanies(),
          getOpportunities(),
          getHelpRequests(),
          getTalents()
        ]);

        if (compsResult.status === 'fulfilled') setCompanies(compsResult.value as any);
        if (oppsResult.status === 'fulfilled') setOpportunities(oppsResult.value as any);
        if (helpResult.status === 'fulfilled') setHelpRequests(helpResult.value as any);
        if (talentsResult.status === 'fulfilled') setTalents(talentsResult.value || []);
        
      } catch (error) {
        console.error("Critical error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort companies by registration date descending
  const sortedCompanies = [...companies].sort((a, b) => {
    const dateA = new Date(a.registrationDate || (a as any).created_at || 0).getTime();
    const dateB = new Date(b.registrationDate || (b as any).created_at || 0).getTime();
    return dateB - dateA;
  });
  
  const recentRegistrations = sortedCompanies.slice(0, 4);
  
  // Calculate companies registered this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newCompaniesThisWeek = companies.filter(c => {
    const regDate = new Date(c.registrationDate || (c as any).created_at || 0);
    return regDate >= oneWeekAgo;
  }).length;

  const publishedOpps = opportunities.filter(o => o.status === 'published').length;
  const closedOpps = opportunities.filter(o => o.status === 'closed').length;
  const awardedOpps = opportunities.filter(o => o.status === 'awarded').length;

  const pendingTasks = helpRequests.filter(h => h.status === 'pending');
  const verifiedTalents = talents.filter(t => t.verification_status === 'verified').length;
  const pendingTalents = talents.filter(t => t.verification_status === 'pending').length;

  const basePath = user.role === 'funcionario' ? '/dashboard/funcionario' : '/dashboard/super_admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 p-8 md:p-12 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent opacity-50"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            BIENVENIDO, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {user.name || 'ADMINISTRADOR'}
            </span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl font-bold uppercase tracking-[0.2em] leading-relaxed opacity-70">
            Gestione el cumplimiento normativo y el desarrollo del contenido nacional en el sector energético de Guinea Ecuatorial de manera eficiente.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Empresas Card */}
        <Link 
          to={`${basePath}/companies`}
          className="flex flex-col bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all group cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 text-primary p-2 sm:p-3 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-lg sm:text-2xl">domain</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-1">
                Empresas
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary">arrow_forward</span>
              </h3>
            </div>
            {newCompaniesThisWeek > 0 && (
              <span className="text-[8px] sm:text-[9px] font-black bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest">
                +{newCompaniesThisWeek}
              </span>
            )}
          </div>
          <div className="flex items-end gap-1.5 sm:gap-3 mb-4 sm:mb-6">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{companies.length}</span>
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 mb-0.5 sm:mb-1 uppercase tracking-widest leading-none">registradas</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
            <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Certificadas</span>
              <span className="text-[10px] sm:text-xs font-black text-emerald-600 uppercase leading-none">{companies.filter(c => c.status === 'certified').length}</span>
            </div>
            <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Pendientes</span>
              <span className="text-[10px] sm:text-xs font-black text-amber-600 uppercase leading-none">{companies.filter(c => c.status === 'pending').length}</span>
            </div>
          </div>
        </Link>

        {/* Talentos Card */}
        <Link 
          to={user.role === 'funcionario' ? `${basePath}/companies` : `${basePath}/talents`}
          className="flex flex-col bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all group cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-lg sm:text-2xl">groups</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-1">
                Base Talentos
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-600">arrow_forward</span>
              </h3>
            </div>
          </div>
          <div className="flex items-end gap-1.5 sm:gap-3 mb-4 sm:mb-6">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{talents.length}</span>
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 mb-0.5 sm:mb-1 uppercase tracking-widest leading-none">perfiles</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
            <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Verificados</span>
              <span className="text-[10px] sm:text-xs font-black text-emerald-600 uppercase leading-none">{verifiedTalents}</span>
            </div>
            <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Por Validar</span>
              <span className="text-[10px] sm:text-xs font-black text-amber-600 uppercase leading-none">{pendingTalents}</span>
            </div>
          </div>
        </Link>

        {/* Oportunidades Card */}
        <Link 
          to={`${basePath}/opportunities`}
          className="flex flex-col bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all group cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-lg sm:text-2xl">work</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-1">
                Oportunidades
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-600">arrow_forward</span>
              </h3>
            </div>
          </div>
          <div className="flex items-end gap-1.5 sm:gap-3 mb-4 sm:mb-6">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{opportunities.length}</span>
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 mb-0.5 sm:mb-1 uppercase tracking-widest leading-none">activas</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 sm:h-2 rounded-full mb-3 sm:mb-4 overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${opportunities.length > 0 ? (publishedOpps / opportunities.length) * 100 : 0}%` }}></div>
            <div className="bg-primary h-full" style={{ width: `${opportunities.length > 0 ? (awardedOpps / opportunities.length) * 100 : 0}%` }}></div>
          </div>
          <div className="flex justify-between text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <span>{publishedOpps} Publicadas</span>
            <span>{awardedOpps} Adjudicadas</span>
          </div>
        </Link>

        {/* Tareas Card */}
        <Link
          to={`${basePath}/help-requests`}
          className="flex flex-col bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all relative overflow-hidden group cursor-pointer active:scale-[0.98]"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-lg sm:text-2xl">notification_important</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-1">
                Alertas
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-orange-600">arrow_forward</span>
              </h3>
            </div>
            <div className="flex items-end gap-1.5 sm:gap-3 mb-2 sm:mb-3">
              <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{pendingTasks.length + pendingTalents}</span>
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 mb-0.5 sm:mb-1 uppercase tracking-widest leading-none">pendientes</span>
            </div>
            <p className="text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400 mb-4 sm:mb-8 font-black uppercase tracking-tight leading-tight">Acciones prioritarias de validación y atención.</p>
            <div 
              className="w-full py-2.5 sm:py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] rounded-lg sm:rounded-xl transition-all shadow-lg flex items-center justify-center mt-auto group-hover:bg-primary group-hover:text-white"
            >
              Gestionar Alertas
            </div>
          </div>
        </Link>
      </div>

      {/* Commodity Widget */}
      <div>
        <CommodityWidget />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Activity Table */}
        <div className="xl:col-span-2 flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 md:px-10 py-6 md:py-8 border-b border-slate-50 dark:border-slate-700 gap-4">
            <h3 className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tighter">Registros Recientes</h3>
            <Link to={`${basePath}/companies`} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Ver todo el directorio</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-700/30 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-10 py-5">Empresa</th>
                  <th className="px-10 py-5">Sector</th>
                  <th className="px-10 py-5">Fecha</th>
                  <th className="px-10 py-5">Estado</th>
                  <th className="px-10 py-5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-700">
                {recentRegistrations.length > 0 ? (
                  recentRegistrations.map((company) => (
                    <tr key={company.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                      <td className="px-10 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary font-black text-xs">
                            {company.name?.substring(0, 2).toUpperCase() || '??'}
                          </div>
                          {company.name}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {company.sector && company.sector.length > 0 ? company.sector[0] : 'N/A'}
                      </td>
                      <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase">
                        {company.registrationDate ? new Date(company.registrationDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-10 py-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          company.status === 'certified' ? 'bg-emerald-100 text-emerald-700' : 
                          company.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            company.status === 'certified' ? 'bg-emerald-500' : 
                            company.status === 'pending' ? 'bg-amber-500' :
                            'bg-slate-500'
                          }`}></span>
                          {company.status === 'certified' ? 'Certificada' : 
                           company.status === 'pending' ? 'Pendiente' : 
                           company.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Link 
                          to={`${basePath}/companies`}
                          className="text-slate-400 hover:text-primary transition-all p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl inline-flex items-center justify-center"
                          title="Ver en Directorio"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No hay empresas registradas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Pending Tasks List */}
        <div className="xl:col-span-1 flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 md:px-8 py-6 md:py-8 border-b border-slate-50 dark:border-slate-700">
            <h3 className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tighter">Lista de Tareas</h3>
            <Link to={`${basePath}/help-requests`} className="text-slate-400 hover:text-primary transition-all p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><span className="material-symbols-outlined">filter_list</span></Link>
          </div>
          <div className="flex flex-col p-6 gap-4 overflow-y-auto custom-scrollbar max-h-[600px]">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 5).map((task, i) => (
                <div key={task.id} className="flex flex-col gap-4 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all bg-white dark:bg-slate-800 group">
                  <div className="flex justify-between items-start">
                    <span className={`bg-amber-100 text-amber-700 text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest`}>
                      {task.type}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">
                      {new Date(task.date || (task as any).created_at || new Date()).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">
                      Petición de {task.companyName || (task as any).company?.name || 'Empresa'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-tight">
                      Urgencia: {task.urgency}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Link to={`${basePath}/help-requests`} className="flex-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-blue-500/10 text-center flex items-center justify-center">Atender</Link>
                    <Link to={`${basePath}/help-requests`} className="px-4 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-base">close</span></Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No hay tareas pendientes</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Internal */}
      <footer className="flex flex-col sm:flex-row items-center justify-between py-6 md:py-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border-t border-slate-50 dark:border-slate-700 gap-4 text-center sm:text-left">
        <p>© 2024 Ministerio de Hidrocarburos, Minas y Electricidad. República de Guinea Ecuatorial.</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4 md:mt-0">
          <a className="hover:text-primary transition-all" href="#">Privacidad</a>
          <a className="hover:text-primary transition-all" href="#">Términos de Uso</a>
          <a className="hover:text-primary transition-all" href="#">Soporte Técnico</a>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardOverview;
