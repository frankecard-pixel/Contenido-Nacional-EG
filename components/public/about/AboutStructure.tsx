import React from 'react';

const AboutStructure: React.FC = () => {
  return (
    <section className="py-24 bg-slate-950 text-white rounded-[4rem] px-16 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-4xl font-black text-white mb-16 text-center tracking-tighter uppercase">Estructura Organizativa</h2>
        <div className="flex flex-col items-center space-y-16">
          <div className="bg-white text-slate-900 p-12 rounded-[3rem] shadow-2xl text-center w-full max-w-md">
            <h4 className="text-xl font-black uppercase tracking-widest mb-2">Ministerio de Hidrocarburos, Minas y Electricidad</h4>
            <p className="text-[11px] text-blue-600 font-bold uppercase tracking-[0.2em]">Dirección General de Contenido Nacional</p>
          </div>
          <div className="w-px h-16 bg-white/20"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            {[
              "Departamento de Registro y Certificación",
              "Unidad de Auditoría y Cumplimiento",
              "División de Capacitación y Desarrollo"
            ].map(dept => (
              <div key={dept} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 text-center hover:bg-white/10 transition-colors">
                <p className="text-sm font-black text-white uppercase tracking-widest leading-tight">{dept}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[120px] -mr-32 -mt-32"></div>
    </section>
  );
};

export default AboutStructure;
