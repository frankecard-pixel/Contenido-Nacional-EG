import React, { useState, useEffect } from 'react';
import { getWebNormativas, getWebGuides } from '../../../services/supabaseApi';

const ResourcesLegal: React.FC = () => {
  const [normatives, setNormatives] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [norms, gds] = await Promise.all([
          getWebNormativas(),
          getWebGuides()
        ]);
        setNormatives(norms.filter((n: any) => n.status === 'published'));
        setGuides(gds.filter((g: any) => g.status === 'published'));
      } catch (err) {
        console.error('Error fetching public legal documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-10 animate-in slide-in-from-bottom-4 duration-500">
      {/* 1. SECCIÓN: MARCO LEGAL */}
      {normatives.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#0d121b] dark:text-white flex items-center gap-3 uppercase tracking-tighter">
              <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
              Marco Legal y Normativas
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{normatives.length} Documentos activos</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {normatives.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-[#1a202c] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="size-14 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                    </div>
                    <span className="text-[10px] font-black bg-slate-50 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-widest">
                      {doc.category || 'Ley'}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-[#0d121b] dark:text-white mb-3 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                    {doc.title?.es || doc.title}
                  </h4>
                  <p className="text-xs text-[#4c669a] dark:text-gray-400 mb-8 font-medium leading-relaxed">
                    {doc.description?.es || doc.description}
                  </p>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-800 pt-6">
                  <a 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-blue-700 text-white py-4 rounded-xl transition-all shadow-lg shadow-blue-500/10"
                  >
                    <span className="material-symbols-outlined text-xl">download</span>
                    Descargar Documento
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SECCIÓN: GUÍAS DE USUARIO */}
      {guides.length > 0 && (
        <div className="flex flex-col gap-6 border-t border-slate-100 dark:border-slate-800 pt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#0d121b] dark:text-white flex items-center gap-3 uppercase tracking-tighter">
              <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
              Guías de Usuario y Manuales
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{guides.length} Guías disponibles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-[#1a202c] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-3xl">description</span>
                    </div>
                    <span className="text-[10px] font-black bg-slate-50 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-widest">
                      {doc.category || 'Guía'}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-[#0d121b] dark:text-white mb-3 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                    {doc.title?.es || doc.title}
                  </h4>
                  <p className="text-xs text-[#4c669a] dark:text-gray-400 mb-8 font-medium leading-relaxed">
                    {doc.description?.es || doc.description}
                  </p>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-800 pt-6">
                  <a 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white py-4 rounded-xl transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">download</span>
                    Descargar Guía
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ResourcesLegal;
