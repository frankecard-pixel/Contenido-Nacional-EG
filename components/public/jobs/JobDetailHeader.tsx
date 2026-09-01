import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { JobOffer } from '../../../types';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Tag,
  CheckCircle2
} from 'lucide-react';

interface JobDetailHeaderProps {
  job: JobOffer;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const titleText = typeof job.title === 'string' 
    ? job.title 
    : (job.title?.[i18n.language as any] || job.title?.es || job.title?.en || 'Oferta de Empleo');
    
  const tags = Array.isArray(job.tags) ? job.tags : [];
  const companyName = (job as any).company?.name || 'Empresa Operadora Sectorial';
  const refCode = `VAC-${(job.id || '001').slice(0, 8).toUpperCase()}`;

  return (
    <div className="space-y-6 mb-8">
      {/* Top Bar Navigation & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-wider hover:bg-blue-50 dark:hover:bg-blue-950/60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <ArrowLeft className="size-4" />
            <span>Volver</span>
          </button>

          <Link 
            to="/jobs" 
            className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:text-blue-600 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-xs"
          >
            <Briefcase className="size-3.5 text-blue-600" />
            <span>Bolsa de Empleo</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
            REF: {refCode}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="size-3.5 text-blue-600" />
            Ley Contenido Nacional
          </span>
        </div>
      </div>

      {/* Main Header Banner Card */}
      <header className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xs">
              <Briefcase className="size-3" />
              Vacante Oficial
            </span>
            {tags.map(tag => (
              <span 
                key={tag} 
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-200/60 dark:border-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
            {titleText}
          </h1>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Building2 className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Empresa</span>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase truncate block">{companyName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <MapPin className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Ubicación</span>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase truncate block">{job.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                <DollarSign className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Remuneración</span>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase truncate block">{job.salary || 'A convenir'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default JobDetailHeader;

