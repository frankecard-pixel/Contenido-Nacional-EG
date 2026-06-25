import React, { useState, useEffect } from 'react';
import { getWebTestimonials } from '../../../services/supabaseApi';

const HomeSuccessStories: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getWebTestimonials();
        setTestimonials(data.filter((t: any) => t.status === 'published'));
      } catch (e) {
        console.error('Error fetching public testimonials:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-[#161d2d]">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <h2 className="mb-20 text-center text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Casos de Éxito de Contenido Nacional</h2>
        
        {testimonials.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2">
            {testimonials.map((testi, i) => {
              const name = testi.name;
              const company = testi.company;
              const role = testi.role?.es || testi.role || '';
              const quote = testi.quote?.es || testi.quote || '';
              const avatar = testi.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150`;

              return (
                <div key={testi.id || i} className="flex flex-col gap-6 rounded-[3.5rem] bg-slate-50 dark:bg-[#101622] p-12 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-1 text-yellow-400">
                    {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined fill-current text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                  </div>
                  <p className="text-lg italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{quote}"
                  </p>
                  <div className="mt-auto flex items-center gap-5 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
                    <img 
                      src={avatar} 
                      className="h-14 w-14 rounded-full object-cover border-2 border-primary/20 shadow-lg" 
                      alt={name} 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{name}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{role} - {company}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs">
            Pronto se publicarán nuevos testimonios locales.
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeSuccessStories;
