import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../../types';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (
    email: string, 
    name: string, 
    role: string, 
    extraData?: { 
      isDirect: boolean; 
      password?: string; 
      phone?: string; 
      department?: string; 
      position?: string;
    }
  ) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, onInvite }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>(UserRole.FUNCIONARIO);
  
  // Direct creation additions
  const [isDirect, setIsDirect] = useState(false);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(email, name, role, {
      isDirect,
      password: isDirect ? password : undefined,
      phone: isDirect || phone ? phone : undefined,
      department: isDirect || department ? department : undefined,
      position: isDirect || position ? position : undefined,
    });
    
    // Reset fields
    setEmail('');
    setName('');
    setRole(UserRole.FUNCIONARIO);
    setPassword('');
    setPhone('');
    setDepartment('');
    setPosition('');
    setIsDirect(false);
    onClose();
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300 my-8">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {isDirect ? 'Crear Usuario Directamente' : 'Invitar Colaborador'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isDirect ? 'Crea cuenta activa con contraseña y datos técnicos' : 'Envía invitación para que complete su registro'}
            </p>
          </div>
          <button onClick={onClose} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-2">
          <button 
            type="button"
            onClick={() => setIsDirect(false)}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${!isDirect ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Enviar Invitación
          </button>
          <button 
            type="button"
            onClick={() => setIsDirect(true)}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${isDirect ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Crear Directamente
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nombre Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
              placeholder="Ej: Manuel Nguema"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
              placeholder="m.nguema@mmh.gob.gq"
            />
          </div>

          {/* Phone Number Field - VERY IMPORTANT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>Número de Teléfono</span>
              {isDirect && <span className="text-red-500 font-bold">*</span>}
              <span className="text-[8px] text-slate-400 font-bold lowercase tracking-normal">(Para confirmaciones y alertas)</span>
            </label>
            <input 
              type="tel" 
              required={isDirect}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
              placeholder="+240 222-3333"
            />
          </div>

          {/* Password only in direct creation mode */}
          {isDirect && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex justify-between">
                <span>Contraseña <span className="text-red-500 font-bold">*</span></span>
                <button 
                  type="button" 
                  onClick={generateRandomPassword}
                  className="text-[9px] text-blue-600 hover:underline lowercase tracking-normal"
                >
                  Generar contraseña
                </button>
              </label>
              <input 
                type="text" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
                placeholder="Contraseña segura o temporal"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nivel de Acceso</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
            >
              <optgroup label="Ministerio">
                <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                <option value={UserRole.FUNCIONARIO}>Funcionario</option>
                <option value={UserRole.CUERPO_TECNICO}>Cuerpo Técnico</option>
                <option value={UserRole.COMUNICACION}>Comunicación</option>
              </optgroup>
              <optgroup label="Comunidades y Otros">
                <option value={UserRole.COMPANY}>Empresa (IOC)</option>
                <option value={UserRole.EMPRESA_LOCAL}>Empresa Local (PYME)</option>
                <option value={UserRole.PETROLERA}>Operadora Petrolera</option>
                <option value={UserRole.PERSONA}>Talento Nacional</option>
                <option value={UserRole.ADVERTISER}>Anunciante</option>
              </optgroup>
            </select>
          </div>

          {/* Technical Data fields (Department and Position) */}
          {isDirect && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Departamento</label>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
                  placeholder="Ej: Comunicaciones"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cargo / Puesto</label>
                <input 
                  type="text" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
                  placeholder="Ej: Editor Senior"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
              {isDirect ? 'Crear Cuenta Activa' : 'Enviar Invitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;

