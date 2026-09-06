'use client';

import { useState, useContext, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { FestivalContext } from '@/context/FestivalContext';
import LotusAnimation from '@/components/ui/LotusAnimation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Mock knowledge base removed to use live Gemini AI route

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function AIGuidePage() {
  const { selectedFestival } = useContext(FestivalContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const festivalName = selectedFestival?.name ?? 'Durga Puja 2026';

  // Initial greeting
  useEffect(() => {
    const greeting = `🙏 **Namaskar! I'm Purohit-mosai!**\n\nYour AI guide for ${festivalName}. I can help you with:\n- 📅 Calendar & Puja timings\n- 🏛️ Pandal information\n- 🍚 Food & street eats\n- 🚇 Transport & routes\n- 🛡️ Safety tips\n- ✅ Packing checklist\n\nAsk me anything about the festival!`;
    setMessages([
      {
        id: 'init',
        role: 'assistant',
        content: greeting,
      },
    ]);
  }, [festivalName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    setMessages((m) => [...m, { id: Date.now().toString(), role: 'user', content: text }]);
    setIsTyping(true);

    const historyForApi = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        // Map 'assistant' back to 'model' for the Gemini API route
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
          festival: festivalName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages((m) => [
          ...m,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: data.text },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: data.error || 'I am having trouble consulting the Panjika right now.' },
        ]);
      }
    } catch (error: any) {
      setMessages((m) => [
        ...m,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: `Network Error: ${error.message}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const QUICK = [
    'What is Sandhi Puja?',
    'Food recommendations',
    'Transport tips',
    'Safety checklist',
    'Sreebhumi pandal',
    'Vijaya Dashami',
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 py-10 relative">
      {/* Background embellishment */}
      <div className="absolute top-20 right-0 opacity-40 pointer-events-none z-0">
        <LotusAnimation />
      </div>
      <div className="absolute bottom-40 -left-10 opacity-20 pointer-events-none z-0 scale-75">
        <LotusAnimation />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_0_15px_rgba(217,70,239,0.3)] border-2 border-purple-500/30 bg-[#080414] shrink-0">
          <img 
            src="/images/purohit-mosai.jpg" 
            alt="Purohit Mosai" 
            className="w-full h-full object-cover object-top scale-[1.2]" 
          />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Purohit-mosai</h1>
          <p className="text-sm text-gray-400">
            Your AI festival guide for{' '}
            <span className="text-amber-400">{festivalName}</span>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 glass border border-saffron/20 rounded-3xl p-5 mb-4 overflow-y-auto overscroll-contain space-y-4 min-h-[400px] max-h-[60vh] relative z-10 shadow-[0_10px_30px_rgba(217,70,239,0.1)]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`p-2 rounded-full shrink-0 self-end ${
                m.role === 'user' ? 'bg-amber-500/20' : 'bg-purple-500/20'
              }`}
            >
              {m.role === 'user' ? (
                <User size={14} className="text-amber-400" />
              ) : (
                <Bot size={14} className="text-purple-400" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-amber-500/15 text-amber-100 rounded-tr-sm'
                  : 'bg-white/5 text-gray-200 rounded-tl-sm'
              }`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
            />
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="p-2 rounded-full bg-purple-500/20 self-end">
              <Bot size={14} className="text-purple-400" />
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={16} className="text-purple-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => {
              setInput(q);
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 relative z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about pandals, timings, food, transport..."
          className="flex-1 bg-[#1F2937] border border-amber-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500/50 transition-colors"
        />
        <button
          onClick={send}
          disabled={!input.trim() || isTyping}
          className="px-4 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl font-bold transition-all"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
