import React, { useMemo } from 'react';
import { ConversationExt, User, UserStatusUpdate } from '../../types';

export type ChatTabType = 'chats' | 'groups' | 'status' | 'directory' | 'settings';

interface ChatSidebarProps {
  activeTab: ChatTabType;
  setActiveTab: (tab: ChatTabType) => void;
  conversations: ConversationExt[];
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusUpdates: UserStatusUpdate[];
  onViewStatus: (status: UserStatusUpdate) => void;
  onShowGroupModal: () => void;
  currentUser: User | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeTab,
  setActiveTab,
  conversations,
  activeConvId,
  setActiveConvId,
  searchQuery,
  setSearchQuery,
  statusUpdates,
  onViewStatus,
  onShowGroupModal,
  currentUser,
}) => {
  const filteredConvs = useMemo(() => {
    const base = conversations.filter(c => {
      if (activeTab === 'chats') return c.type !== 'group';
      if (activeTab === 'groups') return c.type === 'group';
      return false;
    });

    return base.filter(c => {
      const name = c.type === 'group' ? c.name : (c.participant_1 === currentUser?.id ? c.participant2?.name : c.participant?.name || '');
      return (name || '').toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, conversations, activeTab, currentUser]);

  const hasConversations = filteredConvs.length > 0;

  return (
    <aside className="w-full md:w-80 lg:w-[360px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 h-full">
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {activeTab === 'chats' 
              ? 'Chats' 
              : activeTab === 'groups' 
                ? 'Grupos' 
                : activeTab === 'status' 
                  ? 'Estados' 
                  : activeTab === 'directory' 
                    ? 'Buscador' 
                    : 'Ajustes'}
          </h2>
          {activeTab === 'groups' && (
            <button 
              onClick={onShowGroupModal}
              className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"
              title="Crear Nuevo Grupo"
            >
              <span className="material-symbols-outlined text-xl">group_add</span>
            </button>
          )}
        </div>
        
        {(activeTab === 'chats' || activeTab === 'groups' || activeTab === 'status') && (
          <div className="relative group">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input 
              type="text" 
              placeholder={activeTab === 'status' ? "Buscar estados..." : "Buscar chats..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white placeholder-slate-400"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'status' ? (
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/50">
              <div className="relative shrink-0">
                <img 
                  src={currentUser?.avatar_url || currentUser?.avatar || 'https://picsum.photos/seed/me/200'} 
                  className="size-12 rounded-full object-cover border-2 border-primary p-0.5" 
                  alt="My Status" 
                />
                <div className="absolute bottom-0 right-0 size-4.5 rounded-full bg-primary text-white flex items-center justify-center border border-white dark:border-slate-900">
                  <span className="material-symbols-outlined text-xs">add</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Mi Estado</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Añadir actualización de hoy</p>
              </div>
            </div>

            <div className="px-2">
              <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Actualizaciones Recientes</h5>
              {statusUpdates.length === 0 ? (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide text-center py-6">No hay estados disponibles</p>
              ) : (
                <div className="space-y-3">
                  {statusUpdates.map(status => (
                    <div 
                      key={status.id} 
                      onClick={() => onViewStatus(status)}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50"
                    >
                      <div className="size-12 rounded-full border-2 border-emerald-500 p-0.5 shrink-0">
                        <img src={status.user_avatar} className="size-full rounded-full object-cover" alt={status.user_name} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase truncate">{status.user_name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          {new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (activeTab === 'chats' || activeTab === 'groups') ? (
          !hasConversations ? (
            <div className="py-12 px-6 text-center">
              <div className="size-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">chat_bubble_outline</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">No hay chats activos</p>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-1 uppercase leading-relaxed">
                Utiliza la pestaña <strong>Buscador</strong> para encontrar otros usuarios e iniciar una nueva conversación.
              </p>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const participant = conv.type === 'group' ? null : (conv.participant_1 === currentUser?.id ? conv.participant2 : conv.participant);
              const name = conv.type === 'group' ? conv.name : (participant?.name || 'Usuario');
              const avatar = conv.type === 'group' ? (conv.avatar_url || 'https://picsum.photos/seed/group/200') : (participant?.avatar_url || (participant as any)?.avatar || 'https://picsum.photos/seed/user/200');
              const isOnline = conv.type === 'group' ? false : (participant?.is_online || (participant as any)?.isOnline);

              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConvId(conv.id)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-all border-l-4 ${
                    activeConvId === conv.id 
                      ? 'bg-blue-50/50 dark:bg-primary/5 border-primary shadow-inner' 
                      : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-850/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={avatar} className="size-12 rounded-2xl object-cover shadow-sm" alt={name} />
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{name}</h3>
                      <span className={`text-[8px] font-black uppercase tracking-widest shrink-0 ${activeConvId === conv.id ? 'text-primary' : 'text-slate-400'}`}>
                        {new Date(conv.last_message_at || conv.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-[11px] font-medium truncate uppercase tracking-tight ${activeConvId === conv.id ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                      {conv.last_message || 'Inicia la conversación...'}
                    </p>
                    {conv.unread_count > 0 && (
                      <div className="mt-2 flex justify-end">
                        <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">{conv.unread_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )
        ) : null}
      </div>
    </aside>
  );
};

export default ChatSidebar;
