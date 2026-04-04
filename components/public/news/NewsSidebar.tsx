import React from 'react';

const NewsSidebar: React.FC = () => {
  return (
    <div className="lg:col-span-4 space-y-8">
      <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl">
        <h4 className="text-xl font-black mb-6">Suscripción Institucional</h4>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">Reciba las resoluciones ministeriales y anuncios de licitaciones directamente en su correo.</p>
        <form className="space-y-4">
          <input type="email" placeholder="Su email oficial" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
          <button className="w-full bg-blue-700 hover:bg-blue-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all">Suscribirse</button>
        </form>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black mb-8 text-slate-900">Documentos Recientes</h4>
        <div className="space-y-6">
          {[
            "Decreto 015/2024",
            "Resolución Catering v2",
            "Guía de Auditoría 2024"
          ].map((doc, i) => (
            <div key={i} className="flex items-center space-x-4 group cursor-pointer">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg">📄</div>
              <div>
                <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{doc}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">PDF • 2.4 MB</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSidebar;
