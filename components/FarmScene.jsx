"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html, Float, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

export default function FarmScene({ onZoneClick, farmData }) {
  const groupRef = useRef();

  // Refined Interactive Points based on layout
  const zones = [
    { id: 'cow_shed', position: [0, 5, 5], name: 'Automated Cow Shed', description: 'AI-monitored livestock health and automated milking systems.' },
    { id: 'solar_array', position: [50, 2, 40], name: 'Renewable Power', description: 'Platform-mounted solar arrays providing clean energy.' },
    { id: 'crop_field_a', position: [-40, 4, -40], name: 'Precision Wheat', description: 'Smart-monitored wheat crops with automated irrigation.' },
    { id: 'crop_field_b', position: [-40, 4, -120], name: 'Vibrant Canola', description: 'Sustainable canola production for renewable bio-oils.' },
    { id: 'crop_field_c', position: [40, 4, -40], name: 'Premium Barley', description: 'High-quality barley for brewing and livestock feed.' },
    { id: 'crop_field_d', position: [40, 4, -120], name: 'Precision Peas', description: 'Nitrogen-fixing sweet peas for healthy soil regeneration.' },
    { id: 'parking_hub', position: [25, 4, 15], name: 'Operational Hub', description: 'Fleet management and visitor parking.' },
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
        {/* Solar grid moved to platform area */}
        {/* Walking Cows */}
        <MovingAnimal position={[-10, 0, 5]} speed={0.02} color="#f5f5f5" />
        <MovingAnimal position={[12, 0, -5]} speed={0.015} delay={2} color="#4a3219" />
        {/* Humans around the shed */}
        <HumanNPC position={[15, 0, 8]} color="#3b82f6" />
        <HumanNPC position={[-12, 0, -2]} color="#ef4444" />
      </group>

      {/* 2. CROP SIDE (Left Side: 4 distinct fields with Perimeter) */}
      <group position={[-50, 0, 0]}>
        <CropPerimeterFence />
        <CropBlock label="wheat" position={[0, 0, -40]} />
        <CropBlock label="barley" position={[80, 0, -40]} />
        <CropBlock label="canola" position={[0, 0, -120]} />
        <CropBlock label="peas" position={[80, 0, -120]} />
        <MovingTractor position={[0, 0.5, 0]} />
      </group>

      {/* 3. LOGISTICS SIDE (Right Side) */}
      <group position={[30, 0, 20]}>
        <ParkingLot />
        <WarehouseGroup scale={1.5} />
        {/* Solar grid relocated to corner of the yellow platform/houses area */}
        <SolarGrid position={[20, 0.5, 20]} scale={0.6} rotation={[0, -Math.PI / 4, 0]} />
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
      {[...Array(4)].map((_, r) => (
        <group key={`row-${r}`} position={[0, 0, r * 4]}>
          {[...Array(6)].map((_, i) => (
            <group key={`panel-${i}`} position={[i * 2.5 - 6.25, 0, 0]}>
              {/* Mounting Stand */}
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.2, 1, 0.2]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              {/* Solar Panel */}
              <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 5, 0, 0]} castShadow>
                <boxGeometry args={[2.2, 0.1, 3.5]} />
                <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} />
                {/* Panel Frame */}
                <mesh position={[0, -0.06, 0]}>
                  <boxGeometry args={[2.4, 0.05, 3.7]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.8} />
                </mesh>
              </mesh>
            </group>
          ))}
        </group>
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
        <planeGeometry args={[120, 100]} />
        <meshStandardMaterial color="#4b5563" roughness={0.8} />
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

function CropBlock({ position, label }) {
  const isCanola = label === 'canola';
  const isBarley = label === 'barley';
  const isPeas = label === 'peas';

  let headColor = "#eab308"; // wheat
  if (isCanola) headColor = "#fde047";
  if (isBarley) headColor = "#fcd34d"; // lighter gold for barley
  if (isPeas) headColor = "#22c55e"; // bright green for peas

  const fieldDepth = 70; // Depth of this specific block
  const stalkCount = 200; // Crops per row

  const stalks = useMemo(() => {
    return [...Array(stalkCount)].map(() => {
      const x = (Math.random() - 0.5) * 3; // within 3.5 width
      const z = (Math.random() - 0.5) * (fieldDepth - 2);
      let baseHeight = 0.8;
      if (isCanola) baseHeight = 0.9;
      if (isBarley) baseHeight = 1.0;
      if (isPeas) baseHeight = 0.6; // peas grow lower

      const height = baseHeight + Math.random() * 0.6;
      return { position: [x, height / 2 + 0.1, z], height };
    });
  }, [stalkCount, fieldDepth, isCanola, isBarley, isPeas]);

  return (
    <group position={position}>
      {[...Array(12)].map((_, i) => (
        <group key={i} position={[i * 6 - 30, 0.1, 0]}>
          {/* Soil Patch */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.5, 0.2, fieldDepth]} />
            <meshStandardMaterial color="#3f2b1a" roughness={1} />
          </mesh>

          {/* Green Stalks */}
          <Instances range={stalkCount}>
            <cylinderGeometry args={[0.04, 0.04, 1]} />
            <meshStandardMaterial color="#4d7c0f" />
            {stalks.map((data, j) => (
              <Instance key={`stalk-${j}`} position={data.position} scale={[1, data.height, 1]} />
            ))}
          </Instances>

          {/* Crop Heads */}
          <Instances range={stalkCount}>
            {isCanola || isPeas ? (
              <sphereGeometry args={[isPeas ? 0.12 : 0.15, 6, 6]} />
            ) : isBarley ? (
              <boxGeometry args={[0.12, 0.5, 0.12]} />
            ) : (
              <boxGeometry args={[0.15, 0.4, 0.15]} />
            )}
            <meshStandardMaterial color={headColor} />
            {stalks.map((data, j) => (
              <Instance key={`head-${j}`} position={[data.position[0], data.position[1] + data.height / 2, data.position[2]]} />
            ))}
          </Instances>
        </group>
      ))}
    </group>
  );
}

