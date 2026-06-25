import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, CheckCircle, Clock, FileText, Plus, Download, ExternalLink, X } from 'lucide-react';
import { getCertifications, addCertification } from '../../services/supabaseApi';
import { Certification, User } from '../../types';
import { toast } from 'sonner';

interface CertificationsManagementProps {
  user?: User | null;
}

const CertificationsManagement: React.FC<CertificationsManagementProps> = ({ user }) => {
  const { t } = useTranslation();
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCategory, setNewCategory] = useState('Capacitación Técnica');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUserCerts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getCertifications(user.id);
      setCertifications(data);
    } catch (error) {
      console.error("Error fetching certifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCerts();
  }, [user]);

  const stats = useMemo(() => {
    return {
      valid: certifications.filter(c => c.verification_status === 'verified').length,
      expired: certifications.filter(c => {
        if (!c.expiry_date) return false;
        return new Date(c.expiry_date) < new Date();
      }).length,
      pending: certifications.filter(c => c.verification_status === 'pending').length,
    };
  }, [certifications]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newTitle || !newIssuer) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      const certData = {
        user_id: user.id,
        title: newTitle,
        institution: newIssuer,
        issue_date: newDate || new Date().toISOString().split('T')[0],
        expiry_date: newExpiry || null,
        category: newCategory,
        file_url: newFileUrl || 'https://example.com/certificado.pdf',
        verification_status: 'pending',
        progress: 100
      };

      await addCertification(certData);
      toast.success("Certificación enviada para validación");
      setIsModalOpen(false);
      
      // Reset form
      setNewTitle('');
      setNewIssuer('');
      setNewDate('');
      setNewExpiry('');
      setNewFileUrl('');

      fetchUserCerts(); // Refresh list
    } catch (error) {
      console.error("Error creating certification:", error);
      toast.error("Error al registrar la certificación");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Mis Certificaciones
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Repositorio oficial de diplomas, cursos y acreditaciones del sector.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Subir Certificado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-3 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vigentes / Validados</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.valid}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 p-3 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expirados</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.expired}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-3 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Verificación</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.length === 0 ? (
            <div className="col-span-full p-12 text-center opacity-50 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-sm font-black uppercase tracking-widest">No hay certificaciones registradas</p>
            </div>
          ) : (
            certifications.map((cert) => (
              <div key={cert.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`size-14 rounded-2xl flex items-center justify-center ${
                    cert.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : cert.verification_status === 'rejected' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                  }`}>
                    <Award className="w-7 h-7" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    cert.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-700' : cert.verification_status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {cert.verification_status === 'verified' ? 'Vigente / Validado' : cert.verification_status === 'rejected' ? 'Rechazado' : 'Pendiente de Validación'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 tracking-tight">{cert.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{cert.institution}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Emisión</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{cert.issue_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Expiración</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{cert.expiry_date || 'No expira'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                  {cert.file_url && (
                    <a 
                      href={cert.file_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      <Download className="w-4 h-4" /> Ver Documento PDF
                    </a>
                  )}
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{cert.category || 'Técnico'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subir Certificado Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-300">
            <header className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Subir Certificación</h2>
                <p className="text-xs text-slate-400 font-medium">Registra tus títulos y acreditaciones oficiales.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Título de la Certificación *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Curso de Seguridad Offshore OPITO"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Emisor / Institución *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: GEPetrol Academy / SGS"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Fecha de Obtención</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Fecha de Expiración</label>
                  <input 
                    type="date" 
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Categoría</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="Capacitación Técnica">Capacitación Técnica</option>
                  <option value="Seguridad y Salud (HSE)">Seguridad y Salud (HSE)</option>
                  <option value="Medio Ambiente">Medio Ambiente</option>
                  <option value="Liderazgo y Gestión">Liderazgo y Gestión</option>
                  <option value="Idioma">Idioma</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">URL de Documento PDF (Adjunto)</label>
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/certificado.pdf"
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-50 dark:border-slate-700">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  {submitting ? 'Subiendo...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsManagement;
