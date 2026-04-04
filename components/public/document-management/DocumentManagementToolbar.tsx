import React from 'react';

interface DocumentManagementToolbarProps {
  categories: string[];
  filter: string;
  setFilter: (filter: string) => void;
  statuses: string[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const DocumentManagementToolbar: React.FC<DocumentManagementToolbarProps> = ({ 
  categories, 
  filter, 
  setFilter, 
  statuses, 
  statusFilter, 
  setStatusFilter 
}) => {
  return (
    <section className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 custom-scrollbar w-full md:w-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === cat 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105' 
                : 'bg-slate-50 dark:bg-slate-700 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-64">
         <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
           <span className="material-symbols-outlined text-lg">filter_list</span>
         </span>
         <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-700 border-none rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary appearance-none cursor-pointer dark:text-white"
         >
           {statuses.map(s => <option key={s} value={s}>Estado: {s}</option>)}
         </select>
         <span className="absolute inset-y-0 right-4 flex items-center text-slate-400 pointer-events-none">
           <span className="material-symbols-outlined text-lg">expand_more</span>
         </span>
      </div>
    </section>
  );
};

export default DocumentManagementToolbar;
