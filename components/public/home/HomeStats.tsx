import React from 'react';

const HomeStats: React.FC = () => {
  return (
    <section className="relative z-30 -mt-16 px-4 md:px-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-[2.5rem] bg-white dark:bg-[#1a2233] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
          {[
            { label: "Empresas", val: "1,240+", desc: "Locales Registradas", icon: "domain" },
            { label: "Oportunidades", val: "45", desc: "Licitaciones Activas", icon: "work" },
            { label: "Contratos", val: "342", desc: "Adjudicados este año", icon: "contract" },
            { label: "Valor Local", val: "$45.2M", desc: "Retención Económica", icon: "payments" }
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col gap-2 ${i < 3 ? 'lg:border-r border-slate-100 dark:border-slate-700' : ''} lg:px-6`}>
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.val}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
