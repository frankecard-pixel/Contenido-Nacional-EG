import React from 'react';
import { Link } from 'react-router-dom';

const ContactSidebar: React.FC = () => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-8">
      
      {/* Contact Info Card */}
      <div className="bg-primary text-white rounded-[3rem] shadow-2xl overflow-hidden p-10 relative group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
        <h3 className="text-2xl font-black mb-10 relative z-10 uppercase tracking-tight">Canales Oficiales</h3>
        
        <div className="flex flex-col gap-10 relative z-10">
          <div className="flex items-start gap-5">
            <div className="bg-white/10 p-3 rounded-2xl shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">location_on</span>
            </div>
            <div>
              <p className="font-black text-[9px] text-blue-200 uppercase tracking-widest mb-1">Dirección</p>
              <p className="text-sm font-bold leading-relaxed uppercase tracking-tight">
                Edificio Ministerio de Minas e Hidrocarburos<br/>
                Malabo II, Carr del Aeropuerto<br/>
                Malabo, Guinea Ecuatorial
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="bg-white/10 p-3 rounded-2xl shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">call</span>
            </div>
            <div>
              <p className="font-black text-[9px] text-blue-200 uppercase tracking-widest mb-1">Teléfonos</p>
              <p className="text-sm font-black hover:text-blue-100 cursor-pointer transition-colors">222271741</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="bg-white/10 p-3 rounded-2xl shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">mail</span>
            </div>
            <div>
              <p className="font-black text-[9px] text-blue-200 uppercase tracking-widest mb-1">Emails</p>
              <p className="text-sm font-bold hover:text-blue-100 cursor-pointer transition-colors">contenido.nacional@mmh.ge</p>
              <p className="text-sm font-bold hover:text-blue-100 cursor-pointer transition-colors">info@mmh.ge</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="bg-white/10 p-3 rounded-2xl shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">schedule</span>
            </div>
            <div>
              <p className="font-black text-[9px] text-blue-200 uppercase tracking-widest mb-1">Horario de Atención</p>
              <p className="text-sm font-black uppercase">Lunes - Viernes</p>
              <p className="text-sm font-bold opacity-80 uppercase tracking-tight">08:00 AM - 04:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white dark:bg-[#1a2332] rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col relative min-h-[350px] group">
        <img 
          alt="Map Malabo" 
          className="w-full h-full object-cover absolute inset-0 z-0 opacity-60 dark:opacity-40 group-hover:scale-110 transition-transform duration-1000" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3hU-ve_YacF51L1cKqcwBD1MbC9SuocK-dc3GeSQoQ_ssqEBsIKiRv2JaEOMYSRPzX-zQYMH2IprHP82nMyvPuGZKR6yOrZOhnAeZbnLt9Oi2O6O-m5dSh60EETmq0BW2lzXen-Avso-HuKyPsWbdxQXF_q-fyt41M1NNoZeOaKo1POP9T2DTG44B750hn2Xm3-E35GlqE2xLpNPlyxQupl6PRYPTjDTNmHyFApFlbsRkpej0E7jT5lAuIPBr3PsrEYO5pWb9g" 
        />
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/5 hover:bg-black/0 transition-colors cursor-pointer">
          <button className="bg-white text-primary px-8 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all">
            <span className="material-symbols-outlined">map</span>
            Ver en Google Maps
          </button>
        </div>
      </div>

      {/* FAQ Mini-Card */}
      <div className="bg-blue-50 dark:bg-primary/5 rounded-[2.5rem] p-8 border border-blue-100 dark:border-primary/20">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">help</span>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2 uppercase tracking-tight">¿Preguntas Frecuentes?</h4>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              Consulte nuestra sección de preguntas frecuentes antes de enviar su consulta para obtener una respuesta inmediata sobre el proceso de certificación.
            </p>
            <Link to="/resources" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
              Ir al Centro de Ayuda <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSidebar;
