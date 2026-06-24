import React from 'react';
import { Link } from 'react-router-dom';

const LoginFooter: React.FC = () => {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Coat_of_arms_of_Equatorial_Guinea.svg" className="h-4 object-contain opacity-50" alt="GE Coat of Arms" />
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
          República de Guinea Ecuatorial • Ministerio de Hidrocarburos, Minas y Electricidad
        </p>
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/register" className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest hover:underline">
          Registro de Entidad
        </Link>
        <span className="w-px h-3 bg-slate-200 dark:bg-slate-700"></span>
        <Link to="/" className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">
          Portal Público
        </Link>
      </div>
    </div>
  );
};

export default LoginFooter;
