import React from 'react';

interface MinisterialCertificationProps {
  className?: string;
  showText?: boolean;
}

const MinisterialCertification: React.FC<MinisterialCertificationProps> = ({ 
  className = "", 
  showText = true 
}) => {
  return (
    <div className={`bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6 ${className}`}>
      <div className="flex items-center gap-4 shrink-0">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Coat_of_arms_of_Equatorial_Guinea.svg" 
          className="h-12 w-auto object-contain drop-shadow-sm" 
          alt="Escudo de Guinea Ecuatorial" 
        />
        <div className="w-px h-12 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-0.5">
            República de Guinea Ecuatorial
          </span>
          <h2 className="text-xs md:text-sm font-black uppercase tracking-[0.1em] leading-tight text-slate-900 dark:text-white">
            Ministerio de Hidrocarburos<br className="hidden md:block" /> y Desarrollo Minero
          </h2>
        </div>
      </div>

      {showText && (
        <>
          <div className="w-full h-px md:w-px md:h-12 bg-slate-100 dark:bg-slate-800"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">verified</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Portal Oficial Certificado
              </span>
            </div>
            <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Esta plataforma es el único canal oficial autorizado para la gestión del Contenido Nacional. 
              Toda la información y procesos están avalados por la legislación vigente del sector.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MinisterialCertification;
