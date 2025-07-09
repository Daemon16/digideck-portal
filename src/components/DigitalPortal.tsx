import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './DigitalPortal.css';

interface DigitalPortalProps {
  onComplete: () => void;
}

export default function DigitalPortal({ onComplete }: DigitalPortalProps) {
  const [stage, setStage] = useState<'forming' | 'opening' | 'complete'>('forming');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('opening'), 2000);
    const timer2 = setTimeout(() => setStage('complete'), 4000);
    const timer3 = setTimeout(() => onComplete(), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="digital-portal-container">
      {/* Background */}
      <div className="portal-background" />
      
      {/* Digital Grid */}
      <div className="portal-grid" />
      
      {/* Outer Hexagon Ring */}
      <motion.div
        className="portal-hex-outer"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: stage === 'forming' ? 1 : stage === 'opening' ? 1.1 : 1.2,
          rotate: stage === 'complete' ? 360 : 0
        }}
        transition={{ 
          duration: stage === 'forming' ? 2 : 1,
          ease: "easeOut"
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="hex-segment"
            style={{ transform: `rotate(${i * 60}deg)` }}
            animate={{
              opacity: [0.3, 1, 0.3],
              boxShadow: [
                '0 0 10px rgba(0, 210, 211, 0.3)',
                '0 0 30px rgba(0, 210, 211, 0.8)',
                '0 0 10px rgba(0, 210, 211, 0.3)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>

      {/* Inner Tech Rings */}
      <motion.div
        className="portal-tech-rings"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="tech-ring"
            style={{
              width: `${200 - i * 40}px`,
              height: `${200 - i * 40}px`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </motion.div>

      {/* Portal Center */}
      <motion.div
        className="portal-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: stage === 'opening' ? 1 : stage === 'complete' ? 1.5 : 0,
          opacity: stage === 'opening' ? 0.8 : stage === 'complete' ? 1 : 0
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="center-core" />
      </motion.div>

      {/* Tech Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="tech-particle"
          style={{
            left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 35}%`,
            top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 35}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Data Streams */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="data-stream"
          style={{
            left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 45}%`,
            top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 45}%`,
            transform: `rotate(${i * 45 + 90}deg)`
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}

      {/* Text */}
      <motion.div
        className="portal-text"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.h1
          animate={{ 
            textShadow: [
              "0 0 20px #00d2d3",
              "0 0 40px #00d2d3",
              "0 0 20px #00d2d3"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {stage === 'forming' && 'INITIALIZING PORTAL...'}
          {stage === 'opening' && 'ACCESSING DIGITAL WORLD...'}
          {stage === 'complete' && 'CONNECTION ESTABLISHED'}
        </motion.h1>
      </motion.div>

      {/* Portal Flash */}
      {stage === 'complete' && (
        <motion.div
          className="portal-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
}