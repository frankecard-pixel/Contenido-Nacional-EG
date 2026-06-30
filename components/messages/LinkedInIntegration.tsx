import React, { useState } from 'react';
import { User } from '../../types';
import { updateUser } from '../../services/supabaseApi';
import { toast } from 'sonner';

interface LinkedInIntegrationProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
}

const LinkedInIntegration: React.FC<LinkedInIntegrationProps> = ({ currentUser, onUpdateUser }) => {
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedin_url || '');
  const [isLinking, setIsLinking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMockOAuth, setShowMockOAuth] = useState(false);

  const mockLinkedInProfile = {
    headline: currentUser.position 
      ? `${currentUser.position} | Experto en la Industria Hidrocarburífera` 
      : 'Especialista en Energía y Contenido Nacional | Guinea Ecuatorial',
    summary: `Profesional comprometido con el desarrollo del sector extractivo en Guinea Ecuatorial. Amplia experiencia técnica e institucional, enfocado en optimizar operaciones y promover la transferencia tecnológica conforme al Decreto de Contenido Nacional.`,
    skills: ['Contenido Nacional', 'Operaciones Hidrocarburíferas', 'HSE', 'Gestión de Proyectos', 'Liderazgo Técnico'],
    experience: [
      { company: 'Ministerio de Hidrocarburos', position: currentUser.position || 'Consultor Técnico', period: '2022 - Presente' },
      { company: 'Empresa Operadora de Bioko', position: 'Supervisor de Planta', period: '2019 - 2022' }
    ]
  };

  const handleStartOAuth = () => {
    if (!linkedinUrl.trim()) {
      toast.warning('Por favor, introduce tu URL de perfil de LinkedIn antes de vincular.');
      return;
    }
    setShowMockOAuth(true);
  };

  const handleConfirmOAuth = async () => {
    setIsLinking(true);
    setShowMockOAuth(false);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const updated = await updateUser(currentUser.id, {
        linkedin_url: linkedinUrl,
        linkedin_profile: mockLinkedInProfile
      });
      onUpdateUser(updated);
      toast.success('¡Perfil de LinkedIn vinculado e importado con éxito!');
    } catch (error) {
      console.error('LinkedIn link failed:', error);
      toast.error('Error al vincular el perfil de LinkedIn');
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlink = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(currentUser.id, {
        linkedin_url: '',
        linkedin_profile: undefined
      });
      onUpdateUser(updated);
      setLinkedinUrl('');
      toast.success('Cuenta de LinkedIn desvinculada');
    } catch (error) {
      console.error('LinkedIn unlink failed:', error);
      toast.error('Error al desvincular LinkedIn');
    } finally {
      setSaving(false);
    }
  };

  const profile = currentUser.linkedin_profile;

  return (
    <div id="linkedin-integration-card" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
          {/* LinkedIn Icon as clean text or simple aesthetic shape */}
          <span className="font-bold text-sm tracking-tighter">in</span>
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Integración LinkedIn</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Importa tu CV y visibilidad profesional</p>
        </div>
      </div>

      {!profile ? (
        <div className="space-y-4">
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase">
            Vincula tu cuenta de LinkedIn para importar automáticamente tu experiencia, habilidades y cargo profesional. Esto aumentará tu visibilidad para las empresas contratantes.
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 block">URL de tu Perfil</label>
              <input 
                type="url" 
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/tu-perfil"
                className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleStartOAuth}
              disabled={isLinking}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-blue-600/10"
            >
              {isLinking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">link</span>
                  <span>Vincular Perfil</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">{profile.headline}</p>
                <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-1">{linkedinUrl}</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded text-[8px] font-black uppercase tracking-wider">Vinculado</span>
            </div>

            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic border-t border-slate-50 dark:border-slate-900 pt-2">
              "{profile.summary}"
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-900">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experiencia Importada:</p>
              <div className="space-y-2">
                {profile.experience?.map((exp, i) => (
                  <div key={i} className="text-[10px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{exp.position}</span>
                    <span className="text-slate-400"> @ {exp.company} ({exp.period})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 pt-2">
              {profile.skills?.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[9px] font-bold uppercase tracking-tight">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleUnlink}
            disabled={saving}
            className="w-full py-3 border border-red-200/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
          >
            {saving ? 'Desvinculando...' : 'Desvincular Cuenta'}
          </button>
        </div>
      )}

      {/* Mock LinkedIn OAuth Dialog */}
      {showMockOAuth && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-[#0077b5] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-2xl tracking-tighter bg-white text-[#0077b5] px-2.5 py-0.5 rounded-md">in</span>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wide">LinkedIn OAuth</h4>
                  <p className="text-[10px] text-white/80 uppercase">Autorización de Seguridad</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMockOAuth(false)} 
                className="text-white hover:text-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-center items-center gap-6">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black uppercase border border-primary/20">
                  {currentUser.name.slice(0, 2)}
                </div>
                <div className="text-slate-300 text-xl font-light">⟷</div>
                <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold tracking-tighter">
                  in
                </div>
              </div>

              <div className="text-center space-y-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-snug">
                  El Portal de Contenido Nacional solicita acceso a tu cuenta de LinkedIn
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Al autorizar esta conexión, el portal podrá leer de forma segura tu información de perfil profesional, incluyendo tu cargo actual, biografía, habilidades e historial laboral certificado.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Información que se compartirá:</p>
                <div className="space-y-1 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                    <span>Tu cargo: "{mockLinkedInProfile.headline}"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                    <span>Historial de 2 empresas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                    <span>Lista de habilidades profesionales</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
              <button
                onClick={() => setShowMockOAuth(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmOAuth}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
              >
                Permitir Acceso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInIntegration;
