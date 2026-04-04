import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { JobOffer } from '../../../types';

interface JobDetailHeaderProps {
  job: JobOffer;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job }) => {
  const { i18n } = useTranslation();
  
  return (
    <>
      <Link to="/jobs" className="text-blue-600 font-black text-xs uppercase tracking-widest mb-10 inline-flex items-center group">
        <span className="group-hover:-translate-x-1 transition-transform mr-2">←</span> Bolsa de Empleo
      </Link>
      
      <header className="mb-12 border-b border-slate-50 pb-12">
        <div className="flex items-center space-x-3 mb-6">
          {job.tags.map(tag => (
            <span key={tag} className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{tag}</span>
          ))}
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">{job.title[i18n.language as any] || job.title.es}</h1>
        <p className="text-xl text-blue-600 font-black uppercase tracking-widest">{job.location}</p>
      </header>
    </>
  );
};

export default JobDetailHeader;
