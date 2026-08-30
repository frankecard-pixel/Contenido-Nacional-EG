import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Award } from 'lucide-react';

const AboutDelegateMinisterProfile: React.FC = () => {
  const { t } = useTranslation();
  const delegateMinisterPhoto = 
    localStorage.getItem('minister_delegado_photo_url') || 
    "/images/domingo_mba_esono.jpg";

  return (
    <section className="mb-12 md:mb-32 py-10 md:py-20 bg-slate-900 dark:bg-slate-950 text-white rounded-[2rem] md:rounded-[4rem] px-4 sm:px-6 md:px-12 lg:px-24 border border-blue-500/20 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Photo Column */}
        <div className="lg:col-span-4 w-full max-w-sm mx-auto lg:max-w-none">
          <div className="relative group">
            <div className="aspect-[3/4] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white/10 bg-slate-800 relative">
              <img 
                src={delegateMinisterPhoto} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt="Excmo. Sr. Domingo Mba Esono - Ministro Delegado de Hidrocarburos, Minas y Electricidad"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-4 right-4 sm:right-6 bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-xl border border-blue-400/30 flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest">Contenido Nacional</span>
            </div>
          </div>
        </div>

        {/* Text & Message Column */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> Supervisión y Gestión Ejecutiva
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter text-white uppercase">
              Excmo. Sr. Domingo Mba Esono
            </h2>
            <p className="text-blue-300 font-black text-xs md:text-sm uppercase tracking-widest leading-relaxed">
              Ministro Delegado de Hidrocarburos, Minas y Electricidad, Encargado del Contenido Nacional
            </p>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mt-1">
              República de Guinea Ecuatorial
            </p>
          </div>

          <div className="relative border-l-2 border-blue-500/40 pl-6 space-y-4 text-slate-200 text-base md:text-lg leading-relaxed font-medium">
            <p className="italic">
              "El Contenido Nacional es la garantía soberana de que la riqueza de nuestros recursos del subsuelo impulsa de forma directa la capacitación de nuestros técnicos, la contratación prioritaria de mano de obra ecuatoguineana y la consolidación de empresas nacionales en toda la cadena de valor de los hidrocarburos y la minería."
            </p>
            <p className="italic text-slate-300 text-sm md:text-base">
              "Nuestra labor permanente es velar por el cumplimiento riguroso de la normativa, la equidad en los procesos de licitación y la creación de un ecosistema industrial moderno, transparente y competitivo donde el talento de Guinea Ecuatorial sea el principal protagonista de nuestro desarrollo energético."
            </p>
          </div>

          {/* Core Focus Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Fiscalización</p>
              <p className="text-xs font-bold text-slate-200">Auditoría y cumplimiento de cuotas legales</p>
            </div>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">Capacitación</p>
              <p className="text-xs font-bold text-slate-200">Transferencia tecnológica al talento local</p>
            </div>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1">Empresariado</p>
              <p className="text-xs font-bold text-slate-200">Impulso a proveedores y contratistas RUGE</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDelegateMinisterProfile;
