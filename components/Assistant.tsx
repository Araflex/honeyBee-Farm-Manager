
import React, { useState } from 'react';
import { getBeekeepingAdvice } from '../services/gemini';
import { useLanguage } from '../context/LanguageContext';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

const Assistant = () => {
  const [input, setInput] = useState('');
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: language === 'es' ? '¡Hola! Soy tu asistente apícola. Pregúntame sobre el manejo de colmenas, tareas estacionales o tratamientos contra Varroa.' : 'Hello! I am your beekeeping assistant. Ask me about hive management, seasonal tasks, or Varroa treatments.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await getBeekeepingAdvice(userMsg, language);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-900">{language === 'es' ? 'Asistente IA' : 'AI Assistant'}</h1>
        <p className="text-slate-600">{language === 'es' ? 'Consulta a Gemini para consejos apícolas expertos.' : 'Consult Gemini for expert beekeeping advice.'}</p>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600"><Bot size={18}/></div>}
                    <div className={`p-3 rounded-xl max-w-[80%] text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}`}>
                        {msg.content}
                    </div>
                    {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600"><UserIcon size={18}/></div>}
                </div>
            ))}
            {loading && (
                <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Bot size={18}/></div>
                     <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2 text-slate-500 text-sm">
                        <Loader2 size={16} className="animate-spin" /> {language === 'es' ? 'Pensando...' : 'Thinking...'}
                     </div>
                </div>
            )}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
                type="text" 
                className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder={language === 'es' ? 'Pregunta sobre la cría de reinas, enjambres...' : "Ask about queen rearing, swarms, etc..."}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
            />
            <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
                <Send size={20} />
            </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
