
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuditLogs } from '../services/supabaseApi';
import { AuditLog } from '../types';

const CuerpoTecnicoDashboardOverview: React.FC = () => {
  const { t } = useTranslation();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuditLogs();
        setAuditLogs(data as any);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div className="rounded-[2rem] md:rounded-[3rem] bg-slate-900 p-6 md:p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block opacity-60">Auditoría Técnica y de Campo</span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter break-words">Inspector de Soberanía</h1>
            <p className="text-slate-400 font-medium mt-4 max-w-2xl italic leading-relaxed text-sm md:text-base">Su labor garantiza que las operadoras cumplan con los estándares de seguridad y participación nacional en sitio.</p>
         </div>
         <span className="material-symbols-outlined absolute right-[-20px] md:right-[-40px] top-[-20px] md:top-[-40px] text-[150px] md:text-[250px] opacity-5">engineering</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Inspecciones Hoy", val: "3", icon: "fact_check", color: "text-blue-600" },
          { label: "Visitas Pendientes", val: "14", icon: "schedule", color: "text-amber-600" },
          { label: "Reportes Validados", val: "89", icon: "verified", color: "text-emerald-600" },
          { label: "Incidencias HSE", val: "2", icon: "warning", color: "text-rose-600" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className={`p-3 w-fit rounded-xl bg-slate-50 dark:bg-slate-900 ${kpi.color} mb-4 md:mb-6`}>
               <span className="material-symbols-outlined">{kpi.icon}</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Inspection Schedule */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
           <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">Agenda de Auditoría</h3>
              <button className="bg-primary text-white px-6 py-3 sm:py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 w-full sm:w-auto mt-2 sm:mt-0">Agendar Visita</button>
           </div>
           <div className="p-4 md:p-6 space-y-4">
              {[
                { company: 'EG LNG Operations', site: 'Planta Punta Europa', time: '09:00 AM', status: 'En camino' },
                { company: 'ExxonMobil', site: 'Plataforma Zafiro B', time: '01:30 PM', status: 'Programado' },
                { company: 'Noble Energy', site: 'Muelle Luba', time: 'Mañana', status: 'Programado' }
              ].map((v, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-primary transition-all group gap-4">
                   <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                      <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-primary text-sm shadow-sm">
                         {v.company.substring(0, 2)}
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{v.company}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{v.site} • <span className="text-blue-600">{v.time}</span></p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${v.status === 'En camino' ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                         {v.status}
                      </span>
                      <button className="p-2 text-slate-400 group-hover:text-primary"><span className="material-symbols-outlined">map</span></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Technical Reports */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
           <h3 className="text-lg font-black uppercase tracking-tight mb-6 md:mb-8">Últimos Informes Técnicos</h3>
           <div className="space-y-6 flex-1">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="flex gap-4 items-start border-b border-slate-50 dark:border-slate-700 pb-4 last:border-none">
                   <span className="material-symbols-outlined text-primary text-xl">description</span>
                   <div>
                      <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{log.action}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Ref: {log.entity_id} • {new Date(log.timestamp).toLocaleDateString()}</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all">Ver Historial Completo</button>
        </div>
      </div>
    </div>
  );
};

export default CuerpoTecnicoDashboardOverview;
