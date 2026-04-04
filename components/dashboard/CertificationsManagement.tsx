import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, CheckCircle, Clock, FileText, Plus, Download, ExternalLink } from 'lucide-react';
import { getCertifications } from '../../services/supabaseApi';
import { Certification, User } from '../../types';

interface CertificationsManagementProps {
  user?: User | null;
}

const CertificationsManagement: React.FC<CertificationsManagementProps> = ({ user }) => {
  const { t } = useTranslation();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (!user?.id) return;
      try {
        const data = await getCertifications(user.id);
        setCertifications(data as Certification[]);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, [user]);

  const stats = useMemo(() => {
    return {
      valid: certifications.filter(c => c.status === 'valid').length,
      expired: certifications.filter(c => c.status === 'expired').length,
      pending: certifications.filter(c => c.status === 'pending').length,
    };
  }, [certifications]);

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
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vigentes</p>
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
                    cert.status === 'valid' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
                  }`}>
                    <Award className="w-7 h-7" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    cert.status === 'valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {cert.status === 'valid' ? 'Vigente' : cert.status === 'expired' ? 'Expirado' : 'Pendiente'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 tracking-tight">{cert.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{cert.issuer}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Emisión</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{cert.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Expiración</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{cert.expiry}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                  <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                    <Download className="w-4 h-4" /> Descargar PDF
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white">
                    <ExternalLink className="w-4 h-4" /> Verificar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsManagement;
