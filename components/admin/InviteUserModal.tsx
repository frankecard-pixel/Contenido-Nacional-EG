import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../../types';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, name: string, role: string) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, onInvite }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('viewer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(email, name, role);
    setEmail('');
    setName('');
    setRole('viewer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Invitar Colaborador</h2>
          <button onClick={onClose} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nombre Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
              placeholder="correo@empresa.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nivel de Acceso</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
            >
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="viewer">Lector</option>
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
              Enviar Invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
