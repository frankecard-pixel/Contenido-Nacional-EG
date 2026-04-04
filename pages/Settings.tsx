import React, { useState } from 'react';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import { User } from '../types';

interface SettingsProps {
  user?: User | null;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: 'person' },
    { id: 'security', label: 'Seguridad', icon: 'lock' },
    { id: 'appearance', label: 'Apariencia', icon: 'palette' },
    { id: 'notifications', label: 'Notificaciones', icon: 'notifications' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Configuración</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestiona tus preferencias, seguridad y apariencia del portal.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Configuración */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-4 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-lg opacity-80">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileSettings user={user} />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Preferencias de Notificaciones</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Elige qué alertas deseas recibir y cómo.</p>
              
              <div className="space-y-4">
                {[
                  { id: 'email_alerts', title: 'Alertas por Correo', desc: 'Recibe resúmenes diarios y avisos urgentes en tu email.' },
                  { id: 'push_alerts', title: 'Notificaciones Push', desc: 'Avisos en tiempo real en tu navegador mientras usas el portal.' },
                  { id: 'marketing', title: 'Boletín Informativo', desc: 'Noticias, actualizaciones y nuevas oportunidades del sector.' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
