import React from 'react';

interface DirectoryFiltersProps {
  sectors: string[];
  filter: string;
  setFilter: (filter: string) => void;
  view?: 'grid' | 'map';
  setView?: (view: 'grid' | 'map') => void;
}

const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({ 
  sectors, 
  filter, 
  setFilter,
  view = 'grid',
  setView
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      {/* Sector filter buttons */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar whitespace-nowrap flex-1">
        {sectors.map(s => (
          <button 
            key={s} 
            type="button"
            onClick={() => setFilter(s)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 active:scale-95 ${
              filter === s 
                ? 'bg-blue-700 text-white shadow-lg shadow-blue-500/25 border-none' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            {s === 'all' ? 'Todos los Sectores' : s}
          </button>
        ))}
      </div>

      {/* Grid vs Map View Toggle */}
      {setView && (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0 border border-slate-200/50 dark:border-slate-700 self-end md:self-auto shadow-sm">
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              view === 'grid'
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm font-black'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg">grid_view</span>
            Lista
          </button>
          <button
            type="button"
            onClick={() => setView('map')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              view === 'map'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-black'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg">map</span>
            Geolocalizar
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectoryFilters;
