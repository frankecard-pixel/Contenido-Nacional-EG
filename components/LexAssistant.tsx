
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from "@google/genai";
import { useLocation } from 'react-router-dom';

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
    const context = pathname.includes('persona') 
      ? "Te especializas en derechos laborales y beneficios para ciudadanos en el sector petrolero. Ayuda con contratos y la Ley de Hidrocarburos desde el punto de vista del trabajador nacional."
      : pathname.includes('company')
      ? "Eres un experto en cumplimiento normativo (Compliance) para empresas locales e internacionales. Ayuda con el Reglamento de Contenido Nacional 2014, certificaciones MMH y requisitos para licitar."
      : pathname.includes('funcionario')
      ? "Eres el asesor técnico de auditoría ministerial. Ayuda a los funcionarios a analizar informes de contenido nacional y verificar el cumplimiento legal de las operadoras."
      : "Conoces a fondo la Ley de Hidrocarburos de 2006 y el Reglamento de 2014. Responde de forma profesional, clara y citando artículos específicos cuando sea posible.";
    
    return base + context + " Responde siempre en un tono institucional, patriótico y técnico. Prioriza la soberanía nacional en tus respuestas.";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
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

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500">
      <div className="p-8 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-white/10">⚖️</div>
          <div>
            <h3 className="font-black text-xl leading-none">LEX Intelligence</h3>
            <p className="text-[10px] text-blue-300 mt-2 uppercase tracking-[0.2em] font-black opacity-80">Asistente de Soberanía Jurídica</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mb-1"></span>
          <span className="text-[8px] font-black uppercase tracking-widest text-blue-200">Legal Core Active</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-slate-950/20 backdrop-blur-sm">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <div className="text-8xl mb-6 grayscale hover:grayscale-0 transition-all duration-700">🏛️</div>
            <p className="text-sm font-black uppercase tracking-widest mb-2">{t('lex.welcome')}</p>
            <p className="text-[10px] font-medium max-w-xs text-slate-400">Consultas sobre Ley de Hidrocarburos, Reglamento 2014 y Marcos Legales Vigentes.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-6 rounded-3xl text-sm shadow-2xl ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-100 border border-white/5 rounded-tl-none leading-relaxed'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl rounded-tl-none animate-pulse text-blue-300 font-bold text-[10px] uppercase tracking-widest">
              Lex está analizando la normativa nacional...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-8 bg-slate-950/80 border-t border-white/5">
        <div className="flex space-x-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm font-medium"
            placeholder={t('lex.placeholder')}
          />
          <button className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center active:scale-95 group">
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
