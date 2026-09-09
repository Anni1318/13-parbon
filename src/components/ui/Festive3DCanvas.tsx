'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;
  type: 'spark' | 'petal';
  angle: number;
  spin: number;
};

export default function Festive3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Init particles
    const particleCount = Math.min(window.innerWidth / 15, 80); // Responsive amount
    for (let i = 0; i < particleCount; i++) {
      const type = Math.random() > 0.7 ? 'petal' : 'spark';
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5, // Depth parallax factor
        size: type === 'petal' ? Math.random() * 6 + 4 : Math.random() * 2 + 1,
        speedY: type === 'petal' ? Math.random() * 0.5 + 0.2 : -(Math.random() * 1 + 0.5), // petals fall, sparks rise
        speedX: (Math.random() - 0.5) * 0.5,
        color: type === 'petal' ? (Math.random() > 0.5 ? '#F59E0B' : '#EF4444') : '#FDE68A', // Amber/Crimson for petals, Gold for sparks
        type,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse parallax offset
      const targetParallaxX = (mouse.x - width / 2) * 0.05;
      const targetParallaxY = (mouse.y - height / 2) * 0.05;

      particles.forEach((p) => {
        // Move
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        // Apply Parallax based on Z depth
        const drawX = p.x + targetParallaxX * p.z;
        const drawY = p.y + targetParallaxY * p.z;

        // Wrap around screen
        if (p.speedY > 0 && p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
        if (p.speedY < 0 && p.y < -20) { p.y = height + 20; p.x = Math.random() * width; }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.min(1, p.z / 2); // Depth fading

        if (p.type === 'petal') {
          // Draw marigold petal (stylized diamond/ellipse)
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw spark (glowing circle)
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
    />
  );
}
