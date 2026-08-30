import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ShieldCheck, 
  Award, 
  Building2, 
  User as UserIcon, 
  FileText, 
  ExternalLink,
  RefreshCw,
  X,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { getAllCertifications, updateCertificationStatus } from '../services/supabaseApi';
import { toast } from 'sonner';

interface CertificationItem {
  id: string;
  user_id?: string;
  title?: string;
  name?: string;
  institution?: string;
  issuer?: string;
  category?: string;
  issue_date?: string;
  expiry_date?: string;
  date?: string;
  status?: string;
  file_url?: string;
  verification_status?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    avatar_url?: string;
  };
}

const AdminCertificationManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'Pendientes' | 'Validados' | 'Rechazados' | 'Todos'>('Pendientes');
  const [searchQuery, setSearchQuery] = useState('');
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Inspection Modal State
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const data = await getAllCertifications();
      setCertifications(data || []);
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
      pending: certifications.filter(c => (c.status || c.verification_status) === 'pending').length,
      valid: certifications.filter(c => {
        const s = c.status || c.verification_status;
        return s === 'valid' || s === 'active' || s === 'verified';
      }).length,
      rejected: certifications.filter(c => (c.status || c.verification_status) === 'rejected').length,
      total: certifications.length
    };
  }, [certifications]);

  const filteredCertifications = useMemo(() => {
    let list = certifications;

    // Filter by Tab
    if (activeTab === 'Pendientes') {
      list = list.filter(c => (c.status || c.verification_status) === 'pending');
    } else if (activeTab === 'Validados') {
      list = list.filter(c => {
        const s = c.status || c.verification_status;
        return s === 'valid' || s === 'active' || s === 'verified';
      });
    } else if (activeTab === 'Rechazados') {
      list = list.filter(c => (c.status || c.verification_status) === 'rejected');
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => {
        const title = (c.title || c.name || '').toLowerCase();
        const issuer = (c.issuer || c.institution || '').toLowerCase();
        const userName = (c.user?.name || c.user?.email || '').toLowerCase();
        const category = (c.category || '').toLowerCase();
        return title.includes(q) || issuer.includes(q) || userName.includes(q) || category.includes(q);
      });
    }

    return list;
  }, [activeTab, searchQuery, certifications]);

  const handleStatusChange = async (id: string, newStatus: string, reason?: string) => {
    try {
      setProcessingId(id);
      
      // Optimistic update
      setCertifications(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            verification_status: newStatus === 'valid' ? 'verified' : newStatus
          };
        }
        return item;
      }));

      await updateCertificationStatus(id, newStatus);
      
      if (newStatus === 'valid') {
        toast.success("Certificación validada y homologada con éxito");
      } else if (newStatus === 'rejected') {
        toast.error("Certificación marcada como rechazada");
      } else {
        toast.info("Estado de certificación actualizado");
      }

      if (selectedCert?.id === id) {
        setSelectedCert(null);
        setShowRejectForm(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar estado");
      fetchCerts(); // Revert on failure
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (cert: CertificationItem) => {
    const s = cert.status || cert.verification_status;
    if (s === 'valid' || s === 'active' || s === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-3" /> Validado
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
          <XCircle className="size-3" /> Rechazado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
        <Clock className="size-3" /> Pendiente
      </span>
    );
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-10 space-y-5 sm:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div className="space-y-1 min-w-0 w-full">
          <nav className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 flex-wrap">
            <span>Admin</span>
            <span className="material-symbols-outlined text-xs sm:text-sm">chevron_right</span>
            <span className="text-primary truncate">Verificación de Certificados</span>
          </nav>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight break-words">
            Validación de Certificaciones
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed break-words">
            Revise y valide los certificados subidos por empresas y profesionales para otorgar sellos de confianza y habilitación en el RUGE.
          </p>
        </div>

        <button
          onClick={fetchCerts}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs shrink-0"
        >
          <RefreshCw className={`size-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          <span>Actualizar</span>
        </button>
      </header>

      {/* Responsive Metrics Grid: 2 per row on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 w-full min-w-0">
        {/* Pendientes */}
        <div 
          onClick={() => setActiveTab('Pendientes')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 min-w-0 overflow-hidden ${
            activeTab === 'Pendientes' 
              ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 shadow-md ring-2 ring-blue-500/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Pendientes
            </span>
            <span className="size-6 sm:size-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Clock className="size-3.5 sm:size-4" />
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            {stats.pending}
          </p>
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5 truncate">
            Por validar
          </span>
        </div>

        {/* Validados */}
        <div 
          onClick={() => setActiveTab('Validados')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 min-w-0 overflow-hidden ${
            activeTab === 'Validados' 
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-md ring-2 ring-emerald-500/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Validados
            </span>
            <span className="size-6 sm:size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-3.5 sm:size-4" />
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {stats.valid}
          </p>
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5 truncate">
            Aprobados RUGE
          </span>
        </div>

        {/* Rechazados */}
        <div 
          onClick={() => setActiveTab('Rechazados')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 min-w-0 overflow-hidden ${
            activeTab === 'Rechazados' 
              ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 shadow-md ring-2 ring-rose-500/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Rechazados
            </span>
            <span className="size-6 sm:size-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
              <XCircle className="size-3.5 sm:size-4" />
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            {stats.rejected}
          </p>
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5 truncate">
            Desestimados
          </span>
        </div>

        {/* Total Histórico */}
        <div 
          onClick={() => setActiveTab('Todos')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 min-w-0 overflow-hidden ${
            activeTab === 'Todos' 
              ? 'bg-slate-100 dark:bg-slate-700/50 border-slate-400 dark:border-slate-500 shadow-md ring-2 ring-slate-400/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Total
            </span>
            <span className="size-6 sm:size-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Award className="size-3.5 sm:size-4" />
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.total}
          </p>
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5 truncate">
            Registrados
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-800/80 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs w-full min-w-0 overflow-hidden">
        {/* Horizontal scrollable tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap w-full sm:w-auto min-w-0 pb-1 sm:pb-0">
          {(['Pendientes', 'Validados', 'Rechazados', 'Todos'] as const).map((tab) => {
            const count = tab === 'Pendientes' ? stats.pending : tab === 'Validados' ? stats.valid : tab === 'Rechazados' ? stats.rejected : stats.total;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md min-w-0">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por usuario, certificado o emisor..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-medium dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="animate-spin rounded-full size-10 border-2 border-primary border-t-transparent"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando certificaciones...</p>
        </div>
      ) : filteredCertifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/80 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-700/80 text-center space-y-3">
          <div className="size-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
            <ShieldCheck className="size-7" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
            No se encontraron certificaciones
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery 
              ? 'No hay registros que coincidan con los términos de búsqueda ingresados.' 
              : `No existen certificaciones en estado "${activeTab.toLowerCase()}" en este momento.`}
          </p>
          {(searchQuery || activeTab !== 'Todos') && (
            <button
              onClick={() => { setActiveTab('Todos'); setSearchQuery(''); }}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-primary hover:bg-primary/10 transition-colors"
            >
              Ver todas las certificaciones
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Card List View (visible on < md screens) */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden w-full min-w-0">
            {filteredCertifications.map((cert) => {
              const isPending = (cert.status || cert.verification_status) === 'pending';
              const isProcessing = processingId === cert.id;

              return (
                <div 
                  key={cert.id}
                  className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-3 w-full min-w-0 overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 w-full min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="size-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-xs flex items-center justify-center shrink-0">
                        {cert.user?.name ? cert.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-tight truncate">
                          {cert.user?.name || cert.user?.email || 'Usuario General'}
                        </p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">
                          ID: {cert.id}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(cert)}
                    </div>
                  </div>

                  {/* Cert Info */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800/80 min-w-0">
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight break-words">
                      {cert.title || cert.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="truncate">Emisor: <strong className="text-slate-700 dark:text-slate-300">{cert.issuer || cert.institution || 'N/A'}</strong></span>
                      {cert.date && (
                        <span>• Fecha: {new Date(cert.date).toLocaleDateString()}</span>
                      )}
                    </div>
                    {cert.category && (
                      <span className="inline-block text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {cert.category}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="size-3.5" />
                      <span>Ver Detalle</span>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleStatusChange(cert.id, 'rejected')}
                            className="px-2.5 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-rose-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <XCircle className="size-3.5" />
                            <span>Rechazar</span>
                          </button>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleStatusChange(cert.id, 'valid')}
                            className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs disabled:opacity-50"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Validar</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(cert.id, 'pending')}
                          className="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[9px] font-black uppercase tracking-wider hover:underline"
                        >
                          Reevaluar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (visible on >= md screens) */}
          <div className="hidden md:block bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <th className="py-4 px-6">Usuario / Entidad</th>
                    <th className="py-4 px-6">Certificación</th>
                    <th className="py-4 px-6">Emisor</th>
                    <th className="py-4 px-6">Fecha / Categoría</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredCertifications.map((cert) => {
                    const isPending = (cert.status || cert.verification_status) === 'pending';
                    const isProcessing = processingId === cert.id;

                    return (
                      <tr key={cert.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-xs flex items-center justify-center shrink-0">
                              {cert.user?.name ? cert.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-tight">
                                {cert.user?.name || cert.user?.email || 'Usuario General'}
                              </p>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                                {cert.user?.email || `ID: ${cert.id}`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                            {cert.title || cert.name}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-600 dark:text-slate-300">
                          {cert.issuer || cert.institution || 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {cert.date ? new Date(cert.date).toLocaleDateString() : 'N/A'}
                          </p>
                          {cert.category && (
                            <span className="inline-block text-[8px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded mt-0.5">
                              {cert.category}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(cert)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              type="button"
                              onClick={() => setSelectedCert(cert)}
                              className="size-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-50 hover:text-primary transition-all shadow-2xs" 
                              title="Ver Detalle y Documento"
                            >
                              <Eye className="size-4" />
                            </button>

                            {isPending ? (
                              <>
                                <button 
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleStatusChange(cert.id, 'valid')}
                                  className="size-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-2xs disabled:opacity-50" 
                                  title="Validar y Aprobar"
                                >
                                  <CheckCircle2 className="size-4" />
                                </button>
                                <button 
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleStatusChange(cert.id, 'rejected')}
                                  className="size-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-2xs disabled:opacity-50" 
                                  title="Rechazar"
                                >
                                  <XCircle className="size-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(cert.id, 'pending')}
                                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-primary px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Reevaluar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de Inspección Detallada de Certificado */}
      {selectedCert && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => { setSelectedCert(null); setShowRejectForm(false); }}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <header className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg">
                    ID: {selectedCert.id}
                  </span>
                  {getStatusBadge(selectedCert)}
                </div>
                <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {selectedCert.title || selectedCert.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => { setSelectedCert(null); setShowRejectForm(false); }}
                className="size-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
              >
                <X className="size-5" />
              </button>
            </header>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Entidad / Usuario */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Titular del Certificado</span>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">
                      {selectedCert.user?.name || 'Usuario General'}
                    </p>
                    <p className="text-slate-500 font-medium">
                      {selectedCert.user?.email || 'Sin correo asociado'}
                    </p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {selectedCert.user?.role === 'company' ? 'Empresa' : 'Profesional'}
                  </span>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Institución Emisora</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedCert.issuer || selectedCert.institution || 'N/A'}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Categoría Técnica</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedCert.category || 'Capacitación Técnica'}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Fecha de Emisión</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedCert.date ? new Date(selectedCert.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Vigencia / Expiración</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedCert.expiry_date ? new Date(selectedCert.expiry_date).toLocaleDateString() : 'Permanente / Sin Vencimiento'}
                  </p>
                </div>
              </div>

              {/* Document Link */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="font-black text-slate-900 dark:text-white uppercase text-[11px]">Documento de Respaldo</p>
                    <p className="text-[10px] text-slate-500 font-medium">Comprobante de autenticidad PDF/JPG</p>
                  </div>
                </div>
                {selectedCert.file_url ? (
                  <a
                    href={selectedCert.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="size-3" />
                    <span>Ver Archivo</span>
                  </a>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">Sin archivo adjunto</span>
                )}
              </div>

              {/* Formulario de Rechazo Opcional */}
              {showRejectForm && (
                <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-2 animate-in fade-in">
                  <label className="text-[10px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-300 block">
                    Motivo u Observaciones de Rechazo:
                  </label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Ej. Documento ilegible, certificado vencido o emisor no reconocido..."
                    className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <footer className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => { setSelectedCert(null); setShowRejectForm(false); }}
                className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-center"
              >
                Cerrar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!showRejectForm) {
                      setShowRejectForm(true);
                    } else {
                      handleStatusChange(selectedCert.id, 'rejected', rejectionReason);
                    }
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle className="size-4" />
                  <span>{showRejectForm ? 'Confirmar Rechazo' : 'Rechazar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedCert.id, 'valid')}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Aprobar y Emitir Sello</span>
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificationManagement;
