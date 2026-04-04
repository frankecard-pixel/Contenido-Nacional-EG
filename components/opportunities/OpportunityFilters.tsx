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
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="relative w-full lg:w-96 group">
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
        <input 
          type="text" 
          placeholder="Buscar por título o referencia..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all dark:text-white placeholder:text-slate-400"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl">
          {['Todas', 'Abiertas', 'Cerradas', 'Borradores'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === status 
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' 
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
          className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-12 relative"
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
