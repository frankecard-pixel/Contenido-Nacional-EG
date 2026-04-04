import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OpportunityExt } from '../../types';

interface CompanyRecommendedOppsProps {
  recommendedOpps: OpportunityExt[];
}

const CompanyRecommendedOpps: React.FC<CompanyRecommendedOppsProps> = ({ recommendedOpps }) => {
  const { i18n } = useTranslation();
  const getTranslatedText = (obj: any) => obj[i18n.language as any] || obj.es;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
          <span className="material-symbols-outlined text-primary text-2xl">recommend</span>
          Oportunidades Recomendadas
        </h2>
        <Link to="../opportunities" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Ver todas</Link>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {recommendedOpps.map(opp => (
          <div key={opp.id} className="p-8 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all group">
            <div className="flex justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest">Licitación</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ref: {opp.id.toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                  {getTranslatedText(opp.title)}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-tight">
                  {opp.petroleraId === 'u-4' ? 'Marathon Oil' : 'Operadora Local'} • {opp.location}
                </p>
                <div className="flex flex-wrap gap-3 mt-5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-base mr-2">calendar_month</span>
                    Cierre: {opp.deadline}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-[9px] font-black text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-base mr-2">auto_awesome</span>
                    95% Coincidencia
                  </span>
                </div>
              </div>
              <button className="shrink-0 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 text-slate-400 hover:text-primary hover:border-primary transition-all">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyRecommendedOpps;
