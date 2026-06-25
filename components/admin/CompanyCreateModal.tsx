import React, { useState } from 'react';
import { User } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { createCompany, updateUser } from '../../services/supabaseApi';

interface CompanyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onCompanyCreated: () => void;
}

const CompanyCreateModal: React.FC<CompanyCreateModalProps> = ({ isOpen, onClose, users, onCompanyCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    type: 'local',
    status: 'certified',
    selectedUserId: ''
  });

  const availableUsers = users.filter(u => !u.companyId && (u.role === 'company' || u.role === 'empresa_local' || u.role === 'persona'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error('Supabase no está disponible');

      // Check duplicate
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .ilike('name', formData.name)
        .maybeSingle();

      if (existingCompany) {
        throw new Error('Ya existe una empresa con ese nombre.');
      }

      const { data: existingRequest } = await supabase
        .from('registration_requests')
        .select('id')
        .ilike('company_name', formData.name)
        .neq('status', 'rejected')
        .limit(1);

      if (existingRequest && existingRequest.length > 0) {
        throw new Error('Ya existe una solicitud en curso para una empresa con ese nombre.');
      }

      // Create company
      const companyData = await createCompany({
        name: formData.name,
        taxId: formData.taxId,
        type: formData.type as 'local' | 'international',
        status: formData.status as any,
      });

      if (!companyData || !companyData.id) {
        throw new Error('Error al crear la empresa en la base de datos.');
      }

      // Link user if selected
      if (formData.selectedUserId) {
        await updateUser(formData.selectedUserId, { companyId: companyData.id });
      }

      onCompanyCreated();
      onClose();
    } catch (err: any) {
      console.error("Error creating company:", err);
      setError(err.message || 'Error al crear la empresa');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Nueva Empresa</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wide">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Nombre de la Empresa *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold"
                placeholder="Nombre de la empresa"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">NIF / Identificación Fiscal *</label>
              <input 
                type="text" 
                required
                value={formData.taxId}
                onChange={e => setFormData({...formData, taxId: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold"
                placeholder="GE-XXXXXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Tipo</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold"
                >
                  <option value="local">Local</option>
                  <option value="international">Internacional</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Estado</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold"
                >
                  <option value="certified">Activa / Certificada</option>
                  <option value="pending">Pendiente</option>
                  <option value="suspended">Suspendida</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Asignar a un Usuario (Opcional)</label>
              <select 
                value={formData.selectedUserId}
                onChange={e => setFormData({...formData, selectedUserId: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold"
              >
                <option value="">-- No asignar usuario --</option>
                {availableUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Si selecciona un usuario, este será el administrador de la empresa en la plataforma.</p>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white p-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Crear Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyCreateModal;
