import React from 'react';
import { MOCK_LEGAL_DOCS } from '../../../services/mockService';

const ResourcesLegal: React.FC = () => {
  return (
    <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-[#0d121b] dark:text-white flex items-center gap-3 uppercase tracking-tighter">
          <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
          Marco Legal y Normativas
        </h3>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Ver todo el archivo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_LEGAL_DOCS.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-[#1a202c] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className={`size-14 rounded-2xl flex items-center justify-center shadow-inner ${doc.isPack ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                  <span className="material-symbols-outlined text-3xl">
                    {doc.isPack ? 'description' : 'picture_as_pdf'}
                  </span>
                </div>
                <span className="text-[10px] font-black bg-slate-50 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-widest">
                  {doc.version || doc.year}
                </span>
              </div>
              <h4 className="text-xl font-black text-[#0d121b] dark:text-white mb-3 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                {doc.title}
              </h4>
              <p className="text-sm text-[#4c669a] dark:text-gray-400 mb-8 font-medium leading-relaxed">
                {doc.description}
              </p>
            </div>
            <div className="border-t border-slate-50 dark:border-slate-800 pt-6 flex gap-3">
              {doc.isPack ? (
                <button className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-blue-700 text-white py-4 rounded-xl transition-all shadow-lg shadow-blue-500/10">
                  <span className="material-symbols-outlined text-xl">download</span> Descargar Pack (ZIP)
                </button>
              ) : (
                <>
                  <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 py-3 rounded-xl text-slate-700 dark:text-white transition-all">
                    <span className="material-symbols-outlined text-base">download</span> ES
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 py-3 rounded-xl text-slate-700 dark:text-white transition-all">
                    <span className="material-symbols-outlined text-base">download</span> EN
                  </button>
                  {doc.languages.includes('fr') ? (
                    <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 py-3 rounded-xl text-slate-700 dark:text-white transition-all">
                      <span className="material-symbols-outlined text-base">download</span> FR
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 py-3 rounded-xl text-slate-300 dark:text-slate-600 transition-all cursor-not-allowed" title="No disponible">
                      <span className="material-symbols-outlined text-base">block</span> FR
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResourcesLegal;
