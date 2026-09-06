'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

const tracks = [
  { id: 1, name: 'Mahalaya Birendra Krishna Bhadra', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Dummy audio
  { id: 2, name: 'Dhaak Beats', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, name: 'Festive Flute', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-red-100 flex flex-col gap-3 min-w-[250px]">
      <div className="flex items-center gap-3">
        <div className="bg-red-800 p-2 rounded-full text-white">
          <Music size={20} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Devi Paksha Radio</p>
          <p className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
            {tracks[currentTrack].name}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-4 mt-1">
        <select 
          className="text-xs bg-gray-100 border-none rounded-lg p-1.5 font-medium text-gray-700 cursor-pointer outline-none w-32"
          value={currentTrack}
          onChange={(e) => {
            setCurrentTrack(Number(e.target.value));
            setIsPlaying(true);
          }}
        >
          {tracks.map((t, idx) => (
            <option key={t.id} value={idx}>{t.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-2 bg-red-700 text-white hover:bg-red-800 rounded-full transition-colors shadow-md"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={tracks[currentTrack].src} 
        loop 
      />
    </div>
  );
}
