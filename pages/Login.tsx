
import React from 'react';
import LoginForm from '../components/public/login/LoginForm';
import LoginHeader from '../components/public/login/LoginHeader';
import LoginFooter from '../components/public/login/LoginFooter';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 overflow-hidden">
      {/* Left Side: Institutional Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30" 
            alt="Infrastructure" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-xl text-white">
          <div className="mb-12 flex flex-col items-center text-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Coat_of_arms_of_Equatorial_Guinea.svg" className="h-16 object-contain mb-8 shadow-2xl rounded-sm" alt="GE Coat of Arms" />
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              Contenido Nacional <br />
              <span className="text-blue-400">Guinea Ecuatorial</span>
            </h1>
            <div className="w-24 h-2 bg-blue-500 rounded-full mb-8"></div>
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                <span className="material-symbols-outlined text-blue-400">verified_user</span>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight">Acceso Seguro</h3>
                <p className="text-slate-300 text-sm font-medium leading-relaxed">Portal oficial protegido por protocolos de seguridad del Estado para la gestión de datos sensibles.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                <span className="material-symbols-outlined text-blue-400">business</span>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight">Gestión Empresarial</h3>
                <p className="text-slate-300 text-sm font-medium leading-relaxed">Centralización de licitaciones, contratos y certificaciones para empresas nacionales e internacionales.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-12 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Ministerio de Hidrocarburos, Minas y Electricidad</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
            <LoginHeader />
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </div>
        
        <LoginFooter />
      </div>
    </div>
  );
};

export default Login;
