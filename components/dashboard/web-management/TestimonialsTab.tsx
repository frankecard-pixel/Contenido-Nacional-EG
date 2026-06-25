import React, { useState } from 'react';
import { Language } from '../../../types';
import { toast } from 'sonner';

interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  role: Record<Language, string>;
  quote: Record<Language, string>;
  avatar_url?: string;
  status: 'published' | 'draft';
}

interface TestimonialsTabProps {
  testimonials: TestimonialItem[];
  onAdd: (testimonial: Omit<TestimonialItem, 'id'>) => Promise<any>;
  onUpdate: (id: string, testimonial: Partial<TestimonialItem>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({
  testimonials,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [editingTest, setEditingTest] = useState<Partial<TestimonialItem> | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;

    const role = editingTest.role || { es: '', en: '', fr: '' };
    const quote = editingTest.quote || { es: '', en: '', fr: '' };

    if (!editingTest.name || !editingTest.company || !quote.es) {
      toast.error('El nombre, empresa y testimonio en Español son obligatorios');
      return;
    }

    try {
      if (editingTest.id) {
        await onUpdate(editingTest.id, editingTest);
        toast.success('Testimonio actualizado con éxito');
      } else {
        await onAdd({
          name: editingTest.name,
          company: editingTest.company,
          role: role as Record<Language, string>,
          quote: quote as Record<Language, string>,
          avatar_url: editingTest.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
          status: editingTest.status || 'published',
        });
        toast.success('Testimonio creado con éxito');
      }
      setEditingTest(null);
    } catch (error) {
      toast.error('Error al guardar el testimonio');
    }
  };

  const handleNew = () => {
    setEditingTest({
      name: '',
      company: '',
      role: { es: '', en: '', fr: '' },
      quote: { es: '', en: '', fr: '' },
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
      status: 'published',
    });
  };

  const filteredTestimonials = testimonials.filter(t => {
    const n = t.name || '';
    const c = t.company || '';
    const qEs = t.quote?.es || '';
    return (n + ' ' + c + ' ' + qEs).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {editingTest ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {editingTest.id ? 'Editar Testimonio de Éxito' : 'Nuevo Testimonio de Éxito'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure las opiniones de las empresas locales</p>
            </div>
            <button 
              type="button" 
              onClick={() => setEditingTest(null)}
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
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre del Autor</label>
                <input 
                  type="text"
                  required
                  value={editingTest.name || ''}
                  onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Teodoro Nguema Mba"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Empresa / Institución</label>
                <input 
                  type="text"
                  required
                  value={editingTest.company || ''}
                  onChange={(e) => setEditingTest({ ...editingTest, company: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Ej: EG LNG / Elite Oil Services..."
                />
              </div>

              {/* Cargo / Role */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Cargo ({activeLang.toUpperCase()})
                </label>
                <input 
                  type="text"
                  required
                  value={editingTest.role?.[activeLang] || ''}
                  onChange={(e) => setEditingTest({
                    ...editingTest,
                    role: { ...editingTest.role, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Director General / HR Coordinator..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Testimonio / Quote */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Testimonio / Cita ({activeLang.toUpperCase()})
                </label>
                <textarea 
                  rows={4}
                  required
                  value={editingTest.quote?.[activeLang] || ''}
                  onChange={(e) => setEditingTest({
                    ...editingTest,
                    quote: { ...editingTest.quote, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-medium leading-relaxed dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Escriba la opinión de éxito..."
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL del Avatar (Foto de Perfil)</label>
                <div className="flex gap-4">
                  <img src={editingTest.avatar_url} className="size-14 rounded-full object-cover border-2 border-primary/20" alt="Avatar" />
                  <input 
                    type="url"
                    value={editingTest.avatar_url || ''}
                    onChange={(e) => setEditingTest({ ...editingTest, avatar_url: e.target.value })}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-xs font-medium dark:text-white focus:ring-2 focus:ring-primary"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Publicación</label>
                <select
                  value={editingTest.status || 'published'}
                  onChange={(e) => setEditingTest({ ...editingTest, status: e.target.value as any })}
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
              onClick={() => setEditingTest(null)}
              className="px-8 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Guardar Testimonio
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
                placeholder="Buscar por nombre, empresa o cita..."
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary shadow-sm dark:text-white"
              />
            </div>
            <button 
              onClick={handleNew}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nuevo Testimonio
            </button>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <th className="py-6 px-10">Autor</th>
                    <th className="py-6 px-10">Cargo y Empresa</th>
                    <th className="py-6 px-10">Opinión / Testimonio</th>
                    <th className="py-6 px-10">Estado</th>
                    <th className="py-6 px-10 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredTestimonials.map((test) => (
                    <tr key={test.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all cursor-pointer">
                      <td className="py-6 px-10" onClick={() => setEditingTest(test)}>
                        <div className="flex items-center gap-4">
                          <img src={test.avatar_url} className="size-11 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" alt="Avatar" />
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{test.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {test.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingTest(test)}>
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight text-slate-800 dark:text-slate-200">{test.role?.es}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{test.company}</p>
                        </div>
                      </td>
                      <td className="py-6 px-10 max-w-[280px]" onClick={() => setEditingTest(test)}>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic line-clamp-2 tracking-tight">"{test.quote?.es}"</p>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingTest(test)}>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          test.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' 
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                        }`}>
                          {test.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => setEditingTest(test)}
                             className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">edit</span>
                           </button>
                           <button 
                             onClick={() => {
                               if (confirm('¿Está seguro de eliminar este testimonio?')) {
                                 onDelete(test.id);
                                 toast.success('Testimonio eliminado');
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando {filteredTestimonials.length} testimonios publicados</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
