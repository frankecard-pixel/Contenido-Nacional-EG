import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { OpportunityExt, Company, Application, OpportunityShortlist, LocalCompanyMatchResult, CompanyService, User } from '../../types';
import { updateOpportunity, deleteOpportunity } from '../../services/supabaseApi';
import { 
  matchLocalCompaniesForOpportunity, 
  getOpportunityShortlists, 
  createOpportunityShortlistEntry, 
  remitShortlistToOperator,
  getCompanyServices 
} from '../../services/localBusinessService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Users, 
  FileText, 
  ExternalLink, 
  Save, 
  X,
  Target,
  Send,
  Award,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';

interface ManageOpportunityModalProps {
  opportunity: OpportunityExt | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  companies: Company[];
  applications: Application[];
}

const ManageOpportunityModal: React.FC<ManageOpportunityModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onUpdated,
  companies,
  applications
}) => {
  const { i18n } = useTranslation();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | 'applications' | 'shortlist'>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form state
  const [editTitleEs, setEditTitleEs] = useState('');
  const [editDescEs, setEditDescEs] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editDeadline, setEditDeadline] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStatus, setEditStatus] = useState<string>('published');
  const [editScopeOfWork, setEditScopeOfWork] = useState('');
  const [editRequirements, setEditRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState('');

  // Phase 3 Shortlisting state
  const [shortlists, setShortlists] = useState<OpportunityShortlist[]>([]);
  const [matchResults, setMatchResults] = useState<LocalCompanyMatchResult[]>([]);
  const [allServices, setAllServices] = useState<CompanyService[]>([]);
  const [isMatchingRunning, setIsMatchingRunning] = useState(false);
  const [isRemitting, setIsRemitting] = useState(false);
  const [remitNotes, setRemitNotes] = useState('');
  const [minExpYears, setMinExpYears] = useState(2);
  const [minLocalContent, setMinLocalContent] = useState(35);

  const currentUserObj: User = {
    id: authUser?.id || 'u-admin-dgcn',
    email: authUser?.email || 'admin@mmh.gob.gq',
    name: authUser?.user_metadata?.full_name || 'Dirección General de Contenido Nacional',
    role: (authUser as any)?.role || 'admin',
    isOnline: true,
    permissions: ['*']
  };

  const loadShortlistData = async (oppId: string) => {
    try {
      const sl = await getOpportunityShortlists(oppId, currentUserObj);
      setShortlists(sl);

      // Collect services of all local companies for matching
      const servicesAcc: CompanyService[] = [];
      for (const comp of companies.slice(0, 15)) {
        const s = await getCompanyServices(comp.id);
        servicesAcc.push(...s);
      }
      setAllServices(servicesAcc);
    } catch (e) {
      console.warn('Error loading shortlists:', e);
    }
  };

  useEffect(() => {
    if (opportunity) {
      const getTitle = (t: any) => (typeof t === 'object' ? t?.es || t?.en || '' : t || '');
      const getDesc = (d: any) => (typeof d === 'object' ? d?.es || d?.en || '' : d || '');

      setEditTitleEs(getTitle(opportunity.title));
      setEditDescEs(getDesc(opportunity.description));
      setEditCategory(opportunity.category || 'Mantenimiento y Operaciones');
      setEditBudget(opportunity.budget || 0);
      setEditDeadline(opportunity.deadline || '');
      setEditLocation(opportunity.location || '');
      setEditStatus(opportunity.status || 'published');
      setEditScopeOfWork(opportunity.scopeOfWork || '');
      setEditRequirements(opportunity.requirements || []);
      setMinExpYears(opportunity.minimumExperienceYears || 2);
      setMinLocalContent(opportunity.minimumLocalContentScore || 35);
      setActiveTab('details');

      loadShortlistData(opportunity.id);
    }
  }, [opportunity]);

  const handleRunMatching = () => {
    if (!opportunity) return;
    setIsMatchingRunning(true);
    try {
      const oppWithCriteria: OpportunityExt = {
        ...opportunity,
        category: editCategory || opportunity.category,
        minimumExperienceYears: minExpYears,
        minimumLocalContentScore: minLocalContent,
        requiredServices: [editCategory || opportunity.category]
      };
      const results = matchLocalCompaniesForOpportunity(oppWithCriteria, companies, allServices);
      setMatchResults(results);
      toast.success(`Motor de matching finalizado: ${results.length} empresas analizadas.`);
    } catch (e) {
      console.error(e);
      toast.error('Error al ejecutar el motor de matching');
    } finally {
      setIsMatchingRunning(false);
    }
  };

  const handlePreselectCompany = async (match: LocalCompanyMatchResult) => {
    if (!opportunity) return;
    try {
      const criteria = {
        meetsService: match.meetsServiceRequirement,
        meetsExperience: match.meetsExperienceRequirement,
        meetsCertification: match.meetsCertificationRequirement,
        meetsLocalContent: match.meetsLocalContentRequirement,
        score: match.matchScore
      };

      const entry = await createOpportunityShortlistEntry({
        opportunityId: opportunity.id,
        companyId: match.company.id,
        companyName: match.company.name,
        matchScore: match.matchScore,
        criteriaEvaluated: criteria,
        matchExplanation: match.explanation,
        recommendationNotes: `Empresa evaluada con ${match.matchScore}% de compatibilidad técnica y de contenido nacional.`,
        user: currentUserObj
      });

      setShortlists(prev => [...prev.filter(s => s.company_id !== match.company.id), entry]);
      toast.success(`Empresa '${match.company.name}' preseleccionada exitosamente.`);
    } catch (e) {
      console.error(e);
      toast.error('Error al registrar la preselección');
    }
  };

  const handleRemitToOperator = async () => {
    if (!opportunity) return;
    if (shortlists.length === 0) {
      toast.error('Debe preseleccionar al menos una empresa antes de remitir la lista corta.');
      return;
    }

    try {
      setIsRemitting(true);
      await remitShortlistToOperator({
        opportunityId: opportunity.id,
        contractingCompanyId: opportunity.contractingCompanyId || opportunity.petroleraId,
        notes: remitNotes || 'Lista corta ministerial remitida oficialmente para el proceso de licitación de la operadora.',
        user: currentUserObj
      });

      await loadShortlistData(opportunity.id);
      toast.success('Lista corta ministerial remitida con éxito a la empresa contratante.');
      onUpdated();
    } catch (e) {
      console.error(e);
      toast.error('Error al remitir la lista corta');
    } finally {
      setIsRemitting(false);
    }
  };

  if (!isOpen || !opportunity) return null;

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || obj.en || '';
  };

  const formatDeadlineDate = (dateStr?: string) => {
    if (!dateStr) return 'Sin fecha límite';
    try {
      if (dateStr.includes('T')) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
        return dateStr.split('T')[0];
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const oppApplications = applications.filter(
    a => a.opportunityId === opportunity.id || (a as any).opportunity_id === opportunity.id
  );

  const getCompanyName = (id: string) => {
    const comp = companies.find(c => c.id === id);
    return comp ? comp.name : 'Empresa Proveedora';
  };

  const handleQuickStatusChange = async (newStatus: 'published' | 'under_review' | 'closed' | 'awarded') => {
    try {
      setIsSaving(true);
      await updateOpportunity(opportunity.id, { status: newStatus } as any);
      setEditStatus(newStatus);
      toast.success(`Estado actualizado a: ${newStatus === 'published' ? 'Abierta' : newStatus === 'closed' ? 'Cerrada' : newStatus === 'awarded' ? 'Adjudicada' : 'En Evaluación'}`);
      onUpdated();
    } catch (err) {
      console.error(err);
      toast.error('Error al cambiar el estado');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updatedData: any = {
        title: typeof opportunity.title === 'object' ? { ...opportunity.title, es: editTitleEs } : editTitleEs,
        description: typeof opportunity.description === 'object' ? { ...opportunity.description, es: editDescEs } : editDescEs,
        category: editCategory,
        budget: Number(editBudget),
        deadline: editDeadline,
        location: editLocation,
        status: editStatus,
        scopeOfWork: editScopeOfWork,
        requirements: editRequirements
      };

      await updateOpportunity(opportunity.id, updatedData);
      toast.success('Oportunidad actualizada con éxito');
      onUpdated();
      setActiveTab('details');
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta oportunidad de licitación? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      setIsDeleting(true);
      await deleteOpportunity(opportunity.id);
      toast.success('Licitación eliminada');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddRequirement = () => {
    if (newReq.trim()) {
      setEditRequirements([...editRequirements, newReq.trim()]);
      setNewReq('');
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setEditRequirements(editRequirements.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="p-4 sm:p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 sm:gap-4 bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
          <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 sm:py-1 rounded-lg">
                Ref: {opportunity.ref || opportunity.id.toUpperCase()}
              </span>
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 sm:py-1 rounded-lg ${
                editStatus === 'published' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : editStatus === 'closed'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : editStatus === 'awarded'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {editStatus === 'published' ? 'Abierta / Publicada' : editStatus === 'closed' ? 'Cerrada' : editStatus === 'awarded' ? 'Adjudicada' : 'En Evaluación'}
              </span>
            </div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-2">
              {getTranslatedText(opportunity.title)}
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="size-3 text-primary shrink-0" /> 
              <span>{opportunity.location || 'Guinea Ecuatorial'} • {opportunity.category}</span>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="size-9 sm:size-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
          >
            <X className="size-5 sm:size-6" />
          </button>
        </header>

        {/* Tab Navigation - Desplazable horizontalmente con soporte táctil */}
        <div className="flex overflow-x-auto no-scrollbar scroll-smooth border-b border-slate-100 dark:border-slate-800 px-3 sm:px-8 bg-white dark:bg-slate-900 gap-1 sm:gap-4 flex-nowrap shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3.5 sm:py-4 px-3 sm:px-4 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="size-4 shrink-0" /> 
            <span>Detalles de Licitación</span>
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`py-3.5 sm:py-4 px-3 sm:px-4 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'edit'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Edit3 className="size-4 shrink-0" /> 
            <span>Editar y Estado</span>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3.5 sm:py-4 px-3 sm:px-4 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'applications'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Users className="size-4 shrink-0" /> 
            <span>Postulaciones ({oppApplications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('shortlist')}
            className={`py-3.5 sm:py-4 px-3 sm:px-4 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'shortlist'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Target className="size-4 shrink-0 text-amber-500" /> 
            <span>Preselección y Matching ({shortlists.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Quick Status Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Acción Rápida de Estado</span>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">Cambie el ciclo de vida de la convocatoria con un clic:</p>
                </div>
                <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2">
                  <button
                    disabled={isSaving || editStatus === 'published'}
                    onClick={() => handleQuickStatusChange('published')}
                    className="px-2.5 sm:px-3 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors disabled:opacity-50 text-center"
                  >
                    Abrir
                  </button>
                  <button
                    disabled={isSaving || editStatus === 'under_review'}
                    onClick={() => handleQuickStatusChange('under_review')}
                    className="px-2.5 sm:px-3 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 transition-colors disabled:opacity-50 text-center"
                  >
                    Evaluación
                  </button>
                  <button
                    disabled={isSaving || editStatus === 'closed'}
                    onClick={() => handleQuickStatusChange('closed')}
                    className="px-2.5 sm:px-3 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 transition-colors disabled:opacity-50 text-center"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Presupuesto Estimado</span>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${opportunity.budget?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Fecha de Cierre</span>
                  <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1">
                    {formatDeadlineDate(opportunity.deadline)}
                  </p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Empresas Postuladas</span>
                  <p className="text-lg sm:text-xl font-black text-primary">{oppApplications.length}</p>
                </div>
              </div>

              {/* Technical Description & Scope */}
              <div className="space-y-3 sm:space-y-4">
                <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">Descripción General</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {getTranslatedText(opportunity.description) || 'Sin descripción detallada registrada.'}
                  </p>
                </div>

                {opportunity.scopeOfWork && (
                  <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">Alcance del Trabajo (Scope of Work)</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {opportunity.scopeOfWork}
                    </p>
                  </div>
                )}

                {/* Requirements */}
                {opportunity.requirements && opportunity.requirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2.5">Requisitos de Contenido Nacional</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {opportunity.requirements.map((req, i) => (
                        <div key={i} className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Link to Public Detail and Delete Option */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={`/opportunity/${opportunity.id}`}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-95"
                >
                  <ExternalLink className="size-4 text-primary" /> 
                  <span>Ver Ficha Pública de Licitación</span>
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-3 text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-200/60 dark:border-red-900/40 transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Trash2 className="size-4" /> 
                  <span>Eliminar Licitación</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT FORM */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título (Español) *</label>
                  <input
                    type="text"
                    required
                    value={editTitleEs}
                    onChange={(e) => setEditTitleEs(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría / Sector</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Presupuesto ($ USD)</label>
                  <input
                    type="number"
                    value={editBudget}
                    onChange={(e) => setEditBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha Límite</label>
                  <input
                    type="text"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  >
                    <option value="published">Abierta / Publicada</option>
                    <option value="under_review">En Evaluación</option>
                    <option value="closed">Cerrada</option>
                    <option value="awarded">Adjudicada</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Localización</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Malabo, Punta Europa, etc."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción</label>
                <textarea
                  rows={3}
                  value={editDescEs}
                  onChange={(e) => setEditDescEs(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alcance del Trabajo (Scope of Work)</label>
                <textarea
                  rows={3}
                  value={editScopeOfWork}
                  onChange={(e) => setEditScopeOfWork(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Requirements editor */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requisitos</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReq}
                    onChange={(e) => setNewReq(e.target.value)}
                    placeholder="Agregar requisito..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 bg-primary text-white text-xs font-black uppercase rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {editRequirements.map((r, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {r}
                      <button type="button" onClick={() => handleRemoveRequirement(idx)} className="text-slate-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-primary text-white hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  Empresas que han aplicado a esta licitación
                </h4>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {oppApplications.length} Aplicaciones
                </span>
              </div>

              {oppApplications.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aún no hay postulaciones registradas para esta oportunidad.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {oppApplications.map((app) => (
                    <div key={app.id} className="p-4 bg-white dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Ref: {app.ref || app.id}</span>
                        <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase">{getCompanyName(app.companyId)}</h5>
                        <p className="text-[10px] font-bold text-slate-400">Fecha de postulación: {app.submittedAt || app.submitted_at || 'Reciente'}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg ${
                          app.status === 'awarded'
                            ? 'bg-emerald-100 text-emerald-700'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {app.status === 'awarded' ? 'Adjudicada' : app.status === 'rejected' ? 'Descartada' : 'En Evaluación'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRESELECCIÓN Y MATCHING MINISTERIAL (FASE 3) */}
          {activeTab === 'shortlist' && (
            <div className="space-y-6">
              {/* Institutional Notice */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                    Protocolo Ministerial de Preselección (Ley de Contenido Nacional)
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    El Ministerio identifica y preselecciona empresas locales con base en criterios reglados de capacidad y solvencia. 
                    <strong> La adjudicación final corresponde exclusivamente a la empresa contratante</strong> dentro del proceso de licitación.
                  </p>
                </div>
              </div>

              {/* Criteria Bar & Matching Engine Trigger */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                      <Target className="size-4 text-primary" /> Criterios Reglados de Matching
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Parámetros de ponderación técnica objetiva</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunMatching}
                    disabled={isMatchingRunning}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md shadow-primary/20 disabled:opacity-50 active:scale-95"
                  >
                    <Sparkles className="size-3.5" />
                    <span>{isMatchingRunning ? 'Analizando...' : 'Ejecutar Motor de Matching'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Sector Requerido</span>
                    <p className="font-black text-slate-800 dark:text-slate-200">{opportunity.category || 'General'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Experiencia Mínima</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min={0}
                        max={30}
                        value={minExpYears} 
                        onChange={(e) => setMinExpYears(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700" 
                      />
                      <span className="text-[10px] font-bold text-slate-500">años en el sector</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Mínimo Contenido Nacional</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min={0}
                        max={100}
                        value={minLocalContent} 
                        onChange={(e) => setMinLocalContent(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700" 
                      />
                      <span className="text-[10px] font-bold text-slate-500">% cuota de empleo/gasto</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LISTA CORTA ACTUAL (PRESELECCIÓN REGISTRADA) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="size-4 text-emerald-500" /> Lista Corta Preseleccionada ({shortlists.length})
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Empresas locales seleccionadas para remisión oficial</p>
                  </div>

                  {shortlists.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRemitToOperator}
                      disabled={isRemitting}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                    >
                      <Send className="size-3.5" />
                      <span>{isRemitting ? 'Remitiendo...' : 'Remitir a la Operadora'}</span>
                    </button>
                  )}
                </div>

                {shortlists.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Target className="size-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aún no se han preseleccionado empresas para esta oportunidad.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Haga clic en "Ejecutar Motor de Matching" para analizar y preseleccionar proveedores locales.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                    {shortlists.map((sl) => (
                      <div key={sl.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{sl.company_name || sl.company?.name || 'Empresa Local'}</span>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-primary dark:bg-primary/20">
                              {sl.match_score}% Compatibilidad
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{sl.match_explanation || sl.ministry_recommendation_notes}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                            sl.status === 'remitida_a_operadora'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {sl.status === 'remitida_a_operadora' ? 'Remitida a Operadora' : 'Preseleccionada (Borrador)'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RESULTADOS DEL MOTOR DE MATCHING (PROVEEDORES LOCALES COMPATIBLES) */}
              {matchResults.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" /> Empresas Locales Evaluadas por el Motor ({matchResults.length})
                  </h4>

                  <div className="space-y-3">
                    {matchResults.slice(0, 10).map((match, idx) => {
                      const isAlreadyPreselected = shortlists.some(s => s.company_id === match.company.id);

                      return (
                        <div 
                          key={match.company.id || idx} 
                          className={`p-4 rounded-2xl border transition-all ${
                            isAlreadyPreselected 
                              ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40' 
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase">{match.company.name}</h5>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  match.matchScore >= 70 
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : match.matchScore >= 40
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                }`}>
                                  {match.matchScore}% Compatibilidad
                                </span>
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                  RUGE: {match.company.rugeId}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{match.explanation}</p>
                            </div>

                            <div className="shrink-0">
                              {isAlreadyPreselected ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 text-[10px] font-black uppercase tracking-wider">
                                  <Check className="size-3" /> Preseleccionada
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handlePreselectCompany(match)}
                                  className="px-3.5 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <span>Preseleccionar</span>
                                  <ArrowRight className="size-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Breakdown Badges */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[9px] font-black uppercase tracking-wider">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                              match.meetsServiceRequirement ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                            }`}>
                              {match.meetsServiceRequirement ? '✓' : '✗'} Servicio Acreditado
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                              match.meetsExperienceRequirement ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                            }`}>
                              {match.meetsExperienceRequirement ? '✓' : '✗'} Experiencia Requerida
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                              match.meetsCertificationRequirement ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                            }`}>
                              {match.meetsCertificationRequirement ? '✓' : '✗'} Certificada RUGE
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                              match.meetsLocalContentRequirement ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                            }`}>
                              {match.meetsLocalContentRequirement ? '✓' : '✗'} Cuota Contenido Nacional
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOpportunityModal;
