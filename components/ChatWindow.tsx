
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Message } from '../types';
import { MOCK_MESSAGES } from '../services/mockService';

interface ChatWindowProps {
  currentUser: User;
  recipient: User;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, recipient, onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Fixed: Removed 'type' property as it is not present in the Message interface
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: 'conv-1',
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate reply
    setIsTyping(true);
    setTimeout(() => {
      // Fixed: Removed 'type' property as it is not present in the Message interface
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: 'conv-1',
        senderId: recipient.id,
        text: "Mensaje recibido. Procesando solicitud...",
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-800 p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              {recipient.name?.charAt(0) || '?'}
            </div>
            {recipient.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-blue-800 rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{recipient.name}</h3>
            <p className="text-xs text-blue-200">{recipient.isOnline ? t('chat.online') : t('chat.offline')}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <div className={`text-[10px] mt-1 ${isMine ? 'text-blue-100' : 'text-slate-400'} flex items-center justify-end space-x-1`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMine && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('chat.typeMessage') || 'Escribe un mensaje...'}
            className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
