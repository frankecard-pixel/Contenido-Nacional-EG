import React from 'react';

const SectorStatsHeader: React.FC = () => {
  return (
    <header className="mb-20">
      <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Transparencia Industrial</span>
      <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-6">Estadísticas y <br/><span className="text-blue-600">Cumplimiento</span></h1>
      <p className="text-slate-500 max-w-2xl text-xl font-medium leading-relaxed italic">
        Portal oficial de datos abiertos para el monitoreo del impacto económico y social de la industria de hidrocarburos en Guinea Ecuatorial.
      </p>
    </header>
  );
};

export default SectorStatsHeader;
