
import React from 'react';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import VisionGoals from '../components/public/vision/VisionGoals';
import VisionTimeline from '../components/public/vision/VisionTimeline';

const Vision: React.FC = () => {
  return (
    <div className="pb-24 bg-white">
      <PublicBanner 
        title="Nuestra Visión 2035" 
        subtitle="Hacia una industria de hidrocarburos y minería autosuficiente, tecnificada y con pleno empleo nacional."
        category="Estrategia"
        image="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="mx-auto px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-6 mt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <VisionGoals />
        <VisionTimeline />
      </div>
    </div>
  );
};

export default Vision;
