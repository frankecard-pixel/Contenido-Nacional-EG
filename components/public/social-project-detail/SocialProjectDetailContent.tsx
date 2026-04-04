import React from 'react';

interface SocialProjectDetailContentProps {
  description: string;
  location: string;
  impact: string;
}

const SocialProjectDetailContent: React.FC<SocialProjectDetailContentProps> = ({ description, location, impact }) => {
  return (
    <div className="p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-2 space-y-12">
        <div>
          <h3 className="text-2xl font-black mb-6">Objetivo del Proyecto</h3>
          <p className="text-slate-600 leading-relaxed text-lg">
            {description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Localización</p>
              <p className="font-black text-slate-900">{location}</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Beneficiarios</p>
              <p className="font-black text-slate-900">{impact}</p>
            </div>
        </div>
      </div>

      <div className="lg:col-span-1">
          <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-500/20 sticky top-32">
            <h4 className="font-black text-xl mb-6">Financiado por</h4>
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-black">NE</div>
                <div>
                  <p className="font-bold">Noble Energy</p>
                  <p className="text-xs text-blue-200">Operadora Petrolera</p>
                </div>
            </div>
            <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all text-xs">
                Ver Reporte de Impacto
            </button>
          </div>
      </div>
    </div>
  );
};

export default SocialProjectDetailContent;
