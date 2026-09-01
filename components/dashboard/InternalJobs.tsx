import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getJobOffers, getCandidateProfile, createJobApplication, getJobApplications } from '../../services/supabaseApi';
import { JobOffer, User } from '../../types';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  X, 
  FileText, 
  DollarSign, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Award
} from 'lucide-react';
import AdBanner from '../AdBanner';

interface InternalJobsProps {
  user: User;
}

const InternalJobs: React.FC<InternalJobsProps> = ({ user }) => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'offers' | 'my_apps'>('offers');
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [jobsData, profileData, appsData] = await Promise.all([
          getJobOffers(),
          getCandidateProfile(user.id),
          getJobApplications(user.id)
        ]);
        if (isMounted) {
          setJobs(jobsData as any[]);
          setProfile(profileData);
          setUserApplications(appsData as any[]);
        }
      } catch (error) {
        console.error("Error fetching jobs and applications data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [user.id]);

  const handleApply = async (jobId: string) => {
    setApplyingId(jobId);
    try {
      const newApp = await createJobApplication({
        job_id: jobId,
        user_id: user.id,
        status: 'submitted'
      });
      
      setUserApplications(prev => {
        const filtered = prev.filter(a => (a.job_id || a.jobId) !== jobId);
        return [newApp, ...filtered];
      });

      alert("¡Postulación enviada con éxito! Ahora puede consultar el estado en la pestaña 'Mis Postulaciones'.");
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Error al procesar la aplicación. Intente de nuevo.");
    } finally {
      setApplyingId(null);
    }
  };

  const getJobTitle = (job: JobOffer | any) => {
    if (!job?.title) return 'Oferta de Empleo';
    if (typeof job.title === 'string') return job.title;
    return job.title[i18n.language as any] || job.title.es || job.title.en || 'Oferta de Empleo';
  };

  const getJobDescription = (job: JobOffer | any) => {
    if (!job?.description) return 'Sin descripción disponible.';
    if (typeof job.description === 'string') return job.description;
    return job.description[i18n.language as any] || job.description.es || job.description.en || 'Sin descripción disponible.';
  };

  // Map of applied job IDs
  const appliedJobIdsMap = new Map<string, any>();
  userApplications.forEach(app => {
    const jId = app.job_id || app.jobId || app.job?.id;
    if (jId) appliedJobIdsMap.set(jId, app);
  });

  const filteredJobs = jobs.filter(j => {
    const titleStr = getJobTitle(j).toLowerCase();
    const companyStr = ((j as any).company?.name || '').toLowerCase();
    const locationStr = (j.location || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return titleStr.includes(query) || companyStr.includes(query) || locationStr.includes(query);
  });

  const getStatusBadge = (statusStr: string) => {
    const st = (statusStr || '').toLowerCase();
    if (st === 'submitted' || st === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200/60 dark:border-amber-800/60">
          <Clock className="w-3.5 h-3.5" />
          En Revisión Inicial
        </span>
      );
    }
    if (st === 'under_review' || st === 'shortlisted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
          <FileText className="w-3.5 h-3.5" />
          En Evaluación Técnica
        </span>
      );
    }
    if (st === 'accepted' || st === 'hired' || st === 'awarded') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-800/60">
          <Award className="w-3.5 h-3.5" />
          Preseleccionado / Aceptado
        </span>
      );
    }
    if (st === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-200/60 dark:border-rose-800/60">
          <AlertCircle className="w-3.5 h-3.5" />
          Proceso Finalizado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-black uppercase tracking-wider">
        Postulado
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando Bolsa de Empleo...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-full overflow-x-hidden">
      <AdBanner type="main" />

      {/* Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Bolsa de Empleo Nacional
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Explore vacantes de las operadoras del sector y dé seguimiento en tiempo real a sus postulaciones.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'offers'
                ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Ofertas ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('my_apps')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'my_apps'
                ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Mis Postulaciones</span>
            {userApplications.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px]">
                {userApplications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: AVAILABLE JOB OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar posiciones, empresas o ubicación..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 font-bold text-xs sm:text-sm shadow-xs focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => {
                  const appliedApp = appliedJobIdsMap.get(job.id);
                  const isApplyingThis = applyingId === job.id;
                  const companyName = (job as any).company?.name || 'Empresa Operadora';

                  return (
                    <div 
                      key={job.id} 
                      className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="size-12 sm:size-14 shrink-0 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 text-blue-600">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight break-words">
                              {getJobTitle(job)}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {companyName}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status / Apply Button */}
                        <div className="shrink-0 w-full sm:w-auto">
                          {appliedApp ? (
                            <div className="flex items-center gap-2">
                              {getStatusBadge(appliedApp.status)}
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => handleApply(job.id)}
                              disabled={isApplyingThis}
                              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isApplyingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                        {getJobDescription(job)}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-50 dark:border-slate-700/60">
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(job.tags) && job.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedJob(job)}
                          className="text-primary hover:text-blue-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 group"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Detalles</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">No se encontraron ofertas con ese criterio de búsqueda.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Recomendaciones del Perfil</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Basado en su perfil, le recomendamos mantener sus certificaciones validadas para incrementar sus posibilidades de selección.
                </p>
                <div className="space-y-2 pt-2">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{skill}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold uppercase tracking-wide text-center">
                      Sin habilidades registradas
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'my_apps' && (
        <div className="space-y-6">
          {userApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userApplications.map((app, idx) => {
                const associatedJob = jobs.find(j => j.id === (app.job_id || app.jobId)) || app.job;
                const jobTitle = associatedJob ? getJobTitle(associatedJob) : 'Puesto de Empleo';
                const companyName = associatedJob?.company?.name || (associatedJob as any)?.company || 'Empresa del Sector';
                const appDate = app.created_at || app.submitted_at || app.submittedAt;

                return (
                  <div 
                    key={app.id || idx}
                    className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {jobTitle}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {companyName}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                      <span>Fecha de Postulación:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {appDate ? new Date(appDate).toLocaleDateString() : 'Reciente'}
                      </span>
                    </div>

                    {associatedJob && (
                      <button
                        type="button"
                        onClick={() => setSelectedJob(associatedJob)}
                        className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Oferta Completa</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 space-y-4 max-w-lg mx-auto">
              <span className="material-symbols-outlined text-5xl text-slate-300">history_edu</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Sin postulaciones activas</h3>
              <p className="text-xs text-slate-500 font-medium">
                Aún no se ha postulado a ninguna vacante. Explore las ofertas disponibles en la pestaña 'Ofertas' para aplicar a puestos del sector.
              </p>
              <button
                onClick={() => setActiveTab('offers')}
                className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors"
              >
                Explorar Ofertas
              </button>
            </div>
          )}
        </div>
      )}

      {/* JOB DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-2xl relative space-y-6 my-8 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 size-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-10">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                Detalle de la Vacante
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {getJobTitle(selectedJob)}
              </h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>{(selectedJob as any).company?.name || 'Empresa Operadora'}</span>
                <span>•</span>
                <span>{selectedJob.location}</span>
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest">Remuneración</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">{selectedJob.salary || 'A convenir'}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest">Categoría</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">{(selectedJob as any).category || 'Hidrocarburos'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Descripción de Funciones</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {getJobDescription(selectedJob)}
              </p>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cerrar
              </button>

              {appliedJobIdsMap.has(selectedJob.id) ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ya Postulado</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const jId = selectedJob.id;
                    setSelectedJob(null);
                    handleApply(jId);
                  }}
                  className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-md transition-all"
                >
                  Postular Ahora
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalJobs;
