
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers, getUserById, getAuditLogs } from '../services/supabaseApi';
import { User, UserRole, UserStatus, CompanyUserRole } from '../types';
import UserFilters from '../components/admin/UserFilters';
import UserTable from '../components/admin/UserTable';
import InviteUserModal from '../components/admin/InviteUserModal';
import { useAuth } from '../contexts/AuthContext';
import { Users, MessageSquare, History, Send, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const CompanyUserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [usersData, setUsersData] = useState<User[]>([]);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'coordinacion' | 'trazabilidad'>('colaboradores');

  // Coordination tab state
  const [teamMessages, setTeamMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authUser) {
          const userData = await getUserById(authUser.id);
          setDbUser(userData as any);
          
          const data = await getUsers();
          const companyId = (userData as any)?.companyId || (userData as any)?.company_id;
          
          if (data && companyId) {
            const filtered = (data as unknown as User[]).filter(u => u.companyId === companyId);
            setUsersData(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching company users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [authUser]);

  const companyId = dbUser?.companyId || 'company-generic';

  // Load Team coordination logs
  useEffect(() => {
    const storageKey = `team_chat_logs_${companyId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setTeamMessages(JSON.parse(stored));
    } else {
      const initialMsgs = [
        { id: 'm-1', userName: 'Carlos Mba', companyRole: 'admin', text: 'Hola equipo, bienvenidos al canal de coordinación interna de la empresa. Aquí podemos organizar nuestras tareas para las licitaciones.', timestamp: '10:30 AM' },
        { id: 'm-2', userName: 'Sofia Obono', companyRole: 'editor', text: 'Estupendo. Ya he actualizado la solvencia fiscal y el Certificado de Registro de Empresas.', timestamp: '11:15 AM' }
      ];
      localStorage.setItem(storageKey, JSON.stringify(initialMsgs));
      setTeamMessages(initialMsgs);
    }
  }, [companyId]);

  // Load team modifications logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await getAuditLogs();
        const teamNames = usersData.map(u => u.name.toLowerCase());
        const filteredLogs = (logs || []).filter((log: any) => 
          teamNames.includes((log.userName || log.user?.name || '').toLowerCase())
        );

        if (filteredLogs.length === 0 && usersData.length > 0) {
          const generated = [
            { id: 't-1', userName: usersData[0]?.name || 'Administrador', action: 'Actualizó el Perfil Corporativo', timestamp: 'Hace 10 minutos', status: 'success' },
            { id: 't-2', userName: usersData[1]?.name || 'Sofia Obono', action: 'Subió Documento "Solvencia_Fiscal.pdf"', timestamp: 'Hace 2 horas', status: 'success' },
            { id: 't-3', userName: usersData[0]?.name || 'Administrador', action: 'Invitó a un nuevo colaborador', timestamp: 'Ayer', status: 'success' }
          ];
          setAuditLogs(generated);
        } else {
          setAuditLogs(filteredLogs);
        }
      } catch (e) {
        console.error("Error loading team logs:", e);
      }
    };
    if (usersData.length > 0) {
      fetchLogs();
    }
  }, [usersData]);

  const isCompanyAdmin = dbUser?.companyRole === 'admin' || dbUser?.role === 'company';

  const handleInviteUser = (email: string, name: string, role: string) => {
    if (!isCompanyAdmin) return;
    const newUser: User = {
      id: Math.random().toString(),
      name,
      email,
      role: UserRole.COMPANY,
      companyRole: role as any,
      status: 'pending',
      companyId: dbUser?.companyId,
      isOnline: false,
      permissions: []
    };
    const updatedUsers = [...usersData, newUser];
    setUsersData(updatedUsers);
    toast.success(`Se ha enviado una invitación a ${name}`);

    // Log the invitation action
    const newLog = {
      id: `log-${Date.now()}`,
      userName: dbUser?.name || 'Admin',
      action: `Invitó al colaborador ${name} (${role})`,
      timestamp: 'Ahora mismo',
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !dbUser) return;
    const msg = {
      id: `msg-${Date.now()}`,
      userName: dbUser.name,
      companyRole: dbUser.companyRole || 'colaborador',
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...teamMessages, msg];
    setTeamMessages(updated);
    localStorage.setItem(`team_chat_logs_${companyId}`, JSON.stringify(updated));
    setNewMessageText('');
    
    // Log the message action
    const newLog = {
      id: `log-${Date.now()}`,
      userName: dbUser.name,
      action: 'Publicó nota en el Muro de Coordinación',
      timestamp: 'Ahora mismo',
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const filteredUsers = useMemo(() => {
    return usersData.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (u.position || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'Todos' || (u.companyRole && u.companyRole.includes(roleFilter));
      
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter, usersData]);

  const getStatusBadge = (status?: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Activo
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700 border border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pendiente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
            <span className="size-1.5 rounded-full bg-slate-400"></span>
            Inactivo
          </span>
        );
    }
  };

  const getRoleBadge = (role: UserRole) => {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
        {t(`roles.${role}`)}
      </span>
    );
  };

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openPermissionsModal = (user: User) => {
    if (!isCompanyAdmin) return;
    setSelectedUser(user);
    setIsPermissionsModalOpen(true);
  };

  const handleUpdateRole = () => {
    if (!selectedUser) return;
    setIsPermissionsModalOpen(false);
    toast.success(`Se ha actualizado el rol de ${selectedUser.name}`);

    const newLog = {
      id: `log-${Date.now()}`,
      userName: dbUser?.name || 'Admin',
      action: `Modificó permisos del colaborador ${selectedUser.name}`,
      timestamp: 'Ahora mismo',
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Permissions Modal */}
      {isPermissionsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gestionar Acceso</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Colaborador: {selectedUser.name}</p>
              </div>
              <button onClick={() => setIsPermissionsModalOpen(false)} className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Nivel de Acceso</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['admin', 'editor', 'viewer'].map((role) => (
                    <button 
                      key={role}
                      onClick={() => setSelectedUser({ ...selectedUser, companyRole: role as any })}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedUser.companyRole === role ? 'border-primary bg-blue-50 text-primary dark:bg-primary/10' : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 italic">
                  * Los administradores pueden gestionar otros usuarios. Los editores pueden subir documentos y actualizar datos. Los lectores solo pueden visualizar información.
                </p>
              </div>
            </div>

            <div className="p-10 bg-slate-50 dark:bg-slate-900/50 flex gap-4">
              <button onClick={() => setIsPermissionsModalOpen(false)} className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                Cancelar
              </button>
              <button onClick={handleUpdateRole} className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
                Actualizar Rol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <a className="hover:text-primary transition-colors" href="#">Panel</a>
        <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
        <span className="text-primary">Espacio de Trabajo del Equipo</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Espacio de Trabajo y Coordinación</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">
            Colabora con los miembros de tu empresa en tiempo real, comparte notas de tareas y mantén la trazabilidad de qué usuario ha modificado información del equipo.
          </p>
        </div>
        {isCompanyAdmin && activeTab === 'colaboradores' && (
          <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-xl">person_add</span>
            Invitar Colaborador
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-8">
        <button 
          onClick={() => setActiveTab('colaboradores')}
          className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'colaboradores' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Users className="w-4 h-4" />
          Miembros del Equipo
        </button>
        <button 
          onClick={() => setActiveTab('coordinacion')}
          className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'coordinacion' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <MessageSquare className="w-4 h-4" />
          Muro de Coordinación
        </button>
        <button 
          onClick={() => setActiveTab('trazabilidad')}
          className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'trazabilidad' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <History className="w-4 h-4" />
          Trazabilidad y Cambios
        </button>
      </div>

      <InviteUserModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onInvite={handleInviteUser} 
      />

      {activeTab === 'colaboradores' && (
        <div className="flex flex-col rounded-[3rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
          {/* Toolbar */}
          <UserFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            deptFilter={deptFilter}
            setDeptFilter={setDeptFilter}
            departments={['Todos', 'Administración', 'Operaciones', 'Técnico', 'Legal']}
          />

          {/* Table */}
          <UserTable 
            filteredUsers={filteredUsers}
            getRoleBadge={getRoleBadge}
            getStatusBadge={getStatusBadge}
            onEditPermissions={isCompanyAdmin ? openPermissionsModal : undefined}
          />

          {/* Footer stats */}
          <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/30 dark:border-slate-700 dark:bg-slate-900/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total colaboradores: <span className="text-slate-900 dark:text-white ml-1">{usersData.length}</span>
            </p>
          </div>
        </div>
      )}

      {activeTab === 'coordinacion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 flex flex-col h-[500px] shadow-sm">
            <div className="border-b border-slate-50 dark:border-slate-700 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Muro de Trabajo</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Notas internas visibles para todo el equipo</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {teamMessages.map((msg) => (
                <div key={msg.id} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-200 text-xs">
                    {msg.userName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{msg.userName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-slate-900 text-[8px] font-black uppercase text-blue-600 border border-blue-100 dark:border-slate-800">{msg.companyRole}</span>
                      <span className="text-[9px] font-bold text-slate-400 ml-auto">{msg.timestamp}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-[1.25rem] text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-700 flex gap-3">
              <input 
                type="text" 
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe un mensaje de coordinación..." 
                className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
              <button 
                onClick={handleSendMessage}
                className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Canales y Contacto Directo</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-950 rounded-2xl flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                    #
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase">#coordinacion-general</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Canal activo de la empresa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trazabilidad' && (
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 p-10 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Trazabilidad de Cambios</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registro de auditoría interna de modificaciones de datos y documentos realizados por miembros de la empresa.</p>
          </div>

          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-6 rounded-[2rem] border border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-6 hover:border-blue-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase">
                      {log.userName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {log.action}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5 tracking-widest">
                    {log.timestamp}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[8px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    Éxito
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Ministerio de Hidrocarburos, Minas y Electricidad • República de Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default CompanyUserManagementPage;
