import React from 'react';

const JobsFilters: React.FC = () => {
  return (
    <aside className="lg:col-span-3">
      <div className="bg-slate-50/80 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-32">
        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-slate-400">FILTROS AVANZADOS</h3>
        <div className="space-y-5">
          {[
            { id: 'ops', label: 'Operaciones' },
            { id: 'admin', label: 'Administración' },
            { id: 'eng', label: 'Ingeniería' },
            { id: 'hse', label: 'HSE' }
          ].map(f => (
            <label key={f.id} className="flex items-center space-x-4 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer appearance-none w-6 h-6 rounded-lg border-2 border-slate-200 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{f.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default JobsFilters;
