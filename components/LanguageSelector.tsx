
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es', name: 'ES', flag: 'https://flagcdn.com/w40/es.png' },
    { code: 'en', name: 'EN', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'fr', name: 'FR', flag: 'https://flagcdn.com/w40/fr.png' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200 rounded-xl px-4 py-3 transition-all text-slate-800 text-xs font-black uppercase tracking-widest"
      >
        <img src={currentLang.flag} className="w-5 h-3 object-cover rounded-sm" alt={currentLang.name} />
        <span>{currentLang.name}</span>
        <svg className={`w-3 h-3 transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-2xl rounded-2xl border border-slate-100 py-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                  i18n.language === lang.code 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <img src={lang.flag} className="w-5 h-3 object-cover rounded-sm" alt={lang.name} />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;