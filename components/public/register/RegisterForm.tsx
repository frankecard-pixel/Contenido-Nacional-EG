
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { createUser } from '../../../services/supabaseApi';
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
    sector: [] as string[],
    documents: [] as { name: string, base64: string, type: string }[],
  });

  const roles = [
    { value: UserRole.PERSONA, label: 'Talento Nacional', icon: '👷' },
    { value: UserRole.COMPANY, label: 'Empresa de Servicios', icon: '🏭' },
    { value: UserRole.EMPRESA_LOCAL, label: 'Pyme Nacional', icon: '💡' },
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
    if (!supabase) return;

    setLoading(true);
    setError(null);

    try {
      // If it's a company, we create a registration request first
      if (formData.role === UserRole.COMPANY || formData.role === UserRole.EMPRESA_LOCAL) {
        const { error: requestError } = await supabase.from('registration_requests').insert([{
          email: formData.email,
          name: formData.name,
          company_name: formData.companyName,
          tax_id: formData.taxId,
          role: formData.role,
          sectors: formData.sector,
          documents: formData.documents,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

        if (requestError) throw requestError;

        setSuccess(true);
        // Redirect to a tracking page instead of login
        setTimeout(() => navigate(`/registration-status?email=${formData.email}`), 3000);
      } else {
        // Talent (Persona) still registers directly
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
          setTimeout(() => navigate('/login'), 3000);
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
    return (
      <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500">
        <div className="size-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
          ¡Registro Exitoso!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
          Su cuenta ha sido creada. Por favor, verifique su correo electrónico para confirmar su registro.
          Será redirigido al inicio de sesión en unos segundos...
        </p>
        <Link to="/login" className="text-primary font-black uppercase tracking-widest text-xs hover:underline">
          Ir al inicio de sesión ahora
        </Link>
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
