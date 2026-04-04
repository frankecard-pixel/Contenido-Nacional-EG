import React from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Briefcase, GraduationCap, Award, FileText, Plus, Edit2, Share2 } from 'lucide-react';
import { User } from '../../types';

interface TalentProfileManagementProps {
  user?: User | null;
}

const TalentProfileManagement: React.FC<TalentProfileManagementProps> = ({ user }) => {
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Editar Perfil
          </button>
        </div>
      </div>

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
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase mb-6 tracking-tight">Habilidades Clave</h3>
            <div className="flex flex-wrap gap-2">
              {['Drilling Operations', 'HSE Management', 'Project Planning', 'Team Leadership', 'Offshore Safety', 'Technical Reporting'].map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 rounded-lg border border-slate-100 dark:border-slate-800">
                  {skill}
                </span>
              ))}
            </div>
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
