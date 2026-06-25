import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResourcesFilters from '../components/public/resources/ResourcesFilters';
import ResourcesLegal from '../components/public/resources/ResourcesLegal';
import ResourcesVideos from '../components/public/resources/ResourcesVideos';
import ResourcesAgenda from '../components/public/resources/ResourcesAgenda';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import { getWebFAQs } from '../services/supabaseApi';

const Resources: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [faqs, setFaqs] = useState<any[]>([]);
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  const filters = ['Todo', 'Marco Legal y Guías', 'Video Academy', 'Agenda', 'Preguntas Frecuentes (FAQ)'];

  useEffect(() => {
    if (activeFilter === 'Todo' || activeFilter === 'Preguntas Frecuentes (FAQ)') {
      const fetchFaqs = async () => {
        try {
          setLoadingFaqs(true);
          const data = await getWebFAQs();
          setFaqs(data.filter((f: any) => f.status === 'published'));
        } catch (e) {
          console.error('Error fetching FAQs:', e);
        } finally {
          setLoadingFaqs(false);
        }
      };
      fetchFaqs();
    }
  }, [activeFilter]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId(prev => prev === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq => {
    const question = faq.question?.es || faq.question || '';
    const answer = faq.answer?.es || faq.answer || '';
    return (question + ' ' + answer).toLowerCase().includes(faqSearch.toLowerCase());
  });

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark pb-24 animate-in fade-in duration-700">
      <PublicBanner 
        title="Centro de Recursos y Ayuda" 
        subtitle="Acceda a la base documental, marco legal, material multimedia y preguntas frecuentes sobre el Contenido Nacional."
        category="Biblioteca de Recursos"
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
      />
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 lg:px-10 relative z-50 -mt-16 mb-12">
        <MinisterialCertification />
      </div>
      <div className="max-w-[var(--layout-max-width)] mx-auto flex flex-col gap-10 mt-20 px-6 lg:px-10">
        <ResourcesFilters 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          filters={filters} 
        />

        {(activeFilter === 'Todo' || activeFilter === 'Marco Legal y Guías') && (
          <ResourcesLegal />
        )}

        {(activeFilter === 'Todo' || activeFilter === 'Video Academy') && (
          <ResourcesVideos />
        )}

        {(activeFilter === 'Todo' || activeFilter === 'Agenda') && (
          <ResourcesAgenda />
        )}

        {activeFilter === 'Preguntas Frecuentes (FAQ)' && (
          <section className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#0d121b] dark:text-white flex items-center gap-3 uppercase tracking-tighter">
                  <span className="material-symbols-outlined text-primary text-3xl">help_outline</span>
                  Preguntas Frecuentes (FAQ)
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Respuestas inmediatas sobre los trámites del Contenido Nacional.</p>
              </div>

              {/* FAQ Search */}
              <div className="relative w-full max-w-sm">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </span>
                <input 
                  type="text" 
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Buscar en preguntas frecuentes..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white shadow-sm focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {loadingFaqs ? (
              <div className="flex justify-center py-12">
                <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredFaqs.length > 0 ? (
              <div className="flex flex-col gap-4 max-w-4xl">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id} 
                      className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <button 
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 focus:outline-none"
                      >
                        <span className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight leading-tight uppercase">
                          {faq.question?.es || faq.question}
                        </span>
                        <div className={`size-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                          <span className="material-symbols-outlined">expand_more</span>
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="px-8 pb-8 pt-2 border-t border-slate-50 dark:border-slate-900/60 text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                          {faq.answer?.es || faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron preguntas frecuentes que coincidan con su búsqueda.</p>
              </div>
            )}
          </section>
        )}

        {/* Bottom CTA / Footer Placeholder */}
        <section className="mt-10 py-16 border-t border-slate-100 dark:border-slate-800 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            © 2024 Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial
          </p>
        </section>
      </div>
    </div>
  );
};

export default Resources;
