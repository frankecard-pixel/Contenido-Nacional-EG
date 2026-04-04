import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LandingFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center text-white font-black text-xl">GE</div>
                  <div>
                      <h4 className="font-black text-slate-900 text-lg uppercase leading-none">GE-Content</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Portal Oficial</p>
                  </div>
              </div>
              <p className="text-slate-500 leading-relaxed mb-10 max-w-sm">
                  Iniciativa gubernamental para promover la soberanía tecnológica y el empleo local en la industria petrolera de Guinea Ecuatorial.
              </p>
              <div className="flex space-x-6">
                  {['twitter', 'linkedin', 'facebook'].map(s => (
                      <a key={s} href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                          <span className="capitalize font-bold text-sm">{s}</span>
                      </a>
                  ))}
              </div>
          </div>
          <div className="md:col-span-2">
              <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-8">Navegación</h5>
              <ul className="space-y-4">
                  <li><Link to="/opportunities" className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">{t('common.opportunities')}</Link></li>
                  <li><Link to="/resources" className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">{t('common.resources')}</Link></li>
                  <li><Link to="/contact" className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">{t('common.contact')}</Link></li>
              </ul>
          </div>
          <div className="md:col-span-2">
              <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-8">Legal</h5>
              <ul className="space-y-4">
                  <li><a href="#" className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">Privacidad</a></li>
                  <li><a href="#" className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">Términos</a></li>
                  <li><a href="#" className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">Cookies</a></li>
              </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-medium">© 2024 MMH. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <span>Malabo</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Bata</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Ebibeyin</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
