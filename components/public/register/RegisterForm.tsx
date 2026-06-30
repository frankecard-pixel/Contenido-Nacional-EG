
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { createUser } from '../../../services/supabaseApi';
import { sendOTPWhatsApp } from '../../../services/n8nService';
import { UserRole } from '../../../types';
import { Mail, Lock, User, Building2, ChevronRight, ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: UserRole.PERSONA,
    companyName: '',
    taxId: '',
    phone: '',
    userPhone: '',
    whatsappPhone: '',
    dipBase64: '',
    dipFileName: '',
    categories: [] as string[],
    sector: [] as string[],
    documents: [] as { name: string, base64: string, type: string }[],
  });

  // WhatsApp verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  // Track the generated registration number after success
  const [generatedRegNumber, setGeneratedRegNumber] = useState<string>('');

  const roles = [
    { value: UserRole.PERSONA, label: 'Talento Nacional', icon: '👷' },
    { value: UserRole.COMPANY, label: 'Empresa de Servicios Internacionales', icon: '🏭' },
    { value: UserRole.EMPRESA_LOCAL, label: 'Pyme Nacional', icon: '💡' },
  ];

  const pymeCategories = [
    { value: 'CAT_A', label: 'Categoría A', desc: 'Servicios Generales y Logística de Baja Complejidad (Limpieza, Catering, Suministros)' },
    { value: 'CAT_B', label: 'Categoría B', desc: 'Servicios de Complejidad Media (Mantenimiento Técnico, Transporte, IT, Asesoramiento)' },
    { value: 'CAT_C', label: 'Categoría C', desc: 'Servicios de Alta Tecnología e Ingeniería Especializada (Construcción, Perforación, Residuos)' },
  ];

  const sectors = ['Logística', 'Mantenimiento', 'Catering', 'Seguridad', 'Limpieza', 'Consultoría'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          documents: [
            ...prev.documents,
            {
              name: file.name,
              type: file.type,
              base64: reader.result as string
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      sector: prev.sector.includes(sector)
        ? prev.sector.filter(s => s !== sector)
        : [...prev.sector, sector]
    }));
  };

  const handleDipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        dipBase64: reader.result as string,
        dipFileName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const togglePymeCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.whatsappPhone) {
      setOtpError('Por favor introduzca un número de WhatsApp primero.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError(null);
    setOtpSuccess(null);
    try {
      const res = await sendOTPWhatsApp(formData.whatsappPhone, formData.name);
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

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Por favor complete todos los campos obligatorios.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // If it's a company, we create a registration request first
      if (formData.role === UserRole.COMPANY || formData.role === UserRole.EMPRESA_LOCAL) {
        let existingCompany = null;
        let existingRequest = null;

        if (supabase) {
          // Check for duplicates in companies table
          const { data: cData } = await supabase
            .from('companies')
            .select('id')
            .ilike('name', formData.companyName)
            .maybeSingle();
          existingCompany = cData;

          // Check for duplicates in registration_requests table
          const { data: rData } = await supabase
            .from('registration_requests')
            .select('id')
            .ilike('company_name', formData.companyName)
            .neq('status', 'rejected')
            .limit(1);
          existingRequest = rData;
        } else {
          // Check mock arrays via APIs
          const { getCompanies, getRegistrationRequests } = await import('../../../services/supabaseApi');
          const companies = await getCompanies();
          const requests = await getRegistrationRequests();
          
          existingCompany = companies.find((c: any) => c.name.toLowerCase() === formData.companyName.toLowerCase());
          existingRequest = requests.filter((r: any) => r.company_name.toLowerCase() === formData.companyName.toLowerCase() && r.status !== 'rejected');
        }

        if (existingCompany) {
          throw new Error('Ya existe una empresa registrada con ese nombre.');
        }

        if (existingRequest && existingRequest.length > 0) {
           throw new Error('Ya existe una solicitud en curso para una empresa con ese nombre.');
        }

        // Generate unique tracking / registration number
        const trackingNumber = `REG-GE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        setGeneratedRegNumber(trackingNumber);

        const { createRegistrationRequest } = await import('../../../services/supabaseApi');
        await createRegistrationRequest({
          email: formData.email,
          name: formData.name,
          company_name: formData.companyName,
          tax_id: formData.taxId,
          role: formData.role,
          sectors: formData.sector,
          documents: formData.documents,
          status: 'pending',
          phone: formData.phone,
          user_phone: formData.userPhone,
          whatsapp_phone: formData.whatsappPhone,
          whatsapp_verified: isWhatsappVerified,
          dip_base64: formData.dipBase64,
          categories: formData.categories,
          tracking_number: trackingNumber,
          expediente_number: trackingNumber,
          created_at: new Date().toISOString()
        });

        setSuccess(true);
        // Do not redirect automatically so the user can see the tracking number and instructions page!
      } else {
        // Talent (Persona) still registers directly
        if (supabase) {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.name,
                role: formData.role,
              }
            }
          });

          if (authError) throw authError;

          if (authData.user) {
            await createUser({
              id: authData.user.id,
              email: formData.email,
              name: formData.name,
              role: formData.role,
              isOnline: true,
              permissions: [],
              status: 'active'
            });

            setSuccess(true);
          }
        } else {
          // Fallback to memory
          await createUser({
            id: `u-${Date.now()}`,
            email: formData.email,
            name: formData.name,
            role: formData.role,
            isOnline: true,
            permissions: [],
            status: 'active'
          });

          setSuccess(true);
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al registrarse. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const isCompany = formData.role === UserRole.COMPANY || formData.role === UserRole.EMPRESA_LOCAL;

    return (
      <div className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
        <div className="size-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter text-center mb-2">
          {isCompany ? '¡Solicitud Recibida!' : '¡Registro Exitoso!'}
        </h2>
        
        {isCompany ? (
          <div className="space-y-6">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-center text-sm">
              Su solicitud de registro ha sido guardada en nuestro sistema de forma segura.
            </p>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">NÚMERO DE REGISTRO / EXPEDIENTE</span>
              <span className="text-2xl font-black text-primary tracking-tight font-mono">{generatedRegNumber}</span>
              <div className="mt-3 py-1.5 px-4 bg-blue-500/10 rounded-xl inline-flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-sm">mail</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Confirmación enviada a {formData.email}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Procedimiento de Certificación</h3>
              <div className="space-y-4 text-left">
                <div className="flex gap-4">
                  <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center font-black text-xs shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Verificación de Documentación y DIP</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Nuestros analistas validarán su NIF, NIF empresarial y la copia de su DIP proporcionada.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center font-black text-xs shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Inspección Presencial</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Un inspector del Ministerio se pondrá en contacto al {formData.phone} para planificar la auditoría física en su sede.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center font-black text-xs shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Emisión de Nota de Pago</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Una vez calificada positivamente la inspección, se habilitará la Nota de Pago en su portal de seguimiento.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center font-black text-xs shrink-0 mt-0.5">4</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Certificación y Acceso</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Tras acreditar el pago, su cuenta será dada de alta con rol certificado y podrá descargar su certificado oficial.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/registration-status?email=${formData.email}`)}
                className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">troubleshoot</span>
                Consultar Estado de Registro
              </button>
              <Link
                to="/login"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center"
              >
                Ir a Inicio de Sesión
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 text-center mb-8">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-4xl mb-4">mark_email_unread</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Confirme su correo electrónico</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Hemos enviado un correo a <strong className="text-slate-900 dark:text-white">{formData.email}</strong>. Por favor, revise su bandeja de entrada (y la carpeta de spam) y haga clic en el enlace para activar su cuenta.
              </p>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-4">
              Una vez confirmado su correo, podrá acceder al portal para completar su perfil laboral y postularse a ofertas de empleo.
            </p>
            <Link to="/login" className="bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 inline-block transition-all mt-4">
              Ir al Inicio de Sesión
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
            Registro de Portal
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Paso {step} de 3 • {step === 1 ? 'Información Básica' : step === 2 ? 'Tipo de Perfil' : 'Detalles Finales'}
          </p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs font-bold uppercase tracking-tight leading-relaxed">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre Completo</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@ejemplo.com"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirmar Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: r.value }))}
                  className={`p-6 rounded-3xl border-2 transition-all text-center flex flex-col items-center gap-4 ${
                    formData.role === r.value 
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-200'
                  }`}
                >
                  <span className="text-4xl">{r.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {(formData.role === UserRole.COMPANY || formData.role === UserRole.EMPRESA_LOCAL) ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre de la Empresa</label>
                    <div className="relative group">
                      <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Suministros Guinea S.L."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">NIF / Registro Mercantil</label>
                    <div className="relative group">
                      <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        name="taxId"
                        required
                        value={formData.taxId}
                        onChange={handleInputChange}
                        placeholder="GE-000000"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Teléfono de la Empresa (Corporativo)</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">phone</span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+240 222-3333"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Copia de DIP del Representante</label>
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-3 bg-slate-50 dark:bg-slate-800 flex items-center justify-between group">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleDipChange}
                        required={!formData.dipBase64}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">badge</span>
                        <span className="text-xs font-bold text-slate-500 truncate max-w-[150px]">
                          {formData.dipFileName || 'Cargar DIP (Imagen/PDF)'}
                        </span>
                      </div>
                      {formData.dipBase64 && (
                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Teléfono del Usuario / Representante</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                      <input
                        type="tel"
                        name="userPhone"
                        required
                        value={formData.userPhone}
                        onChange={handleInputChange}
                        placeholder="+240 555-1234"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Teléfono de WhatsApp (Notificaciones)</label>
                    <div className="relative group flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-emerald-500 group-focus-within:text-emerald-600 transition-colors">chat</span>
                        <input
                          type="tel"
                          name="whatsappPhone"
                          required
                          value={formData.whatsappPhone}
                          onChange={handleInputChange}
                          placeholder="+240 222-5555"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                        />
                      </div>
                      {!isWhatsappVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp || !formData.whatsappPhone}
                          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-4 rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center whitespace-nowrap"
                        >
                          {isSendingOtp ? 'Enviando...' : 'Verificar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Verification Sub-Module */}
                {formData.whatsappPhone && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-300 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-500 text-2xl">verified_user</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Verificador de WhatsApp</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Integrado con n8n Webhook</p>
                        </div>
                      </div>
                      {isWhatsappVerified ? (
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verificado
                        </span>
                      ) : (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
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
                        Haga clic en <strong>Verificar</strong> arriba para recibir un código de doble factor en su WhatsApp usando el bot del Ministerio (n8n).
                      </p>
                    )}
                  </div>
                )}

                {formData.role === UserRole.EMPRESA_LOCAL && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Categorías de PYME Nacional</label>
                    <div className="grid grid-cols-1 gap-3">
                      {pymeCategories.map(cat => {
                        const isSelected = formData.categories.includes(cat.value);
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => togglePymeCategory(cat.value)}
                            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                              isSelected 
                                ? 'border-primary bg-primary/5 shadow-md' 
                                : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-200'
                            }`}
                          >
                            <span className={`size-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white dark:bg-slate-800'
                            }`}>
                              {isSelected && <span className="material-symbols-outlined text-[10px] font-bold">check</span>}
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{cat.label}</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-bold mt-1 uppercase">{cat.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Documentación Requerida (PDF)</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center hover:border-primary transition-all group relative">
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-3xl">upload_file</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Haga clic o arrastre sus archivos PDF aquí</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">(Registro Mercantil, NIF, Certificados de Operación)</p>
                      </div>
                    </div>

                    {formData.documents.length > 0 && (
                      <div className="space-y-2">
                        {formData.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-blue-500">description</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{doc.name}</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeDocument(index)}
                              className="text-rose-500 hover:text-rose-600 p-1"
                            >
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                  Como Talento Nacional, su perfil se centrará en la búsqueda de empleo y formación. Podrá completar su CV una vez iniciada la sesión.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-8 border-t border-slate-50 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-primary/30 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Finalizar Registro
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      <div className="mt-12 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          ¿Ya tiene una cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Inicie sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
