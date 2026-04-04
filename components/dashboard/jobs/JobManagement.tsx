import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobOffers } from '../../../services/supabaseApi';
import { JobOffer, Company } from '../../../types';

interface JobManagementProps {
  company: Company;
}

const JobManagement: React.FC<JobManagementProps> = ({ company }) => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobOffers();
        // Filter by company if possible, or just show all for now if company_id is missing in jobs
        const companyJobs = (data as any[]).filter(job => job.company_id === company.id || job.companyId === company.id);
        setJobs(companyJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [company.id]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Vacantes</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Administre y publique sus ofertas de empleo.</p>
        </div>
        <Link 
          to="/dashboard/company/jobs/new" 
          className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-lg">add</span> Publicar Vacante
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="p-6">Puesto</th>
              <th className="p-6">Estado</th>
              <th className="p-6">Candidatos</th>
              <th className="p-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-6 font-bold text-slate-900 dark:text-white">{job.title}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {job.status === 'active' ? 'Activo' : 'Cerrado'}
                  </span>
                </td>
                <td className="p-6 font-bold text-slate-900 dark:text-white">{(job as any).applicants_count || 0}</td>
                <td className="p-6">
                  <button className="text-primary font-black text-xs uppercase hover:underline">Ver</button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-400 font-medium italic">
                  No hay vacantes publicadas para esta empresa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobManagement;
