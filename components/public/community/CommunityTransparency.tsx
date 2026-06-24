import React from 'react';

const CommunityTransparency: React.FC = () => {
  return (
    <section className="py-24 bg-slate-950 rounded-[4rem] px-12 lg:px-20 text-white relative overflow-hidden">
       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase leading-tight">Mecanismo de Inversión Social Obligatoria</h2>
             <p className="text-slate-400 text-lg mb-10 font-medium leading-relaxed">
               De acuerdo con la Ley de Hidrocarburos, cada operadora debe destinar un porcentaje de sus utilidades netas a proyectos de impacto social aprobados por el Ministerio de Hidrocarburos, Minas y Electricidad.
             </p>
             <div className="space-y-6">
                {[
                  { area: "EDUCACIÓN", percent: "35%" },
                  { area: "SALUD PÚBLICA", percent: "30%" },
                  { area: "INFRAESTRUCTURA AGUA", percent: "25%" },
                  { area: "DIVERSIFICACIÓN ECON.", percent: "10%" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4">
                     <span className="text-sm font-black uppercase tracking-widest text-slate-200">{item.area}</span>
                     <span className="text-xl font-black text-blue-400">{item.percent}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8">
             <div className="w-64 h-64 rounded-full border-[12px] border-blue-600 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(37,99,235,0.3)] bg-slate-900">
                <span className="text-4xl font-black tracking-tighter">$12.5M</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Inversión 2024</span>
             </div>
             <p className="text-center text-slate-500 font-medium italic">Datos consolidados por la Dirección de Auditoría Social.</p>
          </div>
       </div>
       <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -mr-48 -mt-48"></div>
    </section>
  );
};

export default CommunityTransparency;
