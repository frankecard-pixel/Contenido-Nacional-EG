import React from 'react';

interface DirectoryFiltersProps {
  sectors: string[];
  filter: string;
  setFilter: (filter: string) => void;
}

const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({ sectors, filter, setFilter }) => {
  return (
    <div className="flex gap-4 mb-12 overflow-x-auto pb-4 custom-scrollbar whitespace-nowrap">
      {sectors.map(s => (
        <button 
          key={s} 
          onClick={() => setFilter(s)}
          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
            filter === s ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          {s === 'all' ? 'Todos los Sectores' : s}
        </button>
      ))}
    </div>
  );
};

export default DirectoryFilters;
