
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
    <div className="p-8 lg:p-12 space-y-10 animate-in fade-in duration-700">
      <div className="rounded-[3rem] bg-slate-900 p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block opacity-60">Auditoría Técnica y de Campo</span>
            <h1 className="text-5xl font-black uppercase tracking-tighter">Inspector de Soberanía</h1>
            <p className="text-slate-400 font-medium mt-4 max-w-2xl italic leading-relaxed">Su labor garantiza que las operadoras cumplan con los estándares de seguridad y participación nacional en sitio.</p>
         </div>
         <span className="material-symbols-outlined absolute right-[-40px] top-[-40px] text-[250px] opacity-5">engineering</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Inspecciones Hoy", val: "3", icon: "fact_check", color: "text-blue-600" },
          { label: "Visitas Pendientes", val: "14", icon: "schedule", color: "text-amber-600" },
          { label: "Reportes Validados", val: "89", icon: "verified", color: "text-emerald-600" },
          { label: "Incidencias HSE", val: "2", icon: "warning", color: "text-rose-600" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className={`p-3 w-fit rounded-xl bg-slate-50 dark:bg-slate-900 ${kpi.color} mb-6`}>
               <span className="material-symbols-outlined">{kpi.icon}</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Inspection Schedule */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">Agenda de Auditoría</h3>
              <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Agendar Visita</button>
           </div>
           <div className="p-6 space-y-4">
              {[
                { company: 'EG LNG Operations', site: 'Planta Punta Europa', time: '09:00 AM', status: 'En camino' },
                { company: 'ExxonMobil', site: 'Plataforma Zafiro B', time: '01:30 PM', status: 'Programado' },
                { company: 'Noble Energy', site: 'Muelle Luba', time: 'Mañana', status: 'Programado' }
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-primary transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-primary text-sm shadow-sm">
                         {v.company.substring(0, 2)}
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{v.company}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{v.site} • <span className="text-blue-600">{v.time}</span></p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
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
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
           <h3 className="text-lg font-black uppercase tracking-tight mb-8">Últimos Informes Técnicos</h3>
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
