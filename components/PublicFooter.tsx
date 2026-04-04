
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PublicFooter: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  return (
    <footer className="w-full bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Newsletter / CTA Section (Pre-footer) */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-12 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-xl">
              <h2 className="text-slate-900 dark:text-white text-2xl font-black uppercase tracking-tight leading-tight">
                Suscríbase a las actualizaciones normativas
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">
                Reciba las últimas noticias, licitaciones y cambios en la Ley de Contenido Nacional directamente en su correo institucional.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="flex w-full items-stretch rounded-2xl overflow-hidden h-14 shadow-xl shadow-blue-500/5" onSubmit={(e) => e.preventDefault()}>
                <input 
                  className="flex w-full flex-1 border-none bg-white dark:bg-slate-800 px-6 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 uppercase tracking-widest" 
                  placeholder="CORREO ELECTRÓNICO OFICIAL" 
                  type="email"
                />
                <button className="flex items-center justify-center bg-primary px-8 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-colors shrink-0">
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Intro */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Coat_of_arms_of_Equatorial_Guinea.svg" className="w-12 h-8 object-contain" alt="GE Coat of Arms" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">República de Guinea Ecuatorial</span>
                <span className="text-sm font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">Min. de Hidrocarburos y Desarrollo Minero</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              Plataforma digital centralizada para la gestión estratégica del contenido nacional, promoviendo la soberanía tecnológica y el desarrollo industrial sostenible.
            </p>
            <div className="flex gap-4">
              <a href="#" className="size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-xl">share</span>
              </a>
              <a href="#" className="size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-xl">rss_feed</span>
              </a>
            </div>
          </div>

          {/* Column 2: Plataforma (Operativa) */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 dark:text-white font-black text-[10px] mb-8 uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Plataforma</h3>
            <ul className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest">
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/">Inicio</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/register">Registro de Empresas</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/opportunities">Licitaciones</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/jobs">Bolsa de Empleo</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/directory">Directorio RUGE</Link></li>
            </ul>
          </div>

          {/* Column 3: Institución (Transparencia) */}
          <div className="lg:col-span-3">
            <h3 className="text-slate-900 dark:text-white font-black text-[10px] mb-8 uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Institución</h3>
            <ul className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest">
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/about">Sobre Nosotros</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/vision">Visión 2035</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/news">Gaceta Oficial</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/training">Formación Técnica</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/community">Impacto Social</Link></li>
            </ul>
          </div>

          {/* Column 4: Recursos y Contacto */}
          <div className="lg:col-span-3">
            <h3 className="text-slate-900 dark:text-white font-black text-[10px] mb-8 uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Recursos</h3>
            <ul className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest mb-8">
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/resources">Centro de Recursos</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/sector-stats">Estadísticas del Sector</Link></li>
              <li><Link className="text-slate-500 hover:text-primary transition-colors" to="/contact">Atención Institucional</Link></li>
            </ul>
            
            <div className="flex flex-col gap-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">call</span>
                  <span className="text-[10px] font-black text-slate-900 dark:text-white tabular-nums">+240 333 000 000</span>
               </div>
               <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase leading-tight">Malabo II, Autovía Aeropuerto</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-8 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left">
            © 2024 MINISTERIO DE HIDROCARBUROS Y DESARROLLO MINERO. GOBIERNO DE LA REPÚBLICA DE GUINEA ECUATORIAL.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">
               <span>Malabo</span>
               <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full mt-1"></span>
               <span>Bata</span>
            </div>

            {/* Language Selector Simple */}
            <div className="relative">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg">language</span>
                <select 
                  value={i18n.language}
                  onChange={handleLanguageChange}
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 focus:ring-0 p-0 pr-8 cursor-pointer"
                >
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
