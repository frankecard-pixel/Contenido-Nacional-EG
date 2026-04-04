import React from 'react';

const ContactHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mb-16 max-w-4xl">
      <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] block">Atención Institucional</span>
      <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter uppercase">
        Póngase en contacto <span className="text-primary">con nosotros</span>
      </h1>
      <p className="text-slate-500 dark:text-gray-400 text-xl font-medium leading-relaxed italic">
        Para consultas sobre el registro de proveedores locales, cumplimiento de la normativa de Contenido Nacional o soporte técnico de la plataforma digital.
      </p>
    </div>
  );
};

export default ContactHeader;
