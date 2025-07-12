import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Line, Instance, Instances, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';

function CircuitLines() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments[]>([]);
  
  const circuitPaths = useMemo(() => [
    [[-8, 4, -10], [-4, 4, -10], [-4, 2, -10], [0, 2, -10], [0, -2, -10], [4, -2, -10]],
    [[6, 3, -8], [6, -1, -8], [2, -1, -8], [2, -4, -8], [-2, -4, -8]],
    [[-6, 1, -12], [-6, -3, -12], [-2, -3, -12], [-2, 1, -12], [2, 1, -12]]
  ], []);

  // Create geometry once and reuse
  const materials = useMemo(() => [
    new THREE.LineBasicMaterial({ color: '#00d4ff', transparent: true, opacity: 0.3 }),
    new THREE.LineBasicMaterial({ color: '#ff6600', transparent: true, opacity: 0.3 })
  ], []);

  useEffect(() => {
    // Cleanup materials on unmount
    return () => {
      materials.forEach(material => material.dispose());
    };
  }, [materials]);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Smoother rotation with sine wave modulation
      const rotationSpeed = Math.sin(state.clock.elapsedTime * 0.1) * 0.01 + 0.02;
      groupRef.current.rotation.z += rotationSpeed;
    }
  });
  
  return (
    <group ref={groupRef}>
      {circuitPaths.map((points, i) => {
        const positions = points.flatMap((point, index) => {
          if (index === points.length - 1) return [];
          const nextPoint = points[index + 1];
          return [...point, ...nextPoint];
        });

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={positions.length / 3}
                array={new Float32Array(positions)}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" {...materials[i % 2]} />
          </line>
        );
      })}
    </group>
  );
}

function DataStreams() {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  // Create particle positions with proper distribution
  const [positions, colors] = useMemo(() => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const color1 = new THREE.Color('#00ffff');
    const color2 = new THREE.Color('#0088ff');
    
    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution for more natural look
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 15 + Math.random() * 10; // Radius between 15 and 25
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Interpolate between two colors based on height
      const lerpFactor = (positions[i * 3 + 1] + 15) / 30;
      const finalColor = color1.clone().lerp(color2, lerpFactor);
      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }
    
    return [positions, colors];
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      
      // Add subtle wave motion
      const vertices = (pointsRef.current.geometry as THREE.BufferGeometry).attributes.position.array as Float32Array;
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        vertices[i + 1] += Math.sin(state.clock.elapsedTime + x * 0.1) * 0.01;
      }
      (pointsRef.current.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={pointsRef} frustumCulled>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingPanel({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>();
  const initialPosition = useMemo(() => [
    Math.cos(index * Math.PI / 2) * 6,
    Math.sin(index * 0.5) * 2,
    Math.sin(index * Math.PI / 2) * 6
  ] as const, [index]);
  
  useFrame((state) => {
    if (ref.current) {
      // Individual panel animations
      ref.current.position.y = initialPosition[1] + Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.5;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.1;
      // Glowing effect through opacity
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 
        0.2 + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
    }
  });

  return (
    <Instance 
      ref={ref}
      position={initialPosition as [number, number, number]}
      rotation={[0, index * Math.PI / 4, 0]}
    />
  );
}

function FloatingPanels() {
  const groupRef = useRef<THREE.Group>();
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 3), []);
  const materials = useMemo(() => [
    new THREE.MeshBasicMaterial({ 
      color: '#0f1419', 
      transparent: true, 
      opacity: 0.2,
      side: THREE.DoubleSide,
      wireframe: true
    }),
    new THREE.MeshBasicMaterial({ 
      color: '#1a1f2e', 
      transparent: true, 
      opacity: 0.2,
      side: THREE.DoubleSide,
      wireframe: true
    })
  ], []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      materials.forEach(material => material.dispose());
    };
  }, [geometry, materials]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances range={4} geometry={geometry} material={materials[0]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <FloatingPanel key={i} index={i} />
        ))}
      </Instances>
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