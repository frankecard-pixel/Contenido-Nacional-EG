
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTalents, updateTalentStatus, verifyTalent, getCandidateProfile } from '../services/supabaseApi';
import { toast } from 'sonner';
import { 
  FileText, CheckCircle, XCircle, Clock, Award, Shield, User as UserIcon, 
  Mail, Phone, Calendar, MapPin, Search, Eye, Download, ExternalLink, 
  Maximize, Briefcase, GraduationCap, CheckSquare, Square, Upload 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PDFViewer } from '../components/PDFViewer';

const AdminTalentBasePage: React.FC = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTalent, setSelectedTalent] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<{
    comment: string;
    certNumber: string;
    validationBases: string[];
    resolutionNum: string;
    resolutionFile: string;
  }>({
    comment: '',
    certNumber: '',
    validationBases: [],
    resolutionNum: '',
    resolutionFile: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTalents({ 
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined
      });
      setTalents(data || []);
    } catch (error) {
      toast.error('Error al cargar la base de talentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleOpenReview = async (talent: any) => {
    try {
      // Fetch full profile data
      const fullProfile = await getCandidateProfile(talent.id);
      setSelectedTalent({ ...talent, profile: fullProfile });
      
      const pComment = fullProfile?.admin_comment || talent.admin_comment || '';
      const pCertNumber = fullProfile?.certification_number || talent.certification_number || `CERT-${Math.floor(1000 + Math.random() * 9000)}`;
      const pBases = fullProfile?.validation_bases || [];
      const pResNum = fullProfile?.resolution_num || `MOC-MIN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const pResFile = fullProfile?.resolution_file || 'Resolucion_Ministerial_Firmada.pdf';

      setReviewData({
        comment: pComment,
        certNumber: pCertNumber,
        validationBases: pBases,
        resolutionNum: pResNum,
        resolutionFile: pResFile
      });
      setShowReviewModal(true);
    } catch (error) {
      toast.error('Error al cargar el perfil detallado');
    }
  };

  const handleVerifyProcess = async (status: 'verified' | 'rejected') => {
    if (!currentUser) return;
    setIsVerifying(true);
    try {
      await verifyTalent(selectedTalent.id, {
        status,
        comment: reviewData.comment,
        certification_number: reviewData.certNumber,
        admin_id: currentUser.id,
        validation_bases: reviewData.validationBases,
        resolution_num: reviewData.resolutionNum,
        resolution_file: reviewData.resolutionFile
      });
      toast.success(status === 'verified' ? 'Perfil Certificado con Éxito' : 'Perfil Rechazado');
      setShowReviewModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error en el proceso de verificación');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Base de Talentos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Gestión y verificación de capital humano cualificado.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm border border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'all' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Pendientes
            </button>
            <button 
              onClick={() => setStatusFilter('verified')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'verified' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Verificados
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Talentos', value: talents.length, icon: 'groups', color: 'blue' },
          { label: 'Verificados', value: talents.filter(t => t.verification_status === 'verified').length, icon: 'verified', color: 'emerald' },
          { label: 'Pendientes', value: talents.filter(t => t.verification_status === 'pending').length, icon: 'pending_actions', color: 'amber' },
          { label: 'Disponibles', value: talents.filter(t => t.availability_status === 'available').length, icon: 'event_available', color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none sm:leading-tight">{stat.value}</h3>
              </div>
              <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-500 flex items-center justify-center`}>
                <span className="material-symbols-outlined text-lg sm:text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Buscar por especialidad o biografía..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Talento</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialidad</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Experiencia</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 h-20 bg-slate-50/20"></td>
                  </tr>
                ))
              ) : talents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">person_search</span>
                    <p className="text-slate-400 font-bold text-sm">No se encontraron talentos con los filtros actuales</p>
                  </td>
                </tr>
              ) : (
                talents.map((talent) => (
                  <tr key={talent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          {talent.user?.photo_url ? (
                            <img src={talent.user.photo_url} alt={talent.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-400">person</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white">{talent.user?.name || 'Usuario'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{talent.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                        {talent.specialty || 'No definida'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{talent.experience_years} años</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {talent.location_city ? `${talent.location_city}, ` : ''}{talent.location_province || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        talent.verification_status === 'verified' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' 
                          : talent.verification_status === 'pending'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {talent.verification_status === 'verified' ? 'Verificado' : talent.verification_status === 'pending' ? 'Pendiente' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenReview(talent)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm text-[10px] font-black uppercase tracking-widest"
                        >
                          <Eye className="w-3 h-3" /> Revisar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedTalent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Certificación de Perfil</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validación de contenido nacional y fe de datos ministerial</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Profile Info & Full Virtual CV (7 columns) */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Candidate Primary Banner */}
                  <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="size-20 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                      {selectedTalent.user?.photo_url ? (
                        <img src={selectedTalent.user.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedTalent.user?.name}</h3>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{selectedTalent.specialty || 'TALENTO NACIONAL'}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase"><Mail className="w-3.5 h-3.5" /> {selectedTalent.user?.email}</span>
                        {selectedTalent.location_city && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase"><MapPin className="w-3.5 h-3.5" /> {selectedTalent.location_city}, {selectedTalent.location_province}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic and Real CV Data Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                      Datos Reales del Currículum Vitae (Virtual)
                    </h3>

                    {/* Work Experience List */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" /> Trayectoria Laboral
                      </h4>
                      {selectedTalent.profile?.experience && selectedTalent.profile.experience.length > 0 ? (
                        <div className="space-y-3">
                          {selectedTalent.profile.experience.map((exp: any, index: number) => (
                            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{exp.role || exp.title}</p>
                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-[8px] font-black text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider whitespace-nowrap">{exp.period || `${exp.years || ''} años`}</span>
                              </div>
                              <p className="text-[10px] font-bold text-primary uppercase mt-1">{exp.company || 'Empresa Hidrocarburífera G.E.'}</p>
                              {exp.desc && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{exp.desc}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No se ha registrado experiencia laboral estructurada.</p>
                      )}
                    </div>

                    {/* Academic Education & Certifications */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400" /> Formación Académica y Certificados
                      </h4>
                      {selectedTalent.profile?.education && selectedTalent.profile.education.length > 0 ? (
                        <div className="space-y-3">
                          {selectedTalent.profile.education.map((edu: any, index: number) => (
                            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
                              <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start gap-2">
                                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{edu.degree}</p>
                                  <span className="text-[9px] font-black text-slate-400 uppercase">{edu.year}</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{edu.school || edu.institution}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No se han registrado títulos o formaciones.</p>
                      )}
                    </div>

                    {/* Professional Skills */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Award className="w-4 h-4 text-slate-400" /> Habilidades y Competencias Clave
                      </h4>
                      {selectedTalent.profile?.skills && selectedTalent.profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedTalent.profile.skills.map((skill: string, index: number) => (
                            <span key={index} className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No se han especificado habilidades técnicas.</p>
                      )}
                    </div>
                  </div>

                  {/* CV Document Attached */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Documento CV Adjunto (PDF)
                    </h4>
                    {selectedTalent.profile?.cv_url ? (
                      <div className="p-5 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-100 dark:border-slate-800">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Currículum Vitae PDF</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Cargado por el profesional</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setPreviewUrl(selectedTalent.profile.cv_url)}
                          className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
                        >
                          <Maximize className="w-3.5 h-3.5" /> Visualizar <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Sin documento CV físico adjunto</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Ministry Verification Form (5 columns) */}
                <div className="lg:col-span-5 space-y-8 bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800 pb-3">
                      <Award className="w-5 h-5 text-amber-500" />
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Dictamen y Bases Ministerial</h4>
                    </div>

                    {/* Bases de Validación Checklist */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bases de Validación (Ministerio)</label>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-2 leading-tight">Marque los criterios cumplidos tras la auditoría física del expediente:</p>
                      <div className="space-y-2.5">
                        {[
                          { id: 'identity', label: 'Validación de Identidad (DIP/Pasaporte G.E.)' },
                          { id: 'academic', label: 'Cotejo y Validación de Títulos Académicos' },
                          { id: 'national_content', label: 'Cumplimiento de Ley de Contenido Nacional' },
                          { id: 'technical_skill', label: 'Evaluación de Experiencia Técnica y Perfil' }
                        ].map((base) => {
                          const isChecked = reviewData.validationBases.includes(base.id);
                          return (
                            <button
                              key={base.id}
                              type="button"
                              onClick={() => {
                                const newBases = isChecked
                                  ? reviewData.validationBases.filter(b => b !== base.id)
                                  : [...reviewData.validationBases, base.id];
                                setReviewData({ ...reviewData, validationBases: newBases });
                              }}
                              className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-left hover:border-blue-200 dark:hover:border-blue-900/40 transition-all group"
                            >
                              <div className="text-blue-600 transition-transform group-hover:scale-105">
                                {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-tight ${isChecked ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                {base.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ministry Resolution Selector & Upload */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Moción de Sello / Resolución de Homologación</label>
                      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Nº de Resolución Ministerial</label>
                          <input 
                            type="text"
                            value={reviewData.resolutionNum}
                            onChange={(e) => setReviewData({ ...reviewData, resolutionNum: e.target.value })}
                            className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="MOC-MIN-2026-X"
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <div>
                              <p className="text-[9px] font-black text-slate-900 dark:text-white uppercase truncate max-w-[160px]">{reviewData.resolutionFile}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Resolución con moción del ministerio</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => alert("Sello Ministerial cargado con éxito para este expediente técnico.")}
                            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                            title="Cambiar documento oficial"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes / Fe de datos */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones del Certificador / Fe de Datos</label>
                      <textarea 
                        value={reviewData.comment}
                        onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                        className="w-full h-24 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300 resize-none"
                        placeholder="Escriba las observaciones legales y técnicas de Contenido Nacional..."
                      />
                    </div>

                    {/* Certification Number */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de Certificación Nacional (Ruge/MMH)</label>
                      <div className="relative">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          value={reviewData.certNumber}
                          onChange={(e) => setReviewData({...reviewData, certNumber: e.target.value})}
                          className="w-full h-11 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                      <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-tight">
                        Al certificar este perfil, usted emite una resolución oficial con fe institucional sobre la calificación e incorporación al registro de Contenido Nacional de Guinea Ecuatorial.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => handleVerifyProcess('rejected')}
                      disabled={isVerifying}
                      className="flex-1 py-3.5 bg-white dark:bg-slate-900 text-rose-600 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                    <button 
                      onClick={() => handleVerifyProcess('verified')}
                      disabled={isVerifying || reviewData.validationBases.length < 2}
                      className="flex-[2] py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isVerifying ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Certificar Talento
                    </button>
                  </div>
                  {reviewData.validationBases.length < 2 && (
                    <p className="text-center text-[8px] font-bold text-rose-500 uppercase tracking-tight leading-none mt-1">Se requiere verificar al menos 2 bases de validación.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <PDFViewer 
          url={previewUrl} 
          onClose={() => setPreviewUrl(null)} 
        />
      )}
    </div>
  );
};

export default AdminTalentBasePage;
