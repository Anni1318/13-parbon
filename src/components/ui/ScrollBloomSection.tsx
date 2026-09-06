'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollBloomSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // We track the scroll progress through this specific 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  // Sun position and scale
  // We use percentages for Y so it scales nicely on different screen sizes
  // Starts below the screen (120%) and rises to 30% from the top
  const sunY = useTransform(scrollYProgress, [0, 1], ['120vh', '30vh']);
  const sunScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  // Text Animations - Triggering at specific milestones
  // Card 1: 0.0 - 0.2 (The Night)
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [50, 0, 0, -50]);

  // Card 2: 0.4 - 0.6 (The Dawn)
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [50, 0, 0, -50]);

  // Card 3: 0.8 - 1.0 (The Morning)
  const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 1, 1], [0, 1, 1, 1]);
  const text3Y = useTransform(scrollYProgress, [0.7, 0.8, 1, 1], [50, 0, 0, 0]);

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full">
      {/* Sticky Viewport */}
      <motion.div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-950 via-purple-950 to-[#0A0514]"
      >
        
        {/* Text Overlays */}
        <div className="absolute inset-0 pointer-events-none z-20">
          
          {/* Card 1: The Night */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute inset-0 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
          >
            <div className="max-w-md">
              <h2 className="text-3xl font-sans font-black text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] uppercase tracking-widest">
                The Night
              </h2>
              <p className="text-gray-300 font-medium text-lg leading-relaxed bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
                Anticipation fills the quiet midnight air. The city rests, holding its breath before the divine awakening.
              </p>
            </div>
          </motion.div>

          {/* Card 2: The Dawn */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
          >
            <div className="max-w-md">
              <h2 className="text-3xl font-sans font-black bg-gradient-to-r from-saffron to-yellow-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] uppercase tracking-widest">
                The Dawn
              </h2>
              <p className="text-gray-200 font-medium text-lg leading-relaxed bg-black/60 backdrop-blur-md border border-saffron/30 p-6 rounded-3xl shadow-[0_10px_30px_rgba(249,115,22,0.15)]">
                The first light touches the horizon. Mantras echo through the mist, heralding the arrival of the Goddess.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade to match next section background #080414 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0514] to-transparent z-10 pointer-events-none" />

      </motion.div>
    </section>
  );
}
