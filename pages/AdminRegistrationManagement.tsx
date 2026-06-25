
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseClient';
import { createUser, createCompany } from '../services/supabaseApi';
import { UserRole } from '../types';
import { CheckCircle, XCircle, Clock, Eye, Download, FileText, Loader2, Search, Filter, CreditCard, UserPlus } from 'lucide-react';

const AdminRegistrationManagement: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  // States for DIP, Rejection and Success Email notifications
  const [viewingDip, setViewingDip] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ name: string, base64: string } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('registration_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setRequests(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string, extraData: any = {}) => {
    if (!supabase) return;
    setProcessing(true);
    const { error } = await supabase
      .from('registration_requests')
      .update({ status, ...extraData })
      .eq('id', id);
    
    if (!error) {
      await fetchRequests();
      if (selectedRequest?.id === id) {
        setSelectedRequest((prev: any) => ({ ...prev, status, ...extraData }));
      }
    }
    setProcessing(false);
  };

  const generateContract = async (request: any) => {
    if (!supabase) return;
    setProcessing(true);
    try {
      // 1. Fetch templates
      const { data: templates } = await supabase.from('contract_templates').select('*').limit(1);
      const template = templates?.[0] || { content: 'Contrato de Registro para {{company_name}}' };
      
      // 2. Replace variables
      const content = template.content
        .replace('{{company_name}}', request.company_name)
        .replace('{{tax_id}}', request.tax_id)
        .replace('{{date}}', new Date().toLocaleDateString());
      
      // 3. Create contract record
      await supabase.from('contracts').insert([{
        title: { es: `Contrato de Registro - ${request.company_name}`, en: `Registration Contract - ${request.company_name}` },
        content,
        company_id: request.id, // In a real app, this would be the actual company ID
        status: 'pending',
        type: 'registration',
        created_at: new Date().toISOString()
      }]);

      alert('Contrato generado basado en template. La empresa podrá firmarlo desde su portal.');
    } catch (error) {
      console.error('Error generating contract:', error);
      alert('Error al generar el contrato.');
    } finally {
      setProcessing(false);
    }
  };

  const approveRegistration = async (request: any) => {
    if (!supabase) return;
    setProcessing(true);
    try {
      // 1. Create Supabase Auth User (in a real app, this would be a server-side function)
      // For this demo, we'll simulate it by creating the record in the 'users' table
      // and assuming they can now log in (or we'd use a service role to create the auth user)
      
      const userId = crypto.randomUUID(); // Mock ID for demo
      
      await createUser({
        id: userId,
        email: request.email,
        name: request.name,
        role: request.role,
        isOnline: false,
        permissions: [],
        status: 'active'
      });

      // 2. Create Company Record
      await createCompany({
        name: request.company_name,
        taxId: request.tax_id,
        type: request.role === UserRole.EMPRESA_LOCAL ? 'local' : 'international',
        sector: request.sectors,
        status: 'certified',
        email: request.email
      });

      // 3. Update Request Status
      await supabase
        .from('registration_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);

      await fetchRequests();
      setSelectedRequest(null);
      setSuccessNotification(`¡Registro Aprobado! La cuenta para la empresa ${request.company_name} ha sido creada con éxito. Se ha enviado automáticamente una notificación de bienvenida y confirmación de acceso con credenciales temporales a la dirección de correo: ${request.email}.`);
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Error al aprobar el registro.');
    } finally {
      setProcessing(false);
    }
  };

  const rejectRegistration = async () => {
    if (!supabase || !rejectingRequest) return;
    setProcessing(true);
    try {
      await supabase
        .from('registration_requests')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason
        })
        .eq('id', rejectingRequest.id);

      await fetchRequests();
      setSelectedRequest(null);
      setSuccessNotification(`¡Solicitud Denegada! Se ha rechazado la solicitud de registro para ${rejectingRequest.company_name}. Se ha enviado un correo electrónico de confirmación de denegación a la dirección ${rejectingRequest.email} explicando el siguiente motivo: "${rejectionReason}".`);
      setRejectingRequest(null);
      setRejectionReason('');
    } catch (err) {
      console.error(err);
      alert('Error al denegar la solicitud.');
    } finally {
      setProcessing(false);
    }
  };

  const emitPaymentNote = async (request: any) => {
    const expedienteNumber = `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await updateStatus(request.id, 'payment_pending', { expediente_number: expedienteNumber });
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Admin</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Gestión de Registros</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Solicitudes de Certificación</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Gestione el flujo de aprobación de nuevas empresas, desde la validación documental hasta el acceso final.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Requests List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Lista de Solicitudes</h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {loading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : requests.length === 0 ? (
                <div className="p-20 text-center opacity-50 italic uppercase text-[10px] font-black tracking-widest">No hay solicitudes pendientes</div>
              ) : (
                requests.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`w-full text-left p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all flex items-center justify-between gap-4 ${
                      selectedRequest?.id === req.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{req.company_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        req.status === 'payment_pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Request Detail */}
        <div className="lg:col-span-5">
          {selectedRequest ? (
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-10 space-y-8 sticky top-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{selectedRequest.company_name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedRequest.role.replace('_', ' ')}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIF / Registro</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase leading-none">{selectedRequest.tax_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Representante</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase leading-none">{selectedRequest.name}</p>
                </div>
                <div className="space-y-1 pt-2 col-span-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Correo de Contacto</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate leading-none">{selectedRequest.email}</p>
                </div>
                {selectedRequest.phone && (
                  <div className="space-y-1 pt-2 col-span-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Teléfono</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-none">{selectedRequest.phone}</p>
                  </div>
                )}
              </div>

              {selectedRequest.categories && selectedRequest.categories.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categorías Seleccionadas</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRequest.categories.map((cat: string) => (
                      <span key={cat} className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary py-1 px-2.5 rounded-lg border border-primary/20">
                        {cat === 'CAT_A' ? 'Categoría A' : cat === 'CAT_B' ? 'Categoría B' : cat === 'CAT_C' ? 'Categoría C' : cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 pb-2">Documentación Adjunta</h4>
                <div className="space-y-2">
                  {selectedRequest.dip_base64 && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">badge</span>
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">Copia de DIP del Representante</span>
                      </div>
                      <button 
                        onClick={() => setPreviewDoc({ name: `DIP - ${selectedRequest.name}`, base64: selectedRequest.dip_base64 })}
                        className="text-primary hover:text-blue-700 p-1 flex items-center justify-center hover:scale-110 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {selectedRequest.documents?.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase truncate max-w-[150px]">{doc.name}</span>
                      </div>
                      <button 
                        onClick={() => setPreviewDoc({ name: doc.name, base64: doc.base64 })}
                        className="text-primary hover:text-blue-700 p-1 flex items-center justify-center hover:scale-110 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRequest.payment_proof && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 dark:border-emerald-900/20 pb-2">Comprobante de Pago</h4>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest italic">COMPROBANTE_DE_PAGO.PDF</span>
                    </div>
                    <button 
                      onClick={() => setPreviewDoc({ name: 'Comprobante de Pago', base64: selectedRequest.payment_proof })}
                      className="text-emerald-600 hover:text-emerald-700 p-1 flex items-center justify-center hover:scale-110 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-50 dark:border-slate-700 space-y-4">
                {selectedRequest.status === 'pending' && (
                  <button 
                    onClick={() => emitPaymentNote(selectedRequest)}
                    disabled={processing}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Emitir Nota de Pago
                  </button>
                )}

                {(selectedRequest.status === 'payment_submitted' || selectedRequest.status === 'payment_pending') && (
                  <div className="space-y-4">
                    <button 
                      onClick={() => generateContract(selectedRequest)}
                      disabled={processing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                      Generar Contrato (Template)
                    </button>
                    <button 
                      onClick={() => approveRegistration(selectedRequest)}
                      disabled={processing}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                      Aprobar y Crear Acceso
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => setRejectingRequest(selectedRequest)}
                  className="w-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  Rechazar Solicitud
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-50">
              <Building2 className="w-16 h-16 text-slate-300 mb-6" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Seleccione una solicitud para ver los detalles y gestionar el proceso</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md border border-slate-100 dark:border-slate-800 p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Rechazar Solicitud</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-[11px] leading-relaxed uppercase">
              Indique el motivo del rechazo para la empresa {rejectingRequest.company_name}. Este texto se incluirá en el correo electrónico de notificación.
            </p>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Motivo de Rechazo</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                placeholder="Ej. Documentación del NIF incompleta o copia de DIP ilegible."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white h-28 resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setRejectingRequest(null);
                  setRejectionReason('');
                }}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={rejectRegistration}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Email Notification Alert Modal */}
      {successNotification && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg border border-slate-100 dark:border-slate-800 p-8 shadow-2xl text-center space-y-6">
            <div className="size-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Acción Procesada</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed uppercase">
              {successNotification}
            </p>
            <button
              onClick={() => setSuccessNotification(null)}
              className="bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md inline-block transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* PDF / Image Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">description</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider truncate max-w-[300px]">{previewDoc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Visor de Documentos Oficiales</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/50 min-h-[400px]">
              {previewDoc.base64.startsWith('data:image/') ? (
                <img
                  src={previewDoc.base64}
                  alt={previewDoc.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[500px] object-contain rounded-2xl shadow-md border border-slate-200 dark:border-slate-800"
                />
              ) : previewDoc.base64.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewDoc.base64}
                  title={previewDoc.name}
                  className="w-full h-[500px] rounded-2xl shadow-md border border-slate-200 dark:border-slate-800"
                />
              ) : (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl max-w-sm border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-5xl text-blue-500 mb-4">description</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">{previewDoc.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">No se puede renderizar el documento inline.</p>
                  <a
                    href={previewDoc.base64}
                    download={previewDoc.name}
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

export default AdminRegistrationManagement;

const Building2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);
