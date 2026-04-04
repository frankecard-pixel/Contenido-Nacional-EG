import React from 'react';

const HomeSuccessStories: React.FC = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-[#161d2d]">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <h2 className="mb-20 text-center text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Casos de Éxito</h2>
        <div className="grid gap-10 md:grid-cols-2">
          {[
            { name: "Maria Nchama", role: "Directora, Soluciones Técnicas GE", quote: "Gracias al portal del MMH, nuestra empresa de ingeniería pudo acceder a licitaciones que antes desconocíamos. El proceso de certificación fue claro y rápido." },
            { name: "Juan Carlos Obiang", role: "CEO, Logística del Golfo", quote: "La plataforma ha simplificado enormemente nuestra gestión administrativa. Ahora podemos centrarnos en ejecutar contratos de calidad para los operadores." }
          ].map((testi, i) => (
            <div key={i} className="flex flex-col gap-6 rounded-[3.5rem] bg-slate-50 dark:bg-[#101622] p-12 border border-slate-100 dark:border-slate-800">
              <div className="flex gap-1 text-yellow-400">
                {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
              </div>
              <p className="text-xl italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                "{testi.quote}"
              </p>
              <div className="mt-auto flex items-center gap-5 pt-6">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {testi.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{testi.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeSuccessStories;
