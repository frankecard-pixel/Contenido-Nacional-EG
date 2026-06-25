
import React, { useState, useEffect } from 'react';
import { getJobOffers } from '../services/supabaseApi';
import JobsFilters from '../components/public/jobs/JobsFilters';
import JobsList from '../components/public/jobs/JobsList';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import { JobOffer } from '../types';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobOffers();
        setJobs(data as any[]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
          {loading ? (
            <div className="lg:col-span-12 py-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <JobsList jobs={jobs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
