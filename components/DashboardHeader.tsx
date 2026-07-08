
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Notification } from '../types';
import { supabase } from '../services/supabaseClient';
import { getNotifications, updateNotificationReadState, markAllNotificationsAsRead } from '../services/supabaseApi';
import { toast } from 'sonner';

interface HeaderProps {
  user: User;
  onToggleSidebar: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const fetchHeaderNotifications = async () => {
    if (!user?.id) return;
    try {
      const data = await getNotifications(user.id);
      setNotifications(data as Notification[]);
    } catch (error) {
      console.error("Error fetching notifications for header:", error);
    }
  };

  useEffect(() => {
    fetchHeaderNotifications();

    if (!user?.id || !supabase) return;

    // Set up real-time listener for the 'notifications' table where user_id = user.id
    const channel = supabase
      .channel(`header-realtime-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newDbNotif = payload.new;
          const mapped: Notification = {
            id: newDbNotif.id,
            type: newDbNotif.type || (newDbNotif.title?.toLowerCase().includes('licitaci') ? 'opportunity' : newDbNotif.title?.toLowerCase().includes('mensaje') ? 'message' : 'system'),
            title: newDbNotif.title,
            description: newDbNotif.content || newDbNotif.description || '',
            timestamp: new Date(newDbNotif.created_at).toLocaleDateString(),
            isRead: newDbNotif.read !== undefined ? newDbNotif.read : (newDbNotif.is_read || false),
            actionLabel: newDbNotif.action_label || (newDbNotif.title?.toLowerCase().includes('licitaci') ? 'Ver Licitación' : undefined),
            category: newDbNotif.category || (newDbNotif.title?.toLowerCase().includes('licitaci') ? 'Oportunidades' : 'Sistema')
          };
          setNotifications(prev => [mapped, ...prev]);
          toast.info(`Nueva Alerta: ${mapped.title}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('Notificaciones marcadas como leídas');
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!user?.id) return;
    if (!notif.isRead) {
      await updateNotificationReadState(user.id, notif.id, true);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shrink-0 transition-colors">
      <div className="flex items-center space-x-4">
        {/* Hamburger Button (Mobile Only) */}
        <button 
          onClick={onToggleSidebar}
          className="xl:hidden p-2 text-slate-500 hover:text-blue-600 transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="hidden md:flex items-center space-x-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Coat_of_arms_of_Equatorial_Guinea.svg" className="h-5 object-contain shadow-sm rounded-sm" alt="GE Coat of Arms" />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <h2 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Ministerio de Hidrocarburos, Minas y Electricidad</h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-full max-w-sm mx-4">
        <span className="material-symbols-outlined text-slate-400 text-lg mr-2">search</span>
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-0 w-full"
        />
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
                       {/* Notificaciones con Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-md transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${showNotifications ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                 <span className="material-symbols-outlined text-xl">notifications</span>
                 {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center tracking-tight leading-none">
                     {unreadCount}
                   </span>
                 )}
              </button>

              {/* Dropdown de Notificaciones */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-[120] animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notificaciones</h3>
                    <span 
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                    >
                      Marcar leídas
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-400 italic">No tienes notificaciones</p>
                    ) : (
                      notifications.slice(0, 5).map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-xs ${!notif.isRead ? 'font-black text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>{notif.title}</h4>
                            {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0 ml-2"></span>}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{notif.description}</p>
                          <span className="text-[9px] font-bold text-slate-400 mt-2 block uppercase tracking-wider">{notif.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 text-center border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Link 
                      to={`/dashboard/${user.role}/notifications`}
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block w-full py-1"
                    >
                      Ver todas
                    </Link>
                  </div>
                </div>
              )}
            </div>
           
           <Link 
             to={`/dashboard/${user.role}/messages`} 
             className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all hidden sm:block"
           >
              <span className="material-symbols-outlined text-xl">mail</span>
           </Link>
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

        <div className="flex items-center space-x-3 relative" ref={userMenuRef}>
           <button 
             onClick={() => setShowUserMenu(!showUserMenu)}
             className="flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-all"
           >
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-0.5">{user.name}</p>
                <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t(`roles.${user.role}`)}</p>
             </div>
             <div className="size-9 rounded-md bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white font-black text-sm shadow-sm">
                {user.name?.charAt(0) || '?'}
             </div>
           </button>

           {showUserMenu && (
             <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[120] animate-in fade-in slide-in-from-top-2">
               <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                 <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                 <p className="text-[10px] font-medium text-slate-400 truncate">{user.email}</p>
               </div>
               <div className="p-2">
                 <Link 
                   to={`/dashboard/${user.role}/profile`}
                   onClick={() => setShowUserMenu(false)}
                   className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                 >
                   <span className="material-symbols-outlined text-lg">person</span>
                   Perfil
                 </Link>
                 <Link 
                   to={`/dashboard/${user.role}/settings`}
                   onClick={() => setShowUserMenu(false)}
                   className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                 >
                   <span className="material-symbols-outlined text-lg">settings</span>
                   Configuración
                 </Link>
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                 >
                   <span className="material-symbols-outlined text-lg">logout</span>
                   Cerrar Sesión
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
