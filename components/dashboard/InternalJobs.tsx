import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getJobOffers, getCandidateProfile, createJobApplication } from '../../services/supabaseApi';
import { JobOffer, User } from '../../types';
import { Briefcase, Building2, MapPin, Search, CheckCircle, Loader2 } from 'lucide-react';
import AdBanner from '../AdBanner';

interface InternalJobsProps {
  user: User;
}

const InternalJobs: React.FC<InternalJobsProps> = ({ user }) => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, profileData] = await Promise.all([
          getJobOffers(),
          getCandidateProfile(user.id)
        ]);
        setJobs(jobsData as any);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      await createJobApplication({
        job_id: jobId,
        user_id: user.id,
        status: 'submitted'
      });
      setApplied([...applied, jobId]);
      alert("Aplicación enviada con éxito.");
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Error al enviar la aplicación.");
    } finally {
      setApplying(null);
    }
  };

  const filteredJobs = jobs.filter(j => 
    (j.title.es.toLowerCase().includes(searchTerm.toLowerCase()) || 
     j.title.en.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <AdBanner type="main" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Bolsa de Empleo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Oportunidades recomendadas basadas en su perfil y búsquedas recientes.
          </p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar posiciones..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-white dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-4 font-bold text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="size-16 shrink-0 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{job.title.es || job.title.en}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      <Building2 className="w-3.5 h-3.5" />
                      {(job as any).company?.name || 'Empresa Confidencial'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 font-medium line-clamp-2">{job.description.es || job.description.en}</p>
                </div>
                <div className="shrink-0 flex items-center">
                  {applied.includes(job.id) ? (
                    <span className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle className="w-4 h-4" />
                      Aplicado
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={applying === job.id}
                      className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {applying === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">No se encontraron oportunidades.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Recomendaciones</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
              Basado en su perfil, le recomendamos completar sus habilidades para recibir mejores oportunidades.
            </p>
            <div className="space-y-3">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill: string, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{skill}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                ))
              ) : (
                <div className="p-4 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold uppercase tracking-wide text-center">
                  Sin habilidades registradas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalJobs;
