import React from 'react';

const ResourcesHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[#0d121b] dark:text-white text-3xl lg:text-5xl font-black leading-tight tracking-tighter uppercase">
        Centro de Recursos y Capacitación
      </h1>
      <p className="text-[#4c669a] dark:text-gray-400 text-lg font-medium leading-relaxed max-w-3xl italic">
        Acceda a normativas oficiales, guías de registro paso a paso, tutoriales en video y la agenda de eventos del sector.
      </p>
    </div>
  );
};

export default ResourcesHeader;
