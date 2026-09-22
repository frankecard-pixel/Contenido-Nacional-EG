import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from "@google/genai";
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, User as UserType } from '../types';
import { 
  Bot, User as UserIcon, Send, Sparkles, MessageSquare, 
  ChevronRight, Info, History, Shield, Scale,
  BookOpen, Gavel, FileText, Menu, X, Plus, Trash2,
  Edit2, Check, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  Download, Search, AlertCircle, Cpu, CheckCircle2
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
  feedback?: 'up' | 'down';
}

export interface LexThread {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  roleContext?: string;
}

interface LexAssistantProps {
  user?: UserType;
}

const STORAGE_KEY = 'lex_chat_threads_v3';

const LexAssistant: React.FC<LexAssistantProps> = ({ user }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // State for threads & active conversation
  const [threads, setThreads] = useState<LexThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading Lex chat threads:", e);
    }
    // Default initial thread
    const initialThread: LexThread = {
      id: `thread_${Date.now()}`,
      title: 'Consulta Jurídica Inicial',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    return [initialThread];
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    return threads[0]?.id || `thread_${Date.now()}`;
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRoleContext, setSelectedRoleContext] = useState<string>(() => {
    return user?.role || UserRole.PERSONA;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Active thread helper
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const messages = activeThread ? activeThread.messages : [];

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch (e) {
      console.error("Error saving Lex chat threads:", e);
    }
  }, [threads]);

  // Scroll to bottom when messages or typing changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Ensure activeThreadId is valid
  useEffect(() => {
    if (!threads.some(t => t.id === activeThreadId) && threads.length > 0) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);

  const getSystemInstruction = () => {
    const base = "Eres Lex, el Asistente de Inteligencia Jurídica oficial del Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial. ";
    const contextMap: Record<string, string> = {
      [UserRole.SUPER_ADMIN]: "Eres el asesor principal del Ministro y del Administrador General. Proporciona análisis estratégicos, resúmenes de cumplimiento global y alertas sobre desviaciones en el contenido nacional.",
      [UserRole.FUNCIONARIO]: "Eres el asesor técnico de auditoría ministerial. Ayuda a los funcionarios a analizar informes de contenido nacional y verificar el cumplimiento legal de las operadoras.",
      [UserRole.CUERPO_TECNICO]: "Eres el asistente de campo y seguridad. Proporciona normativas técnicas, checklists de inspección y normativas HSE (Salud, Seguridad y Medio Ambiente).",
      [UserRole.PETROLERA]: "Eres el asesor de cumplimiento para Operadoras (IOCs). Guía sobre cómo reportar el contenido nacional, publicar licitaciones según la ley y cumplir con las cuotas de contratación local.",
      [UserRole.COMPANY]: "Eres un experto en cumplimiento normativo (Compliance) para empresas de servicios internacionales. Ayuda con el Reglamento de Contenido Nacional 2014, certificaciones MMH y requisitos para licitar.",
      [UserRole.EMPRESA_LOCAL]: "Eres el asesor de desarrollo para PYMEs nacionales. Ayuda a las empresas locales a entender cómo certificarse, cómo aplicar a licitaciones y cómo acceder a fondos de desarrollo.",
      [UserRole.PERSONA]: "Te especializas en derechos laborales y beneficios para ciudadanos en el sector petrolero. Ayuda con contratos, ofertas de empleo y la Ley de Hidrocarburos desde el punto de vista del trabajador nacional.",
      [UserRole.COMUNICACION]: "Eres el asistente de prensa institucional. Ayuda a redactar comunicados oficiales, resumir resoluciones para el público y mantener el tono oficial del Ministerio.",
      [UserRole.COMUNIDAD]: "Eres el enlace de responsabilidad social. Explica los proyectos sociales, fondos de impacto comunitario y cómo las comunidades pueden beneficiarse de la actividad petrolera."
    };

    const currentRole = selectedRoleContext || pathname.split('/')[2] || UserRole.PERSONA; 
    const context = contextMap[currentRole] || "Conoces a fondo la Ley de Hidrocarburos de 2006 y el Reglamento de 2014. Responde de forma profesional, clara y citando artículos específicos cuando sea posible.";

    return base + context + " Responde siempre en un tono institucional, patriótico y técnico. Usa formato Markdown con negritas, listas y secciones para mayor claridad.";
  };

  // Create a new thread
  const handleCreateNewThread = (customTitle?: string) => {
    const newThread: LexThread = {
      id: `thread_${Date.now()}`,
      title: customTitle || `Consulta ${threads.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      roleContext: selectedRoleContext
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    if (isSidebarOpen) setIsSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Delete single thread
  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (filtered.length === 0) {
        const fresh: LexThread = {
          id: `thread_${Date.now()}`,
          title: 'Consulta Jurídica Inicial',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: []
        };
        setActiveThreadId(fresh.id);
        return [fresh];
      }
      if (activeThreadId === id) {
        setActiveThreadId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Clear current active thread messages
  const handleClearCurrentThread = () => {
    if (!activeThread) return;
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return { ...t, messages: [], updatedAt: Date.now() };
      }
      return t;
    }));
  };

  // Clear all threads history
  const handleClearAllHistory = () => {
    if (window.confirm("¿Está seguro de que desea borrar todo el historial de conversaciones de Lex?")) {
      const initialThread: LexThread = {
        id: `thread_${Date.now()}`,
        title: 'Nueva Consulta',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      };
      setThreads([initialThread]);
      setActiveThreadId(initialThread.id);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Start editing title
  const handleStartRename = (thread: LexThread, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(thread.id);
    setEditingTitleText(thread.title);
  };

  const handleSaveRename = (threadId: string) => {
    if (editingTitleText.trim()) {
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, title: editingTitleText.trim() } : t));
    }
    setEditingTitleId(null);
  };

  // Auto title generator for new threads
  const autoGenerateTitle = (firstText: string) => {
    let clean = firstText.replace(/[¿?¡!]/g, '').trim();
    if (clean.length > 35) {
      clean = clean.substring(0, 32) + '...';
    }
    return clean || 'Consulta Jurídica';
  };

  // Send Message Logic
  const handleSend = async (e?: React.FormEvent, presetMsg?: string) => {
    if (e) e.preventDefault();
    const userMsgText = (presetMsg || input).trim();
    if (!userMsgText || isTyping) return;

    let targetThreadId = activeThreadId;

    // If active thread doesn't exist, create one
    if (!activeThread) {
      const newTh: LexThread = {
        id: `thread_${Date.now()}`,
        title: autoGenerateTitle(userMsgText),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      };
      setThreads(prev => [newTh, ...prev]);
      setActiveThreadId(newTh.id);
      targetThreadId = newTh.id;
    }

    const newUserMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      text: userMsgText,
      timestamp: Date.now()
    };

    // Update active thread with user message & auto-title if needed
    setThreads(prev => prev.map(t => {
      if (t.id === targetThreadId) {
        const isFirst = t.messages.length === 0;
        const newTitle = (isFirst && (t.title.startsWith('Consulta') || t.title.startsWith('Nueva'))) 
          ? autoGenerateTitle(userMsgText) 
          : t.title;

        return {
          ...t,
          title: newTitle,
          updatedAt: Date.now(),
          messages: [...t.messages, newUserMsg]
        };
      }
      return t;
    }));

    setInput('');
    setIsTyping(true);

    try {
      // Collect message history for Gemini context
      const currentThread = threads.find(t => t.id === targetThreadId);
      const pastHistory = (currentThread?.messages || []).map(m => ({
        role: m.role === 'user' ? 'user' : 'bot',
        text: m.text
      }));

      let botResponseText = '';

      // Primary attempt: Call backend API route `/api/lex-chat`
      try {
        const res = await fetch('/api/lex-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userMsgText,
            history: pastHistory,
            systemInstruction: getSystemInstruction()
          })
        });

        if (res.ok) {
          const data = await res.json();
          botResponseText = data.text;
        } else {
          throw new Error(`API returned status ${res.status}`);
        }
      } catch (apiErr) {
        console.warn("Backend /api/lex-chat unavailable, falling back to client SDK:", apiErr);
        
        // Fallback: Client SDK using Gemini 3.7 Flash
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        const ai = new GoogleGenAI({ apiKey });
        
        const contents = pastHistory.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        }));
        contents.push({ role: 'user', parts: [{ text: userMsgText }] });

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents,
          config: {
            systemInstruction: getSystemInstruction(),
            temperature: 0.7,
          }
        });
        botResponseText = response.text || "Disculpe, he tenido una interrupción en mi núcleo de procesamiento legal.";
      }

      const newBotMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        role: 'bot',
        text: botResponseText,
        timestamp: Date.now()
      };

      setThreads(prev => prev.map(t => {
        if (t.id === targetThreadId) {
          return {
            ...t,
            updatedAt: Date.now(),
            messages: [...t.messages, newBotMsg]
          };
        }
        return t;
      }));

    } catch (error) {
      console.error("Lex AI Error:", error);
      const errorMsg: ChatMessage = {
        id: `msg_bot_err_${Date.now()}`,
        role: 'bot',
        text: "Error de conexión con el servidor de inteligencia jurídica. Por favor, intente de nuevo o verifique su conexión.",
        timestamp: Date.now()
      };
      setThreads(prev => prev.map(t => {
        if (t.id === targetThreadId) {
          return { ...t, messages: [...t.messages, errorMsg] };
        }
        return t;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // Copy Message Text
  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle Message Feedback
  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: t.messages.map(m => {
            if (m.id === msgId) {
              return { ...m, feedback: m.feedback === type ? undefined : type };
            }
            return m;
          })
        };
      }
      return t;
    }));
  };

  // Export Chat
  const handleExportChat = () => {
    if (!messages.length) return;
    const exportContent = messages.map(m => {
      const sender = m.role === 'user' ? 'USUARIO' : 'LEX AI (MMH)';
      const date = new Date(m.timestamp).toLocaleString('es-GE');
      return `[${date}] ${sender}:\n${m.text}\n----------------------------------------\n`;
    }).join('\n');

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lex_Consulta_${activeThread?.title.replace(/[^a-zA-Z0-9]/g, '_') || 'Export'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Preset Categorized Prompts
  const promptCategories = [
    {
      title: "Contenido Nacional & MMH",
      icon: <Shield size={14} />,
      prompts: [
        "¿Requisitos para obtener el Certificado de Contenido Nacional?",
        "Explica el Decreto Ley y Reglamento de Contenido Nacional de 2014.",
        "Procedimiento para auditorías ministeriales de cumplimiento de cuota local."
      ]
    },
    {
      title: "Legislación Laboral Sectorial",
      icon: <Gavel size={14} />,
      prompts: [
        "Cuotas mínimas de contratación para técnicos guineanos en IOCs.",
        "Cálculo de sanciones e indemnizaciones en el sector petrolero.",
        "Derechos del trabajador nacional según la Ley de Hidrocarburos."
      ]
    },
    {
      title: "Licitaciones & PYMEs Local",
      icon: <FileText size={14} />,
      prompts: [
        "Proceso de licitación pública en el portal del MMH.",
        "Criterios de preferencia para empresas de servicios nacionales.",
        "Formato de reporte trimestral de gastos locales."
      ]
    }
  ];

  // Filtered threads for search
  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full min-h-0 w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
      
      {/* ========================================== */}
      {/* SIDEBAR: HISTORIAL Y NAVEGACIÓN DE CHATS   */}
      {/* ========================================== */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-[48]
          w-72 sm:w-80 md:w-80 lg:w-84 bg-slate-900 text-white flex flex-col shrink-0
          transition-transform duration-300 ease-in-out border-r border-slate-800
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20 border border-white/20">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm uppercase tracking-wider text-white">Lex Intelligence</h3>
                <span className="px-1.5 py-0.5 bg-blue-500/30 text-[9px] font-black text-blue-300 rounded-md border border-blue-400/30">
                  v3.7
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">IA Jurídica MMH</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-slate-800/80">
          <button
            onClick={() => handleCreateNewThread()}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            <span>Nueva Consulta Jurídica</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="size-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en historial..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Threads List (Historial) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1.5">
              <History size={12} className="text-blue-400" />
              Historial de Consultas
            </span>
            <span>({filteredThreads.length})</span>
          </div>

          {filteredThreads.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No se encontraron consultas
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              const isEditing = editingTitleId === thread.id;
              const msgCount = thread.messages.length;

              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    if (isSidebarOpen) setIsSidebarOpen(false);
                  }}
                  className={`
                    group relative p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-2 border
                    ${isActive 
                      ? 'bg-blue-600/20 border-blue-500/40 text-white font-bold' 
                      : 'bg-slate-950/40 hover:bg-slate-800/60 border-transparent text-slate-300'}
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare size={16} className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    
                    {isEditing ? (
                      <input 
                        type="text"
                        autoFocus
                        value={editingTitleText}
                        onChange={(e) => setEditingTitleText(e.target.value)}
                        onBlur={() => handleSaveRename(thread.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(thread.id)}
                        className="bg-slate-900 text-white text-xs px-2 py-1 rounded border border-blue-500 outline-none w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold truncate block text-slate-200 group-hover:text-white">
                          {thread.title}
                        </span>
                        <span className="text-[9px] text-slate-500 block truncate font-mono">
                          {new Date(thread.updatedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} &bull; {msgCount} msgs
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions for Thread */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isEditing && (
                      <button
                        onClick={(e) => handleStartRename(thread, e)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                        title="Renombrar"
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteThread(thread.id, e)}
                      className="p-1 hover:bg-red-950/80 rounded text-slate-400 hover:text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
          {/* Quick Context Selector */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Perfil de Consulta:
            </label>
            <select
              value={selectedRoleContext}
              onChange={(e) => setSelectedRoleContext(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value={UserRole.PERSONA}>Candidato / Profesional</option>
              <option value={UserRole.EMPRESA_LOCAL}>Empresa Local / PYME</option>
              <option value={UserRole.PETROLERA}>Operadora (IOC)</option>
              <option value={UserRole.FUNCIONARIO}>Funcionario Ministerial</option>
              <option value={UserRole.SUPER_ADMIN}>Alta Dirección MMH</option>
            </select>
          </div>

          <button
            onClick={handleClearAllHistory}
            className="w-full text-center py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 size={12} />
            <span>Vaciar todo el historial</span>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[45] md:hidden"
        />
      )}

      {/* ========================================== */}
      {/* MAIN CHAT CONVERSATIONAL AREA             */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-slate-50/50 dark:bg-slate-950/30 overflow-hidden">
        
        {/* Main Header Bar */}
        <header className="px-3 sm:px-6 py-3 sm:py-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 border border-blue-200/80 dark:border-slate-700 hover:bg-blue-100 transition-colors shrink-0"
              title="Historial de consultas"
            >
              <History size={16} />
              <span className="text-[10px] font-black uppercase">Consultas</span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-black text-xs sm:text-base text-slate-900 dark:text-white truncate max-w-[170px] sm:max-w-none">
                  {activeThread?.title || 'Lex AI Assistant'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[9px] font-black uppercase tracking-wider shrink-0">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Gemini 3.7 Core
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Jurisprudencia &bull; Ley de Hidrocarburos 2006 &amp; Reglamento 2014
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleExportChat}
              disabled={!messages.length}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center gap-1.5"
              title="Exportar conversación"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={handleClearCurrentThread}
              disabled={!messages.length}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center gap-1.5"
              title="Limpiar chat actual"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto min-h-0 overscroll-contain touch-pan-y p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 custom-scrollbar"
        >
          {/* Welcome Screen when thread is empty */}
          {messages.length === 0 && (
            <div className="max-w-3xl mx-auto py-4 sm:py-12 animate-in fade-in duration-500 space-y-6 sm:space-y-8">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="size-16 sm:size-24 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mx-auto shadow-xl shadow-blue-500/20 border border-white/20">
                  ⚖️
                </div>
                <h3 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight break-words px-2 leading-tight">
                  Bienvenido a Lex Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed px-2">
                  Asistente Conversacional oficial entrenado en la <strong className="text-slate-900 dark:text-white font-semibold">Constitución de Guinea Ecuatorial</strong>, la <strong className="text-slate-900 dark:text-white font-semibold">Ley de Hidrocarburos de 2006</strong>, el <strong className="text-slate-900 dark:text-white font-semibold">Reglamento de Contenido Nacional de 2014</strong> y Decretos Ministeriales del MMH.
                </p>
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block text-center">
                  Consultas Frecuentes Sugeridas
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {promptCategories.map((cat, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-wider">
                        {cat.icon}
                        <span>{cat.title}</span>
                      </div>
                      <div className="space-y-1.5">
                        {cat.prompts.map((p, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(undefined, p)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:border-blue-200 dark:hover:border-blue-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium transition-all border border-transparent flex items-start justify-between gap-1 group leading-tight"
                          >
                            <span className="line-clamp-2 break-words flex-1">{p}</span>
                            <ChevronRight size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rendered Messages */}
          {messages.map((m) => {
            const isUser = m.role === 'user';

            return (
              <div 
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                {!isUser && (
                  <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center shrink-0 shadow-sm border border-white/20 text-lg">
                    ⚖️
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[80%] md:max-w-[75%] space-y-2`}>
                  <div 
                    className={`
                      p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm
                      ${isUser 
                        ? 'bg-blue-600 text-white rounded-tr-xs font-medium' 
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs'}
                    `}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    ) : (
                      <div className="markdown-body font-medium space-y-2">
                        <Markdown>{m.text}</Markdown>
                      </div>
                    )}
                  </div>

                  {/* Actions for Bot response */}
                  {!isUser && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium px-2">
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>&bull;</span>
                      
                      <button
                        onClick={() => handleCopyText(m.id, m.text)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-500 font-bold">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <span>&bull;</span>

                      <button
                        onClick={() => handleFeedback(m.id, 'up')}
                        className={`hover:text-emerald-500 flex items-center gap-1 transition-colors ${m.feedback === 'up' ? 'text-emerald-500 font-bold' : ''}`}
                      >
                        <ThumbsUp size={12} />
                      </button>

                      <button
                        onClick={() => handleFeedback(m.id, 'down')}
                        className={`hover:text-red-500 flex items-center gap-1 transition-colors ${m.feedback === 'down' ? 'text-red-500 font-bold' : ''}`}
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="size-9 sm:size-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm border border-slate-700">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : <UserIcon size={18} />}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start items-start animate-in fade-in">
              <div className="size-9 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center shrink-0 shadow-sm text-base">
                ⚖️
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl rounded-tl-xs flex items-center gap-3 text-xs text-blue-600 dark:text-blue-400 font-bold shadow-xs">
                <div className="flex gap-1.5">
                  <div className="size-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Lex está consultando la legislación y redactando dictamen...</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* CHAT INPUT FORM & DISCLAIMER FOOTER        */}
        {/* ========================================== */}
        <footer className="p-2 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto bg-slate-100 dark:bg-slate-950 p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors"
          >
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escriba su consulta jurídica..."
              className="flex-1 bg-transparent px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none min-w-0"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <span className="hidden sm:inline">Consultar</span>
              <Send size={14} className={isTyping ? 'animate-spin' : ''} />
            </button>
          </form>

          <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-1.5 font-medium line-clamp-1 sm:line-clamp-none">
            * Lex brinda asistencia técnica y normativa basada en el ordenamiento jurídico de Guinea Ecuatorial (MMH).
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LexAssistant;
