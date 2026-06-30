import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  getConversations, 
  getMessagesByConversation, 
  sendMessage, 
  createGroup, 
  getStatusUpdates,
  getUsers,
  updateUser
} from '../services/supabaseApi';
import { supabase } from '../services/supabaseClient';
import { ConversationExt, MessageExt, User, UserStatusUpdate } from '../types';

// Modular Sub-Components
import ChatSidebar, { ChatTabType } from '../components/messages/ChatSidebar';
import ChatConversation from '../components/messages/ChatConversation';
import UserDirectory from '../components/messages/UserDirectory';
import PrivacySettings from '../components/messages/PrivacySettings';
import LinkedInIntegration from '../components/messages/LinkedInIntegration';

interface MessagesProps {
  user?: User | null;
}

const Messages: React.FC<MessagesProps> = ({ user }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ChatTabType>('chats');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<ConversationExt[]>([]);
  const [messages, setMessages] = useState<MessageExt[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<UserStatusUpdate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [viewingStatus, setViewingStatus] = useState<UserStatusUpdate | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync user prop to state
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [convsData, statusData, usersData] = await Promise.all([
          getConversations(user.id),
          getStatusUpdates() as Promise<UserStatusUpdate[]>,
          getUsers()
        ]);
        
        setConversations(convsData as any[]);
        setStatusUpdates(statusData);
        setUsers(usersData);
        
        if (convsData && convsData.length > 0) {
          setActiveConvId(convsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching messaging data:", error);
        toast.error("Error al cargar mensajes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Global subscription for real-time notifications
  useEffect(() => {
    if (!supabase || !user?.id) return;

    const channel = supabase
      .channel('global-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          const newMessage = payload.new as MessageExt;
          
          // Check if the message belongs to one of the user's active conversations
          const isMyConv = conversations.some(c => c.id === newMessage.conversation_id);
          
          if (isMyConv && newMessage.sender_id !== user.id) {
            // Update messages if it's the active conversation
            if (newMessage.conversation_id === activeConvId) {
              setMessages(prev => {
                if (prev.find(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
              });
            } else {
              // If it's not the active conversation, show a toast alert
              const conv = conversations.find(c => c.id === newMessage.conversation_id);
              const senderName = conv?.type === 'group' 
                ? `${conv.name}` 
                : (conv?.participant_1 === user.id ? conv?.participant2?.name : conv?.participant?.name);
              
              toast(`Nuevo mensaje de ${senderName}`, {
                description: newMessage.text,
                action: {
                  label: 'Ver',
                  onClick: () => {
                    setActiveConvId(newMessage.conversation_id);
                    setActiveTab(conv?.type === 'group' ? 'groups' : 'chats');
                  }
                }
              });
            }
            
            // Update conversations list with last message
            setConversations(prev => prev.map(c => {
              if (c.id === newMessage.conversation_id) {
                return {
                  ...c,
                  last_message: newMessage.text,
                  last_message_at: newMessage.timestamp,
                  unread_count: (c.unread_count || 0) + (newMessage.conversation_id !== activeConvId ? 1 : 0)
                };
              }
              return c;
            }).sort((a, b) => 
              new Date(b.last_message_at || b.timestamp).getTime() - 
              new Date(a.last_message_at || a.timestamp).getTime()
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, conversations, activeConvId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConvId) return;
      try {
        const data = await getMessagesByConversation(activeConvId);
        setMessages(data as any[]);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [activeConvId]);

  const activeConv = useMemo(() => {
    return conversations.find(c => c.id === activeConvId) || null;
  }, [activeConvId, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser?.id || !activeConvId) return;

    const messageData = {
      conversation_id: activeConvId,
      sender_id: currentUser.id,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      is_read: false
    };

    try {
      // Optimistic update
      const tempId = Math.random().toString();
      const newMsg: MessageExt = {
        ...messageData,
        id: tempId,
        sender: {
          name: currentUser.name,
          role: currentUser.role,
          avatar_url: currentUser.avatar_url || currentUser.avatar || 'https://picsum.photos/seed/me/200'
        }
      } as any;
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
      
      // Update sidebar conversation text immediately
      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            last_message: messageData.text,
            last_message_at: messageData.timestamp
          };
        }
        return c;
      }).sort((a, b) => 
        new Date(b.last_message_at || b.timestamp).getTime() - 
        new Date(a.last_message_at || a.timestamp).getTime()
      ));

      await sendMessage(messageData);
    } catch (error) {
      console.warn("Message sent locally (simulation):", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedMembers.length === 0 || !currentUser?.id) return;
    
    try {
      const newGroup = await createGroup(newGroupName, selectedMembers, currentUser.id);
      if (newGroup) {
        setConversations(prev => [newGroup as any, ...prev]);
        setActiveConvId(newGroup.id);
        setShowGroupModal(false);
        setNewGroupName('');
        setSelectedMembers([]);
        setActiveTab('groups');
        toast.success("Grupo creado con éxito");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error al crear grupo");
    }
  };

  // Start a new chat from search directory
  const handleStartChat = (otherUser: User) => {
    if (!currentUser) return;
    
    // Check if we already have a conversation with this person
    const existing = conversations.find(c => {
      if (c.type === 'group') return false;
      return (c.participant_1 === currentUser.id && c.participant_2 === otherUser.id) ||
             (c.participant_1 === otherUser.id && c.participant_2 === currentUser.id);
    });

    if (existing) {
      setActiveConvId(existing.id);
      setActiveTab('chats');
      toast.info(`Abriendo chat con ${otherUser.name}`);
      return;
    }

    // Otherwise, dynamically construct a new conversation
    const newConvId = `conv-${currentUser.id}-${otherUser.id}`;
    const newConv: ConversationExt = {
      id: newConvId,
      type: 'direct',
      participant_1: currentUser.id,
      participant_2: otherUser.id,
      participantName: otherUser.name,
      participantRole: otherUser.position || otherUser.role,
      avatar: otherUser.avatar_url || otherUser.avatar || 'https://picsum.photos/seed/user/200',
      lastMessage: 'Inicia esta conversación...',
      last_message: 'Inicia esta conversación...',
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      unread_count: 0,
      isOnline: otherUser.is_online || otherUser.isOnline || false,
      is_online: otherUser.is_online || otherUser.isOnline || false,
      participant: {
        name: otherUser.name,
        avatar_url: otherUser.avatar_url || otherUser.avatar || 'https://picsum.photos/seed/user/200',
        role: otherUser.role,
        is_online: otherUser.is_online || otherUser.isOnline || false
      },
      participant2: {
        name: currentUser.name,
        avatar_url: currentUser.avatar_url || currentUser.avatar || 'https://picsum.photos/seed/user/200',
        role: currentUser.role,
        is_online: currentUser.is_online || currentUser.isOnline || false
      },
      last_message_at: new Date().toISOString()
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConvId);
    setActiveTab('chats');
    toast.success(`Iniciando nuevo chat con ${otherUser.name}`);
  };

  const handleUpdateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Update users directory list locally
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentUserSafe = currentUser || user || null;

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar Navigation */}
      <nav className="w-16 md:w-20 flex flex-col items-center py-8 bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shrink-0">
        <div className="size-10 md:size-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-10 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-2xl md:text-3xl">chat</span>
        </div>
        
        <div className="flex flex-col gap-5 flex-1">
          {[
            { id: 'chats', icon: 'chat_bubble', label: 'Chats' },
            { id: 'groups', icon: 'groups', label: 'Grupos' },
            { id: 'status', icon: 'data_usage', label: 'Estados' },
            { id: 'directory', icon: 'person_search', label: 'Directorio' },
            { id: 'settings', icon: 'manage_accounts', label: 'Ajustes' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ChatTabType)}
              className={`p-3 md:p-3.5 rounded-2xl transition-all relative group ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={tab.label}
            >
              <span className="material-symbols-outlined text-xl md:text-2xl">{tab.icon}</span>
              {activeTab === tab.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <div className="relative">
            <img 
              src={currentUserSafe?.avatar_url || currentUserSafe?.avatar || 'https://picsum.photos/seed/me/200'} 
              className="size-10 md:size-11 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" 
              alt="Me" 
            />
            <div className="absolute -bottom-1 -right-1 size-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"></div>
          </div>
        </div>
      </nav>

      {/* Conditional Secondary Sidebar / Main Area */}
      {activeTab !== 'directory' && activeTab !== 'settings' ? (
        <ChatSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          conversations={conversations}
          activeConvId={activeConvId}
          setActiveConvId={setActiveConvId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusUpdates={statusUpdates}
          onViewStatus={setViewingStatus}
          onShowGroupModal={() => setShowGroupModal(true)}
          currentUser={currentUserSafe}
        />
      ) : null}

      {/* Main Panel */}
      <main className="flex-1 h-full overflow-hidden relative bg-slate-50/50 dark:bg-slate-950/20">
        {activeTab === 'directory' ? (
          <div className="p-6 md:p-10 h-full overflow-y-auto">
            {currentUserSafe && (
              <UserDirectory 
                currentUser={currentUserSafe}
                users={users}
                onStartChat={handleStartChat}
              />
            )}
          </div>
        ) : activeTab === 'settings' ? (
          <div className="p-6 md:p-10 h-full overflow-y-auto max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ajustes del Perfil Profesional</h2>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Configura tu visibilidad y vincula tu ecosistema profesional</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUserSafe && (
                <>
                  <PrivacySettings 
                    currentUser={currentUserSafe}
                    onUpdateUser={handleUpdateCurrentUser}
                  />
                  <LinkedInIntegration 
                    currentUser={currentUserSafe}
                    onUpdateUser={handleUpdateCurrentUser}
                  />
                </>
              )}
            </div>
          </div>
        ) : activeConv ? (
          <ChatConversation 
            activeConv={activeConv}
            currentUser={currentUserSafe}
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center h-full">
            <div className="size-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
              <span className="material-symbols-outlined text-4xl">chat_bubble</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Canal de Comunicación</h3>
            <p className="text-xs font-medium text-slate-400 max-w-xs uppercase tracking-tight leading-relaxed">
              Selecciona un chat activo de la barra lateral o busca un usuario en el buscador para iniciar una conversación segura.
            </p>
          </div>
        )}
      </main>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Nuevo Grupo</h3>
                <button onClick={() => setShowGroupModal(false)} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Nombre del Grupo</label>
                  <input 
                    type="text" 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Ej: Inspectores Bioko Norte"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white placeholder-slate-400"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Seleccionar Miembros</label>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                    {users.filter(u => u.id !== currentUserSafe?.id).map(u => (
                      <label key={u.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <input 
                          type="checkbox" 
                          checked={selectedMembers.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedMembers(prev => [...prev, u.id]);
                            else setSelectedMembers(prev => prev.filter(id => id !== u.id));
                          }}
                          className="size-5 rounded-lg border-slate-300 text-primary focus:ring-primary"
                        />
                        <img src={u.avatar_url || u.avatar || 'https://picsum.photos/seed/user/200'} className="size-10 rounded-xl object-cover" alt={u.name} />
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{u.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{u.role}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
              <button 
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || selectedMembers.length === 0}
                className="flex-1 py-4 bg-primary hover:bg-blue-700 disabled:opacity-30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
              >
                Crear Grupo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Viewer Modal */}
      {viewingStatus && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg aspect-[9/16] bg-slate-900 overflow-hidden shadow-2xl">
            <img src={viewingStatus.content_url} className="w-full h-full object-cover" alt="Status" />
            
            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-progress-bar"></div>
              </div>
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <img src={viewingStatus.user_avatar} className="size-10 rounded-full border-2 border-white" alt={viewingStatus.user_name} />
                <div>
                  <h4 className="text-sm font-black text-white uppercase">{viewingStatus.user_name}</h4>
                  <p className="text-[10px] font-bold text-white/60 uppercase">
                    {new Date(viewingStatus.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingStatus(null)} className="text-white">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-10 left-0 right-0 p-8 text-center z-10">
              <p className="text-white text-xs font-black uppercase tracking-widest bg-black/40 backdrop-blur-md py-4 px-6 rounded-2xl inline-block border border-white/10">
                {viewingStatus.text_content || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress-bar 5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Messages;
