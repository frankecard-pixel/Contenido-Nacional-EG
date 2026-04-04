
import React from 'react';

interface DashboardPlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

const DashboardPlaceholder: React.FC<DashboardPlaceholderProps> = ({ title, description, icon }) => {
  return (
    <div className="p-8 lg:p-12 h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
      <div className="size-24 rounded-[2rem] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 shadow-sm">
        <span className="material-symbols-outlined text-5xl">{icon}</span>
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md font-medium leading-relaxed">
        {description}
      </p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado del Módulo</p>
          <div className="flex items-center justify-center space-x-2 text-blue-600 font-bold">
            <span className="size-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>En Desarrollo</span>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Próxima Actualización</p>
          <p className="text-slate-900 dark:text-white font-bold">Q2 2024</p>
        </div>
      </div>
      <button className="mt-12 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest hover:underline">
        Solicitar Acceso Anticipado →
      </button>
    </div>
  );
};

export default DashboardPlaceholder;
