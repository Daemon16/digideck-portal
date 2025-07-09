import  { useEffect, useRef } from 'react';
import './CyberBackground.css';

interface CyberBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export default function CyberBackground({ intensity = 'medium' }: CyberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas ? canvas.width : 800);
        this.y = Math.random() * (canvas ? canvas.height : 800);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 0;
        this.maxLife = 100 + Math.random() * 100;
        this.color = Math.random() > 0.7 ? '#ff6b35' : '#00d2d3';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        if (this.x < 0 || this.x > (canvas ? canvas.width : 800)) this.vx *= -1;
        if (this.y < 0 || this.y > (canvas ? canvas.height : 800)) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        const alpha = 1 - (this.life / this.maxLife);
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 1, 1);
      }

      isDead() {
        return this.life >= this.maxLife;
      }
    }

    const initParticles = () => {
      const count = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 150;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles = particles.filter(particle => {
        particle.update();
        particle.draw();
        return !particle.isDead();
      });

      // Add new particles
      if (particles.length < (intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 150)) {
        particles.push(new Particle());
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity]);

  return (
    <div className="cyber-background">
      <canvas ref={canvasRef} className="cyber-canvas" />
      <div className="cyber-grid" />
      <div className="cyber-scanlines" />
      <div className="cyber-hexagons">
        <div className="hex hex-1" />
        <div className="hex hex-2" />
        <div className="hex hex-3" />
      </div>
    </div>
  );
}