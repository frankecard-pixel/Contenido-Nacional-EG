import React from 'react';
import { useTranslation } from 'react-i18next';
import { JobOffer } from '../../../types';
import { CheckCircle2, Loader2, Building2, MapPin, DollarSign } from 'lucide-react';

interface JobDetailContentProps {
  job: JobOffer;
  hasApplied?: boolean;
  onApply?: () => void;
  applying?: boolean;
}

const JobDetailContent: React.FC<JobDetailContentProps> = ({ job, hasApplied, onApply, applying }) => {
  const { i18n } = useTranslation();

  const descriptionText = typeof job.description === 'string'
    ? job.description
    : (job.description?.[i18n.language as any] || job.description?.es || job.description?.en || 'Sin descripción detallada.');

  const companyName = (job as any).company?.name || 'Empresa Operadora';

  return (
    <section className="space-y-10">
      {/* Quick metadata grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <Building2 className="size-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Empresa</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">{companyName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Ubicación</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">{job.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
            <DollarSign className="size-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Remuneración</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">{job.salary || 'A convenir'}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black mb-4 uppercase tracking-tight text-slate-900 dark:text-white">Descripción del Puesto</h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
          {descriptionText}
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/40 p-6 sm:p-8 rounded-3xl border border-blue-100 dark:border-blue-900/50 space-y-2">
         <h4 className="font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest text-xs">Reserva de Empleo Local</h4>
         <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm leading-relaxed">
           Este puesto está reservado exclusivamente para ciudadanos de la República de Guinea Ecuatorial en estricto cumplimiento con la Ley de Contenido Nacional y el Reglamento de Hidrocarburos vigente.
         </p>
      </div>

      <div className="pt-4">
        {hasApplied ? (
          <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 py-5 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm">
            <CheckCircle2 className="size-5 text-emerald-600" />
            <span>Ya te has postulado a esta oferta (En Revisión)</span>
          </div>
        ) : (
          <button 
            onClick={onApply}
            disabled={applying}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {applying ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Enviando postulación...</span>
              </>
            ) : (
              <span>Postular y Enviar mi CV</span>
            )}
          </button>
        )}
      </div>
    </section>
  );
};

export default JobDetailContent;
