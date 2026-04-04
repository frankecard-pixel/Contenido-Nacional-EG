import React from 'react';
import { UserRole } from '../../../types';

interface LoginPortalGridProps {
  portals: { role: UserRole; label: string; icon: string; desc: string }[];
  loading: boolean;
  selectedRole: UserRole | null;
  onPortalAccess: (role: UserRole) => void;
}

const LoginPortalGrid: React.FC<LoginPortalGridProps> = ({ portals, loading, selectedRole, onPortalAccess }) => {
  return (
    <div className="p-8 lg:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/50">
      {portals.map((portal) => (
        <button
          key={portal.role}
          onClick={() => onPortalAccess(portal.role)}
          disabled={loading}
          className={`group text-left p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-start ${
            loading && selectedRole === portal.role 
            ? 'bg-blue-600 border-blue-600 scale-[0.98]' 
            : 'bg-white border-white hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 shadow-sm'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm transition-colors ${
            loading && selectedRole === portal.role ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50'
          }`}>
            {portal.icon}
          </div>
          <h4 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${
            loading && selectedRole === portal.role ? 'text-white' : 'text-slate-900'
          }`}>
            {portal.label}
          </h4>
          <p className={`text-[10px] font-bold leading-tight ${
            loading && selectedRole === portal.role ? 'text-blue-100' : 'text-slate-400'
          }`}>
            {portal.desc}
          </p>
          {loading && selectedRole === portal.role && (
             <div className="mt-4 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default LoginPortalGrid;
