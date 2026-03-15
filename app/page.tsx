"use client";

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Sky } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import FarmScene from '@/components/FarmScene';
import UIOverlay from '@/components/UIOverlay';
import VoiceController from '@/components/VoiceController';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';

function CameraHandler({ activeZone }: { activeZone: any }) {
  const { camera, controls } = useThree() as any;
  const targetPos = useRef(new THREE.Vector3(150, 120, 150));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (activeZone) {
      // Very close zoom for detail areas but angled to see animations
      targetPos.current.set(
        activeZone.position[0] + 25,
        activeZone.position[1] + 20,
        activeZone.position[2] + 25
      );
      targetLook.current.set(activeZone.position[0], activeZone.position[1], activeZone.position[2]);
    } else {
      // Cinematic overview
      targetPos.current.set(150, 120, 150);
      targetLook.current.set(0, 0, 0);
    }
    isTransitioning.current = true;
  }, [activeZone]);

  useFrame(() => {
    if (!isTransitioning.current) return;
    camera.position.lerp(targetPos.current, 0.04);
    if (controls && controls.target) {
      controls.target.lerp(targetLook.current, 0.04);
      controls.update();
    }
    if (camera.position.distanceTo(targetPos.current) < 0.2) isTransitioning.current = false;
  });

  return null;
}

export default function FarmExperience() {
  const [activeZone, setActiveZone] = useState<any>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [farmData, setFarmData] = useState({
    temperature: 24.5,
    soilMoisture: 72,
    alerts: [],
  });

  return (
    <main className="w-full h-screen relative bg-[#0a1a08] overflow-hidden">
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-[#0a1a08] flex items-center justify-center p-8"
          >
             <div className="text-center text-white relative z-10">
              <h1 className="text-8xl font-black uppercase mb-12 tracking-tighter">DOWNS PALACE</h1>
              <p className="text-xs font-bold tracking-[0.6em] uppercase opacity-40 mb-16">Architecting Resilient Agriculture</p>
              <button 
                onClick={() => setHasStarted(true)}
                className="px-16 py-6 bg-white text-black font-black uppercase rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all text-sm tracking-widest"
              >
                Access Estate Grid
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas
        shadows
        camera={{ position: [150, 120, 150], fov: 38 }}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#1c2e1c"]} />
        
        {/* Bright daylight setup */}
        <ambientLight intensity={0.9} />
        <spotLight position={[50, 120, 50]} angle={0.15} penumbra={1} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight 
          position={[0, 40, 0]} 
          intensity={0.8} 
        />
        
        <Suspense fallback={null}>
          <FarmScene 
            onZoneClick={setActiveZone}
            farmData={farmData}
          />
          <Environment preset="park" />
          <Sky distance={450000} sunPosition={[1, 0.4, 1]} inclination={0} azimuth={0.25} />
        </Suspense>

        <CameraHandler activeZone={activeZone} />
        
        <OrbitControls
          makeDefault
          minDistance={15}
          maxDistance={500}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping
        />
      </Canvas>

      <UIOverlay 
        activeZone={activeZone}
        farmData={farmData}
        onClose={() => setActiveZone(null)}
      />

      <VoiceController onDataUpdate={setFarmData} />
    </main>
  );
}
