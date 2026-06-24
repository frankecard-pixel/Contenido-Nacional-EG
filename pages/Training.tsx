
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_TRAINING_CENTERS } from '../services/mockService';
import TrainingCenters from '../components/public/training/TrainingCenters';
import TrainingMap from '../components/public/training/TrainingMap';
import TrainingPrograms from '../components/public/training/TrainingPrograms';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Training: React.FC = () => {
  const { t } = useTranslation();

  const mapPoints = MOCK_TRAINING_CENTERS.map(tc => ({
    id: tc.id,
    lat: tc.lat || 0,
    lng: tc.lng || 0,
    title: tc.name,
    type: 'training' as const
  }));

  return (
    <div className="pb-24 bg-white">
      <PublicBanner 
        title="Capacitación y Formación" 
        subtitle="Programas de desarrollo de competencias para el talento nacional en la industria extractiva."
        category="Oportunidades"
        image="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="mx-auto px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-6 mt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <TrainingCenters centers={MOCK_TRAINING_CENTERS} />
        <TrainingMap mapPoints={mapPoints} />
        <TrainingPrograms />
      </div>
    </div>
  );
};

export default Training;
