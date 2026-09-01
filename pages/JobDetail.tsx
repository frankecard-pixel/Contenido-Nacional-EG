
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobOfferById, getJobApplications, createJobApplication } from '../services/supabaseApi';
import JobDetailHeader from '../components/public/jobs/JobDetailHeader';
import JobDetailContent from '../components/public/jobs/JobDetailContent';
import JobDetailLoginPrompt from '../components/public/jobs/JobDetailLoginPrompt';
import { JobOffer } from '../types';
import { Loader2, ArrowLeft, FileText, LayoutDashboard } from 'lucide-react';

const JobDetail: React.FC = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const sessionStr = localStorage.getItem('user_session');
  let userSession: any = null;
  if (sessionStr) {
    try { userSession = JSON.parse(sessionStr); } catch (e) {}
  }
  const isLoggedIn = !!userSession || localStorage.getItem('user_session') === 'active';

  useEffect(() => {
    let isMounted = true;
    const fetchJobData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const foundJob = await getJobOfferById(id);
        if (isMounted) setJob(foundJob);

        if (userSession?.id && id) {
          const apps = await getJobApplications(userSession.id);
          const applied = apps.some((a: any) => (a.job_id || a.jobId) === id);
          if (isMounted) setHasApplied(applied);
        }
      } catch (error) {
        console.error("Error fetching job detail:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobData();
    return () => { isMounted = false; };
  }, [id, userSession?.id]);

  const handleApply = async () => {
    if (!job || !userSession?.id) return;
    setApplying(true);
    try {
      await createJobApplication({
        job_id: job.id,
        user_id: userSession.id,
        status: 'submitted'
      });
      setHasApplied(true);
      alert("Su postulación ha sido enviada con éxito.");
    } catch (error) {
      console.error("Error applying:", error);
      alert("Error al enviar la postulación. Intente de nuevo.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <Loader2 className="size-10 text-blue-600 animate-spin mb-2" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando Ficha de Empleo...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 py-16 sm:py-24">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
            <FileText className="size-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Oferta de Empleo No Encontrada</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            La posición requerida no está disponible en este momento o ha finalizado su periodo de convocatoria oficial.
          </p>
          <Link 
            to="/jobs" 
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="size-4" />
            <span>Volver a la Bolsa de Empleo</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Banner Informativo de Sesión Activa (para candidatos conectados) */}
        {isLoggedIn && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-950 dark:text-blue-200">
                Acceso Homologado Activo &bull; Modo Talento Nacional RUGE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-xs"
              >
                <LayoutDashboard className="size-3" />
                <span>Mi Panel RUGE</span>
              </Link>
            </div>
          </div>
        )}

        {/* Dynamic Job Header Card */}
        <JobDetailHeader job={job} />
        
        {/* Main Job Body Content Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-sm border border-slate-200/80 dark:border-slate-800">
          {isLoggedIn ? (
            <JobDetailContent 
              job={job} 
              hasApplied={hasApplied} 
              onApply={handleApply} 
              applying={applying} 
            />
          ) : (
            <JobDetailLoginPrompt />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

