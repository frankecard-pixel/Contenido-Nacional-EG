import React from 'react';
import { useNavigate } from 'react-router-dom';

const OpportunityPostingForm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-10 animate-in fade-in duration-500">
      <div className="pb-8 border-b border-slate-100 dark:border-slate-700">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Crear Nueva Oportunidad de Negocio</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Complete los detalles para publicar una nueva licitación o oportunidad de negocio.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Título de la Oportunidad <span className="text-red-500">*</span></label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Categoría/Sector <span className="text-red-500">*</span></label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all">
              <option>Mantenimiento</option>
              <option>Logística</option>
              <option>Ingeniería</option>
              <option>Seguridad</option>
              <option>Suministros</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Descripción Detallada <span className="text-red-500">*</span></label>
          <textarea rows={6} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all resize-none" />
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={() => navigate(-1)} className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
          <button onClick={() => navigate(-1)} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all">Publicar Oportunidad</button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityPostingForm;
