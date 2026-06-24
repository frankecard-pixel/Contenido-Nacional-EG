import React from 'react';

const AboutMinistryCommitment: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-blue-600 text-white rounded-[2rem] md:rounded-[4rem] px-4 sm:px-8 md:px-16 relative overflow-hidden shadow-2xl shadow-blue-900/20">
      <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8 border border-white/20 backdrop-blur-md">
          Compromiso del Ministerio
        </span>
        <h2 className="text-3xl md:text-6xl font-black text-white mb-6 md:mb-10 tracking-tighter uppercase leading-tight">
          Nuestra <span className="text-blue-200 italic">Misión</span> es el Futuro de Guinea Ecuatorial
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left mt-8 md:mt-16">
          <div className="space-y-6">
            <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Transparencia y Control</h3>
            <p className="text-blue-50 font-medium leading-relaxed opacity-90">
              Garantizamos un marco regulatorio robusto que supervisa cada contrato y operación en el sector de hidrocarburos y minería, asegurando el cumplimiento estricto de las cuotas de contenido nacional.
            </p>
          </div>
          <div className="space-y-6">
            <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl">
              <span className="material-symbols-outlined text-3xl">trending_up</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Crecimiento Sostenible</h3>
            <p className="text-blue-50 font-medium leading-relaxed opacity-90">
              Impulsamos la industrialización del país mediante el fortalecimiento de las empresas locales y la capacitación técnica de alto nivel para nuestros ciudadanos, creando un ecosistema económico resiliente.
            </p>
          </div>
        </div>
        <div className="mt-20 pt-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left">
            <p className="text-3xl font-black tracking-tighter">Ministerio de Hidrocarburos, Minas y Electricidad</p>
            <p className="text-blue-200 font-bold uppercase tracking-widest text-xs mt-1">República de Guinea Ecuatorial</p>
          </div>
          <div className="flex items-center gap-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Equatorial_Guinea.svg" className="w-12 h-8 object-contain rounded shadow-lg" alt="GE Flag" />
          </div>
        </div>
      </div>
      
      {/* Decorative patterns */}
      <div className="absolute -bottom-24 -right-24 size-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -top-24 -left-24 size-96 bg-blue-400/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default AboutMinistryCommitment;
