import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Briefcase, GraduationCap, Award, FileText, Plus, Edit2, Share2, Upload, X, Loader2, Phone, Mail, MapPin, Trash2 } from 'lucide-react';
import { User } from '../../types';
import { uploadFile, updateUser, getStoragePublicUrl, getCandidateProfile, updateCandidateProfile } from '../../services/supabaseApi';
import { FileUploaderWithPreview } from '../FileUploaderWithPreview';

interface TalentProfileManagementProps {
  user?: User | null;
  onUpdate?: () => void;
}

const TalentProfileManagement: React.FC<TalentProfileManagementProps> = ({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);
  const [showCvUploader, setShowCvUploader] = useState(false);

  // New Profile State
  const [profile, setProfile] = useState<any>(null);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [expData, setExpData] = useState({ role: '', company: '', period: '', desc: '' });
  const [eduData, setEduData] = useState({ degree: '', school: '', year: '' });
  const [skillData, setSkillData] = useState('');

  useEffect(() => {
    if (user?.id) {
      getCandidateProfile(user.id).then(data => {
        if (data) setProfile(data);
      });
    }
  }, [user?.id]);

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleConfirmCv = async (data: { base64?: string; url?: string; fileName?: string }) => {
    if (!user) return;
    setIsUploading(true);
    try {
      let finalCvUrl = '';
      if (data.url) {
        finalCvUrl = data.url;
      } else if (data.base64) {
        const fileType = data.base64.split(';')[0].split(':')[1] || 'application/pdf';
        const fileName = `cv_${user.id}_${Date.now()}.pdf`;
        await uploadFile('cvs', fileName, data.base64, fileType);
        finalCvUrl = getStoragePublicUrl('cvs', fileName);
      }
      
      if (finalCvUrl) {
        await updateUser(user.id, { cv_url: finalCvUrl });
        alert("CV subido y guardado con éxito");
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error al subir el CV");
    } finally {
      setIsUploading(false);
      setShowCvUploader(false);
    }
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
        setEditData({ ...editData, avatar_url: finalAvatarUrl });
        alert("Imagen de perfil lista (recuerde hacer clic en 'Guardar Cambios' para confirmarlo en su perfil)");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error al subir la imagen");
    } finally {
      setIsUploading(false);
      setShowAvatarUploader(false);
    }
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

  const handleSaveExperience = async () => {
    if (!user || !expData.role || !expData.company) return;
    try {
      const newExp = { ...expData };
      const currentExps = profile?.experience || [];
      const updatedExps = [...currentExps, newExp];
      const updatedProfile = await updateCandidateProfile(user.id, { experience: updatedExps });
      setProfile(updatedProfile);
      setShowExpModal(false);
      setExpData({ role: '', company: '', period: '', desc: '' });
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const handleDeleteExperience = async (index: number) => {
    if (!user || !profile?.experience) return;
    try {
      const updatedExps = profile.experience.filter((_: any, i: number) => i !== index);
      const updatedProfile = await updateCandidateProfile(user.id, { experience: updatedExps });
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const handleSaveEducation = async () => {
    if (!user || !eduData.degree || !eduData.school) return;
    try {
      const newEdu = { ...eduData };
      const currentEdus = profile?.education || [];
      const updatedEdus = [...currentEdus, newEdu];
      const updatedProfile = await updateCandidateProfile(user.id, { education: updatedEdus });
      setProfile(updatedProfile);
      setShowEduModal(false);
      setEduData({ degree: '', school: '', year: '' });
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };

  const handleDeleteEducation = async (index: number) => {
    if (!user || !profile?.education) return;
    try {
      const updatedEdus = profile.education.filter((_: any, i: number) => i !== index);
      const updatedProfile = await updateCandidateProfile(user.id, { education: updatedEdus });
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  const handleSaveSkill = async () => {
    if (!user || !skillData.trim()) return;
    try {
      const currentSkills = profile?.skills || [];
      if (currentSkills.includes(skillData.trim())) {
        alert("Esta habilidad ya existe.");
        return;
      }
      const updatedSkills = [...currentSkills, skillData.trim()];
      const updatedProfile = await updateCandidateProfile(user.id, { skills: updatedSkills });
      setProfile(updatedProfile);
      setShowSkillModal(false);
      setSkillData('');
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  const handleDeleteSkill = async (skillToDelete: string) => {
    if (!user || !profile?.skills) return;
    try {
      const updatedSkills = profile.skills.filter((skill: string) => skill !== skillToDelete);
      const updatedProfile = await updateCandidateProfile(user.id, { skills: updatedSkills });
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error deleting skill:", error);
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
                  onClick={() => setShowAvatarUploader(true)}
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
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click para cambiar foto (Base64/URL)</p>
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
            <div className="mt-2 flex flex-col items-center gap-2">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{user?.role || 'Talento'}</p>
              {(user as any)?.verification_status === 'verified' ? (
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 inline-block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Candidato Verificado
                </span>
              ) : (
                <span className="bg-slate-50 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100 inline-block">
                  Perfil en Revisión
                </span>
              )}
            </div>
            
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
                {user?.cv_url ? (user.cv_url.startsWith('http') && !user.cv_url.includes('/storage/') ? 'CV Vinculado via URL' : 'cv_actualizado.pdf') : 'No hay CV subido'}
              </span>
              <button 
                onClick={() => setShowCvUploader(true)}
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
              <button onClick={() => setShowExpModal(true)} className="text-blue-600 hover:text-blue-700"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-8">
              {profile?.experience && profile.experience.length > 0 ? profile.experience.map((exp: any, i: number) => (
                <div key={i} className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-700 pb-8 last:pb-0">
                  <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-800"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{exp.role}</h4>
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{exp.company} • {exp.period}</p>
                    </div>
                    <button onClick={() => handleDeleteExperience(i)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-3">{exp.desc}</p>
                </div>
              )) : (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No hay experiencia registrada</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                Educación
              </h3>
              <button onClick={() => setShowEduModal(true)} className="text-purple-600 hover:text-purple-700"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-6">
              {profile?.education && profile.education.length > 0 ? profile.education.map((edu: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{edu.degree}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{edu.school}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{edu.year}</span>
                    <button onClick={() => handleDeleteEducation(i)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )) : (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No hay educación registrada</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-600" />
                Habilidades
              </h3>
              <button onClick={() => setShowSkillModal(true)} className="text-emerald-600 hover:text-emerald-700"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile?.skills && profile.skills.length > 0 ? profile.skills.map((skill: string, i: number) => (
                <span key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                  {skill}
                  <button onClick={() => handleDeleteSkill(skill)} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )) : (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No hay habilidades registradas</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showExpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">Añadir Experiencia</h2>
              <button onClick={() => setShowExpModal(false)}><X className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Cargo (Ej: Senior Drilling Engineer)" value={expData.role} onChange={(e) => setExpData({...expData, role: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm" />
              <input type="text" placeholder="Empresa" value={expData.company} onChange={(e) => setExpData({...expData, company: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm" />
              <input type="text" placeholder="Periodo (Ej: 2020 - Presente)" value={expData.period} onChange={(e) => setExpData({...expData, period: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm" />
              <textarea placeholder="Descripción del cargo..." value={expData.desc} onChange={(e) => setExpData({...expData, desc: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm resize-none h-24" />
              <button onClick={handleSaveExperience} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Guardar Experiencia</button>
            </div>
          </div>
        </div>
      )}

      {showEduModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">Añadir Educación</h2>
              <button onClick={() => setShowEduModal(false)}><X className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Título (Ej: Máster en Ingeniería)" value={eduData.degree} onChange={(e) => setEduData({...eduData, degree: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm" />
              <input type="text" placeholder="Institución" value={eduData.school} onChange={(e) => setEduData({...eduData, school: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm" />
              <input type="text" placeholder="Año" value={eduData.year} onChange={(e) => setEduData({...eduData, year: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm" />
              <button onClick={handleSaveEducation} className="w-full py-4 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Guardar Educación</button>
            </div>
          </div>
        </div>
      )}

      {showSkillModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">Añadir Habilidad</h2>
              <button onClick={() => setShowSkillModal(false)}><X className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Habilidad (Ej: Perforación Offshore)" value={skillData} onChange={(e) => setSkillData(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveSkill()} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 font-bold text-sm" />
              <button onClick={handleSaveSkill} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Guardar Habilidad</button>
            </div>
          </div>
        </div>
      )}

      {showAvatarUploader && (
        <FileUploaderWithPreview
          title="Subir Imagen de Perfil"
          allowedTypes="image/*"
          initialUrl={editData.avatar_url}
          onConfirm={handleConfirmAvatar}
          onCancel={() => setShowAvatarUploader(false)}
        />
      )}

      {showCvUploader && (
        <FileUploaderWithPreview
          title="Subir Currículum Vitae (CV)"
          allowedTypes=".pdf"
          initialUrl={user?.cv_url || ''}
          onConfirm={handleConfirmCv}
          onCancel={() => setShowCvUploader(false)}
        />
      )}
    </div>
  );
};

export default TalentProfileManagement;
