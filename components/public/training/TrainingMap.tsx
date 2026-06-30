import React from 'react';
import InteractiveMap from '../../InteractiveMap';

interface TrainingMapProps {
  mapPoints: any[];
}

const TrainingMap: React.FC<TrainingMapProps> = ({ mapPoints }) => {
  return (
    <section className="mb-24">
       <InteractiveMap points={mapPoints} zoom={7} height="500px" />
    </section>
  );
};

export default TrainingMap;
