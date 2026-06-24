import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const backgroundImages = [
  "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop", // Offshore platform
  "https://images.unsplash.com/photo-1580828369019-1813202851f1?q=80&w=1920&auto=format&fit=crop", // Tanker / Infrastructure
  "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop"  // Gold mine / Mining operations
];

const LandingHero: React.FC = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Preload images to avoid grey flashes
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-slate-900 min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-slate-900">
        {backgroundImages.map((img, index) => (
          <div 
            key={img}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={img} 
              alt="Industry Background" 
              className="w-full h-full object-cover opacity-40 mix-blend-multiply scale-105"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-20 pointer-events-none"></div>
      </div>
      
      <div className="mx-auto px-6 relative z-30 w-full pt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/30 backdrop-blur-sm">
            Ministerio de Hidrocarburos, Minas y Electricidad
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            {t('common.welcome')}
          </h1>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl">
            {t('common.tagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/opportunities" className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center">
              {t('common.opportunities')}
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Stat Tags */}
      <div className="absolute bottom-10 right-10 hidden xl:flex flex-col space-y-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-2xl">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{t('common.stats.companies')}</p>
              <p className="text-3xl font-black text-white">1,240+</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-2xl ml-[-40px]">
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">{t('common.stats.contracts')}</p>
              <p className="text-3xl font-black text-white">342</p>
          </div>
      </div>
    </div>
  );
};

export default LandingHero;
