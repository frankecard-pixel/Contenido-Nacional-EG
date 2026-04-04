import React from 'react';
import InteractiveMap from '../../InteractiveMap';

interface TrainingMapProps {
  mapPoints: any[];
}

const TrainingMap: React.FC<TrainingMapProps> = ({ mapPoints }) => {
  return (
    <section className="mb-24">
       <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Geolocalización de Centros</h2>
          <p className="text-slate-500 mt-2">Nodos de aprendizaje distribuidos en el territorio nacional.</p>
       </div>
       <InteractiveMap points={mapPoints} zoom={7} height="500px" />
    </section>
  );
};

export default TrainingMap;
