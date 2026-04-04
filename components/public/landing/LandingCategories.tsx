import React from 'react';

const LandingCategories: React.FC = () => {
  return (
    <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-10"></div>
      <div className="mx-auto px-6 relative z-10" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Sectores Estratégicos</h2>
          <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Cubrimos toda la cadena de valor del sector de hidrocarburos, desde la exploración hasta la entrega final de servicios.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: 'Exploración', icon: '🌍' },
            { title: 'Ingeniería', icon: '🏗️' },
            { title: 'Logística', icon: '🚚' },
            { title: 'Mantenimiento', icon: '🔧' },
            { title: 'Seguridad', icon: '🛡️' },
            { title: 'Catering', icon: '🍲' },
            { title: 'Tecnología', icon: '💻' },
            { title: 'Consultoría', icon: '📈' },
          ].map((cat, i) => (
            <div key={i} className="group bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all hover:-translate-y-2 cursor-pointer text-center">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
              <h4 className="text-xl font-black group-hover:text-blue-400 transition-colors">{cat.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingCategories;
