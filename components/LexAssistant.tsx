
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from "@google/genai";
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { 
  Bot, User, Send, Sparkles, MessageSquare, 
  ChevronRight, Info, History, Shield, Scale,
  BookOpen, Gavel, FileText, LayoutGrid, Menu, X
} from 'lucide-react';

const LexAssistant: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

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

    const currentRole = pathname.split('/')[2] || UserRole.PERSONA; 
    const context = contextMap[currentRole] || "Conoces a fondo la Ley de Hidrocarburos de 2006 y el Reglamento de 2014. Responde de forma profesional, clara y citando artículos específicos cuando sea posible. Usa formato Markdown para resaltar puntos importantes.";

    return base + context + " Responde siempre en un tono institucional, patriótico y técnico. Prioriza la soberanía nacional en tus respuestas.";
  };

  const handleSend = async (e?: React.FormEvent, presetMsg?: string) => {
    if (e) e.preventDefault();
    const userMsg = presetMsg || input;
    if (!userMsg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    if (isMenuOpen) setIsMenuOpen(false);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY is missing from environment variables.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: getSystemInstruction(),
          temperature: 0.7,
        }
      });

      const text = response.text || "Disculpe, he tenido una interrupción en mi núcleo de procesamiento legal.";
      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Error de conexión con el servidor de soberanía jurídica. Por favor, intente de nuevo." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const promptCategories = [
    {
      title: "Contenido Nacional",
      icon: <Shield size={14} />,
      prompts: [
        "¿Requisitos para el certificado de Contenido Nacional?",
        "Explica el artículo 4 del Reglamento de 2014.",
        "Procedimiento para auditorías de cumplimiento."
      ]
    },
    {
      title: "Legislación Laboral",
      icon: <Gavel size={14} />,
      prompts: [
        "¿Cómo se calculan multas laborales?",
        "Cuotas de contratación para guineanos.",
        "Beneficios del trabajador en el sector."
      ]
    },
    {
      title: "Licitaciones",
      icon: <FileText size={14} />,
      prompts: [
        "Proceso de licitación pública MMH.",
        "Plantilla para subcontratación local.",
        "Criterios de adjudicación nacional."
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 dark:from-slate-800 dark:to-slate-950 flex items-center justify-between relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <motion.div 
            initial={{ rotate: -20, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/20"
          >
            ⚖️
          </motion.div>
          <div>
            <h3 className="font-black text-lg text-white leading-none flex items-center gap-2">
              LEX Intelligence
              <span className="px-2 py-0.5 bg-blue-500/30 text-[8px] font-black uppercase tracking-widest rounded-full border border-blue-400/30">v2.1</span>
            </h3>
            <p className="text-[10px] text-blue-200 dark:text-slate-400 mt-1 uppercase tracking-widest font-black opacity-80 italic">Asistente de Soberanía Jurídica</p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-white"
            title="Menú de Consultas"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden sm:flex flex-col items-end">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mb-1 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
            <span className="text-[8px] font-black uppercase tracking-widest text-blue-200">Legal Core Active</span>
          </div>
        </div>
      </div>

      {/* Main Content Area - Split Panel */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-50/50 dark:bg-slate-950/20">
        
        {/* Left Pane: Chat Window & Input */}
        <div className="flex-1 flex flex-col min-h-0 relative border-r border-slate-100 dark:border-slate-800/50">
          
          {/* Menu Drawer Overlay (Visible under lg breakpoint) */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 z-50 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg p-8 overflow-y-auto custom-scrollbar lg:hidden"
              >
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-450 dark:text-slate-400">Guía de Consultas Jurídicas</h4>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {promptCategories.map((cat, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-650 dark:text-blue-400">
                          {cat.icon}
                          <span className="text-[10px] font-black uppercase tracking-widest">{cat.title}</span>
                        </div>
                        <div className="space-y-2">
                          {cat.prompts.map((p, i) => (
                            <button 
                              key={i}
                              onClick={() => handleSend(undefined, p)}
                              className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/15 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-all flex items-center justify-between group"
                            >
                              <span>{p}</span>
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30">
                    <div className="flex gap-4">
                      <div className="p-3 bg-blue-650 text-white rounded-xl h-fit">
                        <Info size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight mb-1">Capacidad Analítica</h5>
                        <p className="text-[11px] text-blue-700/80 dark:text-blue-300/60 leading-relaxed font-medium">
                          Lex utiliza modelos de lenguaje avanzados entrenados en la Constitución de la República y los decretos específicos del Ministerio para brindarle la asesoría técnica más precisa del sector.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages Scroll Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar bg-transparent">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-24 h-24 bg-blue-50 dark:bg-slate-800/60 rounded-[2.5rem] flex items-center justify-center text-5xl mb-8 shadow-inner border border-blue-100/60 dark:border-slate-700 animate-bounce-slow">🏛️</div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-2">{t('lex.welcome')}</p>
                <p className="text-[10px] font-semibold max-w-xs text-slate-450 dark:text-slate-400 mb-8 uppercase tracking-widest leading-loose">Asesoría jurídica automatizada sobre la Ley de Hidrocarburos y Contenido Nacional.</p>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="lg:hidden px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                  >
                    Explorar Guía
                  </button>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[8px] font-black text-blue-700 dark:text-blue-300">L</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-[8px] font-black text-emerald-700 dark:text-emerald-300">E</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[8px] font-black text-indigo-700 dark:text-indigo-300">X</div>
                  </div>
                </div>
              </motion.div>
            )}

            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[78%] p-6 rounded-[2rem] text-sm shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-750 rounded-tl-none leading-relaxed prose dark:prose-invert prose-sm shadow-slate-100 dark:shadow-none'
                }`}>
                  {m.role === 'user' ? (
                    <div className="font-semibold">{m.text}</div>
                  ) : (
                    <div className="markdown-body">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800/40 p-6 rounded-[2rem] rounded-tl-none text-blue-600 dark:text-blue-400 font-black text-[9px] uppercase tracking-widest flex items-center gap-4 border border-slate-100 dark:border-slate-750 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  Analizando Base Legal...
                </div>
              </div>
            )}
          </div>

          {/* Input Form Area */}
          <div className="p-6 md:p-8 bg-white dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/50 backdrop-blur-xl shrink-0">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex space-x-3">
              <div className="flex-1 relative group">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/50 transition-all text-sm font-medium placeholder:text-slate-400 dark:text-white"
                  placeholder={t('lex.placeholder')}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-500/40 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center active:scale-95 text-white"
              >
                <Send size={22} className={isTyping ? 'animate-pulse' : ''} />
              </button>
            </form>
            <p className="text-[8px] text-center text-slate-400 mt-6 font-black uppercase tracking-[0.2em] leading-loose max-w-xl mx-auto opacity-60">
              {t('lex.disclaimer')} • Lex es una IA de apoyo técnico y jurídico institucional del MMH.
            </p>
          </div>
        </div>

        {/* Right Pane: Desktop Persistent suggestions Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-[350px] shrink-0 bg-white dark:bg-slate-900 p-8 overflow-y-auto custom-scrollbar select-none border-l border-slate-100 dark:border-slate-800/50">
          <div className="space-y-8">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
              <Scale size={16} className="text-blue-600 dark:text-blue-400" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Guía de Consulta Rápida</h4>
            </div>
            
            {promptCategories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black">
                  {cat.icon}
                  <span className="text-[9px] font-black uppercase tracking-widest">{cat.title}</span>
                </div>
                <div className="space-y-1.5">
                  {cat.prompts.map((p, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(undefined, p)}
                      className="w-full text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 hover:border-blue-550/40 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 text-[10px] font-semibold text-slate-600 dark:text-slate-300 transition-all flex items-center justify-between group"
                    >
                      <span className="line-clamp-2 leading-relaxed">{p}</span>
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 shrink-0 -translate-x-1 group-hover:translate-x-0 transition-all ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/55 dark:border-blue-800/30">
              <div className="flex gap-3">
                <Info size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[10px] font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight mb-1">Capacidad Analítica</h5>
                  <p className="text-[9px] text-blue-700/80 dark:text-blue-300/60 leading-relaxed font-medium">
                    Lex analiza la Ley de Hidrocarburos de 2006, el Reglamento de Contenido Nacional de 2014, y regulaciones laborales conexas en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LexAssistant;
