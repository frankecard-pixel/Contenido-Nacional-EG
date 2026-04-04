import React from 'react';
import { useTranslation } from 'react-i18next';
import { OpportunityExt } from '../../types';

interface OpportunityStatsProps {
  stats: {
    total: number;
    active: number;
    applicants: number;
  };
}

const OpportunityStats: React.FC<OpportunityStatsProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { label: "Total Oportunidades", val: stats.total, icon: "folder_open", color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
        { label: "Convocatorias Abiertas", val: stats.active, icon: "campaign", color: "text-orange-600", bg: "bg-orange-50", trend: "Activas hoy" },
        { label: "Total Aplicantes", val: stats.applicants, icon: "groups", color: "text-purple-600", bg: "bg-purple-50", trend: "+18%" }
      ].map((s, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col group relative overflow-hidden transition-all hover:shadow-md">
          <div className={`p-4 ${s.bg} dark:bg-opacity-10 rounded-2xl ${s.color} w-fit mb-6`}>
            <span className="material-symbols-outlined text-3xl">{s.icon}</span>
          </div>
          <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{s.val}</span>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${s.trend.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>
              {s.trend}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default OpportunityStats;
