import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeHero: React.FC = () => {
  const backgroundImages = [
    "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop", // Platform 1
    "https://images.unsplash.com/photo-1544333346-645472894670?q=80&w=2070&auto=format&fit=crop", // Clear Offshore Oil Rig
    "https://images.unsplash.com/photo-1567789391039-05677397c559?q=80&w=2070&auto=format&fit=crop"  // Refinery
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const heroTexts = [
    { line1: "Impulsando el", line2: "Contenido Nacional", line3: "" },
    { line1: "Soberanía y", line2: "Desarrollo Industrial", line3: "" },
    { line1: "Talento Local", line2: "Minería y Petróleo", line3: "Nuestra Riqueza" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % heroTexts.length);
        setBgIndex((prev) => (prev + 1) % backgroundImages.length);
        setFade(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-20 pointer-events-none"></div>
      
      {/* Background Images Carousel */}
      {backgroundImages.map((img, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${bgIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img 
            src={img} 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}

      <div className="relative flex min-h-[700px] w-full flex-col items-center justify-center px-4 py-20 text-center z-30">
        <div className="relative z-20 flex max-w-5xl flex-col items-center gap-8 md:gap-10">
          
          <div className="inline-flex items-center rounded-full bg-blue-500/20 px-4 py-2 text-xs md:text-sm font-black text-blue-100 backdrop-blur-md border border-blue-400/30 uppercase tracking-[0.2em]">
            <span className="mr-3 h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            Plataforma Oficial del Ministerio de Hidrocarburos, Minas y Electricidad
          </div>

          <p className="max-w-2xl text-lg text-slate-200 md:text-xl font-medium leading-relaxed mt-2 -mb-4">
            Conectamos empresas locales con oportunidades globales. La plataforma centralizada para la gestión, cumplimiento y crecimiento del sector de hidrocarburos y minería.
          </p>

          <div className="w-full h-[240px] md:h-[380px] flex flex-col justify-center items-center">
            <div className={`transition-all duration-700 text-center transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <h1 className="text-4xl font-black leading-tight tracking-tighter text-white md:text-7xl lg:text-8xl uppercase">
                <span className="block">{heroTexts[textIndex].line1}</span>
                <span className="block text-blue-500">{heroTexts[textIndex].line2}</span>
                <span className="block text-blue-400 text-2xl md:text-4xl mt-4 min-h-[1.2em]">
                  {heroTexts[textIndex].line3 || '\u00A0'}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <Link to="/register" className="flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-blue-700 shadow-xl shadow-blue-600/20">
              Certificar Mi Empresa
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
            <Link to="/opportunities" className="flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-2xl bg-white/10 px-8 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/20 border border-white/30">
              Ver Oportunidades
              <span className="material-symbols-outlined text-[20px]">search</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