function CropPerimeterFence() {
  const width = 180;
  const depth = 170;

  const fenceColor = "#4a3728";

  return (
    <group position={[40, 0, -80]}>
      {/* Left Wall */}
      <FenceWall width={depth} x={-width / 2} z={0} rotation={[0, Math.PI / 2, 0]} color={fenceColor} />
      {/* Back Wall */}
      <FenceWall width={width} x={0} z={-depth / 2} rotation={[0, 0, 0]} color={fenceColor} />
      {/* Front Wall */}
      <FenceWall width={width} x={0} z={depth / 2} rotation={[0, 0, 0]} color={fenceColor} />

      {/* Right Wall with Gate (Gate is gap in the middle) */}
      <FenceWall width={(depth - 30) / 2} x={width / 2} z={-depth / 4 - 7.5} rotation={[0, Math.PI / 2, 0]} color={fenceColor} />
      <FenceWall width={(depth - 30) / 2} x={width / 2} z={depth / 4 + 7.5} rotation={[0, Math.PI / 2, 0]} color={fenceColor} />

      {/* Entry Gate Arch */}
      <group position={[width / 2, 0, 0]}>
        <mesh position={[0, 2.5, -15]}>
          <boxGeometry args={[0.6, 5, 0.6]} />
          <meshStandardMaterial color="#2d1b11" />
        </mesh>
        <mesh position={[0, 2.5, 15]}>
          <boxGeometry args={[0.6, 5, 0.6]} />
          <meshStandardMaterial color="#2d1b11" />
        </mesh>
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[0.4, 0.8, 30]} />
          <meshStandardMaterial color="#2d1b11" />
        </mesh>
      </group>
    </group>
  );
}

function FenceWall({ width, x, z, rotation, color }) {
  const posts = Math.floor(width / 10);
  return (
    <group position={[x, 0, z]} rotation={rotation}>
      {/* Top Rail */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Bottom Rail */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Posts */}
      {[...Array(posts + 1)].map((_, i) => (
        <mesh key={i} position={[-width / 2 + i * (width / posts), 1, 0]}>
          <boxGeometry args={[0.3, 2, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function ForestPerimeter() {
  const { scene: treeScene } = useGLTF('/models/tree.glb');
  return (
    <group position={[-40, 0, 0]}>
      {/* Dense forest patch immediately left of the crop section */}
      {[...Array(35)].map((_, i) => (
        <primitive
          key={i}
          object={treeScene.clone()}
          position={[(Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 180]}
          scale={3 + Math.random() * 4}
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
  
  // Update any yellow parts of the model to grey concrete
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // If it looks yellow or is named like a platform
        const color = child.material.color;
        if ((color.r > 0.6 && color.g > 0.6 && color.b < 0.4) || child.name.toLowerCase().includes('platform')) {
          child.material.color.set("#4b5563");
        }
      }
    });
  }, [scene]);

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
