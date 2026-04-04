import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const JobDetailLoginPrompt: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-12 px-10 bg-slate-900 rounded-[2.5rem] text-center text-white">
      <div className="text-5xl mb-6">👷</div>
      <h3 className="text-2xl font-black mb-4">¿Desea aplicar a este puesto?</h3>
      <p className="text-slate-400 mb-8 max-w-sm mx-auto">Para proteger su privacidad y los datos de las operadoras, debe estar registrado para ver los detalles del cargo.</p>
      <div className="flex justify-center space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">{t('common.login')}</Link>
        <Link to="/register" className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20">{t('common.register')}</Link>
      </div>
    </div>
  );
};

export default JobDetailLoginPrompt;
