import React from 'react';

interface ApplicationsTrackingStatsProps {
  stats: {
    total: number;
    review: number;
    action: number;
    awarded: number;
  };
}

const ApplicationsTrackingStats: React.FC<ApplicationsTrackingStatsProps> = ({ stats }) => {
  const statItems = [
    { label: "Total Aplicaciones", val: stats.total, icon: "folder_open", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "En Revisión", val: stats.review, icon: "hourglass_top", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Acción Requerida", val: stats.action, icon: "error", color: "text-red-600", bg: "bg-red-50" },
    { label: "Adjudicadas", val: stats.awarded, icon: "verified", color: "text-green-600", bg: "bg-green-50" }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((s, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-6">
          <div className={`p-4 ${s.bg} dark:bg-opacity-10 rounded-2xl ${s.color}`}>
            <span className="material-symbols-outlined text-3xl">{s.icon}</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{s.val}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ApplicationsTrackingStats;
