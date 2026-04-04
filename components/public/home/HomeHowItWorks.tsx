import React from 'react';

const HomeHowItWorks: React.FC = () => {
  return (
    <section className="py-32 px-4 md:px-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <div className="mb-20 text-center">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">TRANSFORMACIÓN DIGITAL</span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Cómo Funciona</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Participe en la industria de hidrocarburos de Guinea Ecuatorial siguiendo estos pasos estratégicos.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "1. Registro", icon: "edit_document", desc: "Cree el perfil de su empresa completando la información básica y subiendo la documentación legal requerida por el MMH." },
            { step: "2. Certificación", icon: "verified_user", desc: "Nuestro equipo validará su documentación. Una vez aprobada, recibirá su Certificado de Contenido Nacional digital." },
            { step: "3. Licitación", icon: "gavel", desc: "Acceda al panel de oportunidades, filtre por categoría y presente sus ofertas directamente a través de la plataforma." }
          ].map((item, i) => (
            <div key={i} className="group relative flex flex-col gap-6 rounded-[3rem] bg-white dark:bg-[#1a2233] p-10 shadow-sm transition-all hover:shadow-xl border border-slate-100 dark:border-slate-800 hover:-translate-y-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.step}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorks;
