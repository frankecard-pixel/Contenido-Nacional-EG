import React from 'react';

const CompanyTopWidgets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Completeness (Large) */}
      <div className="lg:col-span-2 bg-gradient-to-br from-primary to-blue-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-10 items-center">
          <div className="size-32 rounded-full border-8 border-white/20 flex items-center justify-center relative shrink-0 shadow-inner bg-white/5">
            <svg className="size-full -rotate-90 transform" viewBox="0 0 36 36">
              <path className="text-white/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-white drop-shadow-lg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="3" />
            </svg>
            <span className="absolute text-3xl font-black tracking-tighter">75%</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">Perfil de Empresa casi completo</h3>
            <p className="text-blue-100 text-sm mb-8 max-w-md font-medium leading-relaxed uppercase tracking-wide">
              Para acceder a licitaciones de Nivel 1, necesita completar su documentación fiscal y actualizar sus certificaciones ISO.
            </p>
            <button className="bg-white text-primary text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all inline-flex items-center shadow-lg">
              Completar ahora
              <span className="material-symbols-outlined text-base ml-2">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Compliance Alert */}
      <div className="bg-white dark:bg-slate-800 border-l-8 border-amber-500 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between border border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 font-black uppercase tracking-widest text-xs">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3>Acción Requerida</h3>
            </div>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Urgente</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed font-medium uppercase tracking-tight">
            Su <strong>Certificado de Solvencia Fiscal</strong> vence en 5 días. La renovación es necesaria para mantener su estatus activo.
          </p>
        </div>
        <button className="w-full py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
          Subir Documento
        </button>
      </div>
    </div>
  );
};

export default CompanyTopWidgets;
