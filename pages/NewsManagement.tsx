
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getNewsArticles, deleteNewsArticle, createNewsArticle, updateNewsArticle, uploadFile } from '../services/supabaseApi';
import { Language, NewsArticle } from '../types';

const NewsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'list'>('editor');
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [isSaving, setIsSaving] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle>>({
    title: { es: '', en: '', fr: '' },
    summary: { es: '', en: '', fr: '' },
    content: { es: '', en: '', fr: '' },
    category: 'Comunicados Oficiales',
    status: 'draft',
    publish_date: new Date().toISOString(),
    attachments: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getNewsArticles();
      setArticles(data as NewsArticle[]);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      try {
        await deleteNewsArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingArticle.id) {
        await updateNewsArticle(editingArticle.id, editingArticle);
        alert('Noticia actualizada con éxito');
      } else {
        await createNewsArticle(editingArticle);
        alert('Noticia creada con éxito');
      }
      fetchNews();
      setActiveTab('list');
    } catch (error) {
      console.error("Error saving news:", error);
      alert('Error al guardar la noticia');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const fileName = `${Date.now()}_${file.name}`;
        await uploadFile('news-images', fileName, base64Data, file.type);
        const imageUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/news-images/${fileName}`;
        setEditingArticle({ ...editingArticle, featuredImage: imageUrl });
        alert("Imagen subida con éxito");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error al subir la imagen");
      }
    };
    reader.readAsDataURL(file);
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
            <span className="text-primary">Gestión de Noticias</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Noticias</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Redacte, programe y publique comunicados oficiales del Ministerio de Hidrocarburos, Minas y Electricidad.</p>
        </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setEditingArticle({
                  title: { es: '', en: '', fr: '' },
                  summary: { es: '', en: '', fr: '' },
                  content: { es: '', en: '', fr: '' },
                  category: 'Comunicados Oficiales',
                  status: 'draft',
                  publish_date: new Date().toISOString(),
                  attachments: []
                });
                setActiveTab('editor');
              }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              <span className="material-symbols-outlined text-xl">edit</span>
              Nuevo
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              <span className="material-symbols-outlined text-xl">list</span>
              Listado
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
        {activeTab === 'editor' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full col-span-12">
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
                      value={editingArticle.title?.[activeLang] || ''}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        title: { ...editingArticle.title, [activeLang]: e.target.value } as Record<Language, string>
                      })}
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
                      value={editingArticle.summary?.[activeLang] || ''}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        summary: { ...editingArticle.summary, [activeLang]: e.target.value } as Record<Language, string>
                      })}
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
                      <textarea 
                        className="flex-1 p-10 outline-none text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 min-h-[300px] bg-transparent border-none focus:ring-0"
                        value={editingArticle.content?.[activeLang] || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          content: { ...editingArticle.content, [activeLang]: e.target.value } as Record<Language, string>
                        })}
                        placeholder="Escriba aquí el contenido detallado de la noticia institucional..."
                      />
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
                    <select 
                      value={editingArticle.status}
                      onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                      className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 focus:ring-0"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Publicación</label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-5 flex items-center text-slate-400"><span className="material-symbols-outlined text-lg">calendar_today</span></span>
                        <input 
                          type="datetime-local" 
                          value={editingArticle.publish_date ? editingArticle.publish_date.slice(0, 16) : ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, publish_date: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 pl-14 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                        />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</label>
                    <select 
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner appearance-none cursor-pointer"
                    >
                        <option>Comunicados Oficiales</option>
                        <option>Inversiones</option>
                        <option>Regulación</option>
                        <option>Eventos</option>
                    </select>
                  </div>

                  <div className="pt-4">
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <span className="animate-spin material-symbols-outlined">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-xl">send</span>
                        )}
                        {editingArticle.id ? 'Actualizar' : 'Publicar Ahora'}
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
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-6 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all"
                      >
                        {editingArticle.featuredImage ? (
                          <img src={editingArticle.featuredImage} className="w-full h-32 object-cover rounded-2xl" />
                        ) : (
                          <>
                            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Cargar Imagen</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">PNG, JPG hasta 5MB</p>
                            </div>
                          </>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                      </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden w-full col-span-12">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-10 py-6">Título</th>
                  <th className="px-10 py-6">Categoría</th>
                  <th className="px-10 py-6">Fecha</th>
                  <th className="px-10 py-6">Estado</th>
                  <th className="px-10 py-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {articles.map(article => (
                  <tr key={article.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="px-10 py-6 text-sm font-bold text-slate-900 dark:text-white">{article.title?.es || 'Sin título'}</td>
                    <td className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">{article.category}</td>
                    <td className="px-10 py-6 text-[10px] font-bold text-slate-400">{new Date(article.publish_date || '').toLocaleDateString()}</td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${article.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingArticle(article);
                          setActiveTab('editor');
                        }}
                        className="p-2 text-slate-400 hover:text-primary"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="p-2 text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Gaceta Digital del Ministerio de Hidrocarburos, Minas y Electricidad • Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default NewsManagement;
