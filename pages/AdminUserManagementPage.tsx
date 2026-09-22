
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers, getCompanies, createCompany, updateUser, createUser, getLoginLogs, resetUserPassword } from '../services/supabaseApi';
import { User, UserRole, UserStatus, Company } from '../types';
import { useAuth } from '../contexts/AuthContext';
import UserFilters from '../components/admin/UserFilters';
import UserTable from '../components/admin/UserTable';
import InviteUserModal from '../components/admin/InviteUserModal';
import { toast } from 'sonner';

const AdminUserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [usersData, setUsersData] = useState<User[]>([]);
  const [companiesData, setCompaniesData] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'admin' | 'local_companies' | 'petroleras' | 'personas'>('admin');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { user: authUser, role: userRole } = useAuth();
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [users, companies] = await Promise.all([getUsers(), getCompanies()]);
      if (users) {
        setUsersData(users as unknown as User[]);
      }
      if (companies) {
        setCompaniesData(companies as unknown as Company[]);
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;
    try {
      setIsLoading(true);
      await updateUser(selectedUser.id, userData);
      toast.success('Usuario actualizado correctamente');
      setIsEditModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast.error('Error al actualizar usuario: ' + (err.message || 'Intentelo de nuevo'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
    setNewPassword('');
  };

  const onUpdatePassword = async () => {
    if (!selectedUser || !newPassword) return;
    try {
      setIsUpdatingPassword(true);
      
      // Intentamos enviar correo de recuperación (es lo más seguro desde el cliente)
      await resetUserPassword(selectedUser.email);
      
      toast.success(`Se ha enviado un correo de recuperación a ${selectedUser.email}`);
      setIsPasswordModalOpen(false);
    } catch (err) {
      console.error('Error in password reset:', err);
      toast.error('Error al solicitar el cambio de contraseña');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleInviteUser = async (
    email: string, 
    name: string, 
    role: string, 
    extraData?: { 
      isDirect: boolean; 
      password?: string; 
      phone?: string; 
      department?: string; 
      position?: string;
      companyId?: string;
      newCompanyData?: {
        name: string;
        taxId?: string;
        type?: 'local' | 'international';
        sector?: string[];
        address?: string;
      };
    }
  ) => {
    try {
      setIsLoading(true);
      const isDirect = extraData?.isDirect || false;
      let assignedCompanyId = extraData?.companyId;

      // If user requested creating a new company for this user, create it in DB first
      if (extraData?.newCompanyData && extraData.newCompanyData.name) {
        try {
          const compResult = await createCompany({
            name: extraData.newCompanyData.name,
            taxId: extraData.newCompanyData.taxId,
            type: extraData.newCompanyData.type || (role === UserRole.EMPRESA_LOCAL ? 'local' : 'international'),
            sector: extraData.newCompanyData.sector || ['Servicios'],
            address: extraData.newCompanyData.address || 'Malabo, Guinea Ecuatorial',
            email: email,
            status: 'pending',
          });
          if (compResult && compResult.id) {
            assignedCompanyId = compResult.id;
            toast.success(`Empresa "${compResult.name}" creada exitosamente`);
          }
        } catch (compErr: any) {
          console.error('Error creating company during user invite:', compErr);
          toast.error('Error al crear la empresa: ' + (compErr.message || 'Error en base de datos'));
        }
      }

      const newUser: Partial<User> = {
        email,
        name,
        role: role as UserRole,
        status: isDirect ? 'active' : 'pending',
        isOnline: false,
        permissions: [],
        phone: extraData?.phone || undefined,
        department: extraData?.department || undefined,
        position: extraData?.position || undefined,
        companyId: assignedCompanyId || undefined,
        companyRole: assignedCompanyId ? 'admin' : undefined
      };
      
      await createUser(newUser, extraData?.password);
      
      toast.success(isDirect ? 'Usuario creado correctamente' : 'Invitación enviada correctamente');

      // Trigger WhatsApp/n8n notification
      if (extraData?.phone) {
        const { triggerN8nNotification } = await import('../services/n8nService');
        await triggerN8nNotification(
          'user_created', 
          extraData.phone, 
          name, 
          { 
            email, 
            role, 
            status: isDirect ? 'active' : 'invited',
            password_assigned: isDirect ? (extraData.password || 'contraseña temporal') : 'autoregistro',
            department: extraData.department || '',
            position: extraData.position || '',
            link: window.location.origin + '/login'
          }
        );
      }
      
      await fetchData(); // Refresh list
      setIsInviteModalOpen(false);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError('Error al crear el usuario: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      setIsLoading(true);
      await updateUser(user.id, { status: 'active' });
      await fetchData(); // Refresh list
    } catch (err: any) {
      console.error('Error activating user:', err);
      setError('Error al activar el usuario: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlockUser = async (user: User) => {
    try {
      setIsLoading(true);
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await updateUser(user.id, { status: newStatus });
      await fetchData(); // Refresh list
    } catch (err: any) {
      console.error('Error toggling user block status:', err);
      setError('Error al cambiar estado del usuario: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const adminUsers = useMemo(() => {
    return usersData.filter(u => 
      u.role === UserRole.SUPER_ADMIN || 
      u.role === UserRole.ADMIN || 
      u.role === UserRole.FUNCIONARIO || 
      u.role === UserRole.CUERPO_TECNICO ||
      u.role === UserRole.COMUNICACION
    );
  }, [usersData]);

  const localCompanyUsers = useMemo(() => {
    return usersData.filter(u => 
      u.role === UserRole.EMPRESA_LOCAL || 
      u.role === UserRole.EMPRESA
    );
  }, [usersData]);

  const petroleraUsers = useMemo(() => {
    return usersData.filter(u => 
      u.role === UserRole.PETROLERA || 
      u.role === UserRole.COMPANY
    );
  }, [usersData]);

  const personaUsers = useMemo(() => {
    return usersData.filter(u => 
      u.role === UserRole.PERSONA
    );
  }, [usersData]);

  const currentUsers = useMemo(() => {
    switch (activeTab) {
      case 'admin':
        return adminUsers;
      case 'local_companies':
        return localCompanyUsers;
      case 'petroleras':
        return petroleraUsers;
      case 'personas':
        return personaUsers;
      default:
        return adminUsers;
    }
  }, [activeTab, adminUsers, localCompanyUsers, petroleraUsers, personaUsers]);

  const filteredUsers = useMemo(() => {
    return currentUsers.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (u.position || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'Todos' || t(`roles.${u.role}`).includes(roleFilter);
      const matchesDept = deptFilter === 'Todos' || u.department === deptFilter;
      
      return matchesSearch && matchesRole && matchesDept;
    });
  }, [searchQuery, roleFilter, deptFilter, currentUsers, t]);

  const departments = ['Todos', 'Dirección General', 'Hidrocarburos', 'TI / Sistemas', 'Comunicaciones', 'Legal / Cumplimiento'];

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
      case 'inactive':
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
            <span className="size-1.5 rounded-full bg-slate-400"></span>
            Inactivo
          </span>
        );
      default: return null;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleColors: Record<string, string> = {
      [UserRole.SUPER_ADMIN]: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
      [UserRole.FUNCIONARIO]: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      [UserRole.CUERPO_TECNICO]: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
      [UserRole.COMUNICACION]: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border ${roleColors[role] || 'bg-slate-50 text-slate-600'}`}>
        {t(`roles.${role}`)}
      </span>
    );
  };

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openPermissionsModal = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsModalOpen(true);
  };

  const handleViewLogs = async (user: User) => {
    try {
      setSelectedUser(user);
      setIsLogsModalOpen(true);
      setIsLoadingLogs(true);
      const logs = await getLoginLogs(user.id);
      setUserLogs(logs);
    } catch (err) {
      console.error('Error loading logs:', err);
      toast.error('Error al cargar logs de acceso');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <InviteUserModal 
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)} 
          onInvite={handleInviteUser}
          companies={companiesData}
        />
      )}

      {/* Login Logs Modal */}
      {isLogsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">history</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Logs de Acceso</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Usuario: {selectedUser.name} • {selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setIsLogsModalOpen(false)} className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {isLoadingLogs ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                   <div className="size-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cargando historial...</p>
                </div>
              ) : userLogs.length > 0 ? (
                <div className="space-y-4">
                  <table className="w-full text-left">
                    <thead className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-700 pb-4">
                      <tr>
                        <th className="pb-4">Fecha y Hora</th>
                        <th className="pb-4">IP</th>
                        <th className="pb-4">Ubicación</th>
                        <th className="pb-4">Dispositivo / Navegador</th>
                        <th className="pb-4 text-right">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {userLogs.map((log) => (
                        <tr key={log.id} className="group">
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {new Date(log.login_at).toLocaleDateString()}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                {new Date(log.login_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                              {log.ip_address}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-slate-400">location_on</span>
                              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                                {log.city}, {log.country}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-[10px] font-bold text-slate-500 truncate max-w-[200px] block" title={log.user_agent}>
                              {log.user_agent}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            {log.logout_at ? (
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                                {log.session_duration_minutes} min
                              </span>
                            ) : (
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100 dark:border-blue-800 animate-pulse">
                                Sesión Activa
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
                   <span className="material-symbols-outlined text-7xl mb-4">history_toggle_off</span>
                   <p className="text-[10px] font-black uppercase tracking-widest">No hay logs de acceso registrados para este usuario</p>
                </div>
              )}
            </div>

            <div className="p-10 bg-slate-50 dark:bg-slate-900/50 flex justify-end shrink-0">
              <button onClick={() => setIsLogsModalOpen(false)} className="px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                  <span className="material-symbols-outlined text-3xl">edit_square</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Editar Usuario</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {selectedUser.id}</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const companyIdValue = (formData.get('companyId') as string) || undefined;
              handleUpdateUser({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                position: formData.get('position') as string,
                department: formData.get('department') as string,
                status: formData.get('status') as UserStatus,
                role: formData.get('role') as UserRole,
                companyId: companyIdValue,
              });
            }} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                  <input name="name" defaultValue={selectedUser.name} required className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Sólo lectura)</label>
                  <input name="email" type="email" value={selectedUser.email} readOnly className="w-full h-14 px-6 bg-slate-100 dark:bg-slate-950 border-none rounded-2xl text-[11px] font-bold text-slate-400 cursor-not-allowed" />
                  <p className="text-[9px] text-slate-400 mt-1 ml-1">El email no puede cambiarse por seguridad de la cuenta.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cargo / Puesto</label>
                  <input name="position" defaultValue={selectedUser.position} className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Departamento</label>
                  <input name="department" defaultValue={selectedUser.department} className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Estado</label>
                  <select name="status" defaultValue={selectedUser.status} className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all">
                    <option value="active">Activo</option>
                    <option value="pending">Pendiente</option>
                    <option value="inactive">Inactivo</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rol de Usuario</label>
                  <select name="role" defaultValue={selectedUser.role} className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all">
                    {Object.entries(UserRole).map(([key, value]) => (
                      <option key={value} value={value}>{key.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Empresa Asociada</label>
                <select 
                  name="companyId" 
                  defaultValue={selectedUser.companyId || ''} 
                  className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="">-- Sin Empresa Asociada (Administrativo / Sin entidad) --</option>
                  {companiesData.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.taxId ? `(${c.taxId})` : ''} {c.type ? `• ${c.type.toUpperCase()}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-10 py-4 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button type="submit" className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                  <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Password</h2>
                </div>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                Vas a cambiar la contraseña para <b>{selectedUser.email}</b>. Esta acción es crítica y solo permitida para Super Admins.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" 
                />
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={onUpdatePassword}
                  disabled={!newPassword || isUpdatingPassword}
                  className="w-full py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-500/20 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isUpdatingPassword ? 'Procesando...' : 'Confirmar Cambio de Contraseña'}
                </button>
                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tight">
                  Nota: Se enviará notificación al usuario.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold uppercase tracking-widest border border-red-100">
          {error}
        </div>
      )}

      {/* Permissions Modal */}
      {isPermissionsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Configurar Derechos</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Usuario: {selectedUser.name}</p>
              </div>
              <button onClick={() => setIsPermissionsModalOpen(false)} className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Nivel de Acceso en Empresa</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['admin', 'editor', 'viewer'].map((role) => (
                    <button 
                      key={role}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedUser.companyRole === role ? 'border-primary bg-blue-50 text-primary dark:bg-primary/10' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Permisos Específicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Ver Contratos', 'Editar Perfil', 'Publicar Noticias', 
                    'Gestionar Usuarios', 'Acceso a Licitaciones', 'Reportes Técnicos'
                  ].map((perm) => (
                    <label key={perm} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 cursor-pointer group hover:bg-slate-100 transition-all">
                      <div className="size-6 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-primary transition-colors">
                        <div className="size-3 bg-primary rounded-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 dark:bg-slate-900/50 flex gap-4">
              <button onClick={() => setIsPermissionsModalOpen(false)} className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                Cancelar
              </button>
              <button onClick={() => setIsPermissionsModalOpen(false)} className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <a className="hover:text-primary transition-colors" href="#">Inicio</a>
        <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
        <a className="hover:text-primary transition-colors" href="#">Configuración</a>
        <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
        <span className="text-primary">Usuarios Admin</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Usuarios y Permisos</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">
            Administra los accesos y niveles de permiso de todos los usuarios del ecosistema. Configura derechos para funcionarios y representantes de empresas.
          </p>
        </div>
        {isSuperAdmin && (
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">person_add</span>
            Nuevo Usuario
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('admin')}
          className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'admin' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Ministerio y Administradores ({adminUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('local_companies')}
          className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'local_companies' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Empresas de Contenido Nacional ({localCompanyUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('petroleras')}
          className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'petroleras' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Operadoras Petroleras ({petroleraUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('personas')}
          className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'personas' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Profesionales y Talento ({personaUsers.length})
        </button>
      </div>

      {/* Content Card */}
      <div className="flex flex-col rounded-[3rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
        
        {/* Toolbar */}
        <UserFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          departments={departments}
        />

        {/* Table */}
        <UserTable 
          filteredUsers={filteredUsers}
          getRoleBadge={getRoleBadge}
          getStatusBadge={getStatusBadge}
          companies={companiesData}
          onEditPermissions={openPermissionsModal}
          onActivateUser={handleActivateUser}
          onToggleBlockUser={handleToggleBlockUser}
          onViewLogs={handleViewLogs}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsEditModalOpen(true);
          }}
          onResetPassword={handleResetPassword}
          canManage={isSuperAdmin}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-10 py-8 dark:border-slate-700 dark:bg-slate-900/20">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Mostrando <span className="text-slate-900 dark:text-white mx-1">{filteredUsers.length}</span> usuarios en esta categoría
          </div>
          <div className="flex items-center gap-4">
            <button disabled className="px-8 py-3 bg-white border border-slate-200 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Anterior</button>
            <div className="flex gap-2">
               <button className="size-10 bg-primary text-white font-black text-xs rounded-xl shadow-lg shadow-primary/20">1</button>
               <button className="size-10 bg-white border border-slate-100 text-slate-400 font-black text-xs rounded-xl hover:bg-slate-50 transition-all">2</button>
            </div>
            <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Siguiente</button>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Ministerio de Hidrocarburos, Minas y Electricidad • República de Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default AdminUserManagementPage;
