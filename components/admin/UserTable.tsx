import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserRole, UserStatus, Company } from '../../types';

interface UserTableProps {
  filteredUsers: User[];
  getRoleBadge: (role: UserRole) => React.ReactNode;
  getStatusBadge: (status?: UserStatus) => React.ReactNode;
  companies?: Company[];
  onEditPermissions?: (user: User) => void;
  onActivateUser?: (user: User) => void;
  onToggleBlockUser?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ filteredUsers, getRoleBadge, getStatusBadge, companies = [], onEditPermissions, onActivateUser, onToggleBlockUser }) => {
  const getCompanyName = (companyId?: string) => {
    if (!companyId) return null;
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : `ID: ${companyId}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:bg-slate-900/50">
          <tr>
            <th className="px-10 py-6" scope="col">Usuario</th>
            <th className="px-10 py-6" scope="col">Rol / Nivel Acceso</th>
            <th className="px-10 py-6" scope="col">Entidad / Depto</th>
            <th className="px-10 py-6" scope="col">Estado</th>
            <th className="px-10 py-6 text-right" scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
          {filteredUsers.length > 0 ? filteredUsers.map((user) => (
            <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
              <td className="px-10 py-8">
                <div className="flex items-center gap-5">
                  <div className="relative">
                     <div className="size-12 rounded-2xl bg-slate-100 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center font-black text-slate-400 text-lg">
                       {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || 'U')}
                     </div>
                     {user.isOnline && <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-4 border-white bg-green-500 dark:border-slate-800 shadow-sm"></div>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{user.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-10 py-8">
                <div className="flex flex-col gap-2">
                   {getRoleBadge(user.role)}
                   {user.companyRole && (
                     <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                       <span className="material-symbols-outlined text-xs">verified</span>
                       Nivel: {user.companyRole}
                     </span>
                   )}
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.permissions.length === 1 && user.permissions[0] === '*' ? 'Acceso Total' : `${user.permissions.length} Permisos Específicos`}</p>
                </div>
              </td>
              <td className="px-10 py-8">
                <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                  {user.companyId ? (
                    <div className="flex flex-col">
                      <span className="text-primary font-black">{getCompanyName(user.companyId)}</span>
                      <span className="text-[9px] text-slate-400">ID: {user.companyId}</span>
                    </div>
                  ) : (user.department || 'Sin Asignar')}
                </span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.position || '-'}</p>
              </td>
              <td className="px-10 py-8">
                {getStatusBadge(user.status)}
              </td>
              <td className="px-10 py-8 text-right">
                <div className="flex items-center justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                  {user.status === 'pending' && onActivateUser && (
                    <button 
                      onClick={() => onActivateUser(user)}
                      className="p-3 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-all" 
                      title="Aprobar / Activar Usuario"
                    >
                      <span className="material-symbols-outlined font-black">check_circle</span>
                    </button>
                  )}
                  {onEditPermissions && (
                    <button 
                      onClick={() => onEditPermissions(user)}
                      className="p-3 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" 
                      title="Editar Permisos"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  )}
                  {onToggleBlockUser && (
                    <button 
                      onClick={() => onToggleBlockUser(user)}
                      className={`p-3 rounded-xl transition-all ${user.status === 'suspended' ? 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50' : 'text-red-500 hover:text-red-700 hover:bg-red-50/50'}`}
                      title={user.status === 'suspended' ? "Activar / Desbloquear Usuario" : "Bloquear / Suspender Usuario"}
                    >
                      <span className="material-symbols-outlined font-black">
                        {user.status === 'suspended' ? 'lock_open' : 'lock'}
                      </span>
                    </button>
                  )}
                  <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Opciones">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="px-10 py-32 text-center">
                <div className="flex flex-col items-center opacity-30 grayscale">
                   <span className="material-symbols-outlined text-8xl mb-4">person_search</span>
                   <p className="text-sm font-black uppercase tracking-[0.4em]">No se encontraron funcionarios</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
