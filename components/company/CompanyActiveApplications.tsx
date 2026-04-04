import React from 'react';
import { ApplicationExt } from '../../types';

interface CompanyActiveApplicationsProps {
  myApplications: ApplicationExt[];
}

const CompanyActiveApplications: React.FC<CompanyActiveApplicationsProps> = ({ myApplications }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Estado de Aplicaciones</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-widest">
            <tr>
              <th className="px-8 py-5">Proyecto</th>
              <th className="px-8 py-5">Empresa</th>
              <th className="px-8 py-5 text-center">Fecha Envío</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {myApplications.length > 0 ? myApplications.map(app => {
              const projectName = (app as any).opportunity?.title?.es || app.projectName || 'Proyecto';
              const companyName = (app as any).company?.name || 'Noble Energy';
              
              return (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                    {projectName}
                  </td>
                  <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase">{companyName}</td>
                  <td className="px-8 py-6 text-center text-[10px] font-bold text-slate-400">
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      app.status === 'under_review' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>
                      <span className={`size-2 rounded-full ${app.status === 'under_review' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">
                  No hay aplicaciones activas en este momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyActiveApplications;
