import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DigimonStage {
  name: string;
  sprite: string;
  level: number;
  requiredActivity: number;
}

const agumonLine: DigimonStage[] = [
  {
    name: 'Koromon',
    sprite: '🟤', // Brown circle representing Koromon
    level: 1,
    requiredActivity: 0
  },
  {
    name: 'Agumon',
    sprite: '🦖', // Dinosaur representing Agumon
    level: 10,
    requiredActivity: 50
  },
  {
    name: 'Greymon',
    sprite: '🐲', // Dragon representing Greymon
    level: 25,
    requiredActivity: 150
  },
  {
    name: 'MetalGreymon',
    sprite: '🤖', // Robot representing MetalGreymon
    level: 40,
    requiredActivity: 300
  },
  {
    name: 'WarGreymon',
    sprite: '⚔️', // Sword representing WarGreymon
    level: 60,
    requiredActivity: 500
  }
];

interface DigimonSpriteProps {
  userActivity: number;
  onEvolution?: (newStage: DigimonStage) => void;
}

export default function DigimonSprite({ userActivity, onEvolution }: DigimonSpriteProps) {
  const [currentStage, setCurrentStage] = useState<DigimonStage>(agumonLine[0]);
  const [isEvolving, setIsEvolving] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const newStage = agumonLine
      .slice()
      .reverse()
      .find(stage => userActivity >= stage.requiredActivity) || agumonLine[0];

    if (newStage.name !== currentStage.name) {
      setIsEvolving(true);
      
      setTimeout(() => {
        setCurrentStage(newStage);
        setAnimationKey(prev => prev + 1);
        onEvolution?.(newStage);
        
        setTimeout(() => {
          setIsEvolving(false);
        }, 1000);
      }, 500);
    }
  }, [userActivity, currentStage.name, onEvolution]);

  const nextStage = agumonLine.find(stage => stage.requiredActivity > userActivity);
  const progressToNext = nextStage 
    ? ((userActivity - currentStage.requiredActivity) / (nextStage.requiredActivity - currentStage.requiredActivity)) * 100
    : 100;

  return (
    <div className="flex flex-col items-center">
      {/* Digimon Sprite */}
      <div className="relative mb-4">
        {isEvolving && (
          <motion.div
            className="absolute inset-0 bg-cyber-cyan rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
          />
        )}
        
        <motion.div
          key={animationKey}
          className="text-8xl relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1], 
            opacity: 1,
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {currentStage.sprite}
        </motion.div>
        
        {isEvolving && (
          <motion.div
            className="absolute -inset-4 border-2 border-cyber-orange rounded-full"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1.5, rotate: 360 }}
            transition={{ duration: 1, repeat: 2 }}
          />
        )}
      </div>

      {/* Digimon Info */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-cyber-cyan mb-1">{currentStage.name}</h3>
        <p className="text-gray-400">Level {currentStage.level}</p>
      </div>

      {/* Evolution Progress */}
      {nextStage && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Next: {nextStage.name}</span>
            <span>{userActivity}/{nextStage.requiredActivity}</span>
          </div>
          <div className="w-full bg-digi-gray rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-cyber-cyan to-cyber-orange h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressToNext, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Evolution Effect */}
      {isEvolving && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyber-orange rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos(i * Math.PI / 4) * 100,
                y: Math.sin(i * Math.PI / 4) * 100,
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}