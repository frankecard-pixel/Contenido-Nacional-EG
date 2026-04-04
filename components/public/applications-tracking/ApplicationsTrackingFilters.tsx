import React from 'react';

interface ApplicationsTrackingFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ApplicationsTrackingFilters: React.FC<ApplicationsTrackingFiltersProps> = ({ filter, setFilter, searchQuery, setSearchQuery }) => {
  const filterButtons = [
    { id: 'all', label: 'Todas' },
    { id: 'review', label: 'En Revisión' },
    { id: 'action', label: 'Acción Requerida' },
    { id: 'awarded', label: 'Adjudicadas' }
  ];

  return (
    <section className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex overflow-x-auto gap-3 pb-2 md:pb-0 custom-scrollbar w-full md:w-auto">
        {filterButtons.map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === btn.id 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                : 'bg-slate-50 dark:bg-slate-700 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-96">
        <span className="absolute inset-y-0 left-5 flex items-center text-slate-400">
          <span className="material-symbols-outlined">search</span>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-4 pl-14 pr-6 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-primary text-xs font-black uppercase tracking-widest dark:text-white"
          placeholder="Buscar por ID o Proyecto..."
        />
      </div>
    </section>
  );
};

export default ApplicationsTrackingFilters;
