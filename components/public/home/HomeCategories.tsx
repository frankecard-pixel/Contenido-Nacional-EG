import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWebCategories } from '../../../services/supabaseApi';

const HomeCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getWebCategories();
        // Filtrar las que estén publicadas, o si no tienen status, asumirlas como publicadas
        setCategories(data.filter((c: any) => !c.status || c.status === 'published'));
      } catch (e) {
        console.error('Error fetching public categories:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const safeParse = (val: any) => {
    if (!val) return {};
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch {
      return { es: val, en: val, fr: val };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="mx-auto max-w-[var(--layout-max-width)] text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-16">Sectores Prioritarios</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat, i) => {
            const nameObj = safeParse(cat.name);
            const name = nameObj.es || nameObj.en || nameObj.fr || '';
            return (
              <Link key={cat.id || i} to="/directory" className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a2233] p-8 text-center transition-all hover:border-primary hover:shadow-xl group min-h-[160px]">
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">{cat.icon || 'folder'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 group-hover:text-primary leading-tight">{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
