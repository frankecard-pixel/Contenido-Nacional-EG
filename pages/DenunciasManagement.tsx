import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getDenuncias, updateDenunciaStatus, deleteCommentGlobal, getUsers, updateUser, Denuncia } from '../services/supabaseApi';
import { User } from '../types';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, EyeOff, ShieldAlert, Trash2, UserX, XCircle } from 'lucide-react';

const DenunciasManagement: React.FC = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Denuncia[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'dismissed'>('pending');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [reportsData, usersData] = await Promise.all([
        getDenuncias(),
        getUsers()
      ]);
      setReports(reportsData || []);
      setUsers((usersData as any) || []);
    } catch (err: any) {
      console.error('Error fetching reports data:', err);
      setError('Error al cargar denuncias. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      dismissed: reports.filter(r => r.status === 'dismissed').length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => r.status === activeTab);
  }, [reports, activeTab]);

  const handleDismiss = async (reportId: string) => {
    try {
      setIsLoading(true);
      await updateDenunciaStatus(reportId, 'dismissed');
      toast.success('Denuncia descartada correctamente.');
      await fetchData();
    } catch (err) {
      console.error('Error dismissing report:', err);
      toast.error('Error al descartar la denuncia.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveComment = async (report: Denuncia) => {
    const confirm = window.confirm(`¿Está seguro de que desea eliminar permanentemente este comentario de "${report.commentAuthorName}"?`);
    if (!confirm) return;

    try {
      setIsLoading(true);
      // Delete from local storage / DB
      await deleteCommentGlobal(report.commentId, report.newsId);
      // Resolve report
      await updateDenunciaStatus(report.id, 'resolved');
      toast.success('Comentario eliminado y denuncia resuelta.');
      await fetchData();
    } catch (err) {
      console.error('Error removing comment:', err);
      toast.error('Error al eliminar el comentario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUserAndRemove = async (report: Denuncia) => {
    const confirm = window.confirm(`¿Está seguro de que desea ELIMINAR el comentario y BLOQUEAR permanentemente al usuario "${report.commentAuthorName}"?`);
    if (!confirm) return;

    try {
      setIsLoading(true);
      
      // Find user if they exist in system
      const systemUser = users.find(u => u.name === report.commentAuthorName || u.email === report.commentAuthorName);
      if (systemUser) {
        await updateUser(systemUser.id, { status: 'suspended' });
        toast.info(`Usuario "${systemUser.name}" suspendido en el sistema.`);
      } else {
        toast.warning(`No se encontró un usuario registrado con el nombre "${report.commentAuthorName}", pero se bloqueará su alias.`);
      }

      // Delete comment and resolve
      await deleteCommentGlobal(report.commentId, report.newsId);
      await updateDenunciaStatus(report.id, 'resolved');
      
      toast.success('Comentario retirado y usuario bloqueado con éxito.');
      await fetchData();
    } catch (err) {
      console.error('Error blocking user:', err);
      toast.error('Error al bloquear al usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full dark:bg-red-950/30 dark:text-red-400">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">Garantía de Seguridad</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestor de Denuncias por Abuso</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">
            Modera comentarios y valoraciones reportados por la comunidad. Aplica medidas disciplinarias y bloquea infractores.
          </p>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Denuncias Totales</div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">{stats.total}</div>
        </div>
        <div className="p-8 rounded-[2rem] border border-red-100 bg-red-50/20 shadow-xs dark:border-red-900/30 dark:bg-red-950/10">
          <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-2">Pendientes de Revisión</div>
          <div className="text-4xl font-black text-red-600 dark:text-red-400">{stats.pending}</div>
        </div>
        <div className="p-8 rounded-[2rem] border border-emerald-100 bg-emerald-50/20 shadow-xs dark:border-emerald-900/30 dark:bg-emerald-950/10">
          <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Resueltas (Retirados)</div>
          <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats.resolved}</div>
        </div>
        <div className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Descartadas</div>
          <div className="text-4xl font-black text-slate-500 dark:text-slate-400">{stats.dismissed}</div>
        </div>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'pending' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Pendientes ({stats.pending})
        </button>
        <button 
          onClick={() => setActiveTab('resolved')}
          className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'resolved' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Resueltas / Retirados ({stats.resolved})
        </button>
        <button 
          onClick={() => setActiveTab('dismissed')}
          className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'dismissed' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Descartadas ({stats.dismissed})
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-32 opacity-40 grayscale flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-slate-400 mb-4">gavel</span>
            <p className="text-sm font-black uppercase tracking-widest">No hay denuncias en esta sección</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-8 md:p-10 flex flex-col lg:flex-row justify-between gap-8 hover:bg-slate-50/30 dark:hover:bg-slate-700/10 transition-all">
                <div className="space-y-4 flex-1">
                  {/* Metadata de la denuncia */}
                  <div className="flex flex-wrap gap-3 items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-red-500 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Denunciado por: {report.reportedBy}
                    </span>
                    <span className="text-slate-400">
                      {new Date(report.created_at).toLocaleString()}
                    </span>
                    {report.newsTitle && (
                      <span className="text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
                        Artículo: {report.newsTitle}
                      </span>
                    )}
                  </div>

                  {/* Detalle del Motivo */}
                  <div className="p-4 bg-red-50/30 dark:bg-red-950/10 border-l-4 border-red-500 rounded-r-xl">
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">Motivo de la Denuncia:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium italic">"{report.reason}"</p>
                  </div>

                  {/* El Comentario Ofensivo */}
                  <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-xs font-black text-slate-900 dark:text-white block uppercase tracking-tight">{report.commentAuthorName}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t(`roles.${report.commentAuthorRole}`)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      "{report.commentText}"
                    </p>
                  </div>
                </div>

                {/* Acciones del Gestor */}
                <div className="flex lg:flex-col justify-end items-stretch gap-3 shrink-0 self-center w-full lg:w-64">
                  {report.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleRemoveComment(report)}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 shadow-md transition-all active:scale-95"
                      >
                        <Trash2 size={14} />
                        Retirar Comentario
                      </button>
                      <button 
                        onClick={() => handleBlockUserAndRemove(report)}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-md transition-all active:scale-95"
                      >
                        <UserX size={14} />
                        Bloquear Infractor
                      </button>
                      <button 
                        onClick={() => handleDismiss(report.id)}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                      >
                        <XCircle size={14} />
                        Descartar
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 py-4 px-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                      <CheckCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Acción Aplicada</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Ministerio de Hidrocarburos, Minas y Electricidad • República de Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default DenunciasManagement;
