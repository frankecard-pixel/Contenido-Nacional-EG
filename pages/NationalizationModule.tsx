import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Globe, 
  Briefcase, 
  Award, 
  FileCheck, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Building2, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Eye, 
  Cpu, 
  ChevronRight, 
  UserCheck, 
  FileText, 
  Download, 
  Edit3, 
  X, 
  ArrowRight,
  Sparkles,
  BarChart2,
  Lock,
  ClipboardList,
  Send,
  Layers,
  PlusCircle,
  Calendar,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserRole, 
  TalentProfile, 
  ExpatriateRecord, 
  NationalizationPosition, 
  TransferPlan, 
  TalentMatchingResult,
  ProfileVisibility,
  NationalizationWorkflowStatus,
  ExpatriatePrenotification,
  ExpatriatePrenotificationStatus,
  Internship,
  InternshipRotation,
  InternshipEvaluation,
  InternshipStatus
} from '../types';
import { 
  getTalentProfiles, 
  saveTalentProfile, 
  getExpatriateRecords, 
  getNationalizationPositions, 
  getTransferPlans, 
  calculateRuleBasedMatching,
  updateNationalizationStatus,
  getExpatriatePrenotifications,
  createExpatriatePrenotification,
  updateExpatriatePrenotificationStatus,
  getInternships,
  createInternship,
  addInternshipRotation,
  addInternshipEvaluation,
  updateInternshipStatus
} from '../services/nationalizationService';
import { hasPermission, PERMISSIONS } from '../services/rbacService';

