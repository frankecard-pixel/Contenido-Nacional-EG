
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getConversations, getMessagesByConversation } from '../services/supabaseApi';
import { ConversationExt, MessageExt, User } from '../types';

interface MessagesProps {
  user?: User | null;
}

const Messages: React.FC<MessagesProps> = ({ user }) => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<ConversationExt[]>([]);
  const [messages, setMessages] = useState<MessageExt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      try {
        const data = await getConversations(user.id);
        setConversations(data as any[]);
        if (data && data.length > 0) {
          setActiveConvId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

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

  const filteredConvs = useMemo(() => 
    conversations.filter(c => 
      (c.participant?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  , [searchQuery, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    // En una app real aquí se llamaría al servicio de API
    setInputText('');
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!activeConv) {
    return (
      <div className="p-8 text-center opacity-50">
        <p>No se encontraron conversaciones.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden animate-in fade-in duration-500">
      {/* Chat List Column */}
      <aside className="w-full md:w-80 lg:w-[400px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Mensajería</h2>
          <div className="relative group">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Buscar conversaciones..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConvs.map((conv) => (
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
                <img src={conv.participant?.avatar_url || 'https://picsum.photos/seed/user/200'} className="size-14 rounded-[1.25rem] object-cover shadow-sm" alt={conv.participant?.name} />
                {conv.is_online && (
                  <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{conv.participant?.name || 'Usuario'}</h3>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${activeConvId === conv.id ? 'text-primary' : 'text-slate-400'}`}>
                    {new Date(conv.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          ))}
        </div>
      </aside>

      {/* Active Conversation Column */}
      <main className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#0f172a] relative">
        {/* Chat Header */}
        <header className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={activeConv.participant?.avatar_url || 'https://picsum.photos/seed/user/200'} className="size-12 rounded-2xl object-cover" alt={activeConv.participant?.name} />
              <div className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-4 border-white dark:border-slate-900 ${activeConv.is_online ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{activeConv.participant?.name || 'Usuario'}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                {activeConv.is_online ? <span className="text-emerald-500">En línea</span> : 'Desconectado'} • {activeConv.participant?.role || 'Miembro'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-lg">translate</span>
              Traducir
            </button>
            <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 flex flex-col gap-10">
          <div className="flex justify-center">
            <span className="px-5 py-2 rounded-2xl bg-white dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm border border-slate-50 dark:border-slate-700">
              Historial de conversación
            </span>
          </div>

          {messages.map((msg, i) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex gap-5 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : ''}`}>
                <div className="shrink-0 mt-auto">
                  <div className="size-10 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-slate-500 uppercase">
                    {isMe ? 'Yo' : (activeConv.participant?.name || 'U').charAt(0)}
                  </div>
                </div>
                <div className={`flex flex-col gap-2 ${isMe ? 'items-end' : ''}`}>
                  <div className={`p-6 rounded-[2.5rem] shadow-sm border ${
                    isMe 
                      ? 'bg-primary text-white rounded-br-none border-primary shadow-xl shadow-primary/10' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border-slate-100 dark:border-slate-700'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed uppercase tracking-tight">
                      {msg.text}
                    </p>

                    {msg.attachment && (
                      <div className={`mt-6 flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                        isMe 
                          ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-blue-50'
                      }`}>
                        <div className={`size-12 rounded-xl flex items-center justify-center ${
                          isMe ? 'bg-white text-primary' : 'bg-red-50 text-red-500'
                        }`}>
                          <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black truncate uppercase tracking-tight ${isMe ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                            {msg.attachment.name}
                          </p>
                          <p className={`text-[10px] font-bold ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                            {msg.attachment.size} • {msg.attachment.type}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-xl opacity-60">download</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(msg.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <span className="material-symbols-outlined text-primary text-base">done_all</span>}
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
              className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 resize-none max-h-40 py-3 px-4 font-medium uppercase tracking-tight"
              placeholder="Escriba su mensaje institucional aquí..."
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
          <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-6 opacity-60">
            Comunicaciones Encriptadas conforme a la Ley de Protección de Datos • MMH
          </p>
        </div>
      </main>
    </div>
  );
};

export default Messages;
