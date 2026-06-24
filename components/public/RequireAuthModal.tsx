import React from 'react';
import { Link } from 'react-router-dom';

interface RequireAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const RequireAuthModal: React.FC<RequireAuthModalProps> = ({ 
  isOpen, 
  onClose,
  title = "Acceso Restringido",
  message = "Para acceder a esta información detallada, debe estar registrado y confirmado por el Ministerio de Hidrocarburos, Minas y Electricidad."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <div className="size-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center mb-4">
          {title}
        </h3>
        
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center leading-relaxed mb-8">
          {message}
        </p>
        
        <div className="flex flex-col gap-3">
          <Link 
            to="/login" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-center shadow-lg shadow-blue-600/20"
          >
            Iniciar Sesión
          </Link>
          <Link 
            to="/register" 
            className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-center"
          >
            Registrar Empresa
          </Link>
          <button 
            onClick={onClose}
            className="w-full mt-2 text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequireAuthModal;
