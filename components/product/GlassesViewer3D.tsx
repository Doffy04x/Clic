'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ProductColor } from '@/lib/types';

// ─── 3D Glasses Model ─────────────────────────────────────────────────────────
// Procedurally generated glasses model using Three.js geometry primitives.
// In production, replace with actual GLTF/GLB models.

interface GlassesModelProps {
  color: ProductColor;
  shape: string;
  autoRotate: boolean;
}

function GlassesModel({ color, shape, autoRotate }: GlassesModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color.frameHex ?? color.hex),
    metalness: 0.3,
    roughness: 0.4,
  });
  const lensMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color.lensHex ?? '#88aacc'),
    transparent: true,
    opacity: 0.5,
    metalness: 0.1,
    roughness: 0.0,
    envMapIntensity: 0.8,
  });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Determine lens shape based on frameShape prop
  const lensWidth = shape === 'aviator' ? 0.55 : shape === 'round' || shape === 'oval' ? 0.45 : 0.52;
  const lensHeight = shape === 'aviator' ? 0.55 : shape === 'rectangle' ? 0.32 : 0.42;
  const lensRadiusTop = shape === 'cat-eye' ? 0.7 : shape === 'square' || shape === 'rectangle' ? 0.05 : 1;
  const lensRadiusBottom = shape === 'cat-eye' ? 0.3 : 1;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Left Lens Frame */}
      <mesh position={[-0.7, 0, 0]} material={frameMat} castShadow>
        <torusGeometry args={[lensWidth * 0.5, 0.04, 16, 64]} />
      </mesh>

      {/* Left Lens Fill */}
      <mesh position={[-0.7, 0, 0]} material={lensMat}>
        <circleGeometry args={[lensWidth * 0.5 - 0.04, 64]} />
      </mesh>

      {/* Right Lens Frame */}
      <mesh position={[0.7, 0, 0]} material={frameMat} castShadow>
        <torusGeometry args={[lensWidth * 0.5, 0.04, 16, 64]} />
      </mesh>

      {/* Right Lens Fill */}
      <mesh position={[0.7, 0, 0]} material={lensMat}>
        <circleGeometry args={[lensWidth * 0.5 - 0.04, 64]} />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0.05, 0]} material={frameMat} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 12]} />
      </mesh>

      {/* Nose pad (left) */}
      <mesh position={[-0.12, -0.15, 0.1]} material={frameMat}>
        <boxGeometry args={[0.04, 0.08, 0.03]} />
      </mesh>

      {/* Nose pad (right) */}
      <mesh position={[0.12, -0.15, 0.1]} material={frameMat}>
        <boxGeometry args={[0.04, 0.08, 0.03]} />
      </mesh>

      {/* Left Temple (arm) */}
      <group position={[-lensWidth * 0.5 - 0.7, 0, 0]}>
        <mesh rotation={[0, 0.08, 0]} material={frameMat} castShadow>
          <boxGeometry args={[0.9, 0.035, 0.035]} />
        </mesh>
        {/* Tip curve */}
        <mesh position={[-0.45, -0.08, 0.05]} rotation={[0.8, 0, 0]} material={frameMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
        </mesh>
      </group>

      {/* Right Temple (arm) */}
      <group position={[lensWidth * 0.5 + 0.7, 0, 0]}>
        <mesh rotation={[0, -0.08, 0]} material={frameMat} castShadow>
          <boxGeometry args={[0.9, 0.035, 0.035]} />
        </mesh>
        {/* Tip curve */}
        <mesh position={[0.45, -0.08, 0.05]} rotation={[0.8, 0, 0]} material={frameMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
        </mesh>
      </group>

      {/* Hinge (left) */}
      <mesh position={[-lensWidth * 0.5 - 0.72, 0, 0]} material={
        new THREE.MeshStandardMaterial({ color: '#C9A84C', metalness: 0.9, roughness: 0.1 })
      }>
        <cylinderGeometry args={[0.03, 0.03, 0.07, 12]} />
      </mesh>

      {/* Hinge (right) */}
      <mesh position={[lensWidth * 0.5 + 0.72, 0, 0]} material={
        new THREE.MeshStandardMaterial({ color: '#C9A84C', metalness: 0.9, roughness: 0.1 })
      }>
        <cylinderGeometry args={[0.03, 0.03, 0.07, 12]} />
      </mesh>
    </group>
  );
}

// ─── Loading Placeholder ──────────────────────────────────────────────────────

function LoadingPlaceholder() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Chargement du modèle 3D…</span>
      </div>
    </Html>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface GlassesViewer3DProps {
  color: ProductColor;
  frameShape?: string;
  className?: string;
}

export default function GlassesViewer3D({
  color,
  frameShape = 'round',
  className = '',
}: GlassesViewer3DProps) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className={`relative viewer-3d ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={<LoadingPlaceholder />}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 2, -2]} intensity={0.4} />
          <pointLight position={[0, -3, 2]} intensity={0.3} color="#C9A84C" />

          <GlassesModel color={color} shape={frameShape} autoRotate={autoRotate} />

          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.2}
            scale={5}
            blur={2}
            far={1.5}
          />

          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            onStart={() => setAutoRotate(false)}
          />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center text-xs transition-colors ${
            autoRotate
              ? 'bg-gold-500 text-black'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title={autoRotate ? 'Arrêter la rotation' : 'Rotation automatique'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4">
        <p className="text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
          Glisser pour tourner · Défiler pour zoomer
        </p>
      </div>
    </div>
  );
}
