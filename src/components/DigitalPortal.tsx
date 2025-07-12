import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DigitalPortal.css';

interface DigitalPortalProps {
  onComplete: () => void;
}

interface RainDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  value: string;
  brightness: number;
}

const NUM_DROPS = 40;

export default function DigitalPortal({ onComplete }: DigitalPortalProps) {
  const [stage, setStage] = useState<'initializing' | 'analyzing' | 'connecting' | 'complete'>('initializing');
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const animationRef = useRef<number>();

  // Generate random binary string
  const generateBinaryString = () => {
    const length = Math.floor(Math.random() * 3) + 3; // 3-5 characters
    return Array.from({ length }, () => 
      Math.random() > 0.5 ? '1' : '0'
    ).join('');
  };

  // Create a new raindrop
  const createRainDrop = (id: number) => ({
    id,
    x: Math.random() * 100,
    y: -20,
    speed: 0.08 + Math.random() * 0.12, // Slower speed between 0.08 and 0.2
    value: generateBinaryString(),
    brightness: 0.3 + Math.random() * 0.7 // Random brightness between 0.3 and 1
  });

  useEffect(() => {
    // Initialize raindrops with staggered starting positions
    setRainDrops(Array.from({ length: NUM_DROPS }, (_, i) => ({
      ...createRainDrop(i),
      y: Math.random() * 100 // Start at random positions
    })));

    // Stage transitions
    const timer1 = setTimeout(() => setStage('analyzing'), 2000);
    const timer2 = setTimeout(() => setStage('connecting'), 4000);
    const timer3 = setTimeout(() => setStage('complete'), 6000);
    const timer4 = setTimeout(() => onComplete(), 7000);

    // Animation loop for raindrops
    const updateRaindrops = () => {
      setRainDrops(drops => 
        drops.map(drop => {
          const newY = drop.y + drop.speed;
          
          // If drop is off screen, reset it to top
          if (newY > 120) {
            return {
              ...createRainDrop(drop.id),
              y: -20
            };
          }
          
          return {
            ...drop,
            y: newY,
            // Very occasionally change the value
            value: Math.random() > 0.99 ? generateBinaryString() : drop.value
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(updateRaindrops);
    };

    animationRef.current = requestAnimationFrame(updateRaindrops);

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(glitchInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onComplete]);

  return (
    <div className="portal-container">
      {/* Background Elements */}
      <div className="portal-ambient" />
      <div className="portal-grid" />
      
      {/* Binary Rain */}
      <div className="binary-container">
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="rain-drop"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              opacity: drop.brightness,
              color: `rgba(0, 210, 211, ${drop.brightness})`
            }}
          >
            {drop.value}
          </div>
        ))}
      </div>

      {/* Main Portal */}
      <div className="portal-wrapper">
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