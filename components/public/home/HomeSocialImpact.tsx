import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';

const HomeSocialImpact: React.FC = () => {
  return (
    <section className="py-20 md:py-24 px-4 md:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-[var(--layout-max-width)] relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Heart size={14} className="fill-blue-400/20" />
              <span>Desarrollo Comunitario y Transparencia</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
              Impacto Social en las Comunidades Locales
            </h2>
            
            <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
              Las inversiones del sector de hidrocarburos se transforman en obras tangibles de infraestructura social, agua potable, educación y energía limpia para mejorar la calidad de vida de las familias de Guinea Ecuatorial.
            </p>
          </div>

          <Link
            to="/community"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <span>Ver Portal de Transparencia Social</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Impact Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { metric: '+15,000', label: 'Ciudadanos Beneficiados', sub: 'Comunidades Rurales', icon: <Heart className="text-blue-400" size={20} /> },
            { metric: '$3.8M+', label: 'Inversión Social Directa', sub: 'Fondos FSO Regulados', icon: <Building2 className="text-cyan-400" size={20} /> },
            { metric: '100%', label: 'Monitoreo Transparente', sub: 'Supervisión del MMH', icon: <ShieldCheck className="text-blue-400" size={20} /> },
            { metric: '150+', label: 'Becas Técnicas', sub: 'Capacitación Joven', icon: <GraduationCap className="text-sky-400" size={20} /> }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-5 md:p-6 backdrop-blur-xs hover:border-blue-500/50 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-slate-900/80 w-fit mb-3 border border-slate-700">
                {item.icon}
              </div>
              <p className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1">{item.metric}</p>
              <p className="text-xs font-black text-slate-200 uppercase tracking-wide">{item.label}</p>
              <p className="text-[10px] font-semibold text-slate-400">{item.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeSocialImpact;
