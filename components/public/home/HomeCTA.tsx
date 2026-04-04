import React from 'react';
import { Link } from 'react-router-dom';

const HomeCTA: React.FC = () => {
  return (
    <section className="bg-slate-900 px-4 py-32 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
          alt="Hydrocarbons Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-slate-900/80"></div>
      </div>
      <div className="mx-auto max-w-4xl relative z-10">
        <h2 className="mb-6 text-4xl font-black md:text-6xl tracking-tighter uppercase leading-none">¿Listo para impulsar su negocio?</h2>
        <p className="mb-12 text-lg text-blue-100 font-medium max-w-2xl mx-auto uppercase tracking-wide">Únase a cientos de empresas locales que ya están trabajando con los principales operadores del país en el sector de hidrocarburos y minería.</p>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link to="/register" className="w-full sm:w-auto rounded-2xl bg-blue-600 px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl hover:bg-blue-500 transition-all active:scale-95">
            Certificar Mi Empresa
          </Link>
          <Link to="/contact" className="w-full sm:w-auto rounded-2xl border-2 border-white/20 backdrop-blur-md px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all active:scale-95">
            Contactar Soporte
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
