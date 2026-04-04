import React from 'react';
import { Link } from 'react-router-dom';

interface OpportunityDetailContentProps {
  opp: any;
  getTranslatedText: (obj: any) => string;
}

const OpportunityDetailContent: React.FC<OpportunityDetailContentProps> = ({ opp, getTranslatedText }) => {
  return (
    <section className="space-y-12">
      <div>
        <h3 className="text-xl font-black mb-6 tracking-tight uppercase">Descripción Técnica del Proyecto</h3>
        <p className="text-slate-600 leading-relaxed text-base font-medium">
          {getTranslatedText(opp.description)}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black mb-8 tracking-tight uppercase">Requisitos de Contenido Nacional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opp.requirements.map((req: string, i: number) => (
            <div key={i} className="flex items-center space-x-5 text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:bg-blue-50 hover:border-blue-100 transition-all">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black shrink-0 text-xs">
                ✓
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{req}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 flex flex-col sm:flex-row gap-4">
        <Link 
          to={`/apply/${opp.id}`} 
          className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-blue-500 transition-all active:scale-95 text-center flex items-center justify-center"
        >
          Aplicar a esta Licitación
        </Link>
        <button className="px-10 py-4 border-2 border-slate-100 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 hover:bg-slate-50 transition-all active:scale-95">
          Descargar Pliegos
        </button>
      </div>
    </section>
  );
};

export default OpportunityDetailContent;
