import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutMinisterProfile: React.FC = () => {
  const { t } = useTranslation();
  const ministerPhoto = localStorage.getItem('minister_photo_url') || "https://www.adipec.com/media/hcpphzh1/antonio.jpg";

  return (
    <section className="mb-12 md:mb-32 py-10 md:py-20 bg-slate-950 rounded-[2rem] md:rounded-[4rem] px-4 sm:px-6 md:px-12 lg:px-24 border border-white/5 text-white">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-4 w-full max-w-sm mx-auto lg:max-w-none">
             <div className="aspect-[3/4] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white/5">
                <img 
                  src={ministerPhoto} 
                  className="w-full h-full object-cover" 
                  alt="Excmo. Sr. Antonio Oburu Ondo"
                />
             </div>
          </div>
          <div className="lg:col-span-8">
             <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4 block">Liderazgo Institucional</span>
             <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter">{t('common.minister_name')}</h2>
             <p className="text-blue-400 font-black text-sm uppercase tracking-widest mb-10">{t('common.minister_role')}</p>
             <div className="space-y-6 text-slate-300 text-base md:text-lg leading-relaxed opacity-90 font-medium italic">
                <p>
                   Bajo la dirección del Excmo. Sr. Ministro Antonio Oburu Ondo, el Ministerio de Hidrocarburos, Minas y Electricidad ha priorizado la implementación efectiva del Reglamento de Contenido Nacional, asegurando que las operadoras petroleras cumplan con los más altos estándares de participación local.
                </p>
                <p>
                   Su visión estratégica se centra en la diversificación económica y el fortalecimiento de las capacidades técnicas de los ciudadanos de la República de Guinea Ecuatorial, transformando el sector energético en un catalizador de progreso social.
                </p>
             </div>
          </div>
       </div>
    </section>
  );
};

export default AboutMinisterProfile;
