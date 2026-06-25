import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { JobOffer } from '../../../types';

interface JobsListProps {
  jobs: JobOffer[];
}

const JobsList: React.FC<JobsListProps> = ({ jobs }) => {
  const { i18n } = useTranslation();
  const getTranslatedText = (obj: any) => obj[i18n.language] || obj.es;

  if (jobs.length === 0) {
    return (
      <div className="lg:col-span-12 py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">No se encontraron vacantes disponibles en este momento</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-12 space-y-6">
      {jobs.map(job => (
        <div key={job.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{getTranslatedText(job.title)}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.location}</span>
               </div>
               <p className="text-blue-600 font-black text-[11px] uppercase tracking-[0.1em] mb-8">Operadora Local / Internacional</p>
               
               <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">{tag}</span>
                  ))}
               </div>
            </div>
            
            <div className="mt-10 md:mt-0 flex shrink-0 md:ml-10">
              <Link 
                to={`/job/${job.id}`} 
                className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all text-center"
              >
                POSTULAR
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsList;
