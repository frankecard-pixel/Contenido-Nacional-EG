import React from 'react';
import { useTranslation } from 'react-i18next';
import { OpportunityExt, Company } from '../../types';
import { 
  Building2, 
  MapPin, 
  Tag, 
  Clock, 
  DollarSign, 
  Eye, 
  Settings2, 
  SearchX,
  FileText
} from 'lucide-react';

interface OpportunityListProps {
  filteredOpps: OpportunityExt[];
  getStatusBadge: (status: string) => React.ReactNode;
  getSectorIcon: (cat: string) => string;
  companies: Company[];
  onViewDetails?: (opp: OpportunityExt) => void;
  onManageOpp?: (opp: OpportunityExt) => void;
}

const OpportunityList: React.FC<OpportunityListProps> = ({ 
  filteredOpps, 
  getStatusBadge, 
  companies,
  onViewDetails,
  onManageOpp 
}) => {
  const { i18n } = useTranslation();
  
  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || obj.en || '';
  };

  const getCompanyName = (id: string) => {
    const company = companies.find(c => c.id === id);
    return company ? company.name : 'Operadora Homologada';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Cabecera del Listado */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Listado de Licitaciones y Convocatorias
          </h2>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:block mt-0.5">
            Gestione pliegos, empresas postuladas y adjudicaciones
          </p>
        </div>
        <span className="bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-blue-300 text-[10px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider border border-blue-100 dark:border-blue-900/40">
          {filteredOpps.length} Registros
        </span>
      </div>
      
      {/* Elementos de la Lista */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filteredOpps.map(opp => (
          <div 
            key={opp.id} 
            className="p-4 sm:p-6 md:p-8 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center justify-between"
          >
            {/* Lado Izquierdo: Icono + Metadatos */}
            <div className="flex items-start gap-3 sm:gap-5 flex-1 min-w-0">
              <div className="size-11 sm:size-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-primary border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="size-5 sm:size-6" />
              </div>
              <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(opp.status)}
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    REF: {opp.ref || opp.id.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">
                  {getTranslatedText(opp.title)}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3 text-primary" /> 
                    {getCompanyName(opp.petroleraId)}
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3 text-primary" /> 
                    {opp.location || 'Guinea Ecuatorial'}
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1">
                    <Tag className="size-3 text-primary" /> 
                    {opp.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Presupuesto, Cierre y Acciones Interactivas */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-3 sm:gap-4 w-full md:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 sm:flex md:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="text-left md:text-right bg-slate-50 sm:bg-transparent dark:bg-slate-800/50 sm:dark:bg-transparent p-2 sm:p-0 rounded-xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Presupuesto Estimado</p>
                  <p className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                    {opp.budget ? `$${opp.budget.toLocaleString()}` : 'Confidencial'}
                  </p>
                </div>
                <div className="text-left md:text-right bg-slate-50 sm:bg-transparent dark:bg-slate-800/50 sm:dark:bg-transparent p-2 sm:p-0 rounded-xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Fecha de Cierre</p>
                  <p className="font-black text-xs sm:text-sm text-red-600 dark:text-red-400">
                    {opp.deadline || 'Consultar'}
                  </p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={() => onViewDetails ? onViewDetails(opp) : (onManageOpp && onManageOpp(opp))}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center shadow-xs active:scale-95"
                >
                  <Eye className="size-3.5 text-primary" />
                  <span>Ver Ficha</span>
                </button>
                <button 
                  type="button"
                  onClick={() => onManageOpp && onManageOpp(opp)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 text-center active:scale-95"
                >
                  <Settings2 className="size-3.5" />
                  <span>Gestionar</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredOpps.length === 0 && (
          <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center">
            <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <SearchX className="size-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
              No se encontraron licitaciones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-md">
              Intente ajustar los filtros de búsqueda o cambiar la categoría seleccionada para ver más oportunidades.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityList;
