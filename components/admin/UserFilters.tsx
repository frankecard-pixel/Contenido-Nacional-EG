import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../../types';

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  deptFilter: string;
  setDeptFilter: (dept: string) => void;
  departments: string[];
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  deptFilter,
  setDeptFilter,
  departments
}) => {
  return (
    <div className="flex flex-col gap-6 border-b border-slate-50 p-8 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="relative w-full max-w-md group">
        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-2xl border-none bg-slate-50 py-4 pl-14 pr-6 text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-primary dark:bg-slate-900 dark:text-white shadow-inner uppercase tracking-tight" 
          placeholder="Buscar por nombre, email o cargo..." 
        />
      </div>

      {/* Chips / Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Filtrar por:</span>
        
        <div className="relative group">
           <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="appearance-none inline-flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-all cursor-pointer pr-12 focus:ring-2 focus:ring-primary outline-none"
           >
             {departments.map(d => (
               <option key={d} value={d}>
                 {d === 'Todos' ? 'Todos los Deptos/Entidades' : d}
               </option>
             ))}
           </select>
           <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-transparent px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-primary hover:text-primary transition-all">
          <span className="material-symbols-outlined text-lg">filter_list</span>
          Más filtros
        </button>
      </div>
    </div>
  );
};

export default UserFilters;
