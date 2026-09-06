'use client';

import { motion } from 'framer-motion';

export default function SunriseTransition() {
  return (
    <section className="relative w-full overflow-hidden bg-[#1a0b2e] z-0">
      
      {/* Dynamic Background Animation: Asur Bodh Video */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        whileInView={{ opacity: 0.6, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="relative w-full h-auto pointer-events-none z-0 mix-blend-screen"
      >
        <video 
          src="/videos/asur-bodh.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-auto block"
        />
      </motion.div>

      {/* Dark Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />

      {/* Top Fade (Blends into FestivalExplorer: #1a0f14) */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-[#1a0f14] to-transparent z-10 pointer-events-none"></div>

      {/* Bottom Fade (Blends into Home Audio Section: #080414) */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#080414] to-transparent z-10 pointer-events-none"></div>

      {/* Foreground Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full text-center z-20 px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider uppercase [text-shadow:_0_0_15px_rgba(255,255,255,0.6)]">
          Festivities Begin
        </h2>
        <p className="text-sm md:text-base text-gray-100 mt-2 md:mt-3 [text-shadow:_0_0_8px_rgba(255,255,255,0.4)]">
          Step into the joy, culture, and divine celebration of 13 Parbon.
        </p>
      </motion.div>
    </section>
  );
}
