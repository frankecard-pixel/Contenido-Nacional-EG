import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types';

interface ProfileSettingsProps {
  user?: User | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      const names = (user.name || '').split(' ');
      setFormData({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para guardar el perfil
    alert('Perfil actualizado correctamente.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Información Personal</h2>
      
      <div className="flex items-center space-x-6 mb-8">
        <div className="size-20 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-sm">
          {formData.firstName?.charAt(0) || '?'}{formData.lastName?.charAt(0) || '?'}
        </div>
        <div>
          <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Cambiar Avatar
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">JPG, GIF o PNG. Máximo 2MB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Apellidos</label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Teléfono</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Biografía / Notas</label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
