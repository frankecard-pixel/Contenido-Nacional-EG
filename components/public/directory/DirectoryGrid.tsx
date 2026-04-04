import React from 'react';
import { Company } from '../../../types';

interface DirectoryGridProps {
  filtered: Company[];
  onViewProfile: (companyId: string) => void;
}

const DirectoryGrid: React.FC<DirectoryGridProps> = ({ filtered, onViewProfile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filtered.map(company => (
        <div key={company.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-black text-blue-700 border border-slate-100">
              {company.name?.charAt(0) || '?'}
            </div>
            <div className="text-right">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                company.certificationLevel === 'elite' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {company.certificationLevel}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{company.name}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">NIF: {company.taxId}</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {company.sector.map(s => (
              <span key={s} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-bold uppercase">{s}</span>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map(star => (
                <span key={star} className={`text-xs ${star <= Math.round(company.rating) ? 'text-orange-400' : 'text-slate-200'}`}>★</span>
              ))}
              <span className="text-[10px] font-black text-slate-400 ml-2">{company.rating}</span>
            </div>
            <button onClick={() => onViewProfile(company.id)} className="text-[10px] font-black text-blue-700 uppercase tracking-widest hover:underline">Ver Perfil</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DirectoryGrid;
