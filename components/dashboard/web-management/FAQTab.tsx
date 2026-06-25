import React, { useState } from 'react';
import { Language } from '../../../types';
import { toast } from 'sonner';

interface FAQItem {
  id: string;
  question: Record<Language, string>;
  answer: Record<Language, string>;
  category: string;
  status: 'published' | 'draft';
}

interface FAQTabProps {
  faqs: FAQItem[];
  onAdd: (faq: Omit<FAQItem, 'id'>) => Promise<any>;
  onUpdate: (id: string, faq: Partial<FAQItem>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const FAQTab: React.FC<FAQTabProps> = ({
  faqs,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    const question = editingFaq.question || { es: '', en: '', fr: '' };
    const answer = editingFaq.answer || { es: '', en: '', fr: '' };

    if (!question.es || !answer.es) {
      toast.error('La pregunta y respuesta en Español son obligatorias');
      return;
    }

    try {
      if (editingFaq.id) {
        await onUpdate(editingFaq.id, editingFaq);
        toast.success('Pregunta Frecuente actualizada');
      } else {
        await onAdd({
          question: question as Record<Language, string>,
          answer: answer as Record<Language, string>,
          category: editingFaq.category || 'General',
          status: editingFaq.status || 'published',
        });
        toast.success('Pregunta Frecuente creada');
      }
      setEditingFaq(null);
    } catch (error) {
      toast.error('Error al guardar la FAQ');
    }
  };

  const handleNew = () => {
    setEditingFaq({
      question: { es: '', en: '', fr: '' },
      answer: { es: '', en: '', fr: '' },
      category: 'General',
      status: 'published',
    });
  };

  const filteredFaqs = faqs.filter(f => {
    const qEs = f.question?.es || '';
    const aEs = f.answer?.es || '';
    const qText = qEs.toLowerCase() + ' ' + aEs.toLowerCase();
    return qText.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {editingFaq ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {editingFaq.id ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure los textos de la FAQ</p>
            </div>
            <button 
              type="button" 
              onClick={() => setEditingFaq(null)}
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
              {/* Question */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Pregunta ({activeLang.toUpperCase()})
                </label>
                <input 
                  type="text"
                  required
                  value={editingFaq.question?.[activeLang] || ''}
                  onChange={(e) => setEditingFaq({
                    ...editingFaq,
                    question: { ...editingFaq.question, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Ej: ¿Cuáles son los requisitos de registro?"
                />
              </div>

              {/* Answer */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Respuesta ({activeLang.toUpperCase()})
                </label>
                <textarea 
                  rows={5}
                  required
                  value={editingFaq.answer?.[activeLang] || ''}
                  onChange={(e) => setEditingFaq({
                    ...editingFaq,
                    answer: { ...editingFaq.answer, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-medium leading-relaxed dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Escriba la respuesta completa aquí..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</label>
                <select
                  value={editingFaq.category || 'General'}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary uppercase tracking-wider"
                >
                  <option value="General">General</option>
                  <option value="Empresas">Empresas / RUGE</option>
                  <option value="Certificaciones">Certificaciones</option>
                  <option value="Licitaciones">Licitaciones / Oportunidades</option>
                  <option value="Ayuda Técnica">Ayuda Técnica</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Publicación</label>
                <select
                  value={editingFaq.status || 'published'}
                  onChange={(e) => setEditingFaq({ ...editingFaq, status: e.target.value as any })}
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
              onClick={() => setEditingFaq(null)}
              className="px-8 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Guardar Pregunta
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
                placeholder="Buscar preguntas o respuestas..."
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary shadow-sm dark:text-white"
              />
            </div>
            <button 
              onClick={handleNew}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nueva FAQ
            </button>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <th className="py-6 px-10">Pregunta</th>
                    <th className="py-6 px-10">Respuesta Corta</th>
                    <th className="py-6 px-10">Categoría</th>
                    <th className="py-6 px-10">Estado</th>
                    <th className="py-6 px-10 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredFaqs.map((faq) => (
                    <tr key={faq.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all cursor-pointer">
                      <td className="py-6 px-10" onClick={() => setEditingFaq(faq)}>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{faq.question?.es}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {faq.id}</p>
                        </div>
                      </td>
                      <td className="py-6 px-10 max-w-[250px]" onClick={() => setEditingFaq(faq)}>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate tracking-tight">{faq.answer?.es}</p>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingFaq(faq)}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl">
                          {faq.category}
                        </span>
                      </td>
                      <td className="py-6 px-10" onClick={() => setEditingFaq(faq)}>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          faq.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' 
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                        }`}>
                          {faq.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => setEditingFaq(faq)}
                             className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                           >
                             <span className="material-symbols-outlined text-lg">edit</span>
                           </button>
                           <button 
                             onClick={() => {
                               if (confirm('¿Está seguro de eliminar esta FAQ?')) {
                                 onDelete(faq.id);
                                 toast.success('Pregunta Frecuente eliminada');
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando {filteredFaqs.length} preguntas frecuentes</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
