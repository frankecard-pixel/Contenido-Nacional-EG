
import React from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_JOBS } from '../services/mockService';
import JobDetailHeader from '../components/public/jobs/JobDetailHeader';
import JobDetailContent from '../components/public/jobs/JobDetailContent';
import JobDetailLoginPrompt from '../components/public/jobs/JobDetailLoginPrompt';

const JobDetail: React.FC = () => {
  const { id } = useParams();
  
  const isLoggedIn = !!localStorage.getItem('user_session');
  const job = MOCK_JOBS.find(j => j.id === id);

  if (!job) return <div className="p-20 text-center font-black">Oferta no encontrada.</div>;

  return (
    <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-32 animate-in fade-in duration-700">
      <JobDetailHeader job={job} />
      
      <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
        {isLoggedIn ? (
          <JobDetailContent job={job} />
        ) : (
          <JobDetailLoginPrompt />
        )}
      </div>
    </div>
  );
};

export default JobDetail;
