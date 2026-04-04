import React from 'react';
import { Company } from '../../types';

interface CompanyWelcomeHeaderProps {
  company: Company;
}

const CompanyWelcomeHeader: React.FC<CompanyWelcomeHeaderProps> = ({ company }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          Bienvenido, {company.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Aquí está el resumen de su actividad y cumplimiento en el sector de hidrocarburos.
        </p>
      </div>
      <div className="flex gap-4">
        <button className="inline-flex items-center justify-center px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm">
          <span className="material-symbols-outlined text-lg mr-2">download</span>
          Reporte Mensual
        </button>
        <button className="inline-flex items-center justify-center px-6 py-3.5 bg-primary border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined text-lg mr-2">edit</span>
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default CompanyWelcomeHeader;
