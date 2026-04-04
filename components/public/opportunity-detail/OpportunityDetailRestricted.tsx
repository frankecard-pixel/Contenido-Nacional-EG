import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const OpportunityDetailRestricted: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-16 px-10 bg-slate-950 rounded-[2.5rem] text-center text-white relative overflow-hidden shadow-2xl">
      <div className="relative z-10">
        <div className="text-5xl mb-8 transform hover:rotate-12 transition-transform cursor-default">🔒</div>
        <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase">{t('common.restricted')}</h3>
        <p className="text-slate-400 mb-10 max-w-sm mx-auto text-base leading-relaxed font-medium">
          {t('common.loginToSeeMore')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/login" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-500 transition-all">
            {t('common.login')}
          </Link>
          <Link to="/register" className="w-full sm:w-auto bg-white/5 border border-white/20 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
            {t('common.register')}
          </Link>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32"></div>
    </div>
  );
};

export default OpportunityDetailRestricted;
