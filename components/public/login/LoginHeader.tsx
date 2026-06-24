import React from 'react';

const LoginHeader: React.FC = () => {
  return (
    <div className="p-8 lg:p-12 text-center">
      <div className="flex justify-center mb-6">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Coat_of_arms_of_Equatorial_Guinea.svg" className="h-10 object-contain shadow-sm rounded-sm" alt="GE Coat of Arms" />
      </div>
      <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">Ministerio de Hidrocarburos, Minas y Electricidad</span>
      <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 uppercase">Portal de Contenido Nacional</h2>
      <div className="w-16 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-md mx-auto leading-relaxed">
        Acceda al sistema oficial de gestión de contenido nacional para empresas y profesionales del sector energético.
      </p>
    </div>
  );
};

export default LoginHeader;
