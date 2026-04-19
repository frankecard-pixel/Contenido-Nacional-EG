
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  getConversations, 
  getMessagesByConversation, 
  sendMessage, 
  createGroup, 
  getStatusUpdates,
  getUsers
} from '../services/supabaseApi';
import { supabase } from '../services/supabaseClient';
import { ConversationExt, MessageExt, User, UserStatusUpdate } from '../types';

interface MessagesProps {
  user?: User | null;
}

type TabType = 'chats' | 'groups' | 'status';

const Messages: React.FC<MessagesProps> = ({ user }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('chats');
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
        setUsers(usersData.filter(u => u.id !== user.id));
        
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

  // Global subscription for notifications
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
          
          // Check if the message is for one of the user's conversations
          const isMyConv = conversations.some(c => c.id === newMessage.conversation_id);
          
          if (isMyConv && newMessage.sender_id !== user.id) {
            // Update messages if it's the active conversation
            if (newMessage.conversation_id === activeConvId) {
              setMessages(prev => {
                if (prev.find(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
              });
            } else {
              // If it's not the active conversation, show a toast
              const conv = conversations.find(c => c.id === newMessage.conversation_id);
              const senderName = conv?.type === 'group' 
                ? `${conv.name}` 
                : (conv?.participant_1 === user.id ? conv?.participant2?.name : conv?.participant?.name);
              
              toast(`Nuevo mensaje de ${senderName}`, {
                description: newMessage.text,
                action: {
                  label: 'Ver',
                  onClick: () => setActiveConvId(newMessage.conversation_id)
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

  const activeConv = useMemo(() => 
    conversations.find(c => c.id === activeConvId) || conversations[0]
  , [activeConvId, conversations]);

  const filteredConvs = useMemo(() => {
    const base = conversations.filter(c => {
      if (activeTab === 'chats') return c.type !== 'group';
      if (activeTab === 'groups') return c.type === 'group';
      return false;
    });

    return base.filter(c => {
      const name = c.type === 'group' ? c.name : (c.participant?.name || c.participant2?.name || '');
      return (name || '').toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, conversations, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user?.id || !activeConvId) return;

    const messageData = {
      conversation_id: activeConvId,
      sender_id: user.id,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      is_read: false
    };

    try {
      // Optimistic update
      const tempId = Math.random().toString();
      setMessages(prev => [...prev, { ...messageData, id: tempId } as any]);
      setInputText('');
      
      await sendMessage(messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error al enviar mensaje");
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedMembers.length === 0 || !user?.id) return;
    
    try {
      const newGroup = await createGroup(newGroupName, selectedMembers, user.id);
      if (newGroup) {
        setConversations(prev => [newGroup as any, ...prev]);
        setActiveConvId(newGroup.id);
        setShowGroupModal(false);
        setNewGroupName('');
        setSelectedMembers([]);
        toast.success("Grupo creado con éxito");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error al crear grupo");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar Navigation (WhatsApp Style) */}
      <nav className="w-16 md:w-20 flex flex-col items-center py-8 bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shrink-0">
        <div className="size-10 md:size-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-10 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-2xl md:text-3xl">chat</span>
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          {[
            { id: 'chats', icon: 'chat_bubble', label: 'Chats' },
            { id: 'groups', icon: 'groups', label: 'Grupos' },
            { id: 'status', icon: 'data_usage', label: 'Estados' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`p-3 md:p-4 rounded-2xl transition-all relative group ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={tab.label}
            >
              <span className="material-symbols-outlined text-2xl md:text-3xl">{tab.icon}</span>
              {activeTab === tab.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <button className="p-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
            <span className="material-symbols-outlined text-2xl md:text-3xl">settings</span>
          </button>
          <div className="relative">
            <img src={user?.avatar_url || 'https://picsum.photos/seed/me/200'} className="size-10 md:size-12 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" alt="Me" />
            <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"></div>
          </div>
        </div>
      </nav>

      {/* Chat List Column */}
      <aside className="w-full md:w-80 lg:w-[400px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {activeTab === 'chats' ? 'Chats' : activeTab === 'groups' ? 'Grupos' : 'Estados'}
            </h2>
            {activeTab === 'groups' && (
              <button 
                onClick={() => setShowGroupModal(true)}
                className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"
              >
                <span className="material-symbols-outlined">group_add</span>
              </button>
            )}
          </div>
          
          <div className="relative group">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </span>
            <input 
              type="text" 
              placeholder={activeTab === 'status' ? "Buscar estados..." : "Buscar conversaciones..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'status' ? (
            <div className="p-4 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                <div className="relative">
                  <img src={user?.avatar_url || 'https://picsum.photos/seed/me/200'} className="size-14 rounded-full object-cover border-2 border-primary p-0.5" alt="My Status" />
                  <div className="absolute bottom-0 right-0 size-5 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                    <span className="material-symbols-outlined text-xs">add</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Mi Estado</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Toca para añadir una actualización</p>
                </div>
              </div>

              <div className="px-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Recientes</h5>
                <div className="space-y-4">
                  {statusUpdates.map(status => (
                    <div 
                      key={status.id} 
                      onClick={() => setViewingStatus(status)}
                      className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <div className="size-14 rounded-full border-2 border-emerald-500 p-0.5">
                        <img src={status.user_avatar} className="size-full rounded-full object-cover" alt={status.user_name} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">{status.user_name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                          {new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const participant = conv.type === 'group' ? null : (conv.participant_1 === user?.id ? conv.participant2 : conv.participant);
              const name = conv.type === 'group' ? conv.name : (participant?.name || 'Usuario');
              const avatar = conv.type === 'group' ? (conv.avatar_url || 'https://picsum.photos/seed/group/200') : (participant?.avatar_url || 'https://picsum.photos/seed/user/200');
              const isOnline = conv.type === 'group' ? false : participant?.is_online;

              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConvId(conv.id)}
                  className={`flex items-start gap-5 p-6 cursor-pointer transition-all border-l-4 ${
                    activeConvId === conv.id 
                      ? 'bg-blue-50/50 dark:bg-primary/5 border-primary shadow-inner' 
                      : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={avatar} className="size-14 rounded-[1.25rem] object-cover shadow-sm" alt={name} />
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{name}</h3>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${activeConvId === conv.id ? 'text-primary' : 'text-slate-400'}`}>
                        {new Date(conv.last_message_at || conv.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs font-medium truncate uppercase tracking-tight ${activeConvId === conv.id ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                      {conv.last_message || 'Sin mensajes'}
                    </p>
                    {conv.unread_count > 0 && (
                      <div className="mt-2 flex justify-end">
                        <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">{conv.unread_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Active Conversation Column */}
      <main className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#0f172a] relative">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <header className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img 
                    src={activeConv.type === 'group' ? (activeConv.avatar_url || 'https://picsum.photos/seed/group/200') : (activeConv.participant_1 === user?.id ? activeConv.participant2?.avatar_url : activeConv.participant?.avatar_url || 'https://picsum.photos/seed/user/200')} 
                    className="size-12 rounded-2xl object-cover" 
                    alt="Chat" 
                  />
                  {activeConv.type !== 'group' && (
                    <div className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-4 border-white dark:border-slate-900 ${(activeConv.participant?.is_online || activeConv.participant2?.is_online) ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                    {activeConv.type === 'group' ? activeConv.name : (activeConv.participant_1 === user?.id ? activeConv.participant2?.name : activeConv.participant?.name || 'Usuario')}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                    {activeConv.type === 'group' ? 'Grupo de Trabajo' : (activeConv.participant?.is_online || activeConv.participant2?.is_online) ? <span className="text-emerald-500">En línea</span> : 'Desconectado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">videocam</span>
                </button>
                <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">call</span>
                </button>
                <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 flex flex-col gap-10">
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex gap-5 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : ''}`}>
                    <div className="shrink-0 mt-auto">
                      <img 
                        src={isMe ? (user?.avatar_url || 'https://picsum.photos/seed/me/200') : (msg.sender?.avatar_url || 'https://picsum.photos/seed/user/200')} 
                        className="size-10 rounded-2xl object-cover shadow-sm" 
                        alt="Sender" 
                      />
                    </div>
                    <div className={`flex flex-col gap-2 ${isMe ? 'items-end' : ''}`}>
                      <div className={`p-6 rounded-[2.5rem] shadow-sm border ${
                        isMe 
                          ? 'bg-primary text-white rounded-br-none border-primary shadow-xl shadow-primary/10' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border-slate-100 dark:border-slate-700'
                      }`}>
                        {activeConv.type === 'group' && !isMe && (
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">{msg.sender?.name}</p>
                        )}
                        <p className="text-sm font-medium leading-relaxed uppercase tracking-tight">
                          {msg.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(msg.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <span className={`material-symbols-outlined text-base ${msg.is_read ? 'text-emerald-500' : 'text-slate-300'}`}>
                            done_all
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex flex-col gap-4 rounded-3xl border border-slate-200 dark:border-slate-700 bg-[#fdfdfd] dark:bg-slate-800/50 p-4 focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary transition-all shadow-inner">
                <textarea 
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e as any);
                    }
                  }}
                  className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 resize-none max-h-40 py-3 px-4 font-medium uppercase tracking-tight"
                  placeholder="Escriba su mensaje aquí..."
                ></textarea>
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 pt-4 px-2">
                  <div className="flex items-center gap-1">
                    {['attach_file', 'sentiment_satisfied', 'image', 'mic'].map(icon => (
                      <button key={icon} type="button" className="p-3 text-slate-400 hover:text-primary transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                      </button>
                    ))}
                  </div>
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="flex items-center justify-center gap-3 bg-primary hover:bg-blue-700 disabled:opacity-30 text-white px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95"
                  >
                    <span>Enviar</span>
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="size-32 rounded-[3rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-8">
              <span className="material-symbols-outlined text-6xl">chat_bubble</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Selecciona un chat</h3>
            <p className="text-sm font-medium text-slate-400 max-w-xs uppercase tracking-tight">
              Envía y recibe mensajes institucionales de forma segura y encriptada.
            </p>
          </div>
        )}
      </main>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
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
                    placeholder="Ej: Equipo de Inspección"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Seleccionar Miembros</label>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                    {users.map(u => (
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
                        <img src={u.avatar_url || 'https://picsum.photos/seed/user/200'} className="size-10 rounded-xl object-cover" alt={u.name} />
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
                onClick={() => setShowGroupModal(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all"
              >
                Cancelar
              </button>
              <button 
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
          <div className="relative w-full max-w-lg aspect-[9/16] bg-slate-900 overflow-hidden">
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
              <p className="text-white text-sm font-medium uppercase tracking-tight bg-black/20 backdrop-blur-md py-4 px-6 rounded-2xl inline-block">
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
