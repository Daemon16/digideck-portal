import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

function CircuitLines() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });
  
  const circuitPaths = [
    [[-8, 4, -10], [-4, 4, -10], [-4, 2, -10], [0, 2, -10], [0, -2, -10], [4, -2, -10]],
    [[6, 3, -8], [6, -1, -8], [2, -1, -8], [2, -4, -8], [-2, -4, -8]],
    [[-6, 1, -12], [-6, -3, -12], [-2, -3, -12], [-2, 1, -12], [2, 1, -12]]
  ];
  
  return (
    <group ref={groupRef}>
      {circuitPaths.map((points, i) => (
        <Line
          key={i}
          points={points.map(p => [p[0], p[1], p[2]] as [number, number, number])}
          color={i % 2 === 0 ? '#00d4ff' : '#ff6600'}
          lineWidth={2}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}

function DataStreams() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function FloatingPanels() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });
  
  return (
    <group ref={groupRef}>
      {[...Array(4)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * Math.PI / 2) * 6, 
            Math.sin(i * 0.5) * 2, 
            Math.sin(i * Math.PI / 2) * 6
          ]}
          rotation={[0, i * Math.PI / 4, 0]}
        >
          <planeGeometry args={[2, 3]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? '#0f1419' : '#1a1f2e'} 
            transparent 
            opacity={0.2}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function CyberGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <gridHelper
      ref={gridRef}
      args={[30, 30, '#00d4ff', '#1a1a1a']}
      position={[0, -8, 0]}
    />
  );
}

export default function DigitalWorldBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[8, 8, 8]} intensity={0.3} color="#1a4d66" />
        <pointLight position={[-8, -8, -8]} intensity={0.2} color="#2d1b4e" />
        
        <CircuitLines />
        <DataStreams />
        <FloatingPanels />
        <CyberGrid />
        
        <fog attach="fog" args={['#0c0c0c', 8, 35]} />
      </Canvas>
    </div>
  );
}