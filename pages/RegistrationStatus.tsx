
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import PublicBanner from '../components/public/PublicBanner';
import { CheckCircle2, Clock, AlertCircle, Download, Upload, FileText, Loader2 } from 'lucide-react';

const RegistrationStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);

  useEffect(() => {
    if (email) {
      fetchStatus();
    }
  }, [email]);

  const fetchStatus = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('email', email)
      .single();
    
    if (data) setRequest(data);
    setLoading(false);
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
      await fetchStatus();
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <PublicBanner title="Seguimiento de Registro" subtitle="Consulte el estado de su solicitud de certificación." />
        <div className="max-w-xl mx-auto mt-20 p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl text-center border border-slate-100 dark:border-slate-800">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Solicitud no encontrada</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">No hemos podido encontrar ninguna solicitud asociada al correo {email}.</p>
          <Link to="/register" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Volver al Registro</Link>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'pending', label: 'Validación Inicial', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'payment_pending', label: 'Nota de Pago Emitida', icon: Download, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'payment_submitted', label: 'Pago en Verificación', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'approved', label: 'Acceso Concedido', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === request.status);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PublicBanner 
        title="Estado de su Expediente" 
        subtitle={`Expediente N°: ${request.expediente_number || 'PENDIENTE'}`}
        category="Seguimiento Institucional"
      />

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-30">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{request.company_name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIF: {request.tax_id}</p>
              </div>
            </div>
            <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
              request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {request.status.replace('_', ' ')}
            </div>
          </div>

          <div className="p-10">
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
    </div>
  );
};

export default RegistrationStatus;
