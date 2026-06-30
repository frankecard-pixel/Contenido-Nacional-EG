import React from 'react';
import { ConversationExt, MessageExt, User } from '../../types';

interface ChatConversationProps {
  activeConv: ConversationExt;
  currentUser: User | null;
  messages: MessageExt[];
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatConversation: React.FC<ChatConversationProps> = ({
  activeConv,
  currentUser,
  messages,
  inputText,
  setInputText,
  onSendMessage,
  messagesEndRef,
}) => {
  const getParticipantName = () => {
    if (activeConv.type === 'group') return activeConv.name;
    const p = activeConv.participant_1 === currentUser?.id ? activeConv.participant2 : activeConv.participant;
    return p?.name || 'Usuario';
  };

  const getParticipantAvatar = () => {
    if (activeConv.type === 'group') return activeConv.avatar_url || 'https://picsum.photos/seed/group/200';
    const p = activeConv.participant_1 === currentUser?.id ? activeConv.participant2 : activeConv.participant;
    return p?.avatar_url || 'https://picsum.photos/seed/user/200';
  };

  const isParticipantOnline = () => {
    if (activeConv.type === 'group') return false;
    const p = activeConv.participant_1 === currentUser?.id ? activeConv.participant2 : activeConv.participant;
    return p?.is_online || (p as any)?.isOnline || false;
  };

  const getParticipantRole = () => {
    if (activeConv.type === 'group') return 'Grupo de Trabajo';
    const p = activeConv.participant_1 === currentUser?.id ? activeConv.participant2 : activeConv.participant;
    return p?.role || 'Colaborador';
  };

  return (
    <div id="active-chat-box" className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#0f172a] relative h-full">
      {/* Chat Header */}
      <header className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={getParticipantAvatar()} 
              className="size-12 rounded-2xl object-cover" 
              alt="Chat" 
            />
            {activeConv.type !== 'group' && (
              <div className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-4 border-white dark:border-slate-900 ${isParticipantOnline() ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              {getParticipantName()}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
              {activeConv.type === 'group' ? 'Grupo de Trabajo' : isParticipantOnline() ? <span className="text-emerald-500">En línea</span> : 'Desconectado'}
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
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 flex flex-col gap-6 md:gap-8 bg-slate-50/30 dark:bg-slate-950/20">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-60">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">lock</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Esta conversación está encriptada de extremo a extremo.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            const senderName = msg.sender?.name || 'Colaborador';
            const senderAvatar = isMe 
              ? (currentUser?.avatar_url || currentUser?.avatar || 'https://picsum.photos/seed/me/200')
              : (msg.sender?.avatar_url || (msg.sender as any)?.avatar || 'https://picsum.photos/seed/user/200');

            return (
              <div key={msg.id} className={`flex gap-4 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : ''}`}>
                <div className="shrink-0 mt-auto">
                  <img 
                    src={senderAvatar} 
                    className="size-9 rounded-xl object-cover shadow-sm" 
                    alt="Sender" 
                  />
                </div>
                <div className={`flex flex-col gap-1.5 ${isMe ? 'items-end' : ''}`}>
                  <div className={`p-5 rounded-[2rem] shadow-sm border ${
                    isMe 
                      ? 'bg-primary text-white rounded-br-none border-primary shadow-lg shadow-primary/10' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border-slate-100 dark:border-slate-700'
                  }`}>
                    {activeConv.type === 'group' && !isMe && (
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5">{senderName}</p>
                    )}
                    <p className="text-xs font-semibold leading-relaxed uppercase tracking-tight">
                      {msg.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(msg.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <span className={`material-symbols-outlined text-sm ${msg.is_read ? 'text-emerald-500' : 'text-slate-300'}`}>
                        done_all
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form onSubmit={onSendMessage} className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-[#fdfdfd] dark:bg-slate-800/50 p-3 focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary transition-all shadow-inner">
          <textarea 
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage(e as any);
              }
            }}
            className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 resize-none max-h-32 py-2 px-3 font-medium uppercase tracking-tight"
            placeholder="Escriba su mensaje aquí..."
          ></textarea>
          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 pt-3 px-1">
            <div className="flex items-center gap-1">
              {['attach_file', 'sentiment_satisfied', 'image', 'mic'].map(icon => (
                <button key={icon} type="button" className="p-2 text-slate-400 hover:text-primary transition-all rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </button>
              ))}
            </div>
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 disabled:opacity-30 text-white px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-md shadow-primary/10 active:scale-95"
            >
              <span>Enviar</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatConversation;
