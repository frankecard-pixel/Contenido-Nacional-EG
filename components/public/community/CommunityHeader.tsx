import React from 'react';

const CommunityHeader: React.FC = () => {
  return (
    <header className="mb-20 text-center lg:text-left">
      <span className="text-blue-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Responsabilidad Social Corporativa</span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Impacto Social Directo</h1>
      <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
        Monitoreo en tiempo real de la inversión social obligatoria de las operadoras petroleras para el desarrollo de las comunidades locales.
      </p>
    </header>
  );
};

export default CommunityHeader;
