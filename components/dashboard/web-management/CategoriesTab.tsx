import React, { useState } from 'react';
import { WebCategory, Language } from '../../../types';
import { toast } from 'sonner';

interface CategoriesTabProps {
  categories: WebCategory[];
  onAdd: (category: Omit<WebCategory, 'id'>) => Promise<any>;
  onUpdate: (id: string, category: Partial<WebCategory>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [editingCategory, setEditingCategory] = useState<Partial<WebCategory> | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const name = safeParse(editingCategory.name);
    const description = safeParse(editingCategory.description);

    if (!name.es) {
      toast.error('El nombre en Español es obligatorio');
      return;
    }

    try {
      if (editingCategory.id) {
        await onUpdate(editingCategory.id, {
          ...editingCategory,
          name,
          description,
        });
        toast.success('Categoría actualizada con éxito');
      } else {
        await onAdd({
          name: name as Record<Language, string>,
          description: description as Record<Language, string>,
          icon: editingCategory.icon || 'star',
          status: editingCategory.status || 'published',
          availableLanguages: editingCategory.availableLanguages || ['es', 'en', 'fr'],
        });
        toast.success('Categoría creada con éxito');
      }
      setEditingCategory(null);
    } catch (error) {
      toast.error('Error al guardar la categoría');
    }
  };

  const handleNew = () => {
    setEditingCategory({
      name: { es: '', en: '', fr: '' },
      description: { es: '', en: '', fr: '' },
      icon: 'engineering',
      status: 'published',
      availableLanguages: ['es', 'en', 'fr'],
    });
  };

  const safeParse = (val: any) => {
    if (!val) return {};
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch {
      return { es: val, en: val, fr: val };
    }
  };

  const filteredCategories = categories.filter(cat => {
    const nameObj = safeParse(cat.name);
    const esName = nameObj?.es || '';
    return esName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {editingCategory ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {editingCategory.id ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure los datos y traducciones</p>
            </div>
            <button 
              type="button" 
              onClick={() => setEditingCategory(null)}
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
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Nombre de Categoría ({activeLang.toUpperCase()})
                </label>
                <input 
                  type="text"
                  required
                  value={safeParse(editingCategory.name)?.[activeLang] || ''}
                  onChange={(e) => {
                    const nameObj = safeParse(editingCategory.name);
                    setEditingCategory({
                    ...editingCategory,
                    name: { ...nameObj, [activeLang]: e.target.value } as Record<Language, string>
                  })}}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary uppercase tracking-tight"
                  placeholder="Ej: Ingeniería y Construcción"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Descripción ({activeLang.toUpperCase()})
                </label>
                <textarea 
                  rows={4}
                  required
                  value={safeParse(editingCategory.description)?.[activeLang] || ''}
                  onChange={(e) => {
                    const descObj = safeParse(editingCategory.description);
                    setEditingCategory({
                    ...editingCategory,
                    description: { ...descObj, [activeLang]: e.target.value } as Record<Language, string>
                  })}}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold leading-relaxed dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Escriba la descripción detallada aquí..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Icon */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Icono de Material Symbols</label>
                <div className="flex gap-4">
                  <div className="size-14 rounded-2xl bg-blue-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800 shadow-inner">
                    <span className="material-symbols-outlined text-3xl">{editingCategory.icon || 'star'}</span>
                  </div>
                  <input 
                    type="text"
                    value={editingCategory.icon || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-mono dark:text-white focus:ring-2 focus:ring-primary"
                    placeholder="Ej: engineering, domain, star, eco"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Publicación</label>
                <select
                  value={editingCategory.status || 'published'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value as any })}
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
              onClick={() => setEditingCategory(null)}
              className="px-8 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Guardar Categoría
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
                placeholder="Buscar por nombre..."
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary shadow-sm dark:text-white"
              />
            </div>
            <button 
              onClick={handleNew}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nueva Categoría
            </button>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <th className="py-6 px-10">Elemento</th>
                    <th className="py-6 px-10">Descripción Resumen</th>
                    <th className="py-6 px-10 text-center">Idiomas Activos</th>
                    <th className="py-6 px-10">Estado</th>
                    <th className="py-6 px-10 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all cursor-pointer">
                      <td className="py-6 px-10" onClick={() => setEditingCategory(cat)}>
                        <div className="flex items-center gap-6">
                          <div className="size-12 rounded-2xl bg-blue-50 dark:bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{safeParse(cat.name)?.es || ''}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cat.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-10 max-w-[300px]" onClick={() => setEditingCategory(cat)}>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate uppercase tracking-tight">{safeParse(cat.description)?.es || ''}</p>
                      </td>
                      <td className="py-6 px-10">
                        <div className="flex justify-center gap-2">
                          <span className="text-[9px] font-bold bg-blue-50 dark:bg-slate-900 text-blue-600 px-2 py-1 rounded">ES</span>
                          <span className="text-[9px] font-bold bg-emerald-50 dark:bg-slate-900 text-emerald-600 px-2 py-1 rounded">EN</span>
                          <span className="text-[9px] font-bold bg-purple-50 dark:bg-slate-900 text-purple-600 px-2 py-1 rounded">FR</span>
                        </div>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingCategory(cat)}>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          cat.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' 
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                        }`}>
                          {cat.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => setEditingCategory(cat)}
                             className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">edit</span>
                           </button>
                           <button 
                             onClick={() => {
                               if (confirm('¿Está seguro de eliminar esta categoría?')) {
                                 onDelete(cat.id);
                                 toast.success('Categoría eliminada');
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando {filteredCategories.length} categorías de servicios públicos</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
