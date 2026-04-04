import React from 'react';
import { Company } from '../../types';

interface CompanyRegistryTableProps {
  filteredCompanies: Company[];
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  getStatusBadge: (status: Company['status']) => React.ReactNode;
  totalCompanies: number;
}

const CompanyRegistryTable: React.FC<CompanyRegistryTableProps> = ({
  filteredCompanies,
  selectedCompanyId,
  setSelectedCompanyId,
  getStatusBadge,
  totalCompanies
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <th className="py-6 px-10">Empresa</th>
              <th className="py-6 px-10">ID RUGE</th>
              <th className="py-6 px-10">Categoría</th>
              <th className="py-6 px-10">Registro</th>
              <th className="py-6 px-10">Estado</th>
              <th className="py-6 px-10 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredCompanies.map((c) => (
              <tr 
                key={c.id} 
                onClick={() => setSelectedCompanyId(c.id)}
                className={`group transition-all hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer ${selectedCompanyId === c.id ? 'bg-blue-50/50 dark:bg-primary/5 border-l-4 border-primary' : ''}`}
              >
                <td className="py-8 px-10">
                  <div className="flex items-center gap-6">
                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-1.5 shadow-sm">
                       <span className="text-sm font-black text-primary">{c.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{c.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.address}</p>
                    </div>
                  </div>
                </td>
                <td className="py-8 px-10">
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{c.rugeId}</span>
                </td>
                <td className="py-8 px-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                    {c.sector[0]}
                  </span>
                </td>
                <td className="py-8 px-10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.registrationDate}</span>
                </td>
                <td className="py-8 px-10">
                  {getStatusBadge(c.status)}
                </td>
                <td className="py-8 px-10 text-right">
                   <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Ver Detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-10 py-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-700/20">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Mostrando <span className="text-slate-900 dark:text-white">{filteredCompanies.length}</span> de {totalCompanies} empresas registradas
        </p>
        <div className="flex gap-4">
           <button disabled className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 transition-all">Anterior</button>
           <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">Siguiente</button>
        </div>
      </div>
    </section>
  );
};

export default CompanyRegistryTable;
