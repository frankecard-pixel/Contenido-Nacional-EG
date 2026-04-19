
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getNewsArticles } from '../services/supabaseApi';
import { NewsArticle, User } from '../types';
import { Link } from 'react-router-dom';

interface ComunicacionDashboardOverviewProps {
  user: User;
}

const ComunicacionDashboardOverview: React.FC<ComunicacionDashboardOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await getNewsArticles();
        setNewsArticles(newsData as any);
      } catch (error) {
        console.error("Error fetching news articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const drafts = newsArticles.filter(a => a.status === 'draft');
  const published = newsArticles.filter(a => a.status === 'published');

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 animate-in fade-in duration-700">
      {/* Editorial Welcome */}
      <div className="rounded-[2rem] md:rounded-[3rem] bg-indigo-900 p-6 md:p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
            <div className="max-w-2xl w-full">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block opacity-60">Gaceta Oficial y Prensa</span>
               <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter break-words">Bienvenido, {user.name}</h1>
               <p className="text-indigo-200 font-medium mt-4 italic leading-relaxed text-sm md:text-base">Gestione la narrativa institucional y asegure la transparencia informativa del Ministerio de Hidrocarburos y Desarrollo Minero ante el país y el mundo.</p>
            </div>
            <Link to="../news" className="bg-white text-indigo-900 w-full md:w-auto px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95 shrink-0 flex items-center justify-center gap-3">
               <span className="material-symbols-outlined">edit_document</span>
               Nueva Publicación
            </Link>
         </div>
         <span className="material-symbols-outlined absolute right-[-20px] md:right-[-40px] top-[-20px] md:top-[-40px] text-[150px] md:text-[250px] opacity-10">newspaper</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Artículos Publicados", val: published.length.toString(), icon: "check_circle", color: "text-indigo-600" },
          { label: "Lectores (Este mes)", val: "42.5k", icon: "visibility", color: "text-blue-600" },
          { label: "Borradores Pendientes", val: drafts.length.toString(), icon: "history_edu", color: "text-amber-600" },
          { label: "Documentos Gaceta", val: "312", icon: "gavel", color: "text-slate-600" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className={`p-3 w-fit rounded-xl bg-slate-50 dark:bg-slate-900 ${kpi.color} mb-4 md:mb-6`}>
               <span className="material-symbols-outlined">{kpi.icon}</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
         {/* News Queue */}
         <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">Borradores Recientes</h3>
               <button className="text-primary text-[10px] font-black uppercase hover:underline">Ver toda la cola</button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
               {drafts.length > 0 ? (
                 drafts.slice(0, 5).map(draft => (
                   <div key={draft.id} className="p-6 md:p-8 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                      <div className="flex-1 w-full">
                         <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{draft.title?.es}</h4>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Última edición: {new Date(draft.publish_date).toLocaleDateString()} • Por: {draft.author || 'Redacción'}</p>
                      </div>
                      <div className="flex w-full sm:w-auto gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700 justify-end">
                         <button className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-3 sm:py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center">Editar</button>
                         <button className="flex-1 sm:flex-none bg-primary text-white px-4 py-3 sm:py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 text-center">Aprobar</button>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No hay borradores pendientes</div>
               )}
            </div>
         </div>

         {/* Distribution & Media */}
         <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-slate-100 dark:border-slate-700">
               <h3 className="text-lg font-black uppercase tracking-tight mb-6 md:mb-8">Canales de Distribución</h3>
               <div className="space-y-4 md:space-y-6">
                  {[
                    { name: 'Newsletter Ministerial', reach: '12k sub', icon: 'alternate_email', status: 'Enviado' },
                    { name: 'Gaceta Oficial GE', reach: 'Público', icon: 'history_edu', status: 'Publicado' },
                    { name: 'X (Twitter)', reach: '150k imp', icon: 'share', status: 'Programado' }
                  ].map(canal => (
                    <div key={canal.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-indigo-600">{canal.icon}</span>
                          <div>
                             <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{canal.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{canal.reach}</p>
                          </div>
                       </div>
                       <span className="text-[8px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-widest">{canal.status}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
               <h3 className="text-lg font-black uppercase tracking-tight mb-4 md:mb-6">Métrica de Impacto</h3>
               <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 sm:gap-6 mb-6 md:mb-8">
                  <div className="text-4xl md:text-5xl font-black text-blue-400 tracking-tighter">89.4%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tasa de lectura positiva</div>
               </div>
               <div className="flex gap-2">
                  {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/10 rounded-full h-20 relative overflow-hidden">
                       <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-full transition-all duration-1000" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ComunicacionDashboardOverview;
