import React from 'react';
import { Company } from '../../types';

interface CompanyRegistryDetailProps {
  selectedCompany: Company;
  setSelectedCompanyId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  getStatusBadge: (status: Company['status']) => React.ReactNode;
}

const CompanyRegistryDetail: React.FC<CompanyRegistryDetailProps> = ({
  selectedCompany,
  setSelectedCompanyId,
  activeTab,
  setActiveTab,
  getStatusBadge
}) => {
  return (
    <aside className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-slate-900 shadow-2xl z-[100] flex flex-col border-l border-slate-100 dark:border-slate-800 animate-in slide-in-from-right duration-500">
      <header className="p-8 border-b border-slate-50 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="size-16 rounded-[1.25rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-3 shadow-inner">
            <span className="text-2xl font-black text-primary">{selectedCompany.name?.substring(0, 2).toUpperCase() || '??'}</span>
          </div>
          <button 
            onClick={() => setSelectedCompanyId(null)}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{selectedCompany.name}</h2>
            <span className="material-symbols-outlined text-blue-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
            ID Fiscal: {selectedCompany.taxId} • Reg: {selectedCompany.registrationDate}
          </p>
          {getStatusBadge(selectedCompany.status)}
        </div>
      </header>

      <nav className="flex px-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900">
        {['Perfil', 'Documentos', 'Historial', 'Equipo'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
         {activeTab === 'Perfil' && (
           <div className="space-y-10 animate-in fade-in duration-300">
              <section>
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Información General</h3>
                <div className="grid grid-cols-1 gap-6">
                   <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Dirección Física</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase leading-relaxed">{selectedCompany.address}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Teléfono</p>
                         <p className="text-xs font-bold text-slate-900 dark:text-white uppercase leading-relaxed">{selectedCompany.phone}</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Email</p>
                         <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{selectedCompany.email}</p>
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-4">Representante Legal</p>
                      <div className="flex items-center gap-4">
                         <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                           {selectedCompany.legalRepresentative.name?.charAt(0) || '?'}
                         </div>
                         <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{selectedCompany.legalRepresentative.name}</p>
                      </div>
                   </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Métricas de Contenido Local</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-3xl border border-slate-100 dark:border-slate-700 p-8 text-center bg-white dark:bg-slate-800 shadow-sm">
                    <p className="text-3xl font-black text-primary tracking-tighter mb-2">{selectedCompany.localSpendPercentage}%</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gasto Local</p>
                  </div>
                  <div className="rounded-3xl border border-slate-100 dark:border-slate-700 p-8 text-center bg-white dark:bg-slate-800 shadow-sm">
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{selectedCompany.nationalEmployeeCount}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Empleados Locales</p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Historial de Auditoría</h3>
                  <button className="text-[9px] font-black text-primary uppercase">Ver todo</button>
                </div>
                <div className="space-y-4">
                   {selectedCompany.auditHistory.map(audit => (
                     <div key={audit.id} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                        <div>
                           <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{audit.notes}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{audit.date} • Oficial: {audit.officer}</p>
                        </div>
                        <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                     </div>
                   ))}
                   {selectedCompany.auditHistory.length === 0 && (
                     <div className="p-10 text-center opacity-30 grayscale flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-4">history_toggle_off</span>
                        <p className="text-[9px] font-black uppercase tracking-widest">Sin registros previos</p>
                     </div>
                   )}
                </div>
              </section>
           </div>
         )}

         {activeTab !== 'Perfil' && (
           <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale animate-in fade-in duration-500">
             <span className="material-symbols-outlined text-7xl mb-6">construction</span>
             <p className="text-xs font-black uppercase tracking-[0.3em] text-center">Sección en desarrollo administrativo</p>
           </div>
         )}
      </div>

      <footer className="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 sticky bottom-0 z-10">
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">
            Suspender Registro
          </button>
          <button className="flex-[2] py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">
            Aprobar Documentación
          </button>
        </div>
      </footer>
    </aside>
  );
};

export default CompanyRegistryDetail;
