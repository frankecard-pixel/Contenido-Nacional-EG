
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from "@google/genai";
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { UserRole } from '../types';

const LexAssistant: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const getSystemInstruction = () => {
    const base = "Eres Lex, el Asistente de Inteligencia Jurídica oficial del Ministerio de Hidrocarburos y Desarrollo Minero de Guinea Ecuatorial. ";
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

    const currentRole = pathname.split('/')[2] || UserRole.PERSONA; // Extract role from /dashboard/:role/...
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

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
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

  const suggestedPrompts = [
    "¿Cuáles son los requisitos para el certificado de Contenido Nacional?",
    "Explica el artículo 4 del Reglamento de 2014.",
    "¿Cómo se calculan las multas por incumplimiento laboral?",
    "Plantilla estándar para subcontratación local."
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500">
      <div className="p-8 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="flex items-center space-x-5 relative z-10">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-white/20">⚖️</div>
          <div>
            <h3 className="font-black text-xl leading-none">LEX Intelligence</h3>
            <p className="text-[10px] text-blue-300 mt-2 uppercase tracking-[0.2em] font-black opacity-80">Asistente de Soberanía Jurídica</p>
          </div>
        </div>
        <div className="flex flex-col items-end relative z-10">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mb-1 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
          <span className="text-[8px] font-black uppercase tracking-widest text-blue-200">Legal Core Active</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-slate-950/40 backdrop-blur-sm relative">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-80">
            <div className="text-8xl mb-6 grayscale hover:grayscale-0 transition-all duration-700 drop-shadow-2xl">🏛️</div>
            <p className="text-sm font-black uppercase tracking-widest mb-2 text-white">{t('lex.welcome')}</p>
            <p className="text-[10px] font-medium max-w-xs text-slate-400 mb-8">Consultas sobre Ley de Hidrocarburos, Reglamento 2014 y Marcos Legales Vigentes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestedPrompts.map((prompt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(undefined, prompt)}
                  className="bg-slate-800/50 hover:bg-blue-900/40 border border-white/5 hover:border-blue-500/30 p-4 rounded-2xl text-left text-xs font-medium text-slate-300 hover:text-white transition-all group"
                >
                  <span className="block text-blue-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-6 rounded-3xl text-sm shadow-2xl ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-100 border border-white/5 rounded-tl-none leading-relaxed prose prose-invert prose-sm max-w-none'
            }`}>
              {m.role === 'user' ? m.text : (
                <div className="markdown-body">
                  <Markdown>{m.text}</Markdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl rounded-tl-none animate-pulse text-blue-300 font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 border border-white/5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              Lex está analizando la normativa nacional...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-8 bg-slate-950/90 border-t border-white/5 backdrop-blur-xl">
        <div className="flex space-x-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm font-medium placeholder:text-slate-600"
            placeholder={t('lex.placeholder')}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center active:scale-95 group"
          >
            <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-500 mt-6 font-bold uppercase tracking-widest leading-loose">
          {t('lex.disclaimer')} • Lex es una IA informativa • Para trámites legales vinculantes consulte con el Ministerio de Hidrocarburos y Desarrollo Minero
        </p>
      </form>
    </div>
  );
};

export default LexAssistant;
