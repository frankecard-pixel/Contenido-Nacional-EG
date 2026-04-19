
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCompanies, getOpportunities, getHelpRequests } from '../services/supabaseApi';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compsData, oppsData, helpData] = await Promise.all([
          getCompanies(),
          getOpportunities(),
          getHelpRequests()
        ]);
        setCompanies(compsData as any);
        setOpportunities(oppsData as any);
        setHelpRequests(helpData as any);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
      <div className="rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-[#101622] to-[#1e293b] p-6 md:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-full opacity-20" style={{ background: 'radial-gradient(circle at center, #135bec 0%, transparent 70%)' }}></div>
        <div className="relative z-10 flex flex-col gap-2">
          <h2 className="text-white text-3xl font-black tracking-tighter uppercase">Bienvenido, {user.name}</h2>
          <p className="text-gray-400 text-sm max-w-2xl font-medium uppercase tracking-wide">
            Gestione el cumplimiento normativo y el desarrollo del contenido nacional en el sector energético de Guinea Ecuatorial de manera eficiente.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Empresas Card */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 text-primary p-3 rounded-2xl">
                <span className="material-symbols-outlined text-2xl">domain</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest">Empresas</h3>
            </div>
            {newCompaniesThisWeek > 0 && (
              <span className="text-[9px] font-black bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full uppercase tracking-widest">
                +{newCompaniesThisWeek} esta semana
              </span>
            )}
          </div>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{companies.length}</span>
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">registradas</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Cert.</span>
              <span className="text-xs font-black text-emerald-600 uppercase">{companies.filter(c => c.status === 'certified').length}</span>
            </div>
            <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Pend.</span>
              <span className="text-xs font-black text-amber-600 uppercase">{companies.filter(c => c.status === 'pending').length}</span>
            </div>
            <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Rech.</span>
              <span className="text-xs font-black text-red-600 uppercase">{companies.filter(c => c.status === 'rejected').length}</span>
            </div>
          </div>
        </div>

        {/* Oportunidades Card */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 p-3 rounded-2xl">
                <span className="material-symbols-outlined text-2xl">work</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest">Oportunidades</h3>
            </div>
          </div>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{opportunities.length}</span>
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">totales</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full mb-4 overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${opportunities.length > 0 ? (publishedOpps / opportunities.length) * 100 : 0}%` }} title="Activas"></div>
            <div className="bg-slate-400 h-full" style={{ width: `${opportunities.length > 0 ? (closedOpps / opportunities.length) * 100 : 0}%` }} title="Cerradas"></div>
            <div className="bg-primary h-full" style={{ width: `${opportunities.length > 0 ? (awardedOpps / opportunities.length) * 100 : 0}%` }} title="Adjudicadas"></div>
          </div>
          <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
            <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-emerald-500"></div> {publishedOpps} Activas</span>
            <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-slate-400"></div> {closedOpps} Cerradas</span>
            <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary"></div> {awardedOpps} Adjudicadas</span>
          </div>
        </div>

        {/* Tareas Card */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/10 rounded-bl-full -mr-6 -mt-6 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-3 rounded-2xl">
                <span className="material-symbols-outlined text-2xl">assignment_late</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest">Atención Requerida</h3>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{pendingTasks.length}</span>
              <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">tareas urgentes</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-medium uppercase tracking-tight">Peticiones y validaciones pendientes que requieren acción inmediata.</p>
            <Link 
              to={`/dashboard/${user.role === 'admin' ? 'super_admin' : user.role}/help-requests`}
              className="w-full py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              Ver todas las tareas
            </Link>
          </div>
        </div>
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
            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Ver todo el directorio</button>
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
                        <button className="text-slate-400 hover:text-primary transition-all p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
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
            <button className="text-slate-400 hover:text-primary transition-all"><span className="material-symbols-outlined">filter_list</span></button>
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
                    <button className="flex-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-blue-500/10">Atender</button>
                    <button className="px-4 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"><span className="material-symbols-outlined text-base">close</span></button>
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
        <p>© 2024 Ministerio de Hidrocarburos y Desarrollo Minero. República de Guinea Ecuatorial.</p>
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
