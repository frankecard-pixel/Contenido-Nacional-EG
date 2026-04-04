import React from 'react';

const JobsHeader: React.FC = () => {
  return (
    <header className="mb-20">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">Bolsa de Empleo</h1>
      <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">Conectando talento nacional con las mejores operadoras del sector energético.</p>
    </header>
  );
};

export default JobsHeader;
