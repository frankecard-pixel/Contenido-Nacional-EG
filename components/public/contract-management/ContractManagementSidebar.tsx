import React from 'react';
import { Contract } from '../../../types';

interface ContractManagementSidebarProps {
  contracts: Contract[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const ContractManagementSidebar: React.FC<ContractManagementSidebarProps> = ({ 
  contracts, 
  selectedId, 
  onSelect, 
  searchQuery, 
  onSearch 
}) => {
  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden max-h-[800px]">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Lista de Contratos</h3>
          <div className="relative group">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar contrato..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white shadow-inner"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {contracts.map((cnt) => (
            <div 
              key={cnt.id} 
              onClick={() => onSelect(cnt.id)}
              className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative group ${
                selectedId === cnt.id 
                  ? 'bg-blue-50/50 dark:bg-primary/5 border-primary shadow-inner' 
                  : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="absolute top-6 right-6">
                <span className={`flex size-2 rounded-full ring-4 ring-opacity-20 ${
                  cnt.status === 'execution' ? 'bg-emerald-500 ring-emerald-500' : 'bg-amber-500 ring-amber-500'
                }`}></span>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedId === cnt.id ? 'text-primary' : 'text-slate-400'}`}>
                {cnt.ref}
              </p>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 pr-8 leading-tight">
                {cnt.title}
              </h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">{cnt.awardedTo}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Valor Adjudicado</p>
                  <p className={`text-lg font-black tracking-tighter ${selectedId === cnt.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                    ${cnt.value.toLocaleString()}
                  </p>
                </div>
                {selectedId === cnt.id && <span className="material-symbols-outlined text-primary">arrow_forward</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractManagementSidebar;
