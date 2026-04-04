import React from 'react';

const AboutHeader: React.FC = () => {
  return (
    <header className="mb-20 text-center">
      <span className="text-blue-700 font-bold text-[10px] uppercase tracking-widest mb-4 block">Institución</span>
      <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-none">Sobre el Contenido Nacional</h1>
      <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
        Nuestra institución nace bajo el amparo de la Ley de Hidrocarburos de 2006 con el objetivo de asegurar que la explotación de nuestros recursos naturales revierta en beneficios tangibles para la economía y la sociedad ecuatoguineana.
      </p>
    </header>
  );
};

export default AboutHeader;
