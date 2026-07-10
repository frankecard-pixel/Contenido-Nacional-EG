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
  const [activeTemplateGroup, setActiveTemplateGroup] = useState<'ministerio' | 'empresas' | 'pymes' | 'otros'>('ministerio');
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
          {/* Quick templates for ministry directors/ministro grouped by category */}
          {isDirect && (
            <div className="p-4 bg-blue-50/50 dark:bg-slate-900/40 rounded-2xl border border-blue-100/50 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span> Plantillas de Autocompletado
                </span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Selecciona rol</span>
              </div>
              
              {/* Category Segmented Buttons */}
              <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTemplateGroup('ministerio')}
                  className={`flex-1 py-1.5 px-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                    activeTemplateGroup === 'ministerio'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Ministerio
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTemplateGroup('empresas')}
                  className={`flex-1 py-1.5 px-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                    activeTemplateGroup === 'empresas'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Operadoras / IOCs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTemplateGroup('pymes')}
                  className={`flex-1 py-1.5 px-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                    activeTemplateGroup === 'pymes'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  PYMEs Locales
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTemplateGroup('otros')}
                  className={`flex-1 py-1.5 px-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                    activeTemplateGroup === 'otros'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Otros Empleados
                </button>
              </div>

              {/* Group 1: Ministerio */}
              {activeTemplateGroup === 'ministerio' && (
                <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      setName("Ministro de Hidrocarburos");
                      setEmail("ministro@mmh.gob.gq");
                      setPhone("+240 222-1111");
                      setRole(UserRole.SUPER_ADMIN);
                      setDepartment("Despacho del Ministro");
                      setPosition("Ministro");
                      setPassword("Ministro2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Ministro</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">ministro@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Director General de Contenido Nacional");
                      setEmail("dgcn@mmh.gob.gq");
                      setPhone("+240 222-2222");
                      setRole(UserRole.SUPER_ADMIN);
                      setDepartment("Dirección de Contenido Nacional");
                      setPosition("Director General");
                      setPassword("DGCN2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">DGCN (Contenido Nac.)</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">dgcn@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Director de Inspección y Cumplimiento");
                      setEmail("inspeccion@mmh.gob.gq");
                      setPhone("+240 222-3333");
                      setRole(UserRole.CUERPO_TECNICO);
                      setDepartment("Inspección y Cumplimiento");
                      setPosition("Director de Área");
                      setPassword("Inspeccion2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Director Inspección</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">inspeccion@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Director de Comunicación");
                      setEmail("comunicacion@mmh.gob.gq");
                      setPhone("+240 222-4444");
                      setRole(UserRole.COMUNICACION);
                      setDepartment("Comunicaciones");
                      setPosition("Director de Prensa");
                      setPassword("Prensa2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Director Comunicación</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">comunicacion@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Secretaria Ejecutiva de Despacho");
                      setEmail("secretaria.ministro@mmh.gob.gq");
                      setPhone("+240 222-5555");
                      setRole(UserRole.FUNCIONARIO);
                      setDepartment("Despacho del Ministro");
                      setPosition("Secretaría Ejecutiva");
                      setPassword("Secretaria2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Secretaria de Despacho</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">secretaria.ministro@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Auxiliar del Secretariado General");
                      setEmail("auxiliar.despacho@mmh.gob.gq");
                      setPhone("+240 222-6666");
                      setRole(UserRole.FUNCIONARIO);
                      setDepartment("Secretariado General");
                      setPosition("Auxiliar Administrativo");
                      setPassword("Auxiliar2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Auxiliar Despacho</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">auxiliar.despacho@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Técnico Evaluador de Contenido");
                      setEmail("tecnico.analista@mmh.gob.gq");
                      setPhone("+240 222-7777");
                      setRole(UserRole.CUERPO_TECNICO);
                      setDepartment("Dirección de Contenido Nacional");
                      setPosition("Técnico de Contenido");
                      setPassword("Tecnico2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Técnico de Contenido</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">tecnico.analista@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Secretario de Actas");
                      setEmail("actas@mmh.gob.gq");
                      setPhone("+240 222-8888");
                      setRole(UserRole.FUNCIONARIO);
                      setDepartment("Secretariado General");
                      setPosition("Secretario de Actas");
                      setPassword("Actas2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Secretario de Actas</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">actas@mmh.gob.gq</span>
                  </button>
                </div>
              )}

              {/* Group 2: Empresas/Operadoras */}
              {activeTemplateGroup === 'empresas' && (
                <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      setName("Director de Empresa Operadora");
                      setEmail("director.gq@marathonoil.com");
                      setPhone("+240 555-0101");
                      setRole(UserRole.PETROLERA);
                      setDepartment("Dirección General");
                      setPosition("Director General GQ");
                      setPassword("Marathon2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Director de Empresa</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">director.gq@marathonoil.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Jefe de Recursos Humanos");
                      setEmail("rrhh.gq@chevron.com");
                      setPhone("+240 555-0202");
                      setRole(UserRole.PETROLERA);
                      setDepartment("Recursos Humanos");
                      setPosition("Director de RRHH");
                      setPassword("ChevronHR2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Jefe de RRHH</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">rrhh.gq@chevron.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Representante Técnico");
                      setEmail("ops.gq@exxonmobil.com");
                      setPhone("+240 555-0303");
                      setRole(UserRole.COMPANY);
                      setDepartment("Operaciones");
                      setPosition("Representante Técnico");
                      setPassword("ExxonOps2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Representante Técnico</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">ops.gq@exxonmobil.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Administrador de Contratos");
                      setEmail("contracts.gq@nobleenergy.com");
                      setPhone("+240 555-0404");
                      setRole(UserRole.COMPANY);
                      setDepartment("Suministros y Licitaciones");
                      setPosition("Gestor de Contratos");
                      setPassword("NobleContract2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Admin Contratos</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">contracts.gq@nobleenergy.com</span>
                  </button>
                </div>
              )}

              {/* Group 3: PYMEs */}
              {activeTemplateGroup === 'pymes' && (
                <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      setName("Director de PYME Nacional");
                      setEmail("director@serviciosguinea.gq");
                      setPhone("+240 333-0101");
                      setRole(UserRole.EMPRESA_LOCAL);
                      setDepartment("Gerencia General");
                      setPosition("Director de Empresa");
                      setPassword("ServiciosG2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Dir. PYME Nacional</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">director@serviciosguinea.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Administrador de PYME");
                      setEmail("admin@logisticalitoral.gq");
                      setPhone("+240 333-0202");
                      setRole(UserRole.EMPRESA_LOCAL);
                      setDepartment("Administración");
                      setPosition("Administrador de Empresa");
                      setPassword("LogisticaL2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Admin de PYME</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">admin@logisticalitoral.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Responsable de Cuentas");
                      setEmail("comercial@consultoriaecuatorial.gq");
                      setPhone("+240 333-0303");
                      setRole(UserRole.ADVERTISER);
                      setDepartment("Comercial");
                      setPosition("Gestor de Cuentas");
                      setPassword("ConsultoriaE2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Anunciante Especializado</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">comercial@consultoriaecuatorial.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Representante de la Comunidad");
                      setEmail("comunidad@rebola.gq");
                      setPhone("+240 444-0101");
                      setRole(UserRole.COMUNIDAD);
                      setDepartment("Desarrollo Comunitario");
                      setPosition("Portavoz Local");
                      setPassword("Rebola2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Líder Comunitario</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">comunidad@rebola.gq</span>
                  </button>
                </div>
              )}

              {/* Group 4: Otros Empleados / Perfiles Generales */}
              {activeTemplateGroup === 'otros' && (
                <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      setName("Funcionario de Administración");
                      setEmail("funcionario@mmh.gob.gq");
                      setPhone("+240 222-9901");
                      setRole(UserRole.FUNCIONARIO);
                      setDepartment("Recursos Humanos y Finanzas");
                      setPosition("Técnico Administrativo");
                      setPassword("Funcionario2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Funcionario Administrativo</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">funcionario@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Analista Técnico de Contenido");
                      setEmail("analista@mmh.gob.gq");
                      setPhone("+240 222-9902");
                      setRole(UserRole.CUERPO_TECNICO);
                      setDepartment("Dirección de Contenido Nacional");
                      setPosition("Analista de Datos");
                      setPassword("Analista2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Analista Técnico</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">analista@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Gestor de Empleo y Capacitación");
                      setEmail("empleo@mmh.gob.gq");
                      setPhone("+240 222-9903");
                      setRole(UserRole.FUNCIONARIO);
                      setDepartment("Formación y Empleo");
                      setPosition("Gestor de Plataforma");
                      setPassword("Empleo2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Gestor Bolsa Empleo</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">empleo@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Asesor Jurídico del Ministerio");
                      setEmail("legal@mmh.gob.gq");
                      setPhone("+240 222-9904");
                      setRole(UserRole.CUERPO_TECNICO);
                      setDepartment("Gabinete Jurídico");
                      setPosition("Asesor Legal");
                      setPassword("Legal2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Asesor Jurídico</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">legal@mmh.gob.gq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Profesional / Solicitante de Empleo");
                      setEmail("solicitante@gmail.com");
                      setPhone("+240 222-9905");
                      setRole(UserRole.PERSONA);
                      setDepartment("Sector Público");
                      setPosition("Candidato / Profesional Independiente");
                      setPassword("Solicitante2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Persona / Solicitante</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">solicitante@gmail.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName("Auditor de Cumplimiento Externo");
                      setEmail("auditor@deloitte.gq");
                      setPhone("+240 222-9906");
                      setRole(UserRole.ADMIN);
                      setDepartment("Auditoría Externa");
                      setPosition("Auditor Principal de Contratos");
                      setPassword("Auditor2026*");
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-left tracking-tight flex flex-col justify-center"
                  >
                    <span className="text-slate-800 dark:text-white">Auditor Externo</span>
                    <span className="text-[8px] text-slate-400 normal-case font-bold">auditor@deloitte.gq</span>
                  </button>
                </div>
              )}
            </div>
          )}

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

