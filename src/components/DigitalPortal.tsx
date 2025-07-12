import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DigitalPortal.css';

interface DigitalPortalProps {
  onComplete: () => void;
}

const BINARY_STRINGS = [
  '01100101', '11010010', '10011100', '00110101',
  '11001010', '10101011', '01011010', '11100101'
];

export default function DigitalPortal({ onComplete }: DigitalPortalProps) {
  const [stage, setStage] = useState<'initializing' | 'analyzing' | 'connecting' | 'complete'>('initializing');
  const [codeStrings, setCodeStrings] = useState<string[]>([]);
  const portalRef = useRef<HTMLDivElement>(null);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Stage transitions
    const timeline = [
      { stage: 'analyzing', delay: 2000 },
      { stage: 'connecting', delay: 4000 },
      { stage: 'complete', delay: 6000 },
      { action: onComplete, delay: 7000 }
    ];

    timeline.forEach(({ stage, action, delay }) => {
      const timer = setTimeout(() => {
        if (stage) setStage(stage as any);
        if (action) action();
      }, delay);
      return () => clearTimeout(timer);
    });

    // Binary code animation
    const interval = setInterval(() => {
      setCodeStrings(prev => {
        const newStrings = [...prev];
        if (newStrings.length < 20) {
          newStrings.push(BINARY_STRINGS[Math.floor(Math.random() * BINARY_STRINGS.length)]);
        } else {
          newStrings.shift();
          newStrings.push(BINARY_STRINGS[Math.floor(Math.random() * BINARY_STRINGS.length)]);
        }
        return newStrings;
      });
    }, 200);

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, [onComplete]);

  return (
    <div className="portal-container">
      {/* Background Elements */}
      <div className="portal-ambient" />
      <div className="portal-grid" />
      
      {/* Binary Rain */}
      <div className="binary-container">
        {codeStrings.map((str, i) => (
          <motion.div
            key={`${i}-${str}`}
            className="binary-string"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 0], y: 20 }}
            transition={{ duration: 2 }}
            style={{
              left: `${(i % 10) * 10}%`,
              animationDelay: `${i * 0.1}s`
            }}
          >
            {str}
          </motion.div>
        ))}
      </div>

      {/* Main Portal */}
      <div className="portal-wrapper" ref={portalRef}>
        {/* Energy Field */}
        <motion.div
          className="energy-field"
          initial={{ scale: 0 }}
          animate={{ 
            scale: stage === 'initializing' ? 1 : 1.2,
            opacity: stage === 'complete' ? 0.8 : 0.4
          }}
          transition={{ duration: 2 }}
        />

        {/* Portal Rings */}
        <div className="portal-rings">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={`portal-ring ring-${i + 1}`}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: 1,
                rotate: 360 * (i % 2 ? -1 : 1)
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Core Element */}
        <motion.div
          className="portal-core"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="core-inner" />
        </motion.div>

        {/* Energy Particles */}
        <div className="particle-container">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="energy-particle"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
                x: [0, Math.cos(i * 30) * 100],
                y: [0, Math.sin(i * 30) * 100]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Interface Elements */}
      <div className="interface-layer">
        {/* Status Display */}
        <motion.div
          className="status-display"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="status-header">
            <motion.div
              className="status-dot"
              animate={{
                backgroundColor: ['#ff6b35', '#00d2d3', '#8b5cf6'],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h2>SYSTEM STATUS</h2>
          </div>
          
          <div className="status-content">
            {stage === 'initializing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>INITIALIZING QUANTUM MATRIX</p>
                <p>CALIBRATING PORTAL VECTORS</p>
              </motion.div>
            )}
            {stage === 'analyzing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>ANALYZING DIMENSIONAL PATTERNS</p>
                <p>STABILIZING PORTAL FREQUENCY</p>
              </motion.div>
            )}
            {stage === 'connecting' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>ESTABLISHING DIGITAL LINK</p>
                <p>SYNCHRONIZING DATA STREAMS</p>
              </motion.div>
            )}
            {stage === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>PORTAL STABILIZED</p>
                <p>READY FOR TRANSPORT</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          className="progress-bar"
          initial={{ width: '0%' }}
          animate={{ 
            width: stage === 'initializing' ? '25%' :
                   stage === 'analyzing' ? '50%' :
                   stage === 'connecting' ? '75%' :
                   '100%'
          }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Portal Flash Effect */}
      <AnimatePresence>
        {stage === 'complete' && (
          <motion.div
            className="portal-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Glitch Effect */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            className="glitch-effect"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}