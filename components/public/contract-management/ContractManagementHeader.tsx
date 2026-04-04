import React from 'react';

const ContractManagementHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          <span>Gestión</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-primary">Contratos</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Contratos</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium italic max-w-2xl">Administre sus contratos activos, supervise hitos y garantice el cumplimiento del contenido nacional.</p>
      </div>
      <div className="flex gap-4">
        <button className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all">
          <span className="material-symbols-outlined text-xl">download</span>
          Exportar
        </button>
        <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined text-xl">add</span>
          Nuevo Contrato
        </button>
      </div>
    </header>
  );
};

export default ContractManagementHeader;
