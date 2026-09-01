
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobOfferById, getJobApplications, createJobApplication } from '../services/supabaseApi';
import JobDetailHeader from '../components/public/jobs/JobDetailHeader';
import JobDetailContent from '../components/public/jobs/JobDetailContent';
import JobDetailLoginPrompt from '../components/public/jobs/JobDetailLoginPrompt';
import { JobOffer } from '../types';
import { Loader2 } from 'lucide-react';

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
  const isLoggedIn = !!userSession;

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
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="size-10 text-primary animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando detalles de la oferta...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-32 text-center">
        <div className="bg-slate-50 dark:bg-slate-800 p-12 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 max-w-lg mx-auto space-y-4">
          <span className="material-symbols-outlined text-5xl text-slate-300">search_off</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Oferta no encontrada</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            La posición requerida no existe o ha finalizado su periodo de convocatoria.
          </p>
          <Link to="/jobs" className="inline-block mt-4 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors">
            Volver a la Bolsa de Empleo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-20 sm:py-28 animate-in fade-in duration-700">
      <JobDetailHeader job={job} />
      
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-sm border border-slate-100 dark:border-slate-700">
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
  );
};

export default JobDetail;
