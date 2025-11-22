'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Pokeball3D() {
  return (
    <div className="h-[600px] w-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={45} />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <directionalLight position={[0, -5, 5]} intensity={1} />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <group position={[0, 2.5, 0]} rotation={[0.2, -0.5, 0]}>
            <PokeballMesh />
          </group>
        </Float>
        
        <Suspense fallback={<CharacterPlaceholder />}>
           <CharacterModel />
        </Suspense>
        
        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
        <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI/2 + 0.2} />
      </Canvas>
    </div>
  );
}

function CharacterPlaceholder() {
  return (
    <group position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
      <mesh>
         <sphereGeometry args={[2, 32, 32]} />
         <meshStandardMaterial color="#e6c15c" roughness={0.8} />
      </mesh>
    </group>
  );
}

function CharacterModel() {
  // Expects 'model.glb' (Usagi from Chiikawa) in the public folder
  const { scene } = useGLTF('/model.glb');
  // Adjust scale/position as needed for the specific model
  return <primitive object={scene} position={[0, -3.5, 0]} scale={2.5} />;
}

// Pre-load to avoid waterfall
useGLTF.preload('/model.glb');

function PokeballMesh() {
  const groupRef = useRef<THREE.Group>(null);

  // Materials
  const redMaterial = new THREE.MeshStandardMaterial({ 
    color: '#ff0000', 
    roughness: 0.1, 
    metalness: 0.5 
  });
  
  const whiteMaterial = new THREE.MeshStandardMaterial({ 
    color: '#ffffff', 
    roughness: 0.1, 
    metalness: 0.5 
  });
  
  const blackMaterial = new THREE.MeshStandardMaterial({ 
    color: '#1a1a1a', 
    roughness: 0.2, 
    metalness: 0.2 
  });
  
  const buttonMaterial = new THREE.MeshStandardMaterial({ 
    color: '#ffffff', 
    roughness: 0.2, 
    metalness: 0.8,
    emissive: '#222222'
  });

  // Top Hemisphere (Red)
  // Sphere geometry: radius 2, 32 segments
  // Phi length: PI (half sphere)
  // We need to rotate it to be top
  
  return (
    <group ref={groupRef}>
      {/* Top Red Hemisphere */}
      <mesh material={redMaterial} position={[0, 0.04, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2 - 0.04]} />
      </mesh>
      
      {/* Bottom White Hemisphere */}
      <mesh material={whiteMaterial} position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2 - 0.04]} />
      </mesh>
      
      {/* Inner Black Sphere (Visible in gap) */}
      <mesh material={blackMaterial} scale={[0.95, 0.95, 0.95]}>
        <sphereGeometry args={[2, 64, 32]} />
      </mesh>
      
      {/* Black Band Ring (Torus? Or just the inner sphere showing through?) 
          Actually standard pokeball has a recessed band. The gap above does show the black inner.
          But we need the button housing.
      */}
      
      {/* Button Housing (Black Cylinder/Cylinder-ish) */}
      <group rotation={[0, 0, Math.PI/2]} position={[2, 0, 0]}>
         {/* Main Black Ring around button */}
         <mesh material={blackMaterial} position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 2.05, 32]} />
         </mesh>
      </group>
      
      {/* Refined Button Logic: 
          The button is on the "Front" or "Side". 
          Let's put it on Z axis for easier alignment? Or X axis.
          Let's align with X axis (Right side).
      */}
      
      {/* Button assembly position */}
      <group position={[1.9, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          {/* Black base for button */}
          <mesh material={blackMaterial} position={[0, -0.1, 0]}>
             <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
          </mesh>
          
          {/* White Button */}
          <mesh material={buttonMaterial} position={[0, 0.05, 0]}>
             <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          </mesh>
          
          {/* Small inner button detail */}
          <mesh material={whiteMaterial} position={[0, 0.15, 0]}>
             <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          </mesh>
      </group>
      
    </group>
  );
}

