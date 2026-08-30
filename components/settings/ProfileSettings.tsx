import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types';
import { updateUser, uploadFile, getStoragePublicUrl } from '../../services/supabaseApi';
import { FileUploaderWithPreview } from '../FileUploaderWithPreview';
import { X, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  user?: User | null;
  onUpdate?: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      setAvatarUrl(user.avatar_url || user.avatar || '');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmAvatar = async (data: { base64?: string; url?: string; fileName?: string }) => {
    if (!user) return;
    setIsUploading(true);
    try {
      let finalAvatarUrl = '';
      if (data.url) {
        finalAvatarUrl = data.url;
      } else if (data.base64) {
        const fileType = data.base64.split(';')[0].split(':')[1] || 'image/png';
        const fileName = `avatar_${user.id}_${Date.now()}`;
        await uploadFile('avatars', fileName, data.base64, fileType);
        finalAvatarUrl = getStoragePublicUrl('avatars', fileName);
      }
      
      if (finalAvatarUrl) {
        setAvatarUrl(finalAvatarUrl);
        toast.success("Nueva foto de perfil cargada. Haga clic en 'Guardar Cambios' para confirmarlo.");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error al subir la imagen de avatar");
    } finally {
      setIsUploading(false);
      setShowAvatarUploader(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateUser(user.id, {
        name: updatedName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        avatar_url: avatarUrl
      });
      toast.success('Perfil actualizado correctamente.');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar los cambios del perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Información Personal</h2>
      
      <div className="flex items-center space-x-6 mb-8">
        <div className="size-20 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-sm overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            `${formData.firstName?.charAt(0) || '?'}${formData.lastName?.charAt(0) || '?'}`
          )}
        </div>
        <div>
          <button 
            type="button"
            onClick={() => setShowAvatarUploader(true)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
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
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar Cambios
          </button>
        </div>
      </form>

      {showAvatarUploader && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border border-slate-200 dark:border-slate-700">
            <button 
              type="button"
              onClick={() => setShowAvatarUploader(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Subir Nueva Foto de Perfil</h3>
            <FileUploaderWithPreview 
              title="Subir Nueva Foto de Perfil"
              allowedTypes="image/*"
              onConfirm={handleConfirmAvatar} 
              onCancel={() => setShowAvatarUploader(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
