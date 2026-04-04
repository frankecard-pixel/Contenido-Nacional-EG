import React, { useState } from 'react';

const SecuritySettings: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    alert('Contraseña actualizada correctamente.');
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Seguridad y Contraseña</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Actualiza tu contraseña y gestiona la seguridad de tu cuenta.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contraseña Actual</label>
          <input 
            type="password" 
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nueva Contraseña</label>
          <input 
            type="password" 
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Debe contener al menos 8 caracteres, una mayúscula y un número.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirmar Nueva Contraseña</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex justify-start pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors">
            Actualizar Contraseña
          </button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Autenticación de Dos Factores (2FA)</h3>
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md border border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Protege tu cuenta con seguridad adicional.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recomendado para cuentas institucionales.</p>
          </div>
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Activar 2FA
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
