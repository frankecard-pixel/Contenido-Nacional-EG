
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseClient';
import { createUser } from '../services/supabaseApi';
import { UserRole } from '../types';
import { CheckCircle, XCircle, Clock, Eye, Download, FileText, Loader2, Search, Filter, CreditCard, UserPlus } from 'lucide-react';

const AdminRegistrationManagement: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

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
      await supabase.from('companies').insert([{
        name: request.company_name,
        taxId: request.tax_id,
        type: request.role === UserRole.EMPRESA_LOCAL ? 'local' : 'international',
        sector: request.sectors,
        status: 'active',
        email: request.email,
        registrationDate: new Date().toISOString()
      }]);

      // 3. Update Request Status
      await supabase
        .from('registration_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);

      await fetchRequests();
      setSelectedRequest(null);
      alert('Registro aprobado y cuenta de empresa creada.');
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Error al aprobar el registro.');
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

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIF / Registro</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{selectedRequest.tax_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Representante</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{selectedRequest.name}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 pb-2">Documentación Adjunta</h4>
                <div className="space-y-2">
                  {selectedRequest.documents?.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase truncate max-w-[150px]">{doc.name}</span>
                      </div>
                      <button className="text-primary hover:text-blue-700 p-1">
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
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest italic">PAGO_BANCARIO.PDF</span>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 p-1">
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

                <button className="w-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all">
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
    </div>
  );
};

export default AdminRegistrationManagement;

const Building2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);
