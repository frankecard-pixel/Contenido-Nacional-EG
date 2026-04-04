import React from 'react';
import { useTranslation } from 'react-i18next';
import { OpportunityExt, Company } from '../../types';

interface OpportunityListProps {
  filteredOpps: OpportunityExt[];
  getStatusBadge: (status: string) => React.ReactNode;
  getSectorIcon: (cat: string) => string;
  companies: Company[];
}

const OpportunityList: React.FC<OpportunityListProps> = ({ filteredOpps, getStatusBadge, getSectorIcon, companies }) => {
  const { i18n } = useTranslation();
  const getTranslatedText = (obj: any) => obj[i18n.language as any] || obj.es;

  const getCompanyName = (id: string) => {
    const company = companies.find(c => c.id === id);
    return company ? company.name : 'Operadora Local';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Listado de Oportunidades</h2>
        <span className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-slate-100 dark:border-slate-700">
          {filteredOpps.length} Resultados
        </span>
      </div>
      
      <div className="divide-y divide-slate-50 dark:divide-slate-700">
        {filteredOpps.map(opp => (
          <div key={opp.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all group flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex items-start gap-6 flex-1">
              <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-2xl">{getSectorIcon(opp.category)}</span>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(opp.status)}
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ref: {opp.ref || opp.id.toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                  {getTranslatedText(opp.title)}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">business</span> {getCompanyName(opp.petroleraId)}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">location_on</span> {opp.location}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">category</span> {opp.category}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-4 w-full md:w-auto shrink-0">
              <div className="flex gap-4">
                <div className="text-left md:text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Presupuesto</p>
                  <p className="font-black text-slate-900 dark:text-white">${opp.budget.toLocaleString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cierre</p>
                  <p className="font-black text-slate-900 dark:text-white">{opp.deadline}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center">
                  Ver Detalles
                </button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/20 text-center">
                  Gestionar
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredOpps.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 mb-4">search_off</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No se encontraron resultados</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md">Intente ajustar los filtros de búsqueda o cambiar la categoría seleccionada para ver más oportunidades.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityList;
