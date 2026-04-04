import React from 'react';

const AuditReportsHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Admin</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span>Sistemas</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-primary">Auditoría</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Auditoría y Reportes</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Gestión centralizada de logs, estadísticas del sector y cumplimiento normativo.</p>
      </div>
      <div className="flex gap-4">
        <button className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all">
          <span className="material-symbols-outlined text-xl">calendar_month</span>
          Últimos 30 días
        </button>
        <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined text-xl">download</span>
          Exportar Reporte
        </button>
      </div>
    </header>
  );
};

export default AuditReportsHeader;
