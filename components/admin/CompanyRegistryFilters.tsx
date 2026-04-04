import React from 'react';
import { Company } from '../../types';

interface CompanyRegistryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CompanyRegistryFilters: React.FC<CompanyRegistryFiltersProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
      <div className="relative flex-1 min-w-[300px] max-w-xl group">
        <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </span>
        <input 
          type="text" 
          placeholder="Buscar por nombre, RUGE o ID fiscal..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary dark:text-white shadow-inner"
        />
      </div>
      <div className="flex items-center gap-4 px-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
         {['Todos', 'Activos', 'Pendientes', 'Suspendidos'].map(f => (
           <button key={f} className="px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-all">{f}</button>
         ))}
         <div className="w-px h-8 bg-slate-100 dark:bg-slate-700 mx-2"></div>
         <button className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-primary"><span className="material-symbols-outlined">filter_list</span></button>
      </div>
    </section>
  );
};

export default CompanyRegistryFilters;
