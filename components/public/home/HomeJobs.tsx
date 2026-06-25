import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getJobOffers } from '../../../services/supabaseApi';
import RequireAuthModal from '../RequireAuthModal';

const HomeJobs: React.FC = () => {
  const { i18n } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobOffers();
        setJobs(data as any);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-slate-50 dark:bg-[#101622]/50">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ofertas de Trabajo</h2>
          <p className="mt-4 text-slate-500 font-medium">Últimas vacantes disponibles.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobs.slice(0, 10).map((job) => (
              <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a2233] p-10 hover:border-primary hover:shadow-2xl transition-all group">
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary">
                    <span className="material-symbols-outlined text-3xl">work</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight group-hover:text-primary transition-colors">
                      {getTranslatedText(job.title)}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{job.company?.name} • {job.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-4 md:min-w-[200px]">
                  <button onClick={() => setShowAuthModal(true)} className="w-full md:w-auto rounded-xl bg-slate-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-16 text-center">
          <Link to="/jobs" className="inline-flex items-center gap-3 rounded-2xl px-10 py-5 font-black text-[10px] uppercase tracking-widest text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all">
            Ver todas las ofertas
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
      <RequireAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </section>
  );
};

export default HomeJobs;
