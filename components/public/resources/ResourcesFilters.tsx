import React from 'react';

interface ResourcesFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filters: string[];
}

const ResourcesFilters: React.FC<ResourcesFiltersProps> = ({ activeFilter, setActiveFilter, filters }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input 
          className="block w-full p-5 pl-14 text-sm text-[#0d121b] dark:text-white rounded-2xl bg-white dark:bg-[#1a202c] border border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none shadow-sm transition-all" 
          placeholder="Buscar leyes, guías, vídeos o eventos..." 
          type="text"
        />
        <button className="text-white absolute right-3 bottom-3 bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-black uppercase text-[10px] tracking-widest rounded-xl px-6 py-3 transition-all">
          Buscar
        </button>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-3">
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === filter 
                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                : 'bg-white dark:bg-[#1a202c] text-[#0d121b] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-slate-100 dark:border-slate-700 shadow-sm'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResourcesFilters;
