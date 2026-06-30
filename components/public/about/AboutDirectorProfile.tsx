import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutDirectorProfile: React.FC = () => {
  const { t } = useTranslation();
  const directorPhoto = localStorage.getItem('director_photo_url') || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop";

  return (
    <section className="mb-12 md:mb-32 py-10 md:py-16 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[4rem] px-4 sm:px-6 md:px-12 lg:px-24 border border-slate-100 dark:border-slate-800 shadow-sm">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-9 order-2 lg:order-1">
             <span className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4 block">Dirección Ejecutiva</span>
             <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white uppercase">Mensaje del Director de Contenido Nacional</h2>
             <div className="space-y-6 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium italic">
                <p>
                   "Nuestra misión es clara: transformar el potencial de nuestros recursos naturales en un motor de desarrollo tangible para cada ciudadano de Guinea Ecuatorial. No se trata solo de extraer petróleo, sino de sembrar conocimiento, tecnología y oportunidades para nuestras empresas locales."
                </p>
                <p>
                   A través de esta plataforma digital, estamos eliminando las barreras de entrada y asegurando que la transparencia sea el pilar fundamental de nuestra gestión. Invitamos a todas las empresas y profesionales nacionales a ser parte activa de esta transformación industrial.
                </p>
             </div>
             <div className="mt-8">
                <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">Director General de Contenido Nacional</p>
                <p className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Ministerio de Hidrocarburos, Minas y Electricidad</p>
             </div>
          </div>
          <div className="lg:col-span-3 order-1 lg:order-2 w-full max-w-sm mx-auto lg:max-w-none">
             <div className="aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-slate-50 dark:border-slate-800">
                <img 
                  src={directorPhoto} 
                  className="w-full h-full object-cover" 
                  alt="Director de Contenido Nacional"
                />
             </div>
          </div>
       </div>
    </section>
  );
};

export default AboutDirectorProfile;
