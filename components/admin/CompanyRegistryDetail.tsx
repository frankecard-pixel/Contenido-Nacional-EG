import React, { useState, useEffect } from 'react';
import { Company, User, CompanyService, WorkflowTransition } from '../../types';
import { getCompanyServices, verifyCompanyWorkflow, verifyCompanyService } from '../../services/localBusinessService';
import { getWorkflowHistory } from '../../services/workflowService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface CompanyRegistryDetailProps {
  selectedCompany: Company;
  setSelectedCompanyId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  getStatusBadge: (status: Company['status']) => React.ReactNode;
  users?: User[];
  onLinkUser?: (userId: string, companyId: string | null) => void;
  onUpdateStatus?: (companyId: string, status: Company['status']) => void;
}

const CompanyRegistryDetail: React.FC<CompanyRegistryDetailProps> = ({
  selectedCompany,
  setSelectedCompanyId,
  activeTab,
  setActiveTab,
  getStatusBadge,
  users = [],
  onLinkUser,
  onUpdateStatus
}) => {
  const { user: authUser } = useAuth();
  const [selectedUserIdToLink, setSelectedUserIdToLink] = useState('');
  const [services, setServices] = useState<CompanyService[]>([]);
  const [history, setHistory] = useState<WorkflowTransition[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Verification modal state
  const [isDictamenModalOpen, setIsDictamenModalOpen] = useState(false);
  const [dictamenTargetState, setDictamenTargetState] = useState<'VERIFICADA' | 'ACTIVA' | 'SOLICITUD_INFORMACION' | 'SUSPENDIDA' | 'RECHAZADA'>('VERIFICADA');
  const [dictamenNotes, setDictamenNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUserObj: User = {
    id: authUser?.id || 'u-minister-admin',
    email: authUser?.email || 'admin@mmh.gob.gq',
    name: authUser?.user_metadata?.full_name || 'Dirección General de Contenido Nacional',
    role: (authUser as any)?.role || 'admin',
    isOnline: true,
    permissions: ['*']
  };

  useEffect(() => {
    const loadCompanyData = async () => {
      setLoadingDetails(true);
      try {
        const [svcs, hist] = await Promise.all([
          getCompanyServices(selectedCompany.id),
          getWorkflowHistory(selectedCompany.id, 'company')
        ]);
        setServices(svcs);
        setHistory(hist);
      } catch (e) {
        console.warn('Error loading company registry details:', e);
      } finally {
        setLoadingDetails(false);
      }
    };
    loadCompanyData();
  }, [selectedCompany.id]);

  const companyUsers = React.useMemo(() => {
    return (users || []).filter(u => u.companyId === selectedCompany.id);
  }, [users, selectedCompany.id]);

  const availableUsersToLink = React.useMemo(() => {
    return (users || []).filter(u => u.companyId !== selectedCompany.id);
  }, [users, selectedCompany.id]);

  const handleOpenDictamen = (state: 'VERIFICADA' | 'ACTIVA' | 'SOLICITUD_INFORMACION' | 'SUSPENDIDA' | 'RECHAZADA') => {
    setDictamenTargetState(state);
    setDictamenNotes('');
    setIsDictamenModalOpen(true);
  };

  const handleExecuteDictamen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dictamenNotes.trim()) {
      toast.error('Debe ingresar las observaciones y fundamento del dictamen ministerial.');
      return;
    }

    setIsProcessing(true);
    try {
      await verifyCompanyWorkflow({
        companyId: selectedCompany.id,
        fromState: selectedCompany.status.toUpperCase(),
        toState: dictamenTargetState,
        user: currentUserObj,
        notes: dictamenNotes,
        isLocalContentCertified: dictamenTargetState === 'ACTIVA' || dictamenTargetState === 'VERIFICADA'
      });

      let mappedStatus: Company['status'] = 'pending';
      if (dictamenTargetState === 'ACTIVA' || dictamenTargetState === 'VERIFICADA') mappedStatus = 'certified';
      if (dictamenTargetState === 'SUSPENDIDA') mappedStatus = 'suspended';
      if (dictamenTargetState === 'RECHAZADA') mappedStatus = 'rejected';

      if (onUpdateStatus) {
        onUpdateStatus(selectedCompany.id, mappedStatus);
      }

      toast.success(`Dictamen ministerial ejecutado: Estado ${dictamenTargetState}.`);
      setIsDictamenModalOpen(false);

      // Refresh history
      const hist = await getWorkflowHistory(selectedCompany.id, 'company');
      setHistory(hist);
    } catch (err) {
      console.error(err);
      toast.error('Error al ejecutar el dictamen');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyServiceItem = async (serviceId: string, status: 'verificado' | 'rechazado') => {
    try {
      await verifyCompanyService(serviceId, status, currentUserObj);
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, verification_status: status } : s));
      toast.success(`Capacidad técnica actualizada a: ${status}.`);
    } catch (e) {
      console.error(e);
      toast.error('Error al actualizar servicio');
    }
  };

  return (
    <aside className="fixed inset-y-0 right-0 w-full md:w-[540px] bg-white dark:bg-slate-900 shadow-2xl z-[100] flex flex-col border-l border-slate-100 dark:border-slate-800 animate-in slide-in-from-right duration-500">
      <header className="p-8 border-b border-slate-50 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="size-16 rounded-[1.25rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-3 shadow-inner">
            <span className="text-2xl font-black text-primary">{selectedCompany.name?.substring(0, 2).toUpperCase() || '??'}</span>
          </div>
          <button 
            onClick={() => setSelectedCompanyId(null)}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{selectedCompany.name}</h2>
            <span className="material-symbols-outlined text-blue-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            RUGE: {selectedCompany.rugeId} • NIF: {selectedCompany.taxId} • Tipo: {selectedCompany.type === 'local' ? 'Empresa Local' : 'Internacional'}
          </p>
          <div className="flex items-center gap-3">
            {getStatusBadge(selectedCompany.status)}
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-primary dark:bg-primary/20">
              Contenido Nacional: {selectedCompany.complianceScore || 0}%
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex px-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900 overflow-x-auto no-scrollbar">
        {['Perfil', 'Capacidades', 'Historial', 'Equipo'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 shrink-0 ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab === 'Capacidades' ? `Capacidades (${services.length})` : tab === 'Historial' ? `Historial (${history.length})` : tab}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
        {/* PERFIL */}
        {activeTab === 'Perfil' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 gap-4 text-xs">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase">Razón Social</span>
                <p className="font-bold text-slate-900 dark:text-white uppercase">{selectedCompany.legalRepresentative?.name ? `${selectedCompany.name} S.A.` : selectedCompany.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Provincia / Región</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedCompany.province || 'Bioko Norte'} ({selectedCompany.city || 'Malabo'})</p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Técnicos Nacionales</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedCompany.technicalStaffCount || selectedCompany.nationalEmployeeCount || 0} profesionales</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase">Dirección Física</span>
                <p className="font-bold text-slate-900 dark:text-white uppercase">{selectedCompany.address || 'No registrada'}</p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase">Resumen de Capacidad Técnica</span>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {selectedCompany.technicalCapacitySummary || 'Empresa local homologada con capacidad de soporte operativo e industrial.'}
                </p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase">Instalaciones y Equipamiento</span>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {selectedCompany.facilitiesEquipment || 'Almacenes y logística terrestre en Guinea Ecuatorial.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CAPACIDADES / SERVICIOS */}
        {activeTab === 'Capacidades' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Servicios y Capacidades Declaradas
            </h4>

            {services.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">La empresa no ha catalogado servicios técnicos todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map(svc => (
                  <div key={svc.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-black text-primary uppercase">{svc.category}</span>
                        <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase">{svc.service_name}</h5>
                        <p className="text-[10px] text-slate-500">{svc.technical_description}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        svc.verification_status === 'verificado'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {svc.verification_status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Experiencia: {svc.experience_years} años</span>
                      {svc.verification_status !== 'verificado' && (
                        <button
                          type="button"
                          onClick={() => handleVerifyServiceItem(svc.id, 'verificado')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase transition-colors"
                        >
                          Acreditar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HISTORIAL / AUDITORÍA */}
        {activeTab === 'Historial' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Trazabilidad de Estados y Dictámenes (Workflow)
            </h4>

            {history.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Sin transiciones de estado registradas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-primary">
                        {item.from_state} → {item.to_state}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.comment}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase pt-1">
                      Por: {item.user_name} ({item.user_role})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EQUIPO */}
        {activeTab === 'Equipo' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Usuarios Asignados a la Empresa ({companyUsers.length})
            </h4>

            <div className="space-y-2">
              {companyUsers.map(u => (
                <div key={u.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">{u.name}</p>
                    <p className="text-[10px] text-slate-400">{u.email} • {u.position || 'Representante'}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS: DICTAMEN MINISTERIAL */}
      <footer className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 sticky bottom-0 z-10 space-y-3">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block text-center">
          Mesa de Dictamen Ministerial • Ley de Contenido Nacional
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => handleOpenDictamen('SOLICITUD_INFORMACION')}
            className="py-3 px-2 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-amber-100 transition-colors"
          >
            Solicitar Información
          </button>
          <button 
            type="button"
            onClick={() => handleOpenDictamen('SUSPENDIDA')}
            className="py-3 px-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-red-100 transition-colors"
          >
            Suspender Registro
          </button>
        </div>
        <button 
          type="button"
          onClick={() => handleOpenDictamen('VERIFICADA')}
          className="w-full py-3.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:bg-blue-600 active:scale-95 transition-all"
        >
          Dictaminar Aprobación / Verificación RUGE
        </button>
      </footer>

      {/* DICTAMEN MINISTERIAL MODAL */}
      {isDictamenModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleExecuteDictamen} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Mesa Ministerial de Control</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Dictamen: {dictamenTargetState}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Expediente de la empresa: <strong>{selectedCompany.name}</strong> ({selectedCompany.rugeId})
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Observaciones y Fundamento Técnico-Legal *
              </label>
              <textarea
                required
                rows={4}
                value={dictamenNotes}
                onChange={(e) => setDictamenNotes(e.target.value)}
                placeholder="Indique las bases de la resolución, documentación inspeccionada o motivos..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDictamenModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50"
              >
                {isProcessing ? 'Procesando...' : 'Emitir Dictamen'}
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};

export default CompanyRegistryDetail;
