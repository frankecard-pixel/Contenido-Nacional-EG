import React from 'react';

interface AuditReportsStatsProps {
  stats: {
    label: string;
    val: string;
    icon: string;
    trend: string;
    trendColor: string;
  }[];
}

const AuditReportsStats: React.FC<AuditReportsStatsProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-500">{s.icon}</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mt-4">{s.val}</p>
          <div className={`flex items-center gap-1 mt-4 text-[10px] font-black uppercase tracking-widest ${s.trendColor}`}>
            <span className="material-symbols-outlined text-sm">{s.trendColor.includes('red') ? 'warning' : 'trending_up'}</span>
            <span>{s.trend}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AuditReportsStats;
