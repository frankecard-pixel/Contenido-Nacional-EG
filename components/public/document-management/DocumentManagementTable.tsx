import React from 'react';
import { CompanyDocument } from '../../../types';

interface DocumentManagementTableProps {
  filteredDocs: CompanyDocument[];
  totalDocs: number;
  getStatusBadge: (status: CompanyDocument['status']) => React.ReactNode;
}

const DocumentManagementTable: React.FC<DocumentManagementTableProps> = ({ 
  filteredDocs, 
  totalDocs, 
  getStatusBadge 
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <th className="py-6 px-10">Documento</th>
              <th className="py-6 px-10">Categoría</th>
              <th className="py-6 px-10">Última Actualización</th>
              <th className="py-6 px-10">Vencimiento</th>
              <th className="py-6 px-10">Estado</th>
              <th className="py-6 px-10 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
              <tr key={doc.id} className={`group transition-all hover:bg-slate-50 dark:hover:bg-slate-700/30 ${doc.status === 'rejected' ? 'bg-red-50/20 dark:bg-red-900/5' : ''}`}>
                <td className="py-8 px-10">
                  <div className="flex items-center gap-6">
                    <div className={`size-12 rounded-2xl flex items-center justify-center shadow-inner ${
                      doc.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">
                        {doc.status === 'rejected' ? 'warning' : 'description'}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{doc.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {doc.format} • {doc.size}
                        {doc.feedback && <span className="ml-2 text-red-500 italic"> — {doc.feedback}</span>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-8 px-10">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{doc.category}</span>
                </td>
                <td className="py-8 px-10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.uploadDate}</span>
                </td>
                <td className="py-8 px-10">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${doc.status === 'expired' ? 'text-red-600' : 'text-slate-400'}`}>
                    {doc.expiryDate || 'Indefinido'}
                  </span>
                </td>
                <td className="py-8 px-10">
                  {getStatusBadge(doc.status)}
                </td>
                <td className="py-8 px-10 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {doc.status === 'rejected' ? (
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-red-200 dark:border-red-900/30 text-red-600 font-black text-[9px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all shadow-sm">
                        <span className="material-symbols-outlined text-base">upload</span> Re-subir
                      </button>
                    ) : doc.status === 'expired' ? (
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                        <span className="material-symbols-outlined text-base">autorenew</span> Renovar
                      </button>
                    ) : (
                      <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" title="Descargar">
                          <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" title="Ver Detalle">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <div className="flex flex-col items-center opacity-30 grayscale">
                     <span className="material-symbols-outlined text-7xl mb-4">folder_off</span>
                     <p className="text-xs font-black uppercase tracking-[0.3em]">No se encontraron documentos</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-10 py-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-700/20">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Mostrando <span className="text-slate-900 dark:text-white">{filteredDocs.length}</span> de {totalDocs} documentos
        </p>
        <div className="flex gap-3">
           <button disabled className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 transition-all">Anterior</button>
           <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">Siguiente</button>
        </div>
      </div>
    </section>
  );
};

export default DocumentManagementTable;
