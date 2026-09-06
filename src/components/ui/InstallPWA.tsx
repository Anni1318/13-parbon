'use client';

import { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:bottom-24 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gray-900 border border-amber-500/50 shadow-lg shadow-amber-500/20 rounded-full px-4 py-2 flex items-center justify-between sm:justify-center gap-3 w-full sm:w-auto">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors"
        >
          <Smartphone size={18} className="animate-pulse" />
          <span>Install 13  Parbon App</span>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button
          onClick={() => setShowInstall(false)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
