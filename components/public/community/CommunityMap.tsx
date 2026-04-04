import React from 'react';
import InteractiveMap from '../../InteractiveMap';

interface CommunityMapProps {
  mapPoints: any[];
}

const CommunityMap: React.FC<CommunityMapProps> = ({ mapPoints }) => {
  return (
    <section className="mb-32">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Distribución Geográfica</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guinea Ecuatorial • Continental e Insular</p>
      </div>
      <InteractiveMap points={mapPoints} height="600px" />
    </section>
  );
};

export default CommunityMap;
