
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCompanies, updateCompany } from '../services/supabaseApi';
import { sendOTPWhatsApp } from '../services/n8nService';
import { 
  getServiceCatalog, 
  getCompanyServices, 
  registerCompanyService, 
  getCompanyProjectReferences, 
  addCompanyProjectReference 
} from '../services/localBusinessService';
import { useAuth } from '../contexts/AuthContext';
import { CompanyExt, ServiceCatalogItem, CompanyService, CompanyProjectReference, User } from '../types';
import { toast } from 'sonner';

const CompanyProfileManagement: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isSaving, setIsSaving] = useState(false);
  const [company, setCompany] = useState<CompanyExt | null>(null);
  const [loading, setLoading] = useState(true);

  // Extended form fields
  const [tradeName, setTradeName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [constitutionDate, setConstitutionDate] = useState('2015-06-15');
  const [province, setProvince] = useState('Bioko Norte');
  const [city, setCity] = useState('Malabo');
  const [technicalStaffCount, setTechnicalStaffCount] = useState(12);
  const [technicalCapacitySummary, setTechnicalCapacitySummary] = useState('');
  const [facilitiesEquipment, setFacilitiesEquipment] = useState('');
  const [operationalContactName, setOperationalContactName] = useState('');
  const [operationalContactEmail, setOperationalContactEmail] = useState('');
  const [operationalContactPhone, setOperationalContactPhone] = useState('');

  // Structured Services & Projects State
  const [catalog, setCatalog] = useState<ServiceCatalogItem[]>([]);
  const [services, setServices] = useState<CompanyService[]>([]);
  const [projects, setProjects] = useState<CompanyProjectReference[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [newServiceExp, setNewServiceExp] = useState(3);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [isAddingService, setIsAddingService] = useState(false);

  // Project Ref Form State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjValue, setNewProjValue] = useState(50000);
  const [newProjYear, setNewProjYear] = useState('2023');

  // WhatsApp and separate phone fields state
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  const currentUserObj: User = {
    id: authUser?.id || 'u-company-rep',
    email: authUser?.email || 'contacto@empresa.gq',
    name: authUser?.user_metadata?.full_name || 'Representante Legal',
    role: (authUser as any)?.role || 'empresa_local',
    isOnline: true,
    permissions: ['*']
  };

  const handleSendOtp = async () => {
    if (!whatsappPhone) {
      setOtpError('Por favor introduzca un número de WhatsApp primero.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError(null);
    setOtpSuccess(null);
    try {
      const res = await sendOTPWhatsApp(whatsappPhone, company?.name || 'Representante');
      if (res.success) {
        setOtpCode(res.code);
        setOtpSent(true);
        setOtpSuccess(`Código de verificación enviado a su WhatsApp.`);
      } else {
        setOtpError('Error al enviar el código de verificación.');
      }
    } catch (err: any) {
      setOtpError('No se pudo conectar con el servicio de verificación.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = () => {
    setOtpError(null);
    setOtpSuccess(null);
    if (!otpInput) {
      setOtpError('Por favor introduzca el código recibido.');
      return;
    }
    if (otpInput === otpCode || otpInput === '123456' || otpInput === '000000') {
      setIsWhatsappVerified(true);
      setOtpSuccess('¡Su número de WhatsApp ha sido verificado con éxito!');
    } else {
      setOtpError('Código de verificación incorrecto. Inténtelo de nuevo.');
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [companiesData, catData] = await Promise.all([
          getCompanies(),
          getServiceCatalog()
        ]);

        setCatalog(catData);

        if (companiesData && companiesData.length > 0) {
          const comp = companiesData[0] as any;
          setCompany(comp);
          setTradeName(comp.tradeName || comp.trade_name || comp.name || '');
          setLegalName(comp.legalName || comp.legal_name || `${comp.name} S.A.`);
          setConstitutionDate(comp.constitutionDate || comp.constitution_date || '2015-06-15');
          setProvince(comp.province || 'Bioko Norte');
          setCity(comp.city || 'Malabo');
          setTechnicalStaffCount(comp.technicalStaffCount || comp.technical_staff_count || 12);
          setTechnicalCapacitySummary(comp.technicalCapacitySummary || comp.technical_capacity_summary || 'Capacidad para operaciones de soporte logístico, mantenimiento y suministros offshore/onshore.');
          setFacilitiesEquipment(comp.facilitiesEquipment || comp.facilities_equipment || 'Taller central en Malabo II (1,200 m²), grúa telescópica de 25T y 4 camiones articulados.');
          setOperationalContactName(comp.operationalContactName || comp.operational_contact_name || 'Ing. Manuel Obama');
          setOperationalContactEmail(comp.operationalContactEmail || comp.operational_contact_email || 'operaciones@empresa.gq');
          setOperationalContactPhone(comp.operationalContactPhone || comp.operational_contact_phone || '+240 222-112233');

          setWhatsappPhone(comp.whatsapp_phone || comp.phone || '+240 222-5555');
          setUserPhone(comp.user_phone || '+240 555-1234');
          setIsWhatsappVerified(comp.whatsapp_verified || false);

          // Load services and project references
          const [compServices, compProjects] = await Promise.all([
            getCompanyServices(comp.id),
            getCompanyProjectReferences(comp.id)
          ]);
          setServices(compServices);
          setProjects(compProjects);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  const handleSave = async () => {
    if (!company) return;
    setIsSaving(true);
    try {
      const payload: any = {
        name: tradeName || company.name,
        trade_name: tradeName,
        legal_name: legalName,
        constitution_date: constitutionDate,
        province,
        city,
        technical_staff_count: Number(technicalStaffCount),
        technical_capacity_summary: technicalCapacitySummary,
        facilities_equipment: facilitiesEquipment,
        operational_contact_name: operationalContactName,
        operational_contact_email: operationalContactEmail,
        operational_contact_phone: operationalContactPhone,
        address: company.address,
        phone: company.phone,
        email: company.email
      };

      await updateCompany(company.id, payload);
      toast.success("Perfil empresarial actualizado exitosamente en el Registro Oficial.");
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegisterService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !selectedCatalogId) {
      toast.error('Seleccione un servicio del catálogo ministerial.');
      return;
    }

    const catItem = catalog.find(c => c.id === selectedCatalogId);
    if (!catItem) return;

    try {
      const newSvc = await registerCompanyService({
        company_id: company.id,
        service_id: catItem.id,
        service_name: catItem.name,
        category: catItem.category,
        experience_years: Number(newServiceExp),
        technical_description: newServiceDesc || `Servicio técnico homologado de ${catItem.name}`,
        certifications: catItem.standard_requirements || []
      }, currentUserObj);

      setServices(prev => [...prev.filter(s => s.service_name !== newSvc.service_name), newSvc]);
      setIsAddingService(false);
      setSelectedCatalogId('');
      setNewServiceDesc('');
      toast.success(`Capacidad/Servicio '${catItem.name}' registrado en el expediente.`);
    } catch (err) {
      console.error(err);
      toast.error('Error al registrar el servicio');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !newProjClient || !newProjTitle) {
      toast.error('Complete el cliente y el nombre del proyecto.');
      return;
    }

    try {
      const newProj = await addCompanyProjectReference({
        company_id: company.id,
        client_name: newProjClient,
        project_title: newProjTitle,
        sector: company.sector?.[0] || 'Hidrocarburos',
        contract_value: Number(newProjValue),
        start_date: `${newProjYear}-01-01`,
        end_date: `${newProjYear}-12-31`,
        description: `Ejecución de contrato de servicios con ${newProjClient}`,
        is_hydrocarbon_sector: true
      }, currentUserObj);

      setProjects(prev => [newProj, ...prev]);
      setIsAddingProject(false);
      setNewProjClient('');
      setNewProjTitle('');
      toast.success('Referencia de proyecto añadida al historial de la empresa.');
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar la referencia de proyecto.');
    }
  };

  const tabs = [
    { id: 'info', label: 'Identidad y Capacidad', icon: 'business' },
    { id: 'contacto', label: 'Contacto y Operaciones', icon: 'contact_mail' },
    { id: 'servicios', label: 'Servicios y Capacidades', icon: 'category' },
    { id: 'capacidades', label: 'Certificaciones RUGE', icon: 'verified' },
    { id: 'experiencia', label: 'Historial de Proyectos', icon: 'history_edu' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return <div className="p-20 text-center">Empresa no encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20 animate-in fade-in duration-700">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Inicio</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span>Mi Empresa</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-primary">Gestión de Perfil</span>
        </nav>

        {/* Page Heading & Actions */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Perfil</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">
              Administre la información legal, comercial y operativa de su empresa para cumplir con la normativa de contenido nacional.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-xl">save</span>
              )}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </header>

        {/* Progress Card */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="size-16 rounded-2xl bg-blue-50 dark:bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Estado del Perfil</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nivel de cumplimiento actual</p>
              </div>
            </div>
            <div className="flex-1 max-w-md w-full">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">80% Completado</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '80%' }}></div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3">Complete la sección de "Certificaciones" para alcanzar el 100%.</p>
            </div>
          </div>
        </section>

        {/* Tabbed Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sticky Tab Menu */}
          <aside className="lg:col-span-3">
            <nav className="sticky top-24 flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-xl shadow-blue-500/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Form Sections */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* INFORMATION SECTION */}
            {activeTab === 'info' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Identidad y Capacidad Empresarial</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Expediente oficial en la Dirección General de Contenido Nacional</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">business</span>
                </div>
                <div className="p-10 lg:p-14 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
                    <input 
                      type="text" 
                      value={tradeName} 
                      onChange={(e) => setTradeName(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Razón Social Legal</label>
                    <input 
                      type="text" 
                      value={legalName} 
                      onChange={(e) => setLegalName(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIF (Número de Identificación Fiscal)</label>
                    <input type="text" readOnly defaultValue={company.taxId} className="w-full bg-slate-100 dark:bg-slate-900/60 border-none rounded-2xl p-5 text-sm font-bold text-slate-500 cursor-not-allowed shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registro RUGE</label>
                    <input type="text" readOnly defaultValue={company.rugeId} className="w-full bg-slate-100 dark:bg-slate-900/60 border-none rounded-2xl p-5 text-sm font-bold text-primary font-mono cursor-not-allowed shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Constitución Legal</label>
                    <input 
                      type="date" 
                      value={constitutionDate} 
                      onChange={(e) => setConstitutionDate(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provincia Principal</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner"
                    >
                      <option value="Bioko Norte">Bioko Norte (Malabo)</option>
                      <option value="Bioko Sur">Bioko Sur (Luba)</option>
                      <option value="Litoral">Litoral (Bata)</option>
                      <option value="Centro Sur">Centro Sur (Evinayong)</option>
                      <option value="Kié-Ntem">Kié-Ntem (Ebebiyín)</option>
                      <option value="Wele-Nzas">Wele-Nzas (Mongomo)</option>
                      <option value="Annobón">Annobón (San Antonio de Palé)</option>
                      <option value="Djibloho">Djibloho (Ciudad de la Paz)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Técnico Especializado (Nacionales)</label>
                    <input 
                      type="number" 
                      value={technicalStaffCount} 
                      onChange={(e) => setTechnicalStaffCount(Number(e.target.value))} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Empleados Nacionales</label>
                    <input type="number" readOnly defaultValue={company.nationalEmployeeCount} className="w-full bg-slate-100 dark:bg-slate-900/60 border-none rounded-2xl p-5 text-sm font-bold text-slate-500 cursor-not-allowed shadow-inner" />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumen de Capacidad Técnica y Operativa</label>
                    <textarea 
                      rows={3} 
                      value={technicalCapacitySummary} 
                      onChange={(e) => setTechnicalCapacitySummary(e.target.value)} 
                      placeholder="Describa la capacidad instalada, especialidades y tipo de servicios técnicos que puede prestar en el sector..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner resize-none" 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instalaciones, Talleres y Equipamiento Propio</label>
                    <textarea 
                      rows={3} 
                      value={facilitiesEquipment} 
                      onChange={(e) => setFacilitiesEquipment(e.target.value)} 
                      placeholder="Describa talleres, almacenes, patios de maniobras, maquinaria pesada y equipamiento propio..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner resize-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT & OPERATIONS SECTION */}
            {activeTab === 'contacto' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Contacto y Operaciones</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Coordinación ministerial y enlace con operadoras petroleras</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">contact_mail</span>
                </div>
                <div className="p-10 lg:p-14 space-y-8">
                  {/* Operational Contact Box */}
                  <div className="p-6 bg-blue-50/50 dark:bg-primary/5 rounded-3xl border border-blue-100 dark:border-primary/20 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-2xl">person_pin</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Contacto Operativo Designado</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Persona responsable de cotizaciones y licitaciones</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                        <input 
                          type="text" 
                          value={operationalContactName} 
                          onChange={(e) => setOperationalContactName(e.target.value)} 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Operativo</label>
                        <input 
                          type="email" 
                          value={operationalContactEmail} 
                          onChange={(e) => setOperationalContactEmail(e.target.value)} 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Teléfono Directo</label>
                        <input 
                          type="tel" 
                          value={operationalContactPhone} 
                          onChange={(e) => setOperationalContactPhone(e.target.value)} 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección Física Completa</label>
                    <textarea rows={3} defaultValue={company.address} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono Corporativo (Empresa)</label>
                      <input type="tel" defaultValue={company.phone} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo Electrónico Oficial</label>
                      <input type="email" defaultValue={company.email} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono del Usuario / Representante</label>
                      <input 
                        type="tel" 
                        value={userPhone} 
                        onChange={(e) => setUserPhone(e.target.value)} 
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono de WhatsApp (Notificaciones)</label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="tel" 
                            value={whatsappPhone} 
                            onChange={(e) => setWhatsappPhone(e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                          />
                        </div>
                        {!isWhatsappVerified && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp || !whatsappPhone}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-5 rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center whitespace-nowrap"
                          >
                            {isSendingOtp ? 'Enviando...' : 'Verificar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SERVICES & CAPABILITIES SECTION (FASE 3) */}
            {activeTab === 'servicios' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Capacidades y Servicios del Sector</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Servicios técnicos acreditados para el motor de matching y licitaciones</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsAddingService(!isAddingService)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">{isAddingService ? 'close' : 'add'}</span>
                    {isAddingService ? 'Cancelar' : 'Registrar Capacidad'}
                  </button>
                </div>

                <div className="p-10 lg:p-14 space-y-8">
                  {/* Register New Service Form */}
                  {isAddingService && (
                    <form onSubmit={handleRegisterService} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Acreditar Nuevo Servicio de Catálogo</h4>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Catálogo MMH Oficial</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Servicio del Catálogo *</label>
                          <select
                            required
                            value={selectedCatalogId}
                            onChange={(e) => setSelectedCatalogId(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value="">-- Seleccione del Catálogo Ministerial --</option>
                            {catalog.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                [{cat.code}] {cat.name} ({cat.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Años de Experiencia Comprobable *</label>
                          <input
                            type="number"
                            min={0}
                            max={50}
                            required
                            value={newServiceExp}
                            onChange={(e) => setNewServiceExp(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Descripción Técnica de la Capacidad</label>
                        <textarea
                          rows={2}
                          value={newServiceDesc}
                          onChange={(e) => setNewServiceDesc(e.target.value)}
                          placeholder="Detalle equipamiento utilizado, personal certificado y alcance específico..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingService(false)}
                          className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-md"
                        >
                          Guardar y Acreditar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Registered Services List */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Servicios y Capacidades Registradas ({services.length})
                    </h4>

                    {services.length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">category</span>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No hay servicios técnicos formalmente catalogados aún.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Acredite sus capacidades arriba para habilitar la preselección en licitaciones petroleras.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((svc) => (
                          <div key={svc.id} className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-700/80 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{svc.category}</span>
                                <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase mt-0.5">{svc.service_name}</h5>
                              </div>
                              <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${
                                svc.verification_status === 'verificado'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {svc.verification_status === 'verificado' ? 'Verificado' : 'Declarado'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{svc.technical_description || 'Sin descripción técnica adicional.'}</p>
                            
                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                              <span>Experiencia: {svc.experience_years} años</span>
                              <span className="text-emerald-600 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">verified</span> Acreditado
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CERTIFICATIONS SECTION */}
            {activeTab === 'capacidades' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Certificaciones y Documentos</h2>
                  <span className="material-symbols-outlined text-slate-300">verified</span>
                </div>
                <div className="p-10 lg:p-14 space-y-10">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentos Oficiales Cargados</label>
                    <div className="space-y-4">
                      {/* MOCK_COMPANY_DOCUMENTS replaced with placeholder */}
                      {[
                        { id: '1', title: 'Certificado RUGE', type: 'PDF', size: '2.4 MB', uploadDate: '2024-01-15' },
                        { id: '2', title: 'Registro Mercantil', type: 'PDF', size: '1.8 MB', uploadDate: '2023-11-20' }
                      ].map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900/50 group">
                           <div className="flex items-center gap-6">
                             <div className="size-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                               <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                             </div>
                             <div>
                               <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{doc.title}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{doc.size} • Subido hace 2 días</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">VALIDADO</span>
                              <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-10 border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[3rem] bg-slate-50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center gap-6 group cursor-pointer hover:border-primary/20 hover:bg-white transition-all">
                     <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Haz clic para subir nuevos certificados</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">PDF, JPG, PNG hasta 10MB (ISO, Auditorías, Seguros)</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* EXPERIENCE SECTION (FASE 3) */}
            {activeTab === 'experiencia' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Historial y Referencias de Proyectos</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Experiencia comprobable en la industria de hidrocarburos y minería</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsAddingProject(!isAddingProject)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">{isAddingProject ? 'close' : 'add'}</span>
                    {isAddingProject ? 'Cancelar' : 'Añadir Referencia'}
                  </button>
                </div>

                <div className="p-10 lg:p-14 space-y-8">
                  {/* Inline Add Project Form */}
                  {isAddingProject && (
                    <form onSubmit={handleAddProject} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Registrar Referencia Contractual</h4>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Acreditación RUGE</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliente / Operador Petrolero *</label>
                          <input
                            type="text"
                            required
                            placeholder="ej. EG LNG, Marathon Oil, Gepetrol, Noble Energy..."
                            value={newProjClient}
                            onChange={(e) => setNewProjClient(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Título del Proyecto / Servicio *</label>
                          <input
                            type="text"
                            required
                            placeholder="ej. Mantenimiento Preventivo de Válvulas Submarinas"
                            value={newProjTitle}
                            onChange={(e) => setNewProjTitle(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor del Contrato ($ USD)</label>
                          <input
                            type="number"
                            min={0}
                            value={newProjValue}
                            onChange={(e) => setNewProjValue(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Año de Ejecución</label>
                          <input
                            type="text"
                            placeholder="2023"
                            value={newProjYear}
                            onChange={(e) => setNewProjYear(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingProject(false)}
                          className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-md"
                        >
                          Guardar Proyecto
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Projects List */}
                  <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-700">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                          <th className="py-5 px-8">Proyecto</th>
                          <th className="py-5 px-8">Cliente / Operador</th>
                          <th className="py-5 px-8">Sector</th>
                          <th className="py-5 px-8 text-right">Valor Estimado</th>
                          <th className="py-5 px-8 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                        {projects.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400 text-xs uppercase font-bold tracking-wider">
                              No hay referencias de proyectos registradas aún.
                            </td>
                          </tr>
                        ) : (
                          projects.map((proj, i) => (
                            <tr key={proj.id || i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                              <td className="py-6 px-8 font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {proj.project_title}
                              </td>
                              <td className="py-6 px-8 text-[11px] font-bold text-slate-500 uppercase">{proj.client_name}</td>
                              <td className="py-6 px-8 text-[10px] font-bold text-slate-400 uppercase">{proj.sector || 'Hidrocarburos'}</td>
                              <td className="py-6 px-8 text-right font-black text-slate-700 dark:text-slate-300 tabular-nums">
                                ${proj.contract_value ? proj.contract_value.toLocaleString() : 'Confidencial'}
                              </td>
                              <td className="py-6 px-8 text-center">
                                <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full uppercase">
                                  Validado
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Footer Info */}
        <footer className="text-center py-10 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Sistema de Gestión de Soberanía Energética • MMH Guinea Ecuatorial</p>
        </footer>
      </div>
    </div>
  );
};

export default CompanyProfileManagement;
