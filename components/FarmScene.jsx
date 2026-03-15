"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function FarmScene({ onZoneClick, farmData }) {
  const groupRef = useRef();
  
  // Refined Interactive Points based on layout
  const zones = [
    { id: 'cow_shed', position: [0, 4, -5], name: 'Automated Cow Shed', description: 'AI-monitored livestock health and automated milking systems.' },
    { id: 'solar_array', position: [0, 8, -5], name: 'Renewable Power', description: 'Solar panels providing 100% clean energy to the shed.' },
    { id: 'crop_field_a', position: [-40, 4, -20], name: 'Precision Wheat', description: 'Smart-monitored crops with automated irrigation.' },
    { id: 'crop_field_b', position: [-40, 4, 30], name: 'Sustainability Row', description: 'Experimental nitrogen-fixing crop rotation.' },
    { id: 'parking_hub', position: [25, 4, 15], name: 'Operational Hub', description: 'Fleet management and visitor parking.' },
    { id: 'wind_energy', position: [60, 4, -30], name: 'Energy Grid', description: 'Vertical axis turbines for baseline power.' },
    { id: 'water_tower', position: [40, 10, 30], name: 'Water Security', description: 'Recycled water storage for the entire palace.' },
  ];

  return (
    <group ref={groupRef}>
      {/* GROUND HUB */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[1200, 1, 1200]} />
        <meshStandardMaterial color="#6a8a2d" roughness={0.9} />
      </mesh>

      {/* 1. CENTRAL INFRASTRUCTURE (Cow Shed & Solar) */}
      <group position={[0, 0, -5]}>
        <BarnModel scale={4} rotation={[0, Math.PI, 0]} />
        {/* Solar Panels on Shed */}
        <SolarGrid position={[0, 7.5, 0]} rotation={[-Math.PI / 8, 0, 0]} />
        {/* Walking Cows */}
        <MovingAnimal position={[-10, 0, 5]} speed={0.02} color="#f5f5f5" />
        <MovingAnimal position={[12, 0, -5]} speed={0.015} delay={2} color="#4a3219" />
        {/* Humans around the shed */}
        <HumanNPC position={[15, 0, 8]} color="#3b82f6" />
        <HumanNPC position={[-12, 0, -2]} color="#ef4444" />
      </group>

      {/* 2. CROP SIDE (Left Side) */}
      <group position={[-50, 0, 0]}>
        <VastFields />
        <MovingTractor position={[0, 0.5, 0]} />
      </group>

      {/* 3. LOGISTICS SIDE (Right Side) */}
      <group position={[30, 0, 20]}>
        <ParkingLot />
        <WarehouseGroup scale={1.5} />
      </group>

      {/* 4. ENERGY PARK */}
      <group position={[70, 0, -40]}>
        <WindmillGroup scale={3.5} />
        <WindmillGroup position={[25, 0, 15]} scale={2.8} />
      </group>

      {/* 5. NATURE PERIMETER */}
      <ForestPerimeter />

      {/* Pulsing Hotspots */}
      {zones.map((zone) => (
        <InteractiveHotspot
          key={zone.id}
          zone={zone}
          onClick={() => onZoneClick(zone)}
        />
      ))}
    </group>
  );
}

// --- COMPONENTS ---

function SolarGrid({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[i * 2 - 5, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.1, 3]} />
          <meshStandardMaterial color="#1a365d" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function MovingAnimal({ position, speed, delay = 0, color }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay;
    ref.current.position.x = position[0] + Math.sin(t * speed * 20) * 5;
    ref.current.position.z = position[2] + Math.cos(t * speed * 20) * 2;
    ref.current.rotation.y = Math.atan2(Math.cos(t * speed * 20), -Math.sin(t * speed * 20));
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={[1.2, 0.8, 2]} />
      <meshStandardMaterial color={color} />
      <mesh position={[0, 0.4, 0.8]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </mesh>
  );
}

function MovingTractor({ position }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.z = position[2] + Math.sin(t * 0.2) * 40;
    ref.current.rotation.y = Math.cos(t * 0.2) > 0 ? 0 : Math.PI;
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <boxGeometry args={[2, 2, 4]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 1.5, -0.5]}>
        <boxGeometry args={[1.8, 1.5, 1.5]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function HumanNPC({ position, color }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#ffe4e1" />
      </mesh>
    </group>
  );
}

function ParkingLot() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Cars */}
      <mesh position={[-10, 0.5, -5]} castShadow>
        <boxGeometry args={[4, 1.5, 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[5, 0.5, 8]} castShadow>
        <boxGeometry args={[4, 1.5, 2]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
    </group>
  );
}

function VastFields() {
  return (
    <group>
      {[...Array(12)].map((_, i) => (
         <mesh key={i} position={[i * 6 - 30, 0.1, 0]}>
           <boxGeometry args={[3.5, 0.2, 120]} />
           <meshStandardMaterial color="#4d7c0f" />
         </mesh>
      ))}
    </group>
  );
}

function ForestPerimeter() {
  const { scene: treeScene } = useGLTF('/models/tree.glb');
  return (
    <group>
      {[...Array(24)].map((_, i) => (
        <primitive 
          key={i} 
          object={treeScene.clone()} 
          position={[Math.sin(i * 0.3) * 200, 0, Math.cos(i * 0.3) * 200]} 
          scale={3 + Math.random() * 3} 
        />
      ))}
    </group>
  );
}

function WindmillGroup(props) {
  const { scene } = useGLTF('/models/windtower.glb');
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      const blades = ref.current.getObjectByName('Blades') || ref.current.children[0]?.children[0];
      if (blades) blades.rotation.z += 0.08;
    }
  });
  return <primitive ref={ref} object={scene.clone()} {...props} />;
}

function BarnModel(props) {
  const { scene } = useGLTF('/models/barn.glb');
  return <primitive object={scene.clone()} {...props} />;
}

function WarehouseGroup(props) {
  const { scene } = useGLTF('/models/area1.glb');
  return <primitive object={scene.clone()} {...props} />;
}

function InteractiveHotspot({ zone, onClick }) {
  return (
    <Html position={[zone.position[0], zone.position[1], zone.position[2]]} center transform={false}>
      <button
        onClick={onClick}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-125"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
        <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
           <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white]" />
        </div>
        
        <div className="absolute top-full mt-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none">
          <p className="font-bold text-[10px] text-gray-900 uppercase tracking-wider">{zone.name}</p>
        </div>
      </button>
    </Html>
  );
}

useGLTF.preload('/models/tree.glb');
useGLTF.preload('/models/windtower.glb');
useGLTF.preload('/models/barn.glb');
useGLTF.preload('/models/area1.glb');
