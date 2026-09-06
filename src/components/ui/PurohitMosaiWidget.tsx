'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { FestivalContext } from '@/context/FestivalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/ui/Magnetic';

type Message = { role: 'user' | 'model'; text: string };

export default function PurohitMosaiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedFestival } = useContext(FestivalContext);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Nomoskar! I am Purohit-mosai. How can I guide you with the festival today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Format history for Gemini API (only user/model roles, mapping 'text' to 'parts')
    const historyForApi = messages
      .filter((m) => m.role === 'user' || m.role === 'model')
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyForApi,
          festival: selectedFestival?.name || 'Durga Puja 2026',
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: data.error || 'Kkhoma korben (Apologies), I am having trouble consulting the Panjika right now.' }]);
      }
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: 'model', text: `Network Error: ${error.message || 'Could not connect to the API.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (pathname && pathname.includes('/map')) return null;

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mb-4 w-[calc(100vw-32px)] md:w-80 h-[450px] max-h-[75vh] glass rounded-3xl shadow-[0_20px_50px_rgba(217,70,239,0.2)] flex flex-col overflow-hidden origin-bottom-right pointer-events-auto"
          >
          {/* Header */}
          <div className="bg-[#100824]/90 p-4 flex items-center justify-between border-b border-electric/30 shadow-[0_5px_15px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <h3 className="text-white font-mono font-black flex items-center gap-2 tracking-widest text-xs">
              Purohit-mosai
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed font-mono shadow-[10px_10px_20px_rgba(0,0,0,0.5)] ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-saffron to-yellow-500 text-black rounded-br-sm border border-saffron/50'
                      : 'bg-[#0a0515]/90 text-electric border border-electric/50 rounded-bl-sm shadow-[inset_0_0_15px_rgba(217,70,239,0.2)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start flex flex-col max-w-[85%] items-start">
                <div className="px-4 py-3 rounded-2xl text-sm bg-[#0a0515]/90 text-saffron border border-electric/50 rounded-bl-sm flex items-center gap-2 font-bold font-mono shadow-[inset_0_0_15px_rgba(217,70,239,0.2)]">
                  <Loader2 size={16} className="animate-spin text-electric" /> Computing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#100824]/90 border-t border-electric/30 backdrop-blur-md">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="> INPUT_QUERY..."
                className="flex-1 bg-black/80 font-mono text-electric text-sm rounded-xl px-4 py-3 border border-electric/30 focus:outline-none focus:border-electric placeholder-electric/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.9)]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-chunky bg-saffron disabled:bg-saffron/50 disabled:shadow-none disabled:translate-y-0 text-black p-3 rounded-xl transition-all flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Avatar Button */}
      <Magnetic amount={0.3}>
        <div className="relative animate-float cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
        {/* Glowing Halo */}
        <div className="absolute inset-0 bg-electric rounded-full blur-[20px] opacity-40 animate-pulse group-hover:opacity-70 transition-opacity"></div>
        <div className="relative z-10 bg-gradient-to-tr from-saffron to-electric p-0.5 rounded-full shadow-[0_10px_20px_rgba(217,70,239,0.5)]">
          <button
            className="group w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden hover:scale-105 transition-transform bg-[#080414] flex items-center justify-center focus:outline-none pointer-events-auto relative"
            aria-label="Toggle Purohit-mosai chat"
          >
            <img 
              src="/images/purohit-mosai.jpg" 
              alt="Purohit Mosai" 
              className="w-full h-full object-cover object-top scale-[1.2]" 
            />

            {/* Hover label */}
            <span className="absolute top-1/2 -left-36 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-electric text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Ask Purohit-mosai
            </span>
          </button>
          
        </div>
        </div>
      </Magnetic>
    </div>
  );
}
