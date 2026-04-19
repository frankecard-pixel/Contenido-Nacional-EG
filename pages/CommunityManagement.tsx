
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSocialProjects, getHelpRequests } from '../services/supabaseApi';
import { SocialProjectExt, HelpRequest } from '../types';

const CommunityManagement: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<SocialProjectExt[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, helpRequestsData] = await Promise.all([
          getSocialProjects(),
          getHelpRequests()
        ]);
        setProjects(projectsData as any[]);
        setHelpRequests(helpRequestsData as any[]);
      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Obras Públicas Activas", val: projects.length.toString(), trend: "+2 esta semana", icon: "engineering", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Solicitudes Pendientes", val: helpRequests.length.toString(), trend: "5 alta prioridad", icon: "pending_actions", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Empresas Tiers 1", val: "8", trend: "Activas", icon: "domain", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Validación Pendiente", val: "5", trend: "Requiere acción", icon: "fact_check", color: "text-rose-600", bg: "bg-rose-50" }
  ];

  const getUrgencyBadge = (urgency: HelpRequest['urgency']) => {
    const styles = {
      high: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30',
      medium: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30',
      low: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
    };
    const labels = { high: 'Alta', medium: 'Media', low: 'Baja' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[urgency]}`}>
        {labels[urgency]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      execution: 'bg-blue-50 text-blue-700 border-blue-100',
      delayed: 'bg-amber-50 text-amber-700 border-amber-100',
      final_phase: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };
    const labels: any = { execution: 'En Ejecución', delayed: 'Retrasado', final_phase: 'Fase Final' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.execution}`}>
        {labels[status] || 'En Ejecución'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            <span>Admin</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Comunidad y Obras</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Gestión de Comunidad</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium italic max-w-2xl">Supervisión de obras públicas, cumplimiento normativo y atención a solicitudes de empresas locales.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all">
            <span className="material-symbols-outlined text-xl">download</span>
            Exportar
          </button>
          <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-xl">add</span>
            Nueva Obra
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col group relative overflow-hidden transition-all hover:shadow-md">
            <div className={`p-4 ${s.bg} dark:bg-opacity-10 rounded-2xl ${s.color} w-fit mb-6`}>
              <span className="material-symbols-outlined text-3xl">{s.icon}</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{s.val}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${s.color} bg-opacity-10 px-2 py-1 rounded-lg`}>{s.trend}</span>
            </div>
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-7xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Works and Requests */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Public Works List */}
          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">engineering</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Obras Públicas en Curso</h2>
              </div>
              <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Ver todas</button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {projects.map((work) => (
                <div key={work.id} className="p-10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{(work.title as any).es || work.title}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Empresa Responsable: <span className="text-slate-600 dark:text-slate-300">{work.petrolera?.name || 'Operadora Local'}</span></p>
                    </div>
                    {getStatusBadge(work.status)}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-1000 ${work.status === 'delayed' ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${work.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 tabular-nums">{work.progress}%</span>
                  </div>
                  <div className="mt-6 flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-base">calendar_month</span> Entrega: {work.delivery_date || work.deliveryDate}</span>
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-base">location_on</span> {work.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Help Requests Table */}
          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">help_center</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Solicitudes de Ayuda</h2>
              </div>
              <div className="flex gap-3">
                <select 
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-[9px] font-black uppercase tracking-widest px-4 py-2 focus:ring-2 focus:ring-primary dark:text-white"
                >
                  <option value="Todas">Todas las urgencias</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-[9px] font-black uppercase tracking-widest px-4 py-2 focus:ring-2 focus:ring-primary dark:text-white"
                >
                  <option value="Todos">Todos los tipos</option>
                  <option value="Legal">Legal</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Financiación">Financiación</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-10 py-5">Empresa Local</th>
                    <th className="px-10 py-5">Tipo</th>
                    <th className="px-10 py-5">Fecha</th>
                    <th className="px-10 py-5">Urgencia</th>
                    <th className="px-10 py-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {helpRequests.filter(req => {
                    const matchesUrgency = urgencyFilter === 'Todas' || req.urgency === urgencyFilter;
                    const matchesType = typeFilter === 'Todos' || req.type === typeFilter;
                    return matchesUrgency && matchesType;
                  }).map((req) => (
                    <tr key={req.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-slate-500">
                            {(req.company?.name || 'EL').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{req.company?.name || 'Empresa Local'}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {req.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{req.type}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(req.created_at || '').toLocaleDateString()}</span>
                      </td>
                      <td className="px-10 py-6">
                        {getUrgencyBadge(req.urgency)}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline transition-all">Revisar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 text-center border-t border-slate-50 dark:border-slate-700">
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">Ver todas las solicitudes ({helpRequests.length})</button>
            </div>
          </section>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-10">
          
          {/* Conformity Widget */}
          <section className="bg-gradient-to-br from-primary to-blue-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[150px]">verified</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                  <span className="material-symbols-outlined text-2xl">fact_check</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Conformidad de Obras</h2>
              </div>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium uppercase tracking-tight">Hay <strong className="text-white">3 obras</strong> que han completado fases críticas y esperan validación de documentación técnica oficial.</p>
              
              <div className="space-y-4 mb-10">
                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">Escuela Malabo II</span>
                    <span className="text-[9px] font-black bg-white text-primary px-2 py-0.5 rounded-lg uppercase tracking-widest">Fase 2</span>
                  </div>
                  <p className="text-xs text-white/80 font-medium italic">Certificado de estructura pendiente de firma.</p>
                </div>
              </div>

              <button className="w-full py-4 bg-white text-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                Gestionar Validaciones
              </button>
            </div>
          </section>

          {/* Communications Feed */}
          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-fit overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Comunicaciones</h2>
              <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Ver Todo</button>
            </div>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {[
                { name: "Sarah M. (Exxon)", text: "Hemos subido los informes de impacto ambiental para la fase 3 del proyecto Luba.", time: "10:30 AM", online: true },
                { name: "John D. (Marathon)", text: "Solicitamos una reunión para revisar los nuevos requisitos de contenido nacional.", time: "Ayer", online: false },
                { name: "Carlos E. (Admin)", text: "Nota interna: Revisar la documentación pendiente de Construcciones Malabo antes del viernes.", time: "2 días", online: true }
              ].map((msg, i) => (
                <div key={i} className="flex gap-5 p-4 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all cursor-pointer group">
                  <div className="relative shrink-0">
                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-slate-400">
                      {msg.name?.charAt(0) || '?'}
                    </div>
                    {msg.online && <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{msg.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium uppercase tracking-tight">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-700">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Mensaje rápido..." 
                  className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl pl-6 pr-12 py-3 text-xs font-medium focus:ring-2 focus:ring-primary transition-all dark:text-white shadow-inner"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Page Footer */}
      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Panel de Control Gubernamental • Comunidad y Obras Públicas</p>
      </footer>
    </div>
  );
};

export default CommunityManagement;
