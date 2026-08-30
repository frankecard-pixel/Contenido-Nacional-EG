import React from 'react';

interface OpportunityFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  activeSector: string;
  setActiveSector: (sector: string) => void;
}

const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  activeSector,
  setActiveSector
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch lg:items-center justify-between bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xs">
      <div className="relative w-full lg:w-96 group">
        <span className="material-symbols-outlined absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg sm:text-xl">search</span>
        <input 
          type="text" 
          placeholder="Buscar por título o referencia..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all dark:text-white placeholder:text-slate-400"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full lg:w-auto overflow-hidden">
        {/* Contenedor desplazable de pestañas de estado */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl overflow-x-auto no-scrollbar scroll-smooth flex-nowrap shrink-0">
          {['Todas', 'Abiertas', 'Cerradas', 'Borradores'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <select 
          value={activeSector}
          onChange={(e) => setActiveSector(e.target.value)}
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10 relative shrink-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
        >
          <option value="">Todos los Sectores</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="Logística">Logística</option>
          <option value="Ingeniería">Ingeniería</option>
          <option value="Catering">Catering</option>
          <option value="Seguridad">Seguridad</option>
        </select>
      </div>
    </div>
  );
};

export default OpportunityFilters;
