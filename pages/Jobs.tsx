
import React from 'react';
import { MOCK_JOBS } from '../services/mockService';
import JobsFilters from '../components/public/jobs/JobsFilters';
import JobsList from '../components/public/jobs/JobsList';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Jobs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <PublicBanner 
        title="Bolsa de Empleo" 
        subtitle="Encuentre las mejores oportunidades laborales en el sector de hidrocarburos y minería de Guinea Ecuatorial."
        category="Talento Nacional"
        image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="mx-auto px-8 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-8 mt-20 animate-in fade-in duration-700" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar de Filtros - Escala Corregida */}
          <JobsFilters />

          {/* Listado de Empleos - Escala Corregida */}
          <JobsList jobs={MOCK_JOBS} />
        </div>
      </div>
    </div>
  );
};

export default Jobs;
