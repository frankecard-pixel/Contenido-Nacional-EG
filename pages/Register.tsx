
import React from 'react';
import RegisterForm from '../components/public/register/RegisterForm';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-20 relative overflow-hidden">
      <PublicBanner 
        title="Registro de Empresas" 
        subtitle="Inicie su proceso de certificación para operar en el sector de hidrocarburos y minería de Guinea Ecuatorial."
        category="Portal de Contenido Nacional"
        image="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 relative z-50 -mt-20 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Institutional Info Panel */}
        <div className="w-full lg:w-1/3 space-y-8">
          <MinisterialCertification className="flex-col md:flex-col !items-start !gap-8 !p-10 !rounded-[3rem]" />

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-black tracking-tighter leading-none text-slate-900 dark:text-white uppercase">
                Proceso de<br/>
                <span className="text-blue-600 dark:text-blue-400">Certificación</span>
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                El registro en esta plataforma es el primer paso para participar en el ecosistema de hidrocarburos y minería de Guinea Ecuatorial.
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">verified_user</span>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900 dark:text-white">Verificación Oficial</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Todos los perfiles de empresa son verificados por el Ministerio antes de otorgar acceso completo.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">payments</span>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900 dark:text-white">Nota de Pago</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Tras la validación inicial, recibirá una nota de pago para el ingreso bancario oficial.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">lock_open</span>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900 dark:text-white">Acceso al Portal</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Una vez confirmado el pago, se habilitará su acceso completo y número de expediente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="w-full lg:w-2/3">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
