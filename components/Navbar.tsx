
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Automatic theme based on time (19:00 to 07:00 is dark mode)
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 19 || currentHour < 7;
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && isNight)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const navItems = [
    { 
      id: 'institution',
      label: 'Institución', 
      links: [
        { label: 'Sobre Nosotros', desc: 'Misión, visión y valores de la DCN-GE', path: '/about' },
        { label: 'Visión Estratégica', desc: 'Plan de desarrollo y objetivos clave', path: '/vision' },
        { label: 'Directorio', desc: 'Autoridades y personal del ministerio', path: '/directory' },
        { label: 'Contacto Directo', desc: 'Canales oficiales de comunicación', path: '/contact' }
      ] 
    },
    { 
      id: 'certification',
      label: 'Certificación', 
      links: [
        { label: 'Registro de Empresas', desc: 'Inscripción en el registro de Contenido Nacional', path: '/register' },
        { label: 'Estado de Registro', desc: 'Verificar expediente y notas oficiales', path: '/registration-status' },
        { label: 'Requisitos', desc: 'Documentación y criterios mínimos', path: '/requirements' },
        { label: 'Empresas Certificadas', desc: 'Directorio de empresas habilitadas', path: '/directory' }
      ] 
    },
    { 
      id: 'opportunities',
      label: 'Oportunidades', 
      links: [
        { label: 'Licitaciones', desc: 'Licitaciones y concursos abiertos', path: '/opportunities' },
        { label: 'Bolsa de Empleo', desc: 'Oportunidades de empleo técnico', path: '/jobs' },
        { label: 'Capacitación', desc: 'Programas oficiales de becas y cursos', path: '/training' },
        { label: 'Marco Legal', desc: 'Leyes y normativas de fomento nacional', path: '/resources' }
      ] 
    },
    { 
      id: 'transparency',
      label: 'Transparencia', 
      links: [
        { label: 'Noticias', desc: 'Comunicados y prensa del ministerio', path: '/news' },
        { label: 'Estadísticas', desc: 'Métricas de valor agregado local', path: '/sector-stats' },
        { label: 'Impacto Social', desc: 'Obras de desarrollo comunitario', path: '/community' },
        { label: 'Mapa Industrial', desc: 'Geolocalización interactiva del sector', path: '/directory?view=map' }
      ] 
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setMobileMenuOpen(false);
    navigate(`/news?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-white dark:bg-slate-900 shadow-sm py-2' : 'bg-white dark:bg-slate-900 py-4 border-b border-slate-200 dark:border-slate-800'
      }`}>
        <div className="max-w-[var(--layout-max-width)] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
               <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Equatorial_Guinea.svg" className="w-8 h-5 object-contain" alt="GE Flag" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">Contenido Nacional</h1>
              <h1 className="text-sm font-black text-blue-600 dark:text-blue-400 leading-none tracking-tighter uppercase mt-0.5">Guinea Ecuatorial</h1>
            </div>
          </Link>

          {/* Navegación Central Desktop - Institucional */}
          <div className="hidden xl:flex items-center space-x-8 h-full">
            {navItems.map((item) => (
              <div 
                key={item.id} 
                className="relative group h-full flex items-center py-4"
                onMouseEnter={() => setActiveMenu(item.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className={`flex items-center space-x-1 text-sm font-bold transition-colors ${
                  activeMenu === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}>
                  <span>{item.label}</span>
                  <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${activeMenu === item.id ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {/* Submenú Dropdown Institucional */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-max min-w-[480px] bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl py-3 transition-all duration-200 z-[110] ${
                  activeMenu === item.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                  {item.links.map((link, idx) => (
                    <Link 
                      key={idx} 
                      to={link.path} 
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/link"
                    >
                      <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap mr-8 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">{link.label}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate text-right">{link.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />
            <Link to="/login" className="hidden lg:block bg-blue-600 text-white px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-blue-700 transition-all">
              {t('common.login')}
            </Link>
            {/* Botón Hamburgesa Móvil */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="xl:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Toggle Menu"
            >
               {mobileMenuOpen ? (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
               ) : (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
               )}
            </button>
          </div>
        </div>
      </nav>

      {/* Panel de Menú Móvil */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[90] bg-white dark:bg-slate-900 pt-[100px] overflow-y-auto animate-in slide-in-from-right duration-300">
           <div className="p-8 space-y-8">
              {/* Barra de Búsqueda Móvil */}
              <div className="relative">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Buscar noticias, licitaciones, etc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 rounded-2xl text-sm font-bold transition-all text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400">search</span>
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery('')} 
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  )}
                </form>
              </div>

              {navItems.map((group) => (
                <div key={group.id} className="space-y-3">
                   <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs font-black uppercase tracking-widest">{group.label}</span>
                   </div>
                   <div className="grid grid-cols-1 gap-3 pl-4">
                      {group.links.map((link, idx) => (
                        <Link 
                          key={idx} 
                          to={link.path} 
                          className="flex flex-col text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span className="font-bold text-sm">{link.label}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-500 truncate">{link.desc}</span>
                        </Link>
                      ))}
                   </div>
                </div>
              ))}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <Link 
                  to="/login" 
                  className="w-full bg-blue-600 text-white py-4 rounded-md flex items-center justify-center font-black uppercase text-xs tracking-widest shadow-sm"
                >
                  {t('common.login')}
                </Link>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
