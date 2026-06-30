import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../../types';

interface UserDirectoryProps {
  currentUser: User;
  users: User[];
  onStartChat: (otherUser: User) => void;
}

const UserDirectory: React.FC<UserDirectoryProps> = ({ currentUser, users, onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const searchableUsers = useMemo(() => {
    // 1. Filter out the current user
    // 2. Filter out anyone who has allow_search === false
    return users.filter(u => u.id !== currentUser.id && u.allow_search !== false);
  }, [users, currentUser]);

  const filteredUsers = useMemo(() => {
    return searchableUsers.filter(u => {
      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) {
        return false;
      }
      
      // Text search
      const term = searchQuery.toLowerCase();
      const nameMatch = (u.name || '').toLowerCase().includes(term);
      const positionMatch = (u.position || '').toLowerCase().includes(term);
      const deptMatch = (u.department || '').toLowerCase().includes(term);
      const emailMatch = (u.email || '').toLowerCase().includes(term);
      
      return nameMatch || positionMatch || deptMatch || emailMatch;
    });
  }, [searchQuery, roleFilter, searchableUsers]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Súper Administrador';
      case UserRole.FUNCIONARIO:
        return 'Funcionario MMH';
      case UserRole.CUERPO_TECNICO:
        return 'Cuerpo Técnico';
      case UserRole.PETROLERA:
        return 'Operador Petrolero';
      case UserRole.COMPANY:
      case UserRole.EMPRESA:
      case UserRole.EMPRESA_LOCAL:
        return 'Empresa Local / PYME';
      case UserRole.PERSONA:
        return 'Profesional Técnico';
      default:
        return 'Usuario del Sistema';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400';
      case UserRole.FUNCIONARIO:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400';
      case UserRole.CUERPO_TECNICO:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400';
      case UserRole.PETROLERA:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div id="user-directory-container" className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 space-y-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Buscador de Usuarios</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Conecta con ingenieros, inspectores y empresas locales homologadas</p>
          </div>
          
          <div className="flex gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'funcionario', label: 'Funcionarios' },
              { id: 'cuerpo_tecnico', label: 'Auditores' },
              { id: 'company', label: 'Empresas' },
              { id: 'persona', label: 'Técnicos' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  roleFilter === tab.id
                    ? 'bg-primary text-white shadow-sm shadow-primary/10'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input 
            type="text" 
            placeholder="Buscar por nombre, cargo, departamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <div className="size-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">person_search</span>
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">No se encontraron usuarios</p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-1 uppercase">Prueba otra consulta o cambia de filtro</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUsers.map(u => (
              <div 
                key={u.id}
                className="p-5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={u.avatar_url || u.avatar || 'https://picsum.photos/seed/user/200'} 
                      className="size-12 rounded-2xl object-cover" 
                      alt={u.name} 
                    />
                    {u.isOnline && (
                      <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-4 border-slate-50 dark:border-slate-950"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase truncate tracking-tight">{u.name}</h4>
                      {u.linkedin_url && (
                        <span 
                          title="LinkedIn Verificado"
                          className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[7px] font-black tracking-tighter"
                        >
                          IN
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5 truncate">
                      {u.position || 'Colaborador técnico'}
                    </p>
                    
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 truncate">
                      {u.department || 'Sin departamento'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-3 mt-1">
                  <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider ${getRoleBadgeColor(u.role)}`}>
                    {getRoleLabel(u.role)}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => onStartChat(u)}
                    className="flex items-center gap-1.5 bg-primary hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                  >
                    <span className="material-symbols-outlined text-xs">chat</span>
                    <span>Chatear</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDirectory;
