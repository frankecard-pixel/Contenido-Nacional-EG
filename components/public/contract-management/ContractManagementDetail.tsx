import React from 'react';
import { Contract } from '../../../types';

interface ContractManagementDetailProps {
  selectedContract: Contract;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  getStatusStyle: (status: string) => string;
  children: React.ReactNode;
}

const ContractManagementDetail: React.FC<ContractManagementDetailProps> = ({ 
  selectedContract, 
  activeTab, 
  setActiveTab, 
  tabs, 
  getStatusStyle,
  children
}) => {
  return (
    <div className="lg:col-span-8">
      <div className="bg-white dark:bg-slate-800 rounded-[4rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full overflow-hidden">
        {/* Detail Header */}
        <div className="p-10 lg:p-14 border-b border-slate-50 dark:border-slate-700">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
             <div>
               <div className="flex items-center gap-4 mb-4">
                 <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedContract.status)}`}>
                    {selectedContract.status === 'execution' ? 'En Ejecución' : 'Pendiente'}
                 </span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedContract.ref}</span>
               </div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-3">
                 {(selectedContract.title as any)?.es || selectedContract.title || 'Sin Título'}
               </h2>
               <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic">
                 Adjudicado a: <span className="text-slate-900 dark:text-white font-black">{selectedContract.awardedTo}</span>
               </p>
             </div>
             <div className="text-right md:min-w-[200px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor Total del Contrato</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                  ${selectedContract.value.toLocaleString()}
                </p>
             </div>
           </div>

           {/* Detail Tabs */}
           <nav className="flex gap-10">
             {tabs.map(tab => (
               <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
               >
                 {tab}
               </button>
             ))}
           </nav>
        </div>

        {/* Detail Content Area */}
        <div className="flex-1 p-10 lg:p-14 bg-slate-50/30 dark:bg-slate-900/20 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContractManagementDetail;
