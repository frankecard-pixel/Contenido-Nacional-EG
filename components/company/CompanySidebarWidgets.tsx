import React from 'react';
import { Link } from 'react-router-dom';

const CompanySidebarWidgets: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Messages Widget */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-fit overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mensajes</h2>
          <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">1 Nuevo</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all cursor-pointer bg-blue-50/30 dark:bg-primary/5 border-l-4 border-primary">
            <div className="flex justify-between items-start mb-2">
              <span className="font-black text-[11px] text-slate-900 dark:text-white uppercase tracking-tight">Ministerio de Hidrocarburos, Minas y Electricidad</span>
              <span className="text-[10px] font-bold text-slate-400">2h</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-medium leading-relaxed uppercase tracking-tight">
              Por favor actualice su anexo técnico sobre capacidades logísticas antes del viernes.
            </p>
          </div>
          <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all cursor-pointer border-l-4 border-transparent opacity-60">
            <div className="flex justify-between items-start mb-2">
              <span className="font-black text-[11px] text-slate-700 dark:text-slate-200 uppercase tracking-tight">Soporte Técnico</span>
              <span className="text-[10px] font-bold text-slate-400">Ayer</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium uppercase tracking-tight">
              Su ticket #4592 ha sido resuelto. Confirme si puede acceder a la sección de...
            </p>
          </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-700/30 text-center">
          <Link to="../messages" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Ir a bandeja de entrada</Link>
        </div>
      </div>

      {/* Documentation Status */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 space-y-8">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Estado Documental</h2>
        <div className="space-y-6">
          {[
            { label: "Registro Mercantil", status: "ok", expiry: "Vigente" },
            { label: "Seguro Social (INSESO)", status: "ok", expiry: "Vigente" },
            { label: "Solvencia Fiscal", status: "warn", expiry: "Expira pronto" },
            { label: "Certificado ISO 9001", status: "none", expiry: "Faltante" }
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <span className={`material-symbols-outlined text-2xl ${
                  doc.status === 'ok' ? 'text-green-500' : doc.status === 'warn' ? 'text-amber-500' : 'text-slate-300'
                }`}>
                  {doc.status === 'ok' ? 'check_circle' : doc.status === 'warn' ? 'error' : 'radio_button_unchecked'}
                </span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{doc.label}</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                doc.status === 'warn' ? 'text-amber-600' : 'text-slate-400'
              }`}>{doc.expiry}</span>
            </div>
          ))}
        </div>
        <button className="w-full py-4 flex items-center justify-center gap-3 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em] border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-50 transition-all">
          <span className="material-symbols-outlined text-xl">upload_file</span>
          Gestionar Documentos
        </button>
      </div>

      {/* Support Widget */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/10 rounded-2xl text-yellow-400 shadow-inner">
              <span className="material-symbols-outlined text-2xl">help</span>
            </div>
            <h3 className="font-black text-xl tracking-tight uppercase">¿Necesita Ayuda?</h3>
          </div>
          <p className="text-sm text-slate-300 mb-8 font-medium leading-relaxed uppercase tracking-tight">
            Contacte con la mesa de ayuda del Ministerio de Hidrocarburos, Minas y Electricidad para soporte técnico o legal sobre el portal.
          </p>
          <button className="text-[10px] font-black text-white bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-4 rounded-xl w-full transition-all uppercase tracking-[0.2em]">
            Contactar Soporte
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full"></div>
      </div>
    </div>
  );
};

export default CompanySidebarWidgets;
