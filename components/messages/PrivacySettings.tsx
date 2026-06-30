import React, { useState } from 'react';
import { User } from '../../types';
import { updateUser } from '../../services/supabaseApi';
import { toast } from 'sonner';

interface PrivacySettingsProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ currentUser, onUpdateUser }) => {
  const [allowSearch, setAllowSearch] = useState(currentUser.allow_search !== false);
  const [saving, setSaving] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setAllowSearch(checked);
    setSaving(true);
    try {
      const updated = await updateUser(currentUser.id, { allow_search: checked });
      onUpdateUser(updated);
      toast.success(
        checked 
          ? 'Tu perfil ahora es visible en la búsqueda de usuarios.' 
          : 'Has ocultado tu perfil de la búsqueda de usuarios.'
      );
    } catch (error) {
      console.error('Error updating privacy status:', error);
      toast.error('Error al actualizar preferencias de privacidad');
      setAllowSearch(!checked); // Rollback
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="privacy-settings-card" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined">security</span>
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Privacidad y Búsqueda</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Controla quién puede encontrarte</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Permitir ser buscado
            </label>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 max-w-[200px]">
              Si se desactiva, otros técnicos y empresas locales no podrán encontrarte en el directorio ni iniciar nuevos chats contigo de forma directa.
            </p>
          </div>
          
          <button
            type="button"
            disabled={saving}
            onClick={() => handleToggle(!allowSearch)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              allowSearch ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                allowSearch ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="p-4 bg-blue-50/50 dark:bg-primary/5 rounded-2xl border border-blue-100/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary dark:text-blue-400 uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>Estado Actual</span>
          </div>
          <p className="text-[10px] font-medium leading-relaxed">
            {allowSearch 
              ? 'VISIBLE: Tu perfil es público en el buscador de usuarios para todo el ecosistema del portal.' 
              : 'PRIVADO: Solo las personas con las que ya tienes un chat activo pueden enviarte mensajes.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
