'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LotusAnimation() {
  const [bloomPhase, setBloomPhase] = useState(0);

  // Auto-cycle through phases if clicked, or just cycle slowly automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setBloomPhase((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setBloomPhase((prev) => (prev + 1) % 3);
  };

  // Phase configurations
  // 0: Bud, 1: Opening, 2: Blooming
  const innerLeftVariants = {
    0: { rotate: 0, scale: 0.8 },
    1: { rotate: -10, scale: 0.9 },
    2: { rotate: -25, scale: 1 },
  };

  const innerRightVariants = {
    0: { rotate: 0, scale: 0.8 },
    1: { rotate: 10, scale: 0.9 },
    2: { rotate: 25, scale: 1 },
  };

  const outerLeftVariants = {
    0: { rotate: 0, scale: 0.8, opacity: 1 },
    1: { rotate: -25, scale: 0.9, opacity: 0.9 },
    2: { rotate: -55, scale: 1, opacity: 0.8 },
  };

  const outerRightVariants = {
    0: { rotate: 0, scale: 0.8, opacity: 1 },
    1: { rotate: 25, scale: 0.9, opacity: 0.9 },
    2: { rotate: 55, scale: 1, opacity: 0.8 },
  };

  const glowVariants = {
    0: { filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.2))' },
    1: { filter: 'drop-shadow(0 0 15px rgba(245,158,11,0.6))' },
    2: { filter: 'drop-shadow(0 0 35px rgba(236,72,153,0.9))' },
  };

  return (
    <motion.div
      className="relative cursor-pointer pointer-events-auto"
      onClick={handleClick}
      animate={bloomPhase.toString()}
      variants={glowVariants}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 100 100"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" /> {/* electric pink */}
              <stop offset="100%" stopColor="#f97316" /> {/* saffron */}
            </linearGradient>
            <linearGradient id="lotusOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" /> {/* lighter pink */}
              <stop offset="100%" stopColor="#ea580c" /> {/* dark orange */}
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g style={{ transformOrigin: '50px 80px' }}>
            {/* Base leaves */}
            <path
              d="M20,80 Q50,100 80,80 Q50,90 20,80 Z"
              fill="#10b981"
              opacity="0.6"
            />

            {/* Outer Petals */}
            <motion.path
              d="M50,80 C50,80 15,60 5,45 C20,35 50,80 50,80 Z"
              fill="url(#lotusOuterGrad)"
              variants={outerLeftVariants}
              initial="0"
              animate={bloomPhase.toString()}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '50px 80px' }}
            />
            <motion.path
              d="M50,80 C50,80 85,60 95,45 C80,35 50,80 50,80 Z"
              fill="url(#lotusOuterGrad)"
              variants={outerRightVariants}
              initial="0"
              animate={bloomPhase.toString()}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '50px 80px' }}
            />

            {/* Inner Petals */}
            <motion.path
              d="M50,80 C50,80 25,50 20,30 C35,25 50,80 50,80 Z"
              fill="url(#lotusGrad)"
              variants={innerLeftVariants}
              initial="0"
              animate={bloomPhase.toString()}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '50px 80px' }}
            />
            <motion.path
              d="M50,80 C50,80 75,50 80,30 C65,25 50,80 50,80 Z"
              fill="url(#lotusGrad)"
              variants={innerRightVariants}
              initial="0"
              animate={bloomPhase.toString()}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '50px 80px' }}
            />

            {/* Central Bud (Always Static/Slightly scaled) */}
            <motion.path
              d="M50,80 C50,80 35,40 50,10 C65,40 50,80 50,80 Z"
              fill="url(#lotusGrad)"
              animate={{ scale: bloomPhase === 2 ? 1.05 : 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '50px 80px' }}
              filter="url(#glow)"
            />
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
