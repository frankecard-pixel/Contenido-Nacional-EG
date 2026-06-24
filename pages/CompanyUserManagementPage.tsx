
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers, getUserById } from '../services/supabaseApi';
import { User, UserRole, UserStatus, CompanyUserRole } from '../types';
import UserFilters from '../components/admin/UserFilters';
import UserTable from '../components/admin/UserTable';
import InviteUserModal from '../components/admin/InviteUserModal';
import { useAuth } from '../contexts/AuthContext';

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

  const isCompanyAdmin = dbUser?.companyRole === 'admin' || dbUser?.role === 'company';

  const handleInviteUser = (email: string, name: string, role: string) => {
    if (!isCompanyAdmin) return;
    // Mock adding user to the list
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
    setUsersData(prev => [...prev, newUser]);
    // Here you would typically call a Supabase Edge Function to invite the user
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
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedUser.companyRole === role ? 'border-primary bg-blue-50 text-primary dark:bg-primary/10' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 italic">
                  * Los administradores pueden gestionar otros usuarios. Los editores pueden subir documentos. Los lectores solo pueden visualizar información.
                </p>
              </div>
            </div>

            <div className="p-10 bg-slate-50 dark:bg-slate-900/50 flex gap-4">
              <button onClick={() => setIsPermissionsModalOpen(false)} className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                Cancelar
              </button>
              <button onClick={() => setIsPermissionsModalOpen(false)} className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
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
        <span className="text-primary">Gestión de Usuarios</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Usuarios de la Empresa</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">
            Administra los accesos de tu equipo. Puedes invitar a nuevos colaboradores y asignar niveles de acceso (Admin, Editor, Lector).
          </p>
        </div>
        {isCompanyAdmin && (
          <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-xl">person_add</span>
            Invitar Colaborador
          </button>
        )}
      </div>

      <InviteUserModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onInvite={handleInviteUser} 
      />

      {/* Content Card */}
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

        {/* Pagination placeholder */}
        <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/30 dark:border-slate-700 dark:bg-slate-900/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Total colaboradores: <span className="text-slate-900 dark:text-white ml-1">{usersData.length}</span>
          </p>
        </div>
      </div>

      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Ministerio de Hidrocarburos, Minas y Electricidad • República de Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default CompanyUserManagementPage;
