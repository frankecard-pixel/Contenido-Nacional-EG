import React from 'react';
import { Contract } from '../../../types';

interface ContractManagementGeneralTabProps {
  selectedContract: Contract;
  getMilestoneStyle: (status: string) => string;
}

const ContractManagementGeneralTab: React.FC<ContractManagementGeneralTabProps> = ({ 
  selectedContract, 
  getMilestoneStyle 
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Detalles del Proyecto</h4>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Fecha de Inicio</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{selectedContract.startDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Fecha Fin</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{selectedContract.endDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Ubicación</span>
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedContract.location}</span>
            </div>
            <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso Ejecución</span>
                 <span className="text-sm font-black text-primary">{selectedContract.progress}%</span>
               </div>
               <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${selectedContract.progress}%` }}></div>
               </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Contenido Nacional (KPIs)</h4>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-8">
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mano de Obra Nacional</p>
                   <p className="text-2xl font-black text-emerald-600 tracking-tighter">{selectedContract.nationalCompliance.localStaff}%</p>
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase">Req: {selectedContract.nationalCompliance.localStaffReq}%</p>
               </div>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedContract.nationalCompliance.localStaff}%` }}></div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Servicios Locales</p>
                   <p className="text-2xl font-black text-amber-600 tracking-tighter">{selectedContract.nationalCompliance.localGoods}%</p>
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase">Req: {selectedContract.nationalCompliance.localGoodsReq}%</p>
               </div>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedContract.nationalCompliance.localGoods}%` }}></div>
               </div>
            </div>
            
            <button className="w-full py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:bg-slate-50 transition-all">
              Ver Reporte de Auditoría
            </button>
          </div>
        </section>
      </div>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próximos Hitos</h4>
          <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Gestionar Todo</button>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              <tr className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-5">Descripción del Hito</th>
                <th className="px-8 py-5">Fecha Límite</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {selectedContract.milestones.length > 0 ? selectedContract.milestones.map((ms) => (
                <tr key={ms.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{ms.description}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{ms.deadline}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getMilestoneStyle(ms.status)}`}>
                      {ms.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-primary text-[9px] font-black uppercase tracking-widest hover:underline">
                      {ms.status === 'completed' ? 'Ver' : 'Subir Doc.'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                    No hay hitos registrados para este contrato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ContractManagementGeneralTab;
