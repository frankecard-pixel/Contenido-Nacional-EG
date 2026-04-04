import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers } from '../../services/supabaseApi';
import { User } from '../../types';

interface DashboardRoleSelectorProps {
  currentUserId: string;
  handleRoleChange: (userId: string) => void;
  isOnline: boolean;
}

const DashboardRoleSelector: React.FC<DashboardRoleSelectorProps> = ({ currentUserId, handleRoleChange, isOnline }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data as any);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white/90 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4">
      <div className="flex items-center w-full sm:w-auto bg-slate-50 dark:bg-slate-900 rounded-2xl p-1 pr-4 shadow-inner">
        <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
          <span className="material-symbols-outlined text-xl">account_circle</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Identidad Actual:</span>
          <select 
            value={currentUserId}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-tight focus:ring-0 cursor-pointer text-slate-900 dark:text-white"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {t(`roles.${u.role}`).toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Soberanía de Datos Activa</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardRoleSelector;
