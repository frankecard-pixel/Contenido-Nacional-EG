import React, { useState } from 'react';
import { Language } from '../../../types';
import { toast } from 'sonner';

interface NormativeItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  file_url: string;
  category: string;
  status: 'published' | 'draft';
}

interface NormativesTabProps {
  normatives: NormativeItem[];
  onAdd: (normative: Omit<NormativeItem, 'id'>) => Promise<any>;
  onUpdate: (id: string, normative: Partial<NormativeItem>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const NormativesTab: React.FC<NormativesTabProps> = ({
  normatives,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [editingNorm, setEditingNorm] = useState<Partial<NormativeItem> | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNorm) return;

    const title = editingNorm.title || { es: '', en: '', fr: '' };
    const description = editingNorm.description || { es: '', en: '', fr: '' };

    if (!title.es || !editingNorm.file_url) {
      toast.error('El título en Español y el enlace del archivo son obligatorios');
      return;
    }

    try {
      if (editingNorm.id) {
        await onUpdate(editingNorm.id, editingNorm);
        toast.success('Normativa actualizada');
      } else {
        await onAdd({
          title: title as Record<Language, string>,
          description: description as Record<Language, string>,
          file_url: editingNorm.file_url,
          category: editingNorm.category || 'Leyes',
          status: editingNorm.status || 'published',
        });
        toast.success('Normativa creada con éxito');
      }
      setEditingNorm(null);
    } catch (error) {
      toast.error('Error al guardar la normativa');
    }
  };

  const handleNew = () => {
    setEditingNorm({
      title: { es: '', en: '', fr: '' },
      description: { es: '', en: '', fr: '' },
      file_url: '',
      category: 'Leyes',
      status: 'published',
    });
  };

  const filteredNormatives = normatives.filter(n => {
    const tEs = n.title?.es || '';
    const dEs = n.description?.es || '';
    return (tEs + ' ' + dEs).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {editingNorm ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {editingNorm.id ? 'Editar Normativa / Ley' : 'Nueva Normativa / Ley'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure el marco legal</p>
            </div>
            <button 
              type="button" 
              onClick={() => setEditingNorm(null)}
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
                  Título de la Normativa ({activeLang.toUpperCase()})
                </label>
                <input 
                  type="text"
                  required
                  value={editingNorm.title?.[activeLang] || ''}
                  onChange={(e) => setEditingNorm({
                    ...editingNorm,
                    title: { ...editingNorm.title, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Decreto Ley de Contenido Nacional..."
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
                  value={editingNorm.description?.[activeLang] || ''}
                  onChange={(e) => setEditingNorm({
                    ...editingNorm,
                    description: { ...editingNorm.description, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Escriba la descripción detallada aquí..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* File URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enlace al Documento (URL PDF)</label>
                <input 
                  type="text"
                  required
                  value={editingNorm.file_url || ''}
                  onChange={(e) => setEditingNorm({ ...editingNorm, file_url: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="https://vsp-supabase.co/storage/v1/object/public/documents/decreto_CN.pdf"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo de Documento</label>
                <select
                  value={editingNorm.category || 'Leyes'}
                  onChange={(e) => setEditingNorm({ ...editingNorm, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary uppercase tracking-wider"
                >
                  <option value="Leyes">Leyes y Códigos</option>
                  <option value="Decretos">Decretos Presidenciales</option>
                  <option value="Ordenanzas">Ordenanzas Ministeriales</option>
                  <option value="Resoluciones">Resoluciones de Contenido Nacional</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Publicación</label>
                <select
                  value={editingNorm.status || 'published'}
                  onChange={(e) => setEditingNorm({ ...editingNorm, status: e.target.value as any })}
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
              onClick={() => setEditingNorm(null)}
              className="px-8 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Guardar Normativa
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
              Nueva Normativa / Ley
            </button>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <th className="py-6 px-10">Documento Legal</th>
                    <th className="py-6 px-10">Descripción Resumen</th>
                    <th className="py-6 px-10">Tipo</th>
                    <th className="py-6 px-10">Estado</th>
                    <th className="py-6 px-10 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredNormatives.map((norm) => (
                    <tr key={norm.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all cursor-pointer">
                      <td className="py-6 px-10" onClick={() => setEditingNorm(norm)}>
                        <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{norm.title?.es}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {norm.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-10 max-w-[280px]" onClick={() => setEditingNorm(norm)}>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate tracking-tight">{norm.description?.es}</p>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingNorm(norm)}>
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                          {norm.category}
                        </span>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingNorm(norm)}>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          norm.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' 
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                        }`}>
                          {norm.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <a 
                             href={norm.file_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">download</span>
                           </a>
                           <button 
                             onClick={() => setEditingNorm(norm)}
                             className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">edit</span>
                           </button>
                           <button 
                             onClick={() => {
                               if (confirm('¿Está seguro de eliminar esta normativa?')) {
                                 onDelete(norm.id);
                                 toast.success('Normativa eliminada');
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando {filteredNormatives.length} normativas vigentes</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
