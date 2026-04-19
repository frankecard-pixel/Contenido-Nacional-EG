import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Briefcase, GraduationCap, Award, FileText, Plus, Edit2, Share2, Upload, X, Loader2, Phone, Mail, MapPin } from 'lucide-react';
import { User } from '../../types';
import { uploadFile, updateUser } from '../../services/supabaseApi';

interface TalentProfileManagementProps {
  user?: User | null;
  onUpdate?: () => void;
}

const TalentProfileManagement: React.FC<TalentProfileManagementProps> = ({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || ''
  });

  // Sync editData when user prop changes
  React.useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const fileName = `cv_${user.id}_${Date.now()}.pdf`;
        await uploadFile('cvs', fileName, base64Data, file.type);
        const cvUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/cvs/${fileName}`;
        
        await updateUser(user.id, { cv_url: cvUrl });
        alert("CV subido con éxito");
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error al subir el CV");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const fileName = `avatar_${user.id}_${Date.now()}`;
        await uploadFile('avatars', fileName, base64Data, file.type);
        const avatarUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
        setEditData({ ...editData, avatar_url: avatarUrl });
        alert("Imagen de perfil subida con éxito");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Error al subir la imagen");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUser(user.id, editData);
      alert("Perfil actualizado con éxito");
      setShowEditModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Perfil de Talento Digital
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Gestión de currículum digital, competencias y trayectoria profesional.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Compartir Perfil
          </button>
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar Perfil
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tight">Editar Perfil</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => avatarInputRef.current?.click()}
                  className="size-32 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden cursor-pointer group relative"
                >
                  {editData.avatar_url ? (
                    <img src={editData.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-slate-400" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={24} className="text-white" />
                  </div>
                </div>
                <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click para cambiar foto</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teléfono</label>
                  <input 
                    type="text" 
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biografía / Perfil Profesional</label>
                <textarea 
                  rows={4}
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold resize-none"
                  placeholder="Cuéntanos sobre tu trayectoria..."
                />
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Edit2 size={20} />}
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm text-center">
            <div className="size-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-4xl mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name || 'User')
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name || 'Usuario'}</h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">{user?.role || 'Talento'}</p>
            
            {user?.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-4 italic">
                "{user.bio}"
              </p>
            )}

            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span>Completitud del Perfil</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase mb-6 tracking-tight flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              CV Digital
            </h3>
            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                {user?.cv_url ? 'cv_actualizado.pdf' : 'No hay CV subido'}
              </span>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {user?.cv_url ? 'Actualizar' : 'Subir'}
              </button>
            </div>
            {user?.cv_url && (
              <a 
                href={user.cv_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 block text-center py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                Ver CV Actual
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Experiencia Laboral
              </h3>
              <button className="text-blue-600 hover:text-blue-700"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-8">
              {[
                { role: 'Senior Drilling Engineer', company: 'Marathon Oil', period: '2020 - Presente', desc: 'Liderazgo de operaciones de perforación en el Bloque B, supervisión de equipos técnicos y cumplimiento de normativas HSE.' },
                { role: 'Drilling Engineer', company: 'ExxonMobil', period: '2015 - 2020', desc: 'Soporte técnico en operaciones offshore, planificación de pozos y optimización de procesos de perforación.' }
              ].map((exp, i) => (
                <div key={i} className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-700 pb-8 last:pb-0">
                  <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-800"></div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{exp.role}</h4>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{exp.company} • {exp.period}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-3">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                Educación
              </h3>
              <button className="text-purple-600 hover:text-purple-700"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-6">
              {[
                { degree: 'Máster en Ingeniería de Petróleos', school: 'University of Houston', year: '2014' },
                { degree: 'Grado en Ingeniería Mecánica', school: 'Universidad Nacional de Guinea Ecuatorial', year: '2012' }
              ].map((edu, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{edu.degree}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{edu.school}</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentProfileManagement;
