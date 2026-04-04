import React from 'react';

interface DocumentManagementStatsProps {
  stats: {
    approved: number;
    pending: number;
    rejected: number;
    expired: number;
    complianceScore: number;
  };
}

const DocumentManagementStats: React.FC<DocumentManagementStatsProps> = ({ stats }) => {
  const statItems = [
    { label: "Aprobados", val: stats.approved, color: "text-emerald-600", bg: "bg-emerald-50", icon: "check_circle" },
    { label: "Pendientes", val: stats.pending, color: "text-amber-600", bg: "bg-amber-50", icon: "hourglass_top" },
    { label: "Rechazados", val: stats.rejected, color: "text-red-600", bg: "bg-red-50", icon: "error" },
    { label: "Expirados", val: stats.expired, color: "text-slate-600", bg: "bg-slate-50", icon: "event_busy" }
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Nivel de Cumplimiento General</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Basado en documentos obligatorios aprobados</p>
          </div>
          <span className="text-4xl font-black text-primary tracking-tighter">{stats.complianceScore}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 mb-8 overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-1000 relative" style={{ width: `${stats.complianceScore}%` }}>
             <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
          <span className="material-symbols-outlined text-amber-600 text-3xl shrink-0">warning</span>
          <div>
            <p className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest">Atención Requerida</p>
            <p className="text-sm text-amber-700 dark:text-amber-500/80 font-medium leading-relaxed mt-1 uppercase tracking-tight">
              Tiene {stats.expired} documento expirado y {stats.rejected} rechazado que requieren acción inmediata para alcanzar el 100%.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {statItems.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className={`p-2.5 ${s.bg} dark:bg-opacity-10 rounded-xl ${s.color}`}>
                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
              </div>
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{s.val}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DocumentManagementStats;
