import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

function DigiEgg() {
  const meshRef = useRef<THREE.Mesh>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  const [cracking, setCracking] = useState(false);
  const [hatching, setHatching] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !cracking) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
    
    if (fragmentsRef.current && hatching) {
      fragmentsRef.current.children.forEach((fragment, i) => {
        fragment.position.x += Math.sin(i) * 0.02;
        fragment.position.y += Math.cos(i) * 0.02;
        fragment.rotation.x += 0.05;
        fragment.rotation.y += 0.03;
      });
    }
  });
  
  useEffect(() => {
    const crackTimer = setTimeout(() => setCracking(true), 1500);
    const hatchTimer = setTimeout(() => setHatching(true), 2500);
    return () => {
      clearTimeout(crackTimer);
      clearTimeout(hatchTimer);
    };
  }, []);
  
  return (
    <group>
      {!hatching ? (
        <group>
          {/* Main egg body */}
          <mesh 
            ref={meshRef} 
            scale={cracking ? [1.1, 1.3, 1.1] : [1, 1.2, 1]}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0.05}
              emissive={cracking ? '#ff6600' : '#ffffff'}
              emissiveIntensity={cracking ? 0.1 : 0.02}
            />
          </mesh>
          
          {/* Orange geometric patterns - triangular/diamond shapes */}
          {/* Top section */}
          <mesh position={[0, 0.6, 1.01]} rotation={[0, 0, 0]} scale={[0.15, 0.3, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          <mesh position={[0.3, 0.4, 0.95]} rotation={[0, 0, Math.PI/3]} scale={[0.12, 0.25, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff8800" />
          </mesh>
          <mesh position={[-0.25, 0.5, 0.97]} rotation={[0, 0, -Math.PI/4]} scale={[0.1, 0.2, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          
          {/* Middle section */}
          <mesh position={[0.4, 0, 0.92]} rotation={[0, 0, Math.PI/2]} scale={[0.18, 0.35, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          <mesh position={[-0.35, 0.1, 0.94]} rotation={[0, 0, -Math.PI/6]} scale={[0.14, 0.28, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff8800" />
          </mesh>
          
          {/* Bottom section */}
          <mesh position={[0.2, -0.4, 0.96]} rotation={[0, 0, Math.PI]} scale={[0.16, 0.32, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          <mesh position={[-0.15, -0.3, 0.98]} rotation={[0, 0, Math.PI/4]} scale={[0.12, 0.24, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff8800" />
          </mesh>
          <mesh position={[0, -0.6, 1.01]} rotation={[0, 0, Math.PI]} scale={[0.1, 0.2, 0.05]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          
          {/* Additional diamond accents */}
          <mesh position={[0.15, 0.2, 1.02]} rotation={[0, 0, Math.PI/4]} scale={[0.08, 0.08, 0.03]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
          <mesh position={[-0.1, -0.1, 1.02]} rotation={[0, 0, Math.PI/4]} scale={[0.06, 0.06, 0.03]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
        </group>
      ) : null}
      
      {cracking && (
        <group ref={fragmentsRef}>
          {/* Crack lines on egg surface */}
          <mesh position={[0, 0.2, 1.01]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.05, 0.8, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.3, -0.1, 1.01]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.05, 0.6, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[-0.2, 0.4, 1.01]} rotation={[0, 0, Math.PI / 3]}>
            <boxGeometry args={[0.05, 0.5, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          
          {/* Egg fragments */}
          {hatching && [...Array(8)].map((_, i) => (
            <mesh 
              key={i}
              position={[
                Math.cos(i * Math.PI / 4) * 2,
                Math.sin(i * Math.PI / 4) * 1.5,
                Math.sin(i) * 1
              ]}
              rotation={[
                i * 0.5,
                i * 0.3,
                i * 0.7
              ]}
            >
              <boxGeometry args={[0.3, 0.4, 0.1]} />
              <meshStandardMaterial
                color="#f8f8f8"
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {hatching && (
        <group>
          {[...Array(20)].map((_, i) => (
            <mesh 
              key={i}
              position={[
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial color="#1a4d66" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
      
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.25}
        color="#1a4d66"
        anchorX="center"
        anchorY="middle"
      >
        {hatching ? 'ENTERING DIGITAL WORLD...' : cracking ? 'DIGITIZING...' : 'INITIALIZING...'}
      </Text>
    </group>
  );
}

interface EggLoaderProps {
  onComplete: () => void;
}

export default function EggLoader({ onComplete }: EggLoaderProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center z-50">
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#1a4d66" />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#2d1b4e" />
          <DigiEgg />
          <fog attach="fog" args={['#1e293b', 3, 15]} />
        </Canvas>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}