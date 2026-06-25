import React, { useState } from 'react';
import { Language } from '../../../types';
import { toast } from 'sonner';

interface GuideItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  file_url: string;
  category: string;
  status: 'published' | 'draft';
}

interface GuidesTabProps {
  guides: GuideItem[];
  onAdd: (guide: Omit<GuideItem, 'id'>) => Promise<any>;
  onUpdate: (id: string, guide: Partial<GuideItem>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const GuidesTab: React.FC<GuidesTabProps> = ({
  guides,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [editingGuide, setEditingGuide] = useState<Partial<GuideItem> | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide) return;

    const title = editingGuide.title || { es: '', en: '', fr: '' };
    const description = editingGuide.description || { es: '', en: '', fr: '' };

    if (!title.es || !editingGuide.file_url) {
      toast.error('El título en Español y el enlace del archivo son obligatorios');
      return;
    }

    try {
      if (editingGuide.id) {
        await onUpdate(editingGuide.id, editingGuide);
        toast.success('Guía de usuario actualizada');
      } else {
        await onAdd({
          title: title as Record<Language, string>,
          description: description as Record<Language, string>,
          file_url: editingGuide.file_url,
          category: editingGuide.category || 'Guías de Usuario',
          status: editingGuide.status || 'published',
        });
        toast.success('Guía de usuario creada');
      }
      setEditingGuide(null);
    } catch (error) {
      toast.error('Error al guardar la guía');
    }
  };

  const handleNew = () => {
    setEditingGuide({
      title: { es: '', en: '', fr: '' },
      description: { es: '', en: '', fr: '' },
      file_url: '',
      category: 'Guías de Usuario',
      status: 'published',
    });
  };

  const filteredGuides = guides.filter(g => {
    const tEs = g.title?.es || '';
    const dEs = g.description?.es || '';
    return (tEs + ' ' + dEs).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {editingGuide ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {editingGuide.id ? 'Editar Guía de Usuario' : 'Nueva Guía de Usuario'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure los manuales para ciudadanos y empresas</p>
            </div>
            <button 
              type="button" 
              onClick={() => setEditingGuide(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>

          {/* Language Selection */}
          <div className="flex border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-2 w-fit">
            {(['es', 'en', 'fr'] as Language[]).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                  activeLang === lang 
                    ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-base">translate</span>
                {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Título de la Guía ({activeLang.toUpperCase()})
                </label>
                <input 
                  type="text"
                  required
                  value={editingGuide.title?.[activeLang] || ''}
                  onChange={(e) => setEditingGuide({
                    ...editingGuide,
                    title: { ...editingGuide.title, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Manual de Registro RUGE para PYMEs..."
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Descripción / Resumen ({activeLang.toUpperCase()})
                </label>
                <textarea 
                  rows={4}
                  required
                  value={editingGuide.description?.[activeLang] || ''}
                  onChange={(e) => setEditingGuide({
                    ...editingGuide,
                    description: { ...editingGuide.description, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Explique qué contiene este manual o guía..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* File URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enlace de Descarga (URL PDF)</label>
                <input 
                  type="text"
                  required
                  value={editingGuide.file_url || ''}
                  onChange={(e) => setEditingGuide({ ...editingGuide, file_url: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="https://vsp-supabase.co/storage/v1/object/public/documents/manual_ruge_es.pdf"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría de Guía</label>
                <select
                  value={editingGuide.category || 'Guías de Usuario'}
                  onChange={(e) => setEditingGuide({ ...editingGuide, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary uppercase tracking-wider"
                >
                  <option value="Guías de Usuario">Guías de Usuario</option>
                  <option value="Tutoriales">Tutoriales Técnicos</option>
                  <option value="Manuales de Sistema">Manuales de Sistema</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Publicación</label>
                <select
                  value={editingGuide.status || 'published'}
                  onChange={(e) => setEditingGuide({ ...editingGuide, status: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary uppercase tracking-wider"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador / Oculto</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-slate-50 dark:border-slate-700 pt-6">
            <button 
              type="button"
              onClick={() => setEditingGuide(null)}
              className="px-8 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Guardar Guía
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <section className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full max-w-md group">
              <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o descripción..."
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary shadow-sm dark:text-white"
              />
            </div>
            <button 
              onClick={handleNew}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nueva Guía
            </button>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <th className="py-6 px-10">Manual / Guía</th>
                    <th className="py-6 px-10">Descripción Resumen</th>
                    <th className="py-6 px-10">Categoría</th>
                    <th className="py-6 px-10">Estado</th>
                    <th className="py-6 px-10 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredGuides.map((guide) => (
                    <tr key={guide.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all cursor-pointer">
                      <td className="py-6 px-10" onClick={() => setEditingGuide(guide)}>
                        <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{guide.title?.es}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {guide.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-10 max-w-[280px]" onClick={() => setEditingGuide(guide)}>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate tracking-tight">{guide.description?.es}</p>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingGuide(guide)}>
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                          {guide.category}
                        </span>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingGuide(guide)}>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          guide.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' 
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                        }`}>
                          {guide.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <a 
                             href={guide.file_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">download</span>
                           </a>
                           <button 
                             onClick={() => setEditingGuide(guide)}
                             className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">edit</span>
                           </button>
                           <button 
                             onClick={() => {
                               if (confirm('¿Está seguro de eliminar esta guía?')) {
                                 onDelete(guide.id);
                                 toast.success('Guía eliminada');
                               }
                             }}
                             className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">delete</span>
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 border-t border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-700/20 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando {filteredGuides.length} guías de usuario</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
