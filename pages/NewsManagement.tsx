
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getNewsArticles } from '../services/supabaseApi';
import { Language, NewsArticle } from '../types';

const NewsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsArticles();
        setArticles(data as any[]);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const drafts = articles.filter(a => a.status === 'draft');
  const published = articles.filter(a => a.status === 'published');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-10">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Inicio</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span>Agente de Comunicación</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Nueva Noticia</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Publicar Noticia Oficial</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Redacte, programe y publique comunicados oficiales del Ministerio de Hidrocarburos y Desarrollo Minero.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all">
            <span className="material-symbols-outlined text-xl">visibility</span>
            Previsualizar
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-xl">save</span>
            )}
            {isSaving ? 'Guardando...' : 'Guardar Borrador'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Language Tabs */}
            <div className="flex border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-10">
              {(['es', 'fr', 'en'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`flex items-center gap-3 px-8 py-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${
                    activeLang === lang 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">translate</span>
                  {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
                </button>
              ))}
            </div>

            <div className="p-10 lg:p-14 space-y-10">
              {/* Title Input */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título de la Noticia ({activeLang.toUpperCase()})</label>
                <input 
                  type="text" 
                  placeholder="Ej: Firma de acuerdo estratégico en el sector gasista..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-6 text-xl font-black text-slate-900 dark:text-white placeholder-slate-300 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner uppercase tracking-tight"
                />
              </div>

              {/* Summary Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resumen / Entradilla</label>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Máx 250 carac.</span>
                </div>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner"
                  placeholder="Breve descripción que aparecerá en el listado..."
                />
              </div>

              {/* Rich Text Editor Simulation */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contenido Principal</label>
                <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px] shadow-inner bg-white dark:bg-slate-900/30">
                  <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                    {['format_bold', 'format_italic', 'format_underlined', '|', 'format_h1', 'format_h2', '|', 'format_list_bulleted', 'format_list_numbered', '|', 'link', 'image', 'video_library'].map((btn, i) => (
                      btn === '|' ? <div key={i} className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2"></div> : (
                        <button key={i} className="p-3 rounded-xl text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-all">
                          <span className="material-symbols-outlined text-xl">{btn}</span>
                        </button>
                      )
                    ))}
                    <div className="flex-1"></div>
                    <button className="p-3 rounded-xl text-slate-300 hover:text-slate-900 dark:hover:text-white"><span className="material-symbols-outlined">fullscreen</span></button>
                  </div>
                  <div className="flex-1 p-10 outline-none text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 min-h-[300px]" contentEditable="true" suppressContentEditableWarning={true}>
                    Escriba aquí el contenido detallado de la noticia institucional...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Publication Card */}
          <section className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <span className="material-symbols-outlined text-3xl">schedule_send</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Publicación</h3>
            </div>

            <div className="space-y-8">
               <div className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado Actual:</span>
                 <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                   <span className="size-2 rounded-full bg-slate-400"></span>
                   Borrador
                 </span>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Publicación</label>
                 <div className="relative group">
                    <span className="absolute inset-y-0 left-5 flex items-center text-slate-400"><span className="material-symbols-outlined text-lg">calendar_today</span></span>
                    <input type="datetime-local" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 pl-14 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Deje en blanco para publicación inmediata.</p>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</label>
                 <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner appearance-none cursor-pointer">
                    <option>Comunicados Oficiales</option>
                    <option>Inversiones</option>
                    <option>Regulación</option>
                    <option>Eventos</option>
                 </select>
               </div>

               <div className="pt-4">
                  <button className="w-full py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-xl">send</span>
                    Publicar Ahora
                  </button>
               </div>
            </div>
          </section>

          {/* Multimedia Card */}
          <section className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <span className="material-symbols-outlined text-3xl">perm_media</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Multimedia</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagen Destacada</label>
                 <div className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-6 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all">
                    <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                    </div>
                    <div>
                       <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Cargar Imagen</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">PNG, JPG hasta 5MB</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Adjuntos Oficiales</label>
                  <button className="text-[9px] font-black text-primary uppercase">+ Añadir</button>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-4">
                     <div className="size-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">Decreto_2023_Hidrocarburos.pdf</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">2.4 MB</p>
                     </div>
                     <button className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">close</span></button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Drafts */}
          <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full"></div>
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Últimos Borradores</h3>
              <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded uppercase tracking-widest">{drafts.length} Pendientes</span>
            </div>
            <div className="space-y-6 relative z-10">
              {drafts.slice(0, 3).map(draft => (
                <div key={draft.id} className="group cursor-pointer">
                  <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-snug line-clamp-2">{draft.title?.es || draft.title}</h4>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{new Date(draft.publish_date || '').toLocaleDateString()}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${draft.status === 'draft' ? 'bg-orange-900/50 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>
                      {draft.status === 'draft' ? 'EDICIÓN' : 'PENDIENTE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:bg-white/5 transition-all">Ver toda la biblioteca</button>
          </section>
        </div>
      </div>

      {/* Info Footer */}
      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Gaceta Digital del Ministerio de Hidrocarburos y Desarrollo Minero • Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default NewsManagement;
