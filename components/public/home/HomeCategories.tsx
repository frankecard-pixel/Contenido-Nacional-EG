import React from 'react';
import { Link } from 'react-router-dom';

const HomeCategories: React.FC = () => {
  const categories = [
    { title: 'Ingeniería', icon: 'engineering' },
    { title: 'Logística', icon: 'local_shipping' },
    { title: 'Catering', icon: 'restaurant' },
    { title: 'HSE', icon: 'health_and_safety' },
    { title: 'Construcción', icon: 'construction' },
    { title: 'Mantenimiento', icon: 'handyman' },
  ];

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="mx-auto max-w-[var(--layout-max-width)] text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-16">Sectores Prioritarios</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <Link key={i} to="/directory" className="flex flex-col items-center gap-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a2233] p-8 text-center transition-all hover:border-primary hover:shadow-xl group">
              <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">{cat.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 group-hover:text-primary">{cat.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
