'use client';

import { useState, useRef, useEffect } from 'react';

export default function HomeAudioButtons() {
  const [isPlayingDhak, setIsPlayingDhak] = useState(false);
  const [isPlayingSankha, setIsPlayingSankha] = useState(false);

  const dhakAudioRef = useRef<HTMLAudioElement | null>(null);
  const sankhaAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize strictly on the client side
    dhakAudioRef.current = new Audio('/audio/dhak.mp3');
    dhakAudioRef.current.loop = true;

    sankhaAudioRef.current = new Audio('/audio/sankha.mp3');

    // Cleanup on unmount
    return () => {
      if (dhakAudioRef.current) {
        dhakAudioRef.current.pause();
        dhakAudioRef.current.src = '';
      }
      if (sankhaAudioRef.current) {
        sankhaAudioRef.current.pause();
        sankhaAudioRef.current.src = '';
      }
    };
  }, []);

  const toggleDhak = () => {
    if (isPlayingDhak) {
      dhakAudioRef.current?.pause();
      setIsPlayingDhak(false);
    } else {
      dhakAudioRef.current?.play().catch(e => console.error("Dhak audio playback error:", e));
      setIsPlayingDhak(true);
      
      // Optionally pause the other audio to avoid clash, but user didn't explicitly request this
      // if (isPlayingSankha) toggleSankha();
    }
  };

  const toggleSankha = () => {
    if (isPlayingSankha) {
      sankhaAudioRef.current?.pause();
      setIsPlayingSankha(false);
    } else {
      sankhaAudioRef.current?.play().catch(e => console.error("Sankha audio playback error:", e));
      setIsPlayingSankha(true);
      
      // Optionally pause the other audio to avoid clash, but user didn't explicitly request this
      // if (isPlayingDhak) toggleDhak();
    }
  };

  const [mahalayaText, setMahalayaText] = useState('🌺 MAHALAYA');

  const handleMahalaya = () => {
    setMahalayaText('Stay Tuned...');
    setTimeout(() => {
      setMahalayaText('🌺 MAHALAYA');
    }, 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
      <button
        onClick={toggleDhak}
        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
          isPlayingDhak
            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-500'
            : 'bg-gray-900/50 text-amber-500 border border-amber-500/30 hover:bg-gray-700'
        }`}
      >
        {isPlayingDhak ? '⏸ Pause Dhak Beats' : '🥁 Play Dhak Beats'}
      </button>

      <button
        onClick={toggleSankha}
        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
          isPlayingSankha
            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-500'
            : 'bg-gray-900/50 text-amber-500 border border-amber-500/30 hover:bg-gray-700'
        }`}
      >
        {isPlayingSankha ? '⏸ Pause Sankha' : '🐚 Sankha Sounding...'}
      </button>

      <button
        onClick={handleMahalaya}
        className="px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 bg-gray-900/50 text-red-400 border border-red-500/30 hover:bg-gray-700 w-[160px] text-center"
      >
        {mahalayaText}
      </button>
    </div>
  );
}