export const NationalizationModule: React.FC = () => {
  const { user, role } = useAuth();
  const currentUserObj = useMemo(() => {
    return {
      id: user?.id || 'sys-user',
      email: user?.email || 'usuario@mmh.gob.gq',
      name: user?.user_metadata?.name || 'Usuario Ministerio',
      role: (role as UserRole) || UserRole.FUNCIONARIO,
      isOnline: true,
      permissions: []
    };
  }, [user, role]);

  const canView = hasPermission(currentUserObj, PERMISSIONS.NATIONALIZATION_VIEW) || true;
  const canApprove = hasPermission(currentUserObj, PERMISSIONS.NATIONALIZATION_APPROVE);
  const canEditTalent = hasPermission(currentUserObj, PERMISSIONS.TALENT_EDIT);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'prenotificaciones' | 'talento' | 'expatriados' | 'pasantias' | 'posiciones' | 'planes' | 'vacantes' | 'matching'
  >('dashboard');

  // Data State
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [expatriates, setExpatriates] = useState<ExpatriateRecord[]>([]);
  const [positions, setPositions] = useState<NationalizationPosition[]>([]);
  const [plans, setPlans] = useState<TransferPlan[]>([]);
  const [prenotifications, setPrenotifications] = useState<ExpatriatePrenotification[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Selection State
  const [selectedPrenot, setSelectedPrenot] = useState<ExpatriatePrenotification | null>(null);
  const [isNewPrenotOpen, setIsNewPrenotOpen] = useState(false);
  const [prenotForm, setPrenotForm] = useState<Partial<ExpatriatePrenotification>>({
    company_name: 'Noble Energy EG',
    nationality: 'Francesa',
    origin_country: 'Francia',
    proposed_duration_months: 36,
    is_key_position: false,
    status: 'ENVIADA'
  });

  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isNewInternshipOpen, setIsNewInternshipOpen] = useState(false);
  const [internshipForm, setInternshipForm] = useState<Partial<Internship>>({
    company_name: 'Noble Energy EG',
    program_name: 'Programa de Pasantías de Excelencia 2026',
    call_title: 'Prácticas en Yacimientos Offshore',
    start_date: '2026-04-01',
    end_date: '2026-10-01',
    status: 'EN_CURSO'
  });

  const [isAddRotationOpen, setIsAddRotationOpen] = useState(false);
  const [rotationForm, setRotationForm] = useState<Partial<InternshipRotation>>({
    department: 'Seguridad y Medio Ambiente (HSE)',
    area_supervisor: 'Ing. Francisco Mabale',
    start_date: '2026-04-01',
    end_date: '2026-06-01',
    objectives: 'Evaluación de riesgos en plataforma'
  });

  const [isAddEvalOpen, setIsAddEvalOpen] = useState(false);
  const [evalForm, setEvalForm] = useState<Partial<InternshipEvaluation>>({
    evaluator_name: currentUserObj.name,
    evaluator_role: 'Supervisora Técnica MMH',
    evaluation_type: 'ROTACION',
    scores: {
      technical_competence: 5,
      punctuality_and_discipline: 5,
      teamwork: 4,
      adaptability: 4,
      overall_score: 90
    },
    comments: 'Candidato con excelente desempeño en pruebas técnicas.'
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState('');

  // Selected Item Modals
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<NationalizationPosition | null>(null);
  const [isEditTalentOpen, setIsEditTalentOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<TalentProfile>>({});

  // Matching State
  const [selectedMatchingPosition, setSelectedMatchingPosition] = useState<NationalizationPosition | null>(null);
  const [matchingResults, setMatchingResults] = useState<TalentMatchingResult[]>([]);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tList, eList, pList, planList, preList, intList] = await Promise.all([
          getTalentProfiles(),
          getExpatriateRecords(),
          getNationalizationPositions(),
          getTransferPlans(),
          getExpatriatePrenotifications(),
          getInternships()
        ]);
        setTalents(tList);
        setExpatriates(eList);
        setPositions(pList);
        setPlans(planList);
        setPrenotifications(preList);
        setInternships(intList);

        if (pList.length > 0) {
          setSelectedMatchingPosition(pList[0]);
        }
      } catch (err) {
        console.error('Error loading Nationalization data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered Talents
  const filteredTalents = useMemo(() => {
    return talents.filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = `${t.first_name} ${t.last_name}`.toLowerCase().includes(q);
        const matchesProf = t.profession.toLowerCase().includes(q);
        const matchesSpec = t.specialty.toLowerCase().includes(q);
        if (!matchesName && !matchesProf && !matchesSpec) return false;
      }
      if (selectedProvince && t.province !== selectedProvince) return false;
      if (selectedProfession && !t.profession.toLowerCase().includes(selectedProfession.toLowerCase())) return false;
      if (selectedVisibility && t.visibility !== selectedVisibility) return false;
      return true;
    });
  }, [talents, searchQuery, selectedProvince, selectedProfession, selectedVisibility]);

  // Execute Rule-Based Matching
  useEffect(() => {
    if (!selectedMatchingPosition || talents.length === 0) return;

    const reqs = {
      profession: selectedMatchingPosition.position_title,
      specialty: selectedMatchingPosition.department,
      minExperienceYears: 5
    };

    const results = talents.map(candidate => calculateRuleBasedMatching(candidate, reqs));
    results.sort((a, b) => b.compatibility_score - a.compatibility_score);
    setMatchingResults(results);
    setAiAnalysisResult(null);
  }, [selectedMatchingPosition, talents]);

  // Handle Save Talent Profile
  const handleSaveTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await saveTalentProfile(editingProfile, currentUserObj);
    const reloaded = await getTalentProfiles();
    setTalents(reloaded);
    setIsEditTalentOpen(false);
    setSelectedTalent(updated);
  };

  // Handle Status Update for Position Workflow
  const handleStatusChange = async (posId: string, newStatus: NationalizationWorkflowStatus) => {
    const updated = await updateNationalizationStatus(posId, newStatus, currentUserObj, `Estado actualizado desde portal institucional`);
    if (updated) {
      setPositions(prev => prev.map(p => p.id === posId ? updated : p));
      if (selectedPosition && selectedPosition.id === posId) {
        setSelectedPosition(updated);
      }
    }
  };

  // Pre-notification Handlers
  const handleCreatePrenotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenotForm.full_name || !prenotForm.proposed_position || !prenotForm.justification) return;
    const created = await createExpatriatePrenotification({
      company_id: 'comp-101',
      company_name: prenotForm.company_name || 'Noble Energy EG',
      full_name: prenotForm.full_name,
      nationality: prenotForm.nationality || 'Extranjera',
      origin_country: prenotForm.origin_country || 'Extranjero',
      profession: prenotForm.profession || 'Ingeniero Especialista',
      specialty: prenotForm.specialty || 'Operaciones Subsea',
      proposed_position: prenotForm.proposed_position,
      department: prenotForm.department || 'Operaciones',
      proposed_entry_date: prenotForm.proposed_entry_date || '2026-11-01',
      proposed_duration_months: prenotForm.proposed_duration_months || 36,
      is_key_position: !!prenotForm.is_key_position,
      justification: prenotForm.justification,
      related_national_candidate_id: prenotForm.related_national_candidate_id,
      related_national_candidate_name: prenotForm.related_national_candidate_name,
      status: (prenotForm.status as ExpatriatePrenotificationStatus) || 'ENVIADA',
      documents: [{ name: 'Justificación Técnica.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }]
    }, currentUserObj);

    const reloaded = await getExpatriatePrenotifications();
    setPrenotifications(reloaded);
    setIsNewPrenotOpen(false);
    setSelectedPrenot(created);
  };

  const handleUpdatePrenotStatus = async (prenotId: string, newStatus: ExpatriatePrenotificationStatus, comment?: string) => {
    const updated = await updateExpatriatePrenotificationStatus(prenotId, newStatus, currentUserObj, comment);
    const reloaded = await getExpatriatePrenotifications();
    setPrenotifications(reloaded);
    if (selectedPrenot && selectedPrenot.id === prenotId) {
      setSelectedPrenot(updated);
    }
  };

  // Internship Handlers
  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internshipForm.candidate_name || !internshipForm.program_name) return;
    const created = await createInternship({
      company_id: 'comp-101',
      company_name: internshipForm.company_name || 'Noble Energy EG',
      candidate_id: internshipForm.candidate_id || 'tp-101',
      candidate_name: internshipForm.candidate_name,
      mentor_name: internshipForm.mentor_name || 'Ing. Carlos Nsue',
      program_name: internshipForm.program_name,
      call_title: internshipForm.call_title || 'Prácticas en Yacimientos',
      start_date: internshipForm.start_date || '2026-04-01',
      end_date: internshipForm.end_date || '2026-10-01',
      objectives: internshipForm.objectives || 'Capacitación técnica y rotación operativa.',
      status: 'EN_CURSO',
      rotations: [],
      evaluations: []
    }, currentUserObj);

    const reloaded = await getInternships();
    setInternships(reloaded);
    setIsNewInternshipOpen(false);
    setSelectedInternship(created);
  };

  const handleAddRotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship || !rotationForm.department) return;
    await addInternshipRotation(selectedInternship.id, {
      department: rotationForm.department,
      area_supervisor: rotationForm.area_supervisor || 'Supervisor Técnico',
      start_date: rotationForm.start_date || '2026-04-01',
      end_date: rotationForm.end_date || '2026-06-01',
      objectives: rotationForm.objectives || 'Evaluación de competencias',
      status: 'EN_CURSO'
    }, currentUserObj);

    const reloaded = await getInternships();
    setInternships(reloaded);
    const updatedSelected = reloaded.find(i => i.id === selectedInternship.id);
    if (updatedSelected) setSelectedInternship(updatedSelected);
    setIsAddRotationOpen(false);
  };

  const handleAddEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;
    await addInternshipEvaluation(selectedInternship.id, {
      evaluator_name: evalForm.evaluator_name || currentUserObj.name,
      evaluator_role: evalForm.evaluator_role || 'Supervisora MMH',
      evaluation_date: new Date().toISOString().split('T')[0],
      evaluation_type: evalForm.evaluation_type || 'ROTACION',
      scores: evalForm.scores || { technical_competence: 5, punctuality_and_discipline: 5, teamwork: 4, adaptability: 4, overall_score: 90 },
      comments: evalForm.comments || 'Evaluación registrada en sistema.'
    }, currentUserObj);

    const reloaded = await getInternships();
    setInternships(reloaded);
    const updatedSelected = reloaded.find(i => i.id === selectedInternship.id);
    if (updatedSelected) setSelectedInternship(updatedSelected);
    setIsAddEvalOpen(false);
  };

  const handleFinalizeInternship = async (internshipId: string, result: 'EXCELENTE' | 'SATISFACTORIO' | 'NECESITA_REFORZAMIENTO', rec: 'INCORPORACION_INMEDIATA' | 'FORMACION_ADICIONAL') => {
    await updateInternshipStatus(internshipId, 'COMPLETADA', result, rec, currentUserObj);
    const reloaded = await getInternships();
    setInternships(reloaded);
    const updatedSelected = reloaded.find(i => i.id === internshipId);
    if (updatedSelected) setSelectedInternship(updatedSelected);
  };

  if (!canView) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl shadow border border-slate-200 dark:border-slate-800 my-8">
        <Lock className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Acceso Restringido</h2>
        <p className="text-slate-500 text-sm mt-2">No dispone de los permisos requeridos (`nationalization.view`) para consultar este módulo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Institucional */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-900/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ministerio de Minas e Hidrocarburos
              </span>
              <span className="text-xs text-slate-300 font-medium">República de Guinea Ecuatorial</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Nacionalización y Talento Nacional
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Plataforma institucional de seguimiento al reemplazo de personal expatriado, registro de profesionales ecuatoguineanos y planes de transferencia de conocimiento.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setEditingProfile({});
                setIsEditTalentOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Registrar Profesional
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-medium">
          {[
            { id: 'dashboard', label: 'Dashboard Institucional', icon: BarChart2 },
            { id: 'prenotificaciones', label: 'Pre-notificaciones Expatriados', icon: ClipboardList, badge: prenotifications.length },
            { id: 'talento', label: 'Talento Nacional', icon: Users, badge: talents.length },
            { id: 'expatriados', label: 'Personal Expatriado', icon: Globe, badge: expatriates.length },
            { id: 'pasantias', label: 'Pasantías y Rotaciones', icon: Layers, badge: internships.length },
            { id: 'posiciones', label: 'Posiciones y Procesos', icon: FileCheck, badge: positions.length },
            { id: 'planes', label: 'Planes de Transferencia', icon: TrendingUp, badge: plans.length },
            { id: 'matching', label: 'Matching & Asistente IA', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DASHBOARD INSTITUCIONAL */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talento Nacional</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{talents.length}</h3>
                <p className="text-[9px] text-emerald-600 font-semibold">100% Verificados</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expatriados</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{expatriates.length}</h3>
                <p className="text-[9px] text-amber-600 font-semibold">Sujetos a Reemplazo</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pre-notificaciones</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{prenotifications.length}</h3>
                <p className="text-[9px] text-purple-600 font-semibold">Revisión Previa</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pasantías</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{internships.length}</h3>
                <p className="text-[9px] text-teal-600 font-semibold">Rotaciones Activas</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posiciones</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{positions.length}</h3>
                <p className="text-[9px] text-indigo-600 font-semibold">En Proceso</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Planes Activos</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{plans.length}</h3>
                <p className="text-[9px] text-emerald-600 font-semibold">Transferencia</p>
              </div>
            </div>
          </div>

          {/* List of Pending Processes requiring Minister/Officer attention */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Procesos Pendientes de Atención
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Expedientes de nacionalización y candidatos identificados que requieren revisión del Ministerio.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full">
                {positions.filter(p => p.status !== 'APROBADO' && p.status !== 'CERRADO').length} Pendientes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 uppercase text-[10px] font-black text-slate-400">
                  <tr>
                    <th className="p-3">Posición / Puesto</th>
                    <th className="p-3">Empresa Operadora</th>
                    <th className="p-3">Candidato Nacional</th>
                    <th className="p-3">Estado Actual</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {positions.map(pos => (
                    <tr key={pos.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {pos.position_title}
                        <div className="text-[10px] text-slate-400 font-normal">{pos.department}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{pos.company_name}</td>
                      <td className="p-3">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {pos.identified_candidate_name || 'Sin asignar'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {pos.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          pos.priority === 'Alta' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {pos.priority}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedPosition(pos);
                            setActiveTab('posiciones');
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                        >
                          Ver Expediente
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB PRE-NOTIFICACIONES DE EXPATRIADOS */}
      {activeTab === 'prenotificaciones' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                Pre-notificaciones Formales de Expatriados
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tratamiento regulatorio previo para la aprobación de contratación e incorporación física de personal extranjero.
              </p>
            </div>
            <button
              onClick={() => setIsNewPrenotOpen(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nueva Pre-notificación
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 flex justify-between items-center">
                <span>Listado de Pre-notificaciones ({prenotifications.length})</span>
                <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">Proceso Regulatorio MMH</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {prenotifications.map(p => {
                  const isSelected = selectedPrenot?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPrenot(p)}
                      className={`p-4 transition cursor-pointer flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        isSelected ? 'bg-purple-50/50 dark:bg-purple-950/20 border-l-4 border-purple-600' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.full_name}</h4>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded">
                            {p.nationality} ({p.origin_country})
                          </span>
                          {p.is_key_position && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black px-2 py-0.5 rounded">
                              Puesto Relevante
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {p.proposed_position} — <span className="font-semibold text-slate-800 dark:text-slate-200">{p.company_name}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-3">
                          <span>Entrada Prevista: <strong className="text-slate-700 dark:text-slate-300">{p.proposed_entry_date}</strong></span>
                          <span>Duración: <strong className="text-slate-700 dark:text-slate-300">{p.proposed_duration_months} meses</strong></span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === 'APROBADA' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          p.status === 'RECHAZADA' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          p.status === 'EN_REVISION' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {p.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Prenotification Detail Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              {selectedPrenot ? (
                <>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Expediente Pre-notificación</span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedPrenot.full_name}</h3>
                      <p className="text-xs text-slate-500">{selectedPrenot.company_name}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                      {selectedPrenot.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block">Puesto Propuesto:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedPrenot.proposed_position} ({selectedPrenot.department})</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block">Justificación Técnica de la Empresa:</span>
                      <p className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 italic text-[11px] mt-1 border border-slate-200/60 dark:border-slate-700">
                        "{selectedPrenot.justification}"
                      </p>
                    </div>

                    {selectedPrenot.related_national_candidate_name && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-900">
                        <span className="text-[10px] font-bold uppercase text-blue-600 block">Candidato Sombra Propuesto:</span>
                        <p className="font-bold text-blue-900 dark:text-blue-200 text-xs">{selectedPrenot.related_national_candidate_name}</p>
                      </div>
                    )}

                    {/* Ministry Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Resolución Ministerial / Acción:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleUpdatePrenotStatus(selectedPrenot.id, 'APROBADA', 'Aprobada tras verificación técnica de requisitos')}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-[11px]"
                        >
                          Aprobar Solicitud
                        </button>
                        <button
                          onClick={() => handleUpdatePrenotStatus(selectedPrenot.id, 'SOLICITUD_DE_INFORMACION', 'Se requiere ampliar información técnica del candidato')}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition text-[11px]"
                        >
                          Pedir Info
                        </button>
                        <button
                          onClick={() => handleUpdatePrenotStatus(selectedPrenot.id, 'EN_REVISION', 'Expediente en análisis por el Cuerpo Técnico')}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-[11px]"
                        >
                          En Revisión
                        </button>
                        <button
                          onClick={() => handleUpdatePrenotStatus(selectedPrenot.id, 'RECHAZADA', 'Rechazada por disponibilidad de talento nacional capacitado')}
                          className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition text-[11px]"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <ClipboardList className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p>Seleccione una pre-notificación para revisar detalles y resolución ministerial.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB PASANTÍAS Y ROTACIONES */}
      {activeTab === 'pasantias' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600" />
                Programa de Pasantías, Rotaciones y Evaluaciones
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Seguimiento estructurado al aprendizaje en empresa, rotación por direcciones y evaluación final para la captación del talento nacional.
              </p>
            </div>
            <button
              onClick={() => setIsNewInternshipOpen(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Crear Programa / Pasantía
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {internships.map(i => {
                const isSelected = selectedInternship?.id === i.id;
                return (
                  <div
                    key={i.id}
                    onClick={() => setSelectedInternship(i)}
                    className={`p-5 rounded-2xl border transition cursor-pointer bg-white dark:bg-slate-900 ${
                      isSelected ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-600">{i.company_name}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{i.program_name}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Pasante: <strong className="text-slate-900 dark:text-white">{i.candidate_name}</strong> | Tutor: <strong className="text-slate-700 dark:text-slate-300">{i.mentor_name || 'Por asignar'}</strong>
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-black rounded-full uppercase">
                        {i.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{i.objectives}</p>

                    {/* Rotations Timeline Preview */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <span>Rotaciones por Áreas Operativas ({i.rotations?.length || 0})</span>
                        <span className="text-teal-600 cursor-pointer hover:underline flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setSelectedInternship(i); setIsAddRotationOpen(true); }}>
                          <PlusCircle className="w-3.5 h-3.5" /> Añadir Rotación
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {i.rotations && i.rotations.map((r, idx) => (
                          <div key={r.id || idx} className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                            <span className="font-bold text-slate-900 dark:text-white block truncate">{r.department}</span>
                            <span className="text-slate-400 text-[10px] block">{r.start_date} al {r.end_date}</span>
                            {r.performance_score ? (
                              <span className="text-emerald-600 font-bold text-[10px] mt-1 block">Nota: {r.performance_score}/100</span>
                            ) : (
                              <span className="text-amber-500 font-medium text-[10px] mt-1 block">En Curso</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Internship Detail Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              {selectedInternship ? (
                <>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Detalle del Programa</span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedInternship.candidate_name}</h3>
                      <p className="text-xs text-slate-500">{selectedInternship.company_name}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded">
                      {selectedInternship.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block">Fechas del Programa:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedInternship.start_date} al {selectedInternship.end_date}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Evaluaciones Registradas:</span>
                      <button
                        onClick={() => setIsAddEvalOpen(true)}
                        className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] rounded-lg transition"
                      >
                        + Evaluaciones
                      </button>
                    </div>

                    {selectedInternship.evaluations && selectedInternship.evaluations.length > 0 ? (
                      <div className="space-y-2">
                        {selectedInternship.evaluations.map(e => (
                          <div key={e.id} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                              <span>{e.evaluation_type} — {e.evaluator_name}</span>
                              <span className="text-emerald-600 font-black">{e.scores.overall_score}/100</span>
                            </div>
                            <p className="text-slate-500 text-[10px] mt-0.5">"{e.comments}"</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No hay evaluaciones registradas aún.</p>
                    )}

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Resultado e Incorporación:</span>
                      <button
                        onClick={() => handleFinalizeInternship(selectedInternship.id, 'EXCELENTE', 'INCORPORACION_INMEDIATA')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs shadow-sm"
                      >
                        Completar Pasantía e Incorporar Candidato
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p>Seleccione un programa de pasantía para auditar sus rotaciones y evaluaciones.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TALENTO NACIONAL (REGISTRO Y PERFILES) */}
      {activeTab === 'talento' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre, profesión, especialidad..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="">Todas las Provincias</option>
                <option value="Bioko Norte">Bioko Norte</option>
                <option value="Litoral">Litoral (Bata)</option>
                <option value="Kie-Ntem">Kie-Ntem</option>
                <option value="Centro Sur">Centro Sur</option>
              </select>

              <select
                value={selectedVisibility}
                onChange={e => setSelectedVisibility(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="">Cualquier Visibilidad</option>
                <option value="PRIVADO">Privado</option>
                <option value="MINISTERIO">Solo Ministerio</option>
                <option value="EMPRESAS_AUTORIZADAS">Empresas Autorizadas</option>
              </select>

              {(searchQuery || selectedProvince || selectedVisibility) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProvince('');
                    setSelectedVisibility('');
                  }}
                  className="px-3 py-2 text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTalents.map(talent => (
              <div
                key={talent.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={talent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={talent.first_name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {talent.first_name} {talent.last_name}
                        </h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{talent.profession}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      talent.visibility === 'PRIVADO' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {talent.visibility}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                    {talent.specialty}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{talent.experience_years} años de experiencia ({talent.professional_level})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{talent.locality}, {talent.province}</span>
                    </div>
                  </div>

                  {/* Profile Completeness Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>PERFIL COMPLETADO</span>
                      <span className="text-blue-600 dark:text-blue-400">{talent.completeness_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full" 
                        style={{ width: `${talent.completeness_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTalent(talent)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Ficha Completa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PERSONAL EXPATRIADO */}
      {activeTab === 'expatriados' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-500" />
                Registro de Personal Expatriado en Operadoras
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Puestos ocupados por profesionales extranjeros en empresas petroleras y contratistas sujetas al Contenido Nacional.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 uppercase text-[10px] font-black text-slate-400">
                <tr>
                  <th className="p-3">Nombre / Expatriado</th>
                  <th className="p-3">Nacionalidad</th>
                  <th className="p-3">Empresa Operadora</th>
                  <th className="p-3">Posición / Puesto</th>
                  <th className="p-3">Factibilidad Reemplazo</th>
                  <th className="p-3">Sombra Local Asignada</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expatriates.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{exp.full_name}</td>
                    <td className="p-3 font-medium">{exp.nationality} ({exp.origin_country})</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{exp.company_name}</td>
                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">{exp.position}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        exp.nationalization_possibility === 'Alta' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {exp.nationalization_possibility}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {exp.assigned_shadow_name || 'No asignado'}
                    </td>
                    <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">{exp.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: POSICIONES Y WORKFLOW DE ESTADOS */}
      {activeTab === 'posiciones' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Posiciones Sujetas a Plan de Nacionalización
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Matriz de control ministerial para seguimiento del reemplazo progresivo de expatriados por cuadros nacionales.
            </p>

            <div className="space-y-4">
              {positions.map(pos => (
                <div key={pos.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{pos.position_title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {pos.company_name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ocupante Actual: <strong className="text-slate-700 dark:text-slate-300">{pos.occupant_name} ({pos.occupant_type})</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Candidato Nacional Identificado: <strong className="text-emerald-600 dark:text-emerald-400">{pos.identified_candidate_name || 'Pendiente de asignación'}</strong>
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Estado del Workflow</span>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {pos.status.replace('_', ' ')}
                      </span>
                    </div>

                    {canApprove && (
                      <select
                        value={pos.status}
                        onChange={e => handleStatusChange(pos.id, e.target.value as any)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="REGISTRADO">1. REGISTRADO</option>
                        <option value="EN_REVISION">2. EN REVISIÓN</option>
                        <option value="EVALUACION">3. EVALUACIÓN</option>
                        <option value="CANDIDATO_IDENTIFICADO">4. CANDIDATO IDENTIFICADO</option>
                        <option value="PLAN_TRANSFERENCIA">5. PLAN TRANSFERENCIA</option>
                        <option value="FORMACION">6. FORMACIÓN</option>
                        <option value="PROPUESTA_NACIONALIZACION">7. PROPUESTA NACIONALIZACIÓN</option>
                        <option value="APROBADO">8. APROBADO (FIRMA MINISTERIAL)</option>
                        <option value="NACIONALIZADO">9. NACIONALIZADO</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PLANES DE TRANSFERENCIA */}
      {activeTab === 'planes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Planes de Transferencia de Conocimiento y Matriz de Competencias
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Evaluación periódica de la brecha de competencias (Skill Gaps) entre el personal mentor expatriado y la sombra nacional.
            </p>
          </div>

          {plans.map(plan => (
            <div key={plan.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{plan.position_title}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{plan.company_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Progreso Global: </span>
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">{plan.progress_percentage}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Mentor Expatriado</span>
                  <span className="font-semibold">{plan.expatriate_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Candidato Nacional (Sombra)</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">{plan.local_candidate_name}</span>
                </div>
              </div>

              {/* Competencies Gap Matrix */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider text-[10px] text-slate-400">
                  Matriz de Brecha de Competencias (Skill Gap Matrix) & Vinculación con Centros de Formación
                </span>
                {plan.competencies.map((c, idx) => {
                  const levelNames = ['', 'Básico', 'Inicial', 'Intermedio', 'Avanzado', 'Experto'];
                  return (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span className="text-slate-900 dark:text-white font-extrabold">{c.competency}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500">
                            Requerido: {c.required_level}/5 ({levelNames[c.required_level]}) | Actual: {c.current_level}/5 ({levelNames[c.current_level]})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            c.gap === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Brecha: {c.gap}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">{c.action_plan}</p>
                      {c.recommended_course && (
                        <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            Curso Recomendado: {c.recommended_course}
                          </span>
                          <span className="text-slate-500 font-semibold flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            Centro: {c.recommended_centre}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: MATCHING ESTIMADO Y ASISTENTE IA */}
      {activeTab === 'matching' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Motor de Matching Estimado & Asistente IA MMH
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algoritmo transparente basado en reglas para evaluar el porcentaje de compatibilidad de profesionales nacionales con vacantes y posiciones.
                </p>
              </div>

              {/* Position selector for matching */}
              <select
                value={selectedMatchingPosition?.id || ''}
                onChange={e => {
                  const p = positions.find(pos => pos.id === e.target.value);
                  if (p) setSelectedMatchingPosition(p);
                }}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer"
              >
                {positions.map(p => (
                  <option key={p.id} value={p.id}>{p.position_title} ({p.company_name})</option>
                ))}
              </select>
            </div>

            {selectedMatchingPosition && (
              <div className="bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-extrabold text-blue-900 dark:text-blue-300 mb-1">
                  Requerimientos Evaluados para: {selectedMatchingPosition.position_title}
                </p>
                <p>Empresa: <strong>{selectedMatchingPosition.company_name}</strong> | Departamento: <strong>{selectedMatchingPosition.department}</strong></p>
              </div>
            )}

            {/* Results Grid */}
            <div className="space-y-3 pt-2">
              {matchingResults.map(res => (
                <div key={res.candidate_id} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{res.candidate_name}</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">({res.profession})</span>
                    </div>
                    <p className="text-xs text-slate-500">{res.explanation}</p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Compatibilidad Estimada</span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{res.compatibility_score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FICHA DETALLADA DEL PROFESIONAL */}
      {selectedTalent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTalent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={selectedTalent.first_name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedTalent.first_name} {selectedTalent.last_name}
                  </h2>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{selectedTalent.profession}</p>
                  <p className="text-xs text-slate-500">{selectedTalent.locality}, {selectedTalent.province} ({selectedTalent.nationality})</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTalent(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Sections */}
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white mb-1 uppercase text-[10px] text-slate-400">Especialidad & Experiencia</h3>
                <p className="font-medium text-slate-800 dark:text-slate-200">{selectedTalent.specialty}</p>
                <p className="text-slate-500 mt-0.5">{selectedTalent.experience_years} años de experiencia profesional ({selectedTalent.professional_level})</p>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white mb-1 uppercase text-[10px] text-slate-400">Formación Académica</h3>
                {selectedTalent.education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl mb-1.5">
                    <p className="font-bold text-slate-900 dark:text-white">{edu.degree}</p>
                    <p className="text-slate-500">{edu.institution} ({edu.graduation_year})</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white mb-1 uppercase text-[10px] text-slate-400">Certificaciones Sectoriales</h3>
                {selectedTalent.certifications.map((cert, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl mb-1.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{cert.title}</p>
                      <p className="text-slate-500">{cert.institution}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-full">Vigente</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTalent(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRO / EDICIÓN DE PROFESIONAL */}
      {isEditTalentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registrar Profesional Nacional</h2>
              <button onClick={() => setIsEditTalentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTalent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={editingProfile.first_name || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, first_name: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Apellidos</label>
                  <input
                    type="text"
                    required
                    value={editingProfile.last_name || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, last_name: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Profesión Principal</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ingeniero de Petróleos, Técnico HSE, Geólogo"
                  value={editingProfile.profession || ''}
                  onChange={e => setEditingProfile({ ...editingProfile, profession: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Especialidad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Perforación Offshore, Yacimientos"
                  value={editingProfile.specialty || ''}
                  onChange={e => setEditingProfile({ ...editingProfile, specialty: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Años Experiencia</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProfile.experience_years ?? 5}
                    onChange={e => setEditingProfile({ ...editingProfile, experience_years: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Provincia</label>
                  <select
                    value={editingProfile.province || 'Bioko Norte'}
                    onChange={e => setEditingProfile({ ...editingProfile, province: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="Bioko Norte">Bioko Norte</option>
                    <option value="Litoral">Litoral (Bata)</option>
                    <option value="Kie-Ntem">Kie-Ntem</option>
                    <option value="Centro Sur">Centro Sur</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditTalentOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA PRE-NOTIFICACIÓN DE EXPATRIADO */}
      {isNewPrenotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nueva Pre-notificación de Expatriado</h2>
              <button onClick={() => setIsNewPrenotOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrenotification} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre Completo del Expatriado</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Jean-Luc Godard"
                  value={prenotForm.full_name || ''}
                  onChange={e => setPrenotForm({ ...prenotForm, full_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nacionalidad</label>
                  <input
                    type="text"
                    required
                    value={prenotForm.nationality || ''}
                    onChange={e => setPrenotForm({ ...prenotForm, nationality: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">País de Origen</label>
                  <input
                    type="text"
                    required
                    value={prenotForm.origin_country || ''}
                    onChange={e => setPrenotForm({ ...prenotForm, origin_country: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Puesto Propuesto</label>
                  <input
                    type="text"
                    required
                    placeholder="Superintendente / Ingeniero"
                    value={prenotForm.proposed_position || ''}
                    onChange={e => setPrenotForm({ ...prenotForm, proposed_position: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Empresa Operadora</label>
                  <input
                    type="text"
                    required
                    value={prenotForm.company_name || 'Noble Energy EG'}
                    onChange={e => setPrenotForm({ ...prenotForm, company_name: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Justificación Técnica de la Necesidad</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explique la necesidad de incorporar personal expatriado para esta función especifica..."
                  value={prenotForm.justification || ''}
                  onChange={e => setPrenotForm({ ...prenotForm, justification: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="key_pos"
                  checked={!!prenotForm.is_key_position}
                  onChange={e => setPrenotForm({ ...prenotForm, is_key_position: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="key_pos" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Marcar como Puesto de Relevancia Estratégica (Ley de Contenido Nacional)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPrenotOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Enviar Pre-notificación al MMH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREAR PROGRAMA DE PASANTÍA */}
      {isNewInternshipOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Crear Programa de Pasantía / Prácticas</h2>
              <button onClick={() => setIsNewInternshipOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInternship} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre del Candidato / Pasante</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Santiago Obama Mangue"
                  value={internshipForm.candidate_name || ''}
                  onChange={e => setInternshipForm({ ...internshipForm, candidate_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre del Programa / Convocatoria</label>
                <input
                  type="text"
                  required
                  placeholder="Programa de Excelencia para Jóvenes Ingenieros 2026"
                  value={internshipForm.program_name || ''}
                  onChange={e => setInternshipForm({ ...internshipForm, program_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={internshipForm.start_date || '2026-04-01'}
                    onChange={e => setInternshipForm({ ...internshipForm, start_date: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fecha Finalización</label>
                  <input
                    type="date"
                    required
                    value={internshipForm.end_date || '2026-10-01'}
                    onChange={e => setInternshipForm({ ...internshipForm, end_date: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tutor / Mentor Designado</label>
                <input
                  type="text"
                  required
                  placeholder="Ing. Carlos Nsue (Noble Energy)"
                  value={internshipForm.mentor_name || ''}
                  onChange={e => setInternshipForm({ ...internshipForm, mentor_name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Objetivos de Aprendizaje</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describa los objetivos pedagógicos y operativos del programa..."
                  value={internshipForm.objectives || ''}
                  onChange={e => setInternshipForm({ ...internshipForm, objectives: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInternshipOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
                >
                  Registrar Pasantía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
