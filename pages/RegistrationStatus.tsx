import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import PublicBanner from '../components/public/PublicBanner';
import { CheckCircle2, Clock, AlertCircle, Download, Upload, FileText, Loader2, Search, ArrowRight, ShieldCheck, Phone, Tag, Image, Eye } from 'lucide-react';

const RegistrationStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlEmail = searchParams.get('email');
  
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  
  // Custom tracking search states
  const [searchQuery, setSearchQuery] = useState(urlEmail || '');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showDipModal, setShowDipModal] = useState(false);

  useEffect(() => {
    if (urlEmail) {
      fetchStatusByQuery(urlEmail);
    }
  }, [urlEmail]);

  const fetchStatusByQuery = async (queryStr: string) => {
    if (!supabase || !queryStr.trim()) return;
    setLoading(true);
    setSearchError(null);
    try {
      // 1. Try searching by email
      let { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('email', queryStr.trim())
        .maybeSingle();

      // 2. If not found by email, try tracking_number or expediente_number
      if (!data) {
        const { data: dataByRef, error: errorByRef } = await supabase
          .from('registration_requests')
          .select('*')
          .or(`tracking_number.eq.${queryStr.trim()},expediente_number.eq.${queryStr.trim()}`)
          .maybeSingle();
        data = dataByRef;
      }

      if (data) {
        setRequest(data);
      } else {
        setRequest(null);
        setSearchError('No se encontró ninguna solicitud de registro que coincida con el correo o número de expediente introducido.');
      }
    } catch (err: any) {
      console.error(err);
      setSearchError('Error de red al consultar el estado. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatusByQuery(searchQuery);
  };

  const handlePaymentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submitPayment = async () => {
    if (!supabase || !paymentFile || !request) return;
    setUploading(true);
    const { error } = await supabase
      .from('registration_requests')
      .update({ 
        payment_proof: paymentFile,
        status: 'payment_submitted'
      })
      .eq('id', request.id);
    
    if (!error) {
      await fetchStatusByQuery(request.email || searchQuery);
    }
    setUploading(false);
  };

  const steps = [
    { id: 'pending', label: 'Validación Inicial', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'payment_pending', label: 'Nota de Pago Emitida', icon: Download, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'payment_submitted', label: 'Pago en Verificación', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'approved', label: 'Acceso Concedido', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const currentStepIndex = request ? steps.findIndex(s => s.id === request.status) : 0;

  // Render a clean search box if there's no resolved request
  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <PublicBanner 
          title="Consulta de Registro" 
          subtitle="Realice el seguimiento en tiempo real del estado de su solicitud de certificación empresarial." 
          category="Seguimiento de Expediente"
        />
        
        <div className="max-w-xl mx-auto w-full px-6 -mt-20 relative z-30 mb-20">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-800">
            <div className="size-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter text-center mb-2">
              Seguimiento de Trámites
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-center text-xs mb-8 leading-relaxed">
              Introduzca la dirección de correo electrónico utilizada durante el registro o su Número de Expediente asignado para visualizar los avances.
            </p>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="ejemplo@empresa.com o REG-GE-2026-XXXXX"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white uppercase placeholder:normal-case"
                />
              </div>

              {searchError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 border border-rose-100 dark:border-rose-800 rounded-2xl flex gap-3 text-left">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold uppercase leading-normal">{searchError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buscando expediente...
                  </>
                ) : (
                  <>
                    Consultar Estado
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link to="/register" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline flex items-center justify-center gap-1">
                ¿No se ha registrado aún? Solicite su cuenta aquí
              </Link>
            </div>
          </div>

          {/* Procedural guidelines shown below the search */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Certificación Real</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Nuestros inspectores garantizan el cumplimiento de contenido nacional en Guinea Ecuatorial.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Revisiones Rápidas</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Los expedientes se validan en un promedio de 48 horas una vez presentados los documentos.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Descarga Segura</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Acceda a sus certificados de forma directa y autenticada desde el panel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Categories helper to map CAT_A/B/C codes to labels
  const getCategoryLabel = (catCode: string) => {
    switch (catCode) {
      case 'CAT_A': return 'Categoría A (Servicios Generales)';
      case 'CAT_B': return 'Categoría B (Servicios Medios)';
      case 'CAT_C': return 'Categoría C (Servicios Especializados)';
      default: return catCode;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PublicBanner 
        title="Estado de su Expediente" 
        subtitle={`Expediente N°: ${request.expediente_number || request.tracking_number || 'PENDIENTE'}`}
        category="Seguimiento de Trámites"
      />

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-30">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          
          {/* Header Info */}
          <div className="p-8 md:p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{request.company_name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIF: {request.tax_id}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {request.phone || 'No registrado'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                onClick={() => setRequest(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-[9px] uppercase tracking-widest py-2 px-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-5/50 hover:bg-slate-50 transition-all"
              >
                Buscar otro
              </button>
              <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {request.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* Display PYME Categories if available */}
            {request.categories && request.categories.length > 0 && (
              <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Categorías Homologadas PYME</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {request.categories.map((cat: string) => (
                        <span key={cat} className="text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary py-0.5 px-2 rounded-md">
                          {getCategoryLabel(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DIP Copy view option */}
                {request.dip_base64 && (
                  <button
                    onClick={() => setShowDipModal(true)}
                    className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    Ver Copia DIP
                  </button>
                )}
              </div>
            )}

            {/* Display DIP Copy viewer outside the categories container block just in case it's not a local pyme but still has a DIP */}
            {!request.categories?.length && request.dip_base64 && (
              <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Identificación del Representante</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Copia de DIP adjunta correctamente.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDipModal(true)}
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  Ver Copia DIP
                </button>
              </div>
            )}

            {/* Steps Timeline */}
            <div className="relative flex justify-between mb-12">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000" 
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
              
              {steps.map((s, i) => {
                const Icon = s.icon;
                const isActive = i <= currentStepIndex;
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 text-slate-300 border border-slate-100 dark:border-slate-700'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest text-center max-w-[80px] ${
                      isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-8">
              {request.status === 'pending' && (
                <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800 text-center">
                  <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Validación en curso</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    El Ministerio está revisando su documentación. Se le contactará telefónicamente para verificar la ubicación física de su empresa.
                  </p>
                </div>
              )}

              {request.status === 'payment_pending' && (
                <div className="space-y-6">
                  <div className="p-8 bg-orange-50 dark:bg-orange-900/10 rounded-[2rem] border border-orange-100 dark:border-orange-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <Download className="w-10 h-10 text-orange-500" />
                        <div>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Nota de Pago Lista</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Descargue el documento para realizar el ingreso en el banco.</p>
                        </div>
                      </div>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Descargar Nota
                      </button>
                    </div>
                  </div>

                  <div className="p-8 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center relative group">
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handlePaymentUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-10 h-10 text-slate-300 group-hover:text-primary transition-colors" />
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Subir Comprobante de Pago</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Formato PDF o Imagen de alta resolución</p>
                    </div>
                  </div>

                  {paymentFile && (
                    <div className="flex justify-center">
                      <button 
                        onClick={submitPayment}
                        disabled={uploading}
                        className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center gap-2"
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Enviar Comprobante
                      </button>
                    </div>
                  )}
                </div>
              )}

              {request.status === 'payment_submitted' && (
                <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800 text-center">
                  <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Pago en Verificación</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Hemos recibido su comprobante de pago. El Ministerio confirmará el ingreso bancario en las próximas 24-48 horas.
                  </p>
                </div>
              )}

              {request.status === 'approved' && (
                <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-800 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">¡Acceso Concedido!</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                    Su empresa ha sido certificada exitosamente. Ya puede acceder al portal completo con sus credenciales.
                  </p>
                  <Link to="/login" className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 inline-block">Iniciar Sesión</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DIP Image/PDF copy viewer modal */}
      {showDipModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">badge</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Copia de DIP del Representante</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Expediente: {request.expediente_number}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDipModal(false)}
                className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/50 min-h-[400px]">
              {request.dip_base64.startsWith('data:image/') ? (
                <img
                  src={request.dip_base64}
                  alt="Copia DIP"
                  referrerPolicy="no-referrer"
                  className="max-h-[500px] object-contain rounded-2xl shadow-md border border-slate-200 dark:border-slate-800"
                />
              ) : request.dip_base64.startsWith('data:application/pdf') ? (
                <iframe
                  src={request.dip_base64}
                  title="Copia DIP PDF"
                  className="w-full h-[500px] rounded-2xl shadow-md border border-slate-200 dark:border-slate-800"
                />
              ) : (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl max-w-sm border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-5xl text-blue-500 mb-4">description</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Archivo de Identificación</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">No se puede renderizar el documento inline.</p>
                  <a
                    href={request.dip_base64}
                    download="copia_dip.pdf"
                    className="inline-flex items-center gap-2 bg-primary text-white py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar Archivo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationStatus;
