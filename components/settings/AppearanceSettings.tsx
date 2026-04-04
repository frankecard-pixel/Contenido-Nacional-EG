import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AppearanceSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(i18n.language || 'es');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');
  const [layoutWidth, setLayoutWidth] = useState(localStorage.getItem('layoutWidth') || 'standard');
  const [menuSize, setMenuSize] = useState(localStorage.getItem('menuSize') || 'standard');
  const [chartSize, setChartSize] = useState(localStorage.getItem('chartSize') || 'medium');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  const handleLayoutWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const width = e.target.value;
    setLayoutWidth(width);
    localStorage.setItem('layoutWidth', width);
    document.documentElement.setAttribute('data-layout-width', width);
  };

  const handleMenuSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setMenuSize(size);
    localStorage.setItem('menuSize', size);
    document.documentElement.setAttribute('data-menu-size', size);
  };

  const handleChartSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setChartSize(size);
    localStorage.setItem('chartSize', size);
    document.documentElement.setAttribute('data-chart-size', size);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Apariencia e Idioma</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Personaliza cómo se ve y se comporta la interfaz del portal.</p>
      
      <div className="space-y-8 max-w-2xl">
        {/* Selector de Tema */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Tema Visual</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => handleThemeChange('light')}
              className={`flex items-center space-x-4 p-4 rounded-md border-2 transition-all ${
                theme === 'light' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined">light_mode</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Modo Claro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Aspecto luminoso por defecto</p>
              </div>
            </button>

            <button 
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center space-x-4 p-4 rounded-md border-2 transition-all ${
                theme === 'dark' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Modo Oscuro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ideal para entornos con poca luz</p>
              </div>
            </button>
          </div>
        </div>

        {/* Opciones de Tamaño */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Opciones de Visualización</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Tamaño de Fuente */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tamaño de la Fuente</label>
              <div className="relative">
                <select 
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano (Por defecto)</option>
                  <option value="large">Grande</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Tamaño de Ventana */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ancho de la Interfaz</label>
              <div className="relative">
                <select 
                  value={layoutWidth}
                  onChange={handleLayoutWidthChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="compact">Compacto</option>
                  <option value="standard">Estándar (Por defecto)</option>
                  <option value="wide">Ancho Completo</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Tamaño del Menú */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tamaño del Menú Lateral</label>
              <div className="relative">
                <select 
                  value={menuSize}
                  onChange={handleMenuSizeChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="compact">Compacto</option>
                  <option value="standard">Estándar (Por defecto)</option>
                  <option value="large">Grande</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Tamaño de Gráficos */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tamaño de Gráficos</label>
              <div className="relative">
                <select 
                  value={chartSize}
                  onChange={handleChartSizeChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano (Por defecto)</option>
                  <option value="large">Grande</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

          </div>
        </div>

        {/* Selector de Idioma */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Idioma de la Interfaz</h3>
          <div className="relative max-w-xs">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
            >
              <option value="es">Español (ES)</option>
              <option value="en">English (EN)</option>
              <option value="fr">Français (FR)</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Este cambio afectará a todos los menús, botones y textos del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
