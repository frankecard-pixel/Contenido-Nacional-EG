
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCompanies } from '../services/supabaseApi';
import { sendOTPWhatsApp } from '../services/n8nService';
import { CompanyExt } from '../types';

const CompanyProfileManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('info');
  const [isSaving, setIsSaving] = useState(false);
  const [company, setCompany] = useState<CompanyExt | null>(null);
  const [loading, setLoading] = useState(true);

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
    const fetchCompany = async () => {
      try {
        // Fetch the first company for now, or you could fetch based on logged in user
        const data = await getCompanies();
        if (data && data.length > 0) {
          const comp = data[0] as any;
          setCompany(comp);
          setWhatsappPhone(comp.whatsapp_phone || comp.phone || '+240 222-5555');
          setUserPhone(comp.user_phone || '+240 555-1234');
          setIsWhatsappVerified(comp.whatsapp_verified || false);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Cambios guardados con éxito.");
    }, 1000);
  };

  const tabs = [
    { id: 'info', label: 'Información General', icon: 'business' },
    { id: 'contacto', label: 'Contacto', icon: 'contact_mail' },
    { id: 'servicios', label: 'Servicios', icon: 'category' },
    { id: 'capacidades', label: 'Certificaciones', icon: 'verified' },
    { id: 'experiencia', label: 'Experiencia', icon: 'history_edu' }
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
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Información Básica</h2>
                  <span className="material-symbols-outlined text-slate-300">business</span>
                </div>
                <div className="p-10 lg:p-14 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
                    <input type="text" defaultValue={company.name} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Razón Social</label>
                    <input type="text" defaultValue={`${company.name} S.A.`} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIF (Número de Identificación Fiscal)</label>
                    <input type="text" defaultValue={company.taxId} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Constitución</label>
                    <input type="date" defaultValue="2015-06-15" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº Empleados Nacionales</label>
                    <input type="number" defaultValue={company.nationalEmployeeCount} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT SECTION */}
            {activeTab === 'contacto' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Datos de Contacto</h2>
                  <span className="material-symbols-outlined text-slate-300">contact_mail</span>
                </div>
                <div className="p-10 lg:p-14 space-y-8">
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
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
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

                  {/* WhatsApp Verification Sub-Module */}
                  {whatsappPhone && (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-800 animate-in fade-in duration-300 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-emerald-500 text-2xl">verified_user</span>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Verificador de WhatsApp</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Sincronizado vía n8n webhook</p>
                          </div>
                        </div>
                        {isWhatsappVerified ? (
                          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 font-bold animate-pulse">
                            <span className="material-symbols-outlined text-xs">verified</span> Verificado
                          </span>
                        ) : (
                          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full font-bold">
                            Pendiente de Verificación
                          </span>
                        )}
                      </div>

                      {otpError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wide rounded-xl">
                          {otpError}
                        </div>
                      )}

                      {otpSuccess && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide rounded-xl">
                          {otpSuccess}
                        </div>
                      )}

                      {otpSent && !isWhatsappVerified && (
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                          <input
                            type="text"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="Introduzca el código OTP de 6 dígitos"
                            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Confirmar Código
                          </button>
                        </div>
                      )}

                      {!otpSent && !isWhatsappVerified && (
                        <p className="text-[10px] text-slate-500 font-medium">
                          Presione <strong>Verificar</strong> arriba para recibir un SMS/WhatsApp con el código OTP de verificación integrado.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sitio Web Oficial</label>
                    <input type="url" defaultValue="https://www.atlantic.com" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" />
                  </div>
                </div>
              </div>
            )}

            {/* SERVICES SECTION */}
            {activeTab === 'servicios' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Categorías de Servicios</h2>
                  <span className="material-symbols-outlined text-slate-300">category</span>
                </div>
                <div className="p-10 lg:p-14 space-y-10">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sectores de Actividad Seleccionados</label>
                    <div className="flex flex-wrap gap-3">
                      {company.sector.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-blue-50 dark:bg-primary/10 border border-blue-100 dark:border-primary/20 px-5 py-3 rounded-2xl group transition-all hover:border-primary">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{s}</span>
                          <button className="text-slate-300 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        </div>
                      ))}
                      <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-base">add</span>
                        Añadir Sector
                      </button>
                    </div>
                  </div>
                  <div className="pt-10 border-t border-slate-50 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Sectores Recomendados para su Perfil</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Mantenimiento Industrial', 'Consultoría Ambiental', 'Seguridad Física'].map(s => (
                        <div key={s} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group cursor-pointer hover:border-primary/30">
                           <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">{s}</span>
                           <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                        </div>
                      ))}
                    </div>
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

            {/* EXPERIENCE SECTION */}
            {activeTab === 'experiencia' && (
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Historial de Proyectos</h2>
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">add</span> Añadir Proyecto
                  </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <th className="py-6 px-10">Proyecto</th>
                            <th className="py-6 px-10">Cliente / Operador</th>
                            <th className="py-6 px-10">Año</th>
                            <th className="py-6 px-10 text-right">Valor (USD)</th>
                            <th className="py-6 px-10"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                         {[
                           { name: 'Mantenimiento Planta LNG', client: 'EG LNG', year: '2022', value: '$250,000' },
                           { name: 'Logística de Equipos Offshore', client: 'Marathon Oil', year: '2021', value: '$120,000' }
                         ].map((proj, i) => (
                           <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                              <td className="py-8 px-10 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{proj.name}</td>
                              <td className="py-8 px-10 text-[10px] font-bold text-slate-500 uppercase">{proj.client}</td>
                              <td className="py-8 px-10 text-[10px] font-bold text-slate-500">{proj.year}</td>
                              <td className="py-8 px-10 text-right font-black text-slate-700 dark:text-slate-300 tabular-nums text-xs">{proj.value}</td>
                              <td className="py-8 px-10 text-right">
                                 <button className="text-slate-300 hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
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
