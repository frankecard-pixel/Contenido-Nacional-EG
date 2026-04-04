import React from 'react';
import { ApplicationExt } from '../../../types';

interface ApplicationsTrackingItemProps {
  app: ApplicationExt;
}

const ApplicationsTrackingItem: React.FC<ApplicationsTrackingItemProps> = ({ app }) => {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group">
      <div className="p-10 lg:p-14">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-14">
          <div className="flex gap-8">
            <div className={`hidden sm:flex h-16 w-16 rounded-[1.5rem] items-center justify-center flex-shrink-0 shadow-inner ${
              app.status === 'awarded' ? 'bg-green-50 text-green-600' : 
              app.actionRequired ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-primary'
            }`}>
              <span className="material-symbols-outlined text-3xl">
                {app.status === 'awarded' ? 'celebration' : app.actionRequired ? 'gavel' : 'engineering'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-4 flex-wrap mb-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                  {app.projectName}
                </h3>
                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  app.status === 'awarded' ? 'bg-green-100 text-green-700' :
                  app.actionRequired ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Ref: <span className="text-slate-600 dark:text-slate-300 font-bold">{app.ref}</span> • Enviado: {app.submittedAt}
              </p>
            </div>
          </div>
          <div className="flex gap-4 self-stretch md:self-center">
            <button className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl ${
              app.actionRequired 
                ? 'bg-primary text-white hover:bg-blue-700 shadow-blue-500/20' 
                : 'bg-slate-50 dark:bg-slate-700 text-primary hover:bg-blue-50'
            }`}>
              {app.actionRequired ? 'Subsanar Error' : app.status === 'awarded' ? 'Ver Contrato' : 'Ver Detalles'}
            </button>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="relative mb-20 px-8">
          <div className="absolute top-4 left-10 right-10 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
          <div 
            className={`absolute top-4 left-10 h-1.5 rounded-full transition-all duration-1000 ${
              app.actionRequired ? 'bg-red-500' : app.status === 'awarded' ? 'bg-green-500' : 'bg-primary'
            }`} 
            style={{ width: `${(app.step - 1) * 33.33}%` }}
          ></div>
          
          <div className="relative z-10 flex justify-between">
            {['Enviada', 'Revisión', 'Pre-selección', 'Resultado'].map((stepName, i) => {
              const stepNum = i + 1;
              const isActive = app.step === stepNum;
              const isPast = app.step > stepNum;
              const isError = app.actionRequired && isActive;

              return (
                <div key={stepName} className="flex flex-col items-center">
                  <div className={`size-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg transition-all ${
                    isError ? 'bg-red-500 text-white animate-pulse' :
                    isActive ? 'bg-primary text-white scale-125' :
                    isPast ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-lg">
                      {isError ? 'priority_high' : (isPast || (isActive && app.status === 'awarded')) ? 'check' : isActive ? 'hourglass_empty' : 'circle'}
                    </span>
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest mt-6 absolute w-24 text-center ${
                    isActive ? 'text-primary dark:text-blue-400' : 'text-slate-400'
                  }`}>
                    {stepName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auditor Feedback Block */}
        {app.ministerComment && (
          <div className={`mt-20 p-8 rounded-[2rem] border flex items-start gap-6 ${
            app.actionRequired 
              ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' 
              : 'bg-blue-50 dark:bg-primary/10 border-blue-100 dark:border-primary/30'
          }`}>
            <span className={`material-symbols-outlined text-2xl ${app.actionRequired ? 'text-red-500' : 'text-primary'}`}>
              {app.actionRequired ? 'warning' : 'info'}
            </span>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Comentario de Auditoría Ministerial</p>
              <p className={`text-sm font-medium italic ${app.actionRequired ? 'text-red-700 dark:text-red-300' : 'text-slate-600 dark:text-slate-300'}`}>
                "{app.ministerComment}"
              </p>
              <div className="mt-4 flex gap-6">
                <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">translate</span> Traducir Feedback
                </button>
                {app.actionRequired && (
                  <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">upload_file</span> Cargar Nuevo Documento
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ApplicationsTrackingItem;
