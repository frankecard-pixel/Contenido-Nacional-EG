import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Clock, Search, Filter, Download, Eye } from 'lucide-react';
import { getAllCertifications, updateCertificationStatus } from '../services/supabaseApi';
import { toast } from 'sonner';

const AdminCertificationManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Pendientes');
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const data = await getAllCertifications();
      setCertifications(data);
    } catch (error) {
      console.error("Error loading certifications:", error);
      toast.error("Error al cargar las certificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const stats = useMemo(() => {
    return {
      pending: certifications.filter(c => c.status === 'pending').length,
      valid: certifications.filter(c => c.status === 'valid' || c.status === 'active').length,
      rejected: certifications.filter(c => c.status === 'rejected').length,
      total: certifications.length
    };
  }, [certifications]);

  const filteredCertifications = useMemo(() => {
    switch (activeTab) {
      case 'Pendientes':
        return certifications.filter(c => c.status === 'pending');
      case 'Validados':
        return certifications.filter(c => c.status === 'valid' || c.status === 'active');
      case 'Rechazados':
        return certifications.filter(c => c.status === 'rejected');
      default:
        return certifications;
    }
  }, [activeTab, certifications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateCertificationStatus(id, newStatus);
      toast.success(newStatus === 'valid' ? "Certificación validada con éxito" : "Certificación rechazada");
      fetchCerts(); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Admin</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Verificación de Certificados</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Validación de Certificaciones</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Revise y valide los certificados subidos por empresas y profesionales para otorgar sellos de confianza.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pendientes</p>
          <p className="text-4xl font-black text-blue-600 tracking-tighter">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Validados</p>
          <p className="text-4xl font-black text-emerald-500 tracking-tighter">{stats.valid}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rechazados</p>
          <p className="text-4xl font-black text-rose-500 tracking-tighter">{stats.rejected}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Histórico</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.total}</p>
        </div>
      </div>

      <nav className="flex space-x-1 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar">
        {['Pendientes', 'Validados', 'Rechazados', 'Todos'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="py-6 px-10">Usuario / Entidad</th>
                  <th className="py-6 px-10">Certificación</th>
                  <th className="py-6 px-10">Emisor</th>
                  <th className="py-6 px-10">Fecha Subida</th>
                  <th className="py-6 px-10 text-right">Acciones de Validación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredCertifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 px-10 text-center text-slate-400 font-medium italic">
                      No hay certificaciones en esta categoría
                    </td>
                  </tr>
                ) : (
                  filteredCertifications.map((cert) => (
                    <tr key={cert.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                      <td className="py-8 px-10">
                        <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">
                          {cert.user?.name || cert.user?.email || 'Usuario General'}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cert.id}</p>
                      </td>
                      <td className="py-8 px-10">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                          {cert.title || cert.name}
                        </p>
                        {cert.category && (
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                            {cert.category}
                          </span>
                        )}
                      </td>
                      <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">{cert.issuer || 'N/A'}</td>
                      <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {cert.date ? new Date(cert.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-8 px-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {cert.file_url && (
                            <a 
                              href={cert.file_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-50 hover:text-primary transition-all shadow-sm" 
                              title="Ver Documento"
                            >
                              <Eye className="w-5 h-5" />
                            </a>
                          )}
                          {cert.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(cert.id, 'valid')}
                                className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm" 
                                title="Validar"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(cert.id, 'rejected')}
                                className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm" 
                                title="Rechazar"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {cert.status !== 'pending' && (
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                              cert.status === 'valid' || cert.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-rose-100 text-rose-700'
                            }`}>
                              {cert.status === 'valid' || cert.status === 'active' ? 'Validado' : 'Rechazado'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminCertificationManagement;
